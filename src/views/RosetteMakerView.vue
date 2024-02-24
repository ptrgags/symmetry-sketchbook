<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import {
  type CoefficientPickerState,
  CoefficientPickerSketch
} from '@/sketches/CoefficientPickerSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
const CENTER_TERM = CENTER_1D * GRID_SIZE + CENTER_1D

const term_grid_state: TermGridState = {
  cell_size: 40,
  rows: GRID_SIZE,
  cols: GRID_SIZE,
  selected_index: CENTER_TERM,
  coefficients: new Array(TERM_COUNT).fill(new ComplexPolar(0, 0)),
  frequency_map: (row: number, col: number): [number, number] => {
    const n = col - CENTER_1D
    const m = GRID_SIZE - row - CENTER_1D - 1
    return [n, m]
  }
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

picker.events.addEventListener('change', (e) => {
  const z = (e as CustomEvent).detail as ComplexRect
  term_grid_state.coefficients[term_grid_state.selected_index] = z.to_polar()
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <!-- <P5Sketch :sketch="viewer"></P5Sketch> -->
    </template>
    <template #right>
      <div class="vertical">
        <h1>Rosette Maker</h1>
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
