<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { PointSymmetry, type PointSymmetryInfo, dropdown_options } from '@/core/PointSymmetry'
import {
  type CoefficientPickerState,
  CoefficientPickerSketch
} from '@/sketches/CoefficientPickerSketch'
import { PolynomialSketch, type PolynomialState } from '@/sketches/PolynomialSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { ref, type Ref, computed, type ComputedRef } from 'vue'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
const CENTER_TERM = CENTER_1D * GRID_SIZE + CENTER_1D

const SYMMETRY_OPTIONS = dropdown_options(GRID_SIZE)

// Vue state

const symmetry_info: Ref<PointSymmetryInfo> = ref(SYMMETRY_OPTIONS[0])

const symmetry: ComputedRef<PointSymmetry> = computed(() => {
  return symmetry_info.value.symmetry
})

// p5.js sketches -------------------

const viewer_state: PolynomialState = {
  symmetry_mode: 'rosette',
  pattern: FourierSeries2D.from_tuples([]),
  rotation_order: 5
}
const viewer = new PolynomialSketch(viewer_state)

const term_grid_state: TermGridState = {
  cell_size: 40,
  rows: GRID_SIZE,
  cols: GRID_SIZE,
  selected_index: CENTER_TERM,
  coefficients: new Array(TERM_COUNT).fill(ComplexPolar.ZERO),
  frequency_map: (indices) => symmetry.value.frequency_map(indices),
  editable_map: (indices) => symmetry.value.is_enabled(indices)
}
const term_grid = new TermGridSketch(term_grid_state)

const picker_state: CoefficientPickerState = {
  coefficient: ComplexRect.ZERO
}
const picker = new CoefficientPickerSketch(picker_state)

// Event Handling ---
// When a new term is selected, pass that term to the picker
term_grid.events.addEventListener('term-selected', (e) => {
  const z = (e as CustomEvent).detail as ComplexPolar
  picker_state.coefficient = z.to_rect()
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

picker.events.addEventListener('change', (e) => {
  const z = (e as CustomEvent).detail as ComplexRect
  symmetry.value.update_coefficients(
    term_grid_state.coefficients,
    term_grid_state.selected_index,
    z.to_polar()
  )

  update_viewer()
})

function toggle_palette(e: Event) {
  const checkbox = e.target as HTMLInputElement
  viewer.show_palette = checkbox.checked
}

function change_symmetry() {
  const coefficients = term_grid_state.coefficients
  coefficients.fill(ComplexPolar.ZERO)

  term_grid_state.selected_index = CENTER_TERM
  term_grid_state.frequency_map = (indices) => symmetry.value.frequency_map(indices)
  term_grid_state.editable_map = (indices) => symmetry.value.is_enabled(indices)

  picker_state.coefficient = ComplexRect.ZERO

  update_viewer()
}
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="viewer"></P5Sketch>
    </template>
    <template #right>
      <div class="vertical">
        <h1>Rosette Maker</h1>
        <input id="toggle-palette" type="checkbox" @change="toggle_palette" />
        <label for="toggle-palette">Show color palette</label>
        <br />
        <label for="symmetry-type">Symmetry Type: </label>
        <select id="symmetry-type" v-model="symmetry_info" @change="change_symmetry">
          <option v-for="entry in SYMMETRY_OPTIONS" :key="entry.id" :value="entry">
            {{ entry.label }}
          </option>
        </select>
        <P5Sketch :sketch="term_grid"></P5Sketch>
        <P5Sketch :sketch="picker"></P5Sketch>
      </div>
    </template>
  </TwoColumns>
</template>
