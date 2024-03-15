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
import { PolynomialSketch, type PolynomialState } from '@/sketches/PolynomialSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { ref, computed, watch } from 'vue'
import PointSymmetryEditor from '@/components/PointSymmetryEditor.vue'
import XYRTFlags from '@/components/XYRTFlags.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import { PALETTE_TYPES, type PaletteType } from '@/core/point_symmetry/PaletteType'
import RangeSlider from '@/components/RangeSlider.vue'

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

const symmetry = ref(new PointSymmetry(GRID_SIZE, [IDENTITY]))

const palette_type = ref(PALETTE_TYPES[0])

// p5.js sketches -------------------

const viewer_state: PolynomialState = {
  symmetry_mode: props.symmetryMode,
  pattern: FourierSeries2D.from_tuples([]),
  rotation_order: 5
}
const viewer = new PolynomialSketch(viewer_state)

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

  viewer_state.pattern = new FourierSeries2D(terms)
  viewer.recompute()
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

watch(palette_type, (new_value: PaletteType) => {
  const palette_settings = new_value
  viewer.invert_palette = palette_settings.invert
  viewer.secondary_color_mode = palette_settings.secondary_color
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="viewer"></P5Sketch>
    </template>
    <template #right>
      <h1>{{ title }}</h1>
      <TabLayout>
        <TabContent title="Choose Symmetry">
          <PointSymmetryEditor
            :symmetry-mode="props.symmetryMode"
            @update:model-value="change_symmetry"
          />
        </TabContent>
        <TabContent title="Edit Pattern">
          <P5Sketch :sketch="term_grid"></P5Sketch>
          <P5Sketch :sketch="coefficient_picker"></P5Sketch>
        </TabContent>
        <TabContent title="Display Settings">
          <h3>Color Palette</h3>
          <div class="form-row">
            <input id="toggle-palette" type="checkbox" @change="toggle_palette" />
            <label for="toggle-palette"> Show color palette</label>
          </div>
          <div class="form-row">
            <label for="palette-type">Palette Type: </label>
            <select id="palette-type" v-model="palette_type">
              <option v-for="option in PALETTE_TYPES" :key="option.id" :value="option">
                {{ option.label }}
              </option>
            </select>
          </div>
          <ColorPicker
            id="primary-color"
            :model-value="[0.5, 0.0, 1.0]"
            @update:model-value="(value) => viewer.set_color('primary', value)"
            >Primary Color</ColorPicker
          >
          <ColorPicker
            id="secondary-color"
            :model-value="[0.5, 1.0, 0.0]"
            @update:model-value="(value) => viewer.set_color('secondary', value)"
            >Secondary Color</ColorPicker
          >
          <ColorPicker
            id="far-color"
            :model-value="[0.0, 0.0, 0.0]"
            @update:model-value="(value) => viewer.set_color('far', value)"
            >Far Away Color</ColorPicker
          >
          <RangeSlider
            id="far-power"
            :min="1"
            :max="19"
            :model-value="4"
            @update:model-value="(value) => (viewer.far_power = 20 - value)"
            >Far Away Fade</RangeSlider
          >
          <details class="form-row">
            <summary>Reference Geometry</summary>

            <h3>Axes</h3>
            <XYRTFlags
              id="input-axes-xyrt"
              @update:model-value="(value) => viewer.set_xyrt_flags('input_axes', value)"
            />
            <ColorPicker
              id="input-axes-color"
              :model-value="[1, 1, 1]"
              @update:model-value="(value) => viewer.set_color('input_axes', value)"
              >Color</ColorPicker
            >
            <RangeSlider
              id="input-axes-thickness"
              :min="0.001"
              :max="0.1"
              :step="0.001"
              :model-value="0.01"
              @update:model-value="(value) => viewer.set_thickness('input_axes', value)"
              >Thickness:</RangeSlider
            >

            <h3>Palette Axes</h3>
            <XYRTFlags
              id="output-axes-xyrt"
              @update:model-value="(value) => viewer.set_xyrt_flags('output_axes', value)"
            />
            <ColorPicker
              id="output-axes-color"
              :model-value="[0, 1, 1]"
              @update:model-value="(value) => viewer.set_color('output_axes', value)"
              >Color</ColorPicker
            >
            <RangeSlider
              id="output-axes-thickness"
              :min="0.001"
              :max="0.5"
              :step="0.001"
              :model-value="0.1"
              @update:model-value="(value) => viewer.set_thickness('output_axes', value)"
              >Thickness:</RangeSlider
            >

            <h3>Pulses</h3>
            <XYRTFlags
              id="pulse-xyrt"
              @update:model-value="(value) => viewer.set_xyrt_flags('pulse', value)"
            />
            <ColorPicker
              id="pulse-color"
              :model-value="[1, 1, 0]"
              @update:model-value="(value) => viewer.set_color('pulse', value)"
              >Color</ColorPicker
            >
            <RangeSlider
              id="pulse-thickness"
              :min="0.001"
              :max="0.5"
              :step="0.001"
              :model-value="0.1"
              @update:model-value="(value) => viewer.set_thickness('pulse', value)"
              >Thickness:</RangeSlider
            >

            <h3>Grid Lines</h3>
            <XYRTFlags
              id="grid-xyrt"
              @update:model-value="(value) => viewer.set_xyrt_flags('grid', value)"
            />
            <ColorPicker
              id="grid-color"
              :model-value="[1, 1, 1]"
              @update:model-value="(value) => viewer.set_color('grid', value)"
              >Color</ColorPicker
            >
            <RangeSlider
              id="grid-thickness"
              :min="0.001"
              :max="0.5"
              :step="0.001"
              :model-value="0.1"
              @update:model-value="(value) => viewer.set_thickness('grid', value)"
              >Thickness:</RangeSlider
            >
          </details>
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
