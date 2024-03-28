<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import ReferenceGeometryEditor from '@/components/ReferenceGeometryEditor.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import TabLayout from '@/components/TabLayout.vue'
import TabContent from '@/components/TabContent.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { PolynomialSymmetry } from '@/core/point_symmetry/PolynomialSymmetry'
import { type PolynomialSymmetryRule, IDENTITY } from '@/core/point_symmetry/PolynomialSymmetryRule'
import {
  type CoefficientPickerState,
  CoefficientPickerSketch
} from '@/sketches/CoefficientPickerSketch'
import { PolynomialSketch, type PolynomialPattern } from '@/sketches/PolynomialSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { ref, computed, watch } from 'vue'
import PolynomialSymmetryEditor from '@/components/PolynomialSymmetryEditor.vue'
import PolynomialPaletteEditor from '@/components/PolynomialPaletteEditor.vue'
import { default_palette, type PolynomialPalette } from '@/core/point_symmetry/PolynomialPalette'
import { to_compressed_json } from '@/core/serialization/serialization'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import { PolynomialPaletteSerializer } from '@/core/serialization/SerializedPolynomialPalette'
import { default_ref_geom, type ReferenceGeometryCollection } from '@/core/ReferenceGeometry'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
// The center term is sometimes not editable, or it only affects the constant
// term. But selecting the one above it will produce visible results in most
// if not all cases.
const DEFAULT_TERM = (CENTER_1D - 1) * GRID_SIZE + CENTER_1D

const PATTERN_SERIALIZER = new PolynomialPatternSerializer()
const PALETTE_SERIALIZER = new PolynomialPaletteSerializer()

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

const symmetry = ref(new PolynomialSymmetry(GRID_SIZE, [IDENTITY]))

const palette = defineModel<PolynomialPalette>('palette', {
  default: default_palette
})

const ref_geom = defineModel<ReferenceGeometryCollection>('ref_geom', {
  default: default_ref_geom
})

const pattern_base64 = ref<string>()
const palette_base64 = ref<string>()

// p5.js sketches -------------------

const viewer = new PolynomialSketch({
  symmetry_mode: props.symmetryMode,
  pattern: {
    series: FourierSeries2D.from_tuples([[1, 0, 1, 0]]),
    rotation_order: 4
  },
  palette: palette.value,
  ref_geom: ref_geom.value
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

  // When the rotation order is 1, we only have mirrors and inversions.
  // This looks better with more sectors, so set it to 4
  const folds = symmetry.value.first_rule.rotation_folds ?? 1
  const rotation_order = folds >= 2 ? folds : 4

  const pattern: PolynomialPattern = {
    rotation_order,
    series: new FourierSeries2D(terms)
  }
  viewer.pattern = pattern

  // Also update the link to the viewer
  to_compressed_json(pattern, PATTERN_SERIALIZER)
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

function change_symmetry(rules: PolynomialSymmetryRule[]) {
  symmetry.value = new PolynomialSymmetry(GRID_SIZE, rules)

  const coefficients = term_grid_state.coefficients
  coefficients.fill(ComplexPolar.ZERO)

  term_grid_state.selected_index = DEFAULT_TERM
  term_grid_state.frequency_map = (indices) => symmetry.value.frequency_map(indices)
  term_grid_state.editable_map = (indices) => symmetry.value.is_editable(indices)

  coefficient_picker_state.coefficient = ComplexRect.ZERO

  update_viewer()
}

watch(
  palette,
  (value) => {
    viewer.palette = value

    to_compressed_json(value, PALETTE_SERIALIZER)
      .then((x) => {
        palette_base64.value = x
      })
      .catch(console.error)
  },
  { deep: true }
)

watch(
  ref_geom,
  (value) => {
    viewer.ref_geom = value
  },
  { deep: true }
)
</script>

<template>
  <h2>{{ title }}</h2>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="viewer"></P5Sketch>
    </template>
    <template #right>
      <TabLayout>
        <TabContent title="Symmetry">
          <PolynomialSymmetryEditor
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
          <PolynomialPaletteEditor v-model="palette"></PolynomialPaletteEditor>
          <details class="form-row">
            <summary>Reference Geometry</summary>
            <ReferenceGeometryEditor v-model="ref_geom"></ReferenceGeometryEditor>
          </details>
        </TabContent>
        <TabContent title="Export">
          <div v-if="pattern_base64" class="form-row">
            <RouterLink
              :to="{
                path: viewer_path,
                query: { custom_pattern: pattern_base64, custom_palette: palette_base64 }
              }"
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
