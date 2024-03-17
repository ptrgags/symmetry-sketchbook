<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'

import { ref, computed, type ComputedRef } from 'vue'
import { CurveSymmetryType, SYMMETRY_TYPES } from '@/core/curve_symmetry/CurveSymmetryType'
import { ParametricCurveSketch, type ParametricCurveState } from '@/sketches/ParametricCurveSketch'
import { FourierSeries, type FourierTerm } from '@/core/curve_symmetry/FourierSeries'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import {
  CoefficientPickerSketch,
  type CoefficientPickerState
} from '@/sketches/CoefficientPickerSketch'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import type { GridIndices2D } from '@/core/GridIndices2D'
import { compress_base64 } from '@/core/serialization/gzip_base64'

// The frequencies in use will be [-MAX_FREQ, MAX_FREQ]
const MAX_FREQ = 5
const TERM_COUNT = 2 * MAX_FREQ + 1
const CENTER_TERM = 5

// Vue state -----------------------

const symmetry_type = ref(SYMMETRY_TYPES[0])

const frequency_map: ComputedRef<(indices: GridIndices2D) => number> = computed(() => {
  return (indices: GridIndices2D) => {
    const k = indices.col - CENTER_TERM
    return symmetry_type.value.get_frequency(k)
  }
})

const pattern_base64 = ref<string>()

// p5.js sketches --------------------------------
const viewer_state: ParametricCurveState = {
  pattern: FourierSeries.from_tuples([[1, 1, 0]]),
  show_arm: false
}
const viewer = new ParametricCurveSketch(viewer_state)

const term_grid_state: TermGridState = {
  cell_size: 50,
  rows: 1,
  cols: TERM_COUNT,
  selected_index: CENTER_TERM,
  coefficients: new Array(TERM_COUNT).fill(new ComplexPolar(0, 0)),
  frequency_map: frequency_map.value
}
term_grid_state.coefficients[CENTER_TERM] = new ComplexPolar(1, 0)
const term_grid = new TermGridSketch(term_grid_state)

const picker_state: CoefficientPickerState = {
  coefficient: ComplexRect.ONE
}
const picker = new CoefficientPickerSketch(picker_state)

// Event handling ---------------------------

// When a new term is selected, pass that term to the picker
term_grid.events.addEventListener('term-selected', (e) => {
  const z = (e as CustomEvent).detail as ComplexPolar
  picker_state.coefficient = z.to_rect()
})

function update_viewer() {
  const coefficients = term_grid_state.coefficients

  const terms: FourierTerm[] = []
  for (let i = 0; i < coefficients.length; i++) {
    const coefficient = coefficients[i]

    // Skip empty terms
    if (coefficient.r === 0) {
      continue
    }

    const n = frequency_map.value({ row: 0, col: i })
    terms.push({
      frequency: n,
      coefficient: coefficient
    })
  }

  viewer_state.pattern = new FourierSeries(terms)
  viewer.recompute_curve()

  const json = viewer_state.pattern.to_json()
  compress_base64(json)
    .then((x) => {
      pattern_base64.value = x
    })
    .catch(console.error)
}

function coefficient_changed(e: Event) {
  const z = (e as CustomEvent).detail as ComplexRect
  term_grid_state.coefficients[term_grid_state.selected_index] = z.to_polar()

  update_viewer()
}

picker.events.addEventListener('input', coefficient_changed)
picker.events.addEventListener('change', coefficient_changed)

function change_symmetry() {
  const coefficients = term_grid_state.coefficients
  for (let i = 0; i < TERM_COUNT; i++) {
    coefficients[i] = ComplexPolar.ZERO
  }
  coefficients[CENTER_TERM] = ComplexPolar.ONE
  term_grid_state.selected_index = CENTER_TERM
  term_grid_state.frequency_map = frequency_map.value

  picker_state.coefficient = ComplexRect.ONE

  update_viewer()
}

function get_label(symmetry: CurveSymmetryType) {
  if (symmetry.folds === 1) {
    return 'No symmetry'
  }

  return `${symmetry.folds}-fold symmetry of type ${symmetry.order}`
}
</script>

<template>
  <TwoColumns>
    <template #left><P5Sketch :sketch="viewer"></P5Sketch></template>
    <template #right>
      <div class="vertical">
        <h1>Curve Maker</h1>
        <label for="symmetry-type">Symmetry Type: </label>
        <select id="symmetry-type" v-model="symmetry_type" @change="change_symmetry">
          <option v-for="(symmetry, index) in SYMMETRY_TYPES" :key="index" :value="symmetry">
            {{ get_label(symmetry) }}
          </option>
        </select>
        <P5Sketch :sketch="term_grid"></P5Sketch>
        <P5Sketch :sketch="picker"></P5Sketch>
        <div v-if="pattern_base64" class="form-row">
          <RouterLink
            :to="{ path: '/curve_symmetry', query: { pattern: pattern_base64 } }"
            target="_blank"
            >Viewer Link</RouterLink
          >
        </div>
      </div>
    </template>
  </TwoColumns>
</template>
