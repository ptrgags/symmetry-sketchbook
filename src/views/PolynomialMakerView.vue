<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import TabLayout from '@/components/TabLayout.vue'
import TabContent from '@/components/TabContent.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { PointSymmetry } from '@/core/point_symmetry/PointSymmetry'
import { type PointSymmetryRule, IDENTITY } from '@/core/point_symmetry/PointSymmetryRule'
import {
  type CoefficientPickerState,
  CoefficientPickerSketch
} from '@/sketches/CoefficientPickerSketch'
import { PolynomialSketch } from '@/sketches/PolynomialSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { ref, computed } from 'vue'
import PointSymmetryEditor from '@/components/PointSymmetryEditor.vue'
import { compress_base64 } from '@/core/serialization/gzip_base64'
import PointSymmetryPaletteEditor from '@/components/PointSymmetryPaletteEditor.vue'
import { type PointSymmetryPalette } from '@/core/point_symmetry/PointSymmetryPalette'
import { PALETTE_TYPES } from '@/core/point_symmetry/PaletteType'
import { Color } from '@/core/Color'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
// The center term is sometimes not editable, or it only affects the constant
// term. But selecting the one above it will produce visible results in most
// if not all cases.
const DEFAULT_TERM = (CENTER_1D - 1) * GRID_SIZE + CENTER_1D

// Vue state

const props = defineProps<{
  symmetryMode: 'rosette' | 'frieze'
}>()

const title = computed<string>(() => {
  return props.symmetryMode === 'frieze' ? 'Frieze Maker' : 'Rosette Maker'
})

const viewer_path = computed<string>(() => {
  return props.symmetryMode === 'frieze' ? '/frieze_symmetry' : '/point_symmetry'
})

const symmetry = ref(new PointSymmetry(GRID_SIZE, [IDENTITY]))

const palette = defineModel<PointSymmetryPalette>({
  default: {
    palette_type: PALETTE_TYPES[0],
    primary_color: new Color(0.5, 0.0, 1.0),
    secondary_color: new Color(0.5, 1.0, 0.0),
    far_color: new Color(0.0, 0.0, 0.0),
    far_power: 4,
    ref_geom: {
      input_axes: {
        xyrt_flags: [false, false, false, false],
        color: new Color(1, 1, 1),
        thickness: 0.01
      },
      output_axes: {
        xyrt_flags: [false, false, false, false],
        color: new Color(0, 1, 1),
        thickness: 0.1
      },
      pulse: {
        xyrt_flags: [false, false, false, false],
        color: new Color(1, 1, 0),
        thickness: 0.1
      },
      grid: {
        xyrt_flags: [false, false, false, false],
        color: new Color(1, 1, 1),
        thickness: 0.1
      }
    }
  }
})

const pattern_base64 = ref<string>()

// p5.js sketches -------------------

const viewer = new PolynomialSketch({
  symmetry_mode: props.symmetryMode,
  pattern: FourierSeries2D.from_tuples([]),
  rotation_order: 5
})

const term_grid_state: TermGridState = {
  cell_size: 40,
  rows: GRID_SIZE,
  cols: GRID_SIZE,
  selected_index: DEFAULT_TERM,
  coefficients: new Array(TERM_COUNT).fill(ComplexPolar.ZERO),
  frequency_map: (indices) => symmetry.value.frequency_map(indices),
  editable_map: (indices) => symmetry.value.is_editable(indices)
}
const term_grid = new TermGridSketch(term_grid_state)

const coefficient_picker_state: CoefficientPickerState = {
  coefficient: ComplexRect.ZERO
}
const coefficient_picker = new CoefficientPickerSketch(coefficient_picker_state)

// Event Handling ------------------------

// When a new term is selected, pass that term to the picker
term_grid.events.addEventListener('term-selected', (e) => {
  const z = (e as CustomEvent).detail as ComplexPolar
  coefficient_picker_state.coefficient = z.to_rect()
})

function update_viewer() {
  const coefficients = term_grid_state.coefficients
  const terms: FourierTerm2D[] = []
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const index = i * GRID_SIZE + j
      const coefficient = coefficients[index]

      if (coefficient.r === 0) {
        continue
      }

      const frequencies = symmetry.value.frequency_map({ row: i, col: j })
      terms.push({
        frequencies,
        coefficient
      })
    }
  }

  viewer.pattern = new FourierSeries2D(terms)

  const json = viewer.get_pattern_json()
  compress_base64(json)
    .then((x) => {
      pattern_base64.value = x
    })
    .catch(console.error)
}

function update_coefficient(e: Event) {
  const z = (e as CustomEvent).detail as ComplexRect
  symmetry.value.update_coefficients(
    term_grid_state.coefficients,
    term_grid_state.selected_index,
    z.to_polar()
  )

  update_viewer()
}

coefficient_picker.events.addEventListener('change', update_coefficient)
coefficient_picker.events.addEventListener('input', update_coefficient)

function toggle_palette(e: Event) {
  const checkbox = e.target as HTMLInputElement
  viewer.show_palette = checkbox.checked
}

function change_symmetry(rules: PointSymmetryRule[]) {
  symmetry.value = new PointSymmetry(GRID_SIZE, rules)

  const coefficients = term_grid_state.coefficients
  coefficients.fill(ComplexPolar.ZERO)

  term_grid_state.selected_index = DEFAULT_TERM
  term_grid_state.frequency_map = (indices) => symmetry.value.frequency_map(indices)
  term_grid_state.editable_map = (indices) => symmetry.value.is_editable(indices)

  viewer.rotation_order = rules[0].rotation_folds ?? 1

  coefficient_picker_state.coefficient = ComplexRect.ZERO

  update_viewer()
}
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="viewer"></P5Sketch>
    </template>
    <template #right>
      <h1>{{ title }}</h1>
      <TabLayout>
        <TabContent title="Symmetry">
          <PointSymmetryEditor
            :symmetry-mode="props.symmetryMode"
            @update:model-value="change_symmetry"
          />
        </TabContent>
        <TabContent title="Pattern">
          <P5Sketch :sketch="term_grid"></P5Sketch>
          <P5Sketch :sketch="coefficient_picker"></P5Sketch>
        </TabContent>
        <TabContent title="Palette">
          <h3>Color Palette</h3>
          <div class="form-row">
            <input id="toggle-palette" type="checkbox" @change="toggle_palette" />
            <label for="toggle-palette"> Show color palette</label>
          </div>
          <PointSymmetryPaletteEditor
            v-model="palette"
            @update:far-power="
              (value) => {
                viewer.far_power = value
              }
            "
            @update:palette-type="
              (value) => {
                viewer.invert_palette = value.invert
                viewer.secondary_color_mode = value.secondary_color
              }
            "
            @update:color="(...args) => viewer.set_color(...args)"
            @update:xyrt-flags="(...args) => viewer.set_xyrt_flags(...args)"
            @update:thickness="(...args) => viewer.set_thickness(...args)"
          ></PointSymmetryPaletteEditor>
        </TabContent>
        <TabContent title="Export">
          <div v-if="pattern_base64" class="form-row">
            <RouterLink
              :to="{ path: viewer_path, query: { pattern: pattern_base64 } }"
              target="_blank"
              >Viewer Link</RouterLink
            >
          </div>
          <div v-else>Create a pattern using the other tabs, then a link will appear here</div>
        </TabContent>
      </TabLayout>
    </template>
  </TwoColumns>
</template>

<style>
details {
  width: 100%;
}
</style>
