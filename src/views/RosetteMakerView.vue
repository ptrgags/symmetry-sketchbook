<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import {
  type CoefficientPickerState,
  CoefficientPickerSketch
} from '@/sketches/CoefficientPickerSketch'
import { PolynomialSketch, type PolynomialState } from '@/sketches/PolynomialSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
const CENTER_TERM = CENTER_1D * GRID_SIZE + CENTER_1D

function indices_to_freq(row: number, col: number): [n: number, m: number] {
  const n = col - CENTER_1D
  const flipped_row = GRID_SIZE - 1 - row
  const m = flipped_row - CENTER_1D
  return [n, m]
}

function freq_to_indices(n: number, m: number): [row: number, col: number] {
  const col = n + CENTER_1D
  const flipped_row = m + CENTER_1D
  const row = GRID_SIZE - 1 - flipped_row
  return [row, col]
}

// p5.j2 sketches -------------------

const viewer_state: PolynomialState = {
  symmetry_mode: 'rosette',
  pattern: FourierSeries2D.from_tuples([[0, 0, 1, 0]])
}
const viewer = new PolynomialSketch(viewer_state)

const mirror = {
  is_enabled: (row: number, col: number): boolean => {
    const [n, m] = indices_to_freq(row, col)
    // The mirror symmetry rule requires a_nm = a_mn, so we'll only
    // allow editing the ones on or below the diagonal n = m
    return m <= n
  },
  update_coefficients(coefficients: ComplexPolar[], index: number, term: ComplexPolar) {
    // Set a_nm
    coefficients[index] = term

    // For mirror symmetry over the real axis, we need
    // a_mn = a_nm
    const row = Math.floor(index / GRID_SIZE)
    const col = index % GRID_SIZE
    console.log('row, col', row, col)

    const [n, m] = indices_to_freq(row, col)
    console.log('n, m', row, col)
    const [partner_row, partner_col] = freq_to_indices(m, n)
    console.log('partner row, col', partner_row, partner_col)

    const partner_index = partner_row * GRID_SIZE + partner_col
    coefficients[partner_index] = term
  }
}

const term_grid_state: TermGridState = {
  cell_size: 40,
  rows: GRID_SIZE,
  cols: GRID_SIZE,
  selected_index: CENTER_TERM,
  coefficients: new Array(TERM_COUNT).fill(new ComplexPolar(0, 0)),
  frequency_map: indices_to_freq,
  editable_map: mirror.is_enabled
}
term_grid_state.coefficients[CENTER_TERM] = new ComplexPolar(1, 0)
const term_grid = new TermGridSketch(term_grid_state)

const picker_state: CoefficientPickerState = {
  coefficient: ComplexRect.ONE
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

      const [n, m] = indices_to_freq(i, j)
      terms.push({
        frequencies: { n, m },
        coefficient: coefficient
      })
    }
  }

  viewer_state.pattern = new FourierSeries2D(terms)
  viewer.recompute()
}

picker.events.addEventListener('change', (e) => {
  const z = (e as CustomEvent).detail as ComplexRect
  mirror.update_coefficients(
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
        <!---
      <label for="symmetry-type">Symmetry Type: </label>
      <select id="symmetry-type" v-model="symmetry_type" @change="change_symmetry">
        <option v-for="(symmetry, index) in SYMMETRY_TYPES" :key="index" :value="symmetry">
          {{ symmetry.folds }}-fold symmetry of type {{ symmetry.order }}
        </option>
      </select>
    -->
        <P5Sketch :sketch="term_grid"></P5Sketch>
        <P5Sketch :sketch="picker"></P5Sketch>
      </div>
    </template>
  </TwoColumns>
</template>
