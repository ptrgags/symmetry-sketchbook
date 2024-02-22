<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'

import { ref, type Ref } from 'vue'
import { SYMMETRY_TYPES } from '@/core/CurveSymmetryType'
import { ParametricCurveViewer, type ParametricCurveState } from '@/sketches/ParametricCurveViewer'
import { FourierSeries, type FourierTerm } from '@/core/FourierSeries'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import {
  CoefficientPickerSketch,
  type CoefficientPickerState
} from '@/sketches/CoefficientPickerSketch'
import { ComplexPolar, ComplexRect } from '@/core/Complex'

// The frequencies in use will be [-MAX_FREQ, MAX_FREQ]
const MAX_FREQ = 5
const TERM_COUNT = 2 * MAX_FREQ + 1
const CENTER_TERM = 5

const symmetry_type = ref(SYMMETRY_TYPES[0])

const viewer_state: Ref<ParametricCurveState> = ref({
  pattern: FourierSeries.from_tuples([[1, 1, 0]]),
  show_arm: false
})
const viewer = new ParametricCurveViewer(viewer_state.value)

const term_grid_state: Ref<TermGridState> = ref({
  cell_size: 50,
  rows: 1,
  cols: TERM_COUNT,
  selected_index: CENTER_TERM,
  coefficients: new Array(TERM_COUNT).fill(new ComplexPolar(0, 0))
})
term_grid_state.value.coefficients[CENTER_TERM] = new ComplexPolar(1, 0)
const term_grid = new TermGridSketch(term_grid_state.value)

const picker_state: Ref<CoefficientPickerState> = ref({
  coefficient: ComplexRect.ONE
})
const picker = new CoefficientPickerSketch(picker_state.value)

term_grid.events.addEventListener('term-selected', (e) => {
  const z = (e as CustomEvent).detail as ComplexPolar
  picker_state.value.coefficient = z.to_rect()
})

function update_viewer() {
  const coefficients = term_grid_state.value.coefficients

  const terms: FourierTerm[] = []
  for (let i = 0; i < coefficients.length; i++) {
    const coefficient = coefficients[i]

    // Skip empty terms
    if (coefficient.r === 0) {
      continue
    }

    const k = i - 5
    const n = symmetry_type.value.folds * k + symmetry_type.value.type
    terms.push({
      frequency: n,
      coefficient: coefficient
    })
  }

  viewer_state.value.pattern = new FourierSeries(terms)
  viewer.recompute_curve()
}

picker.events.addEventListener('change', (e) => {
  const z = (e as CustomEvent).detail as ComplexRect
  const grid_state = term_grid_state.value
  grid_state.coefficients[grid_state.selected_index] = z.to_polar()

  update_viewer()
})

function change_symmetry() {
  const coefficients = term_grid_state.value.coefficients
  for (let i = 0; i < TERM_COUNT; i++) {
    coefficients[i] = ComplexPolar.ZERO
  }
  coefficients[CENTER_TERM] = ComplexPolar.ONE
  term_grid_state.value.selected_index = CENTER_TERM

  picker_state.value.coefficient = ComplexRect.ONE

  update_viewer()
}
</script>

<template>
  <TwoColumns>
    <template #left>
      <h1>Curve Maker</h1>
      <label for="symmetry-type">Symmetry Type: </label>
      <select id="symmetry-type" v-model="symmetry_type" @change="change_symmetry">
        <option v-for="(symmetry, index) in SYMMETRY_TYPES" :key="index" :value="symmetry">
          {{ symmetry.folds }}-fold symmetry of type {{ symmetry.type }}
        </option>
      </select>
      <P5Sketch :sketch="term_grid"></P5Sketch>
      <P5Sketch :sketch="picker"></P5Sketch>
    </template>
    <template #right><P5Sketch :sketch="viewer"></P5Sketch></template>
  </TwoColumns>
</template>
