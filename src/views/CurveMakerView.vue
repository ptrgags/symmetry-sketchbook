<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import TabLayout from '@/components/TabLayout.vue'
import TabContent from '@/components/TabContent.vue'

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
import { to_compressed_json } from '@/core/serialization/serialization'
import { FourierSeriesSerializer } from '@/core/serialization/SerializedFourierSeries'

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

  const pattern = new FourierSeries(terms)
  viewer_state.pattern = pattern
  viewer.recompute_curve()

  // Also update the link to the viewer
  to_compressed_json(pattern, new FourierSeriesSerializer())
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
  <h2>Curve Maker</h2>
  <TwoColumns>
    <template #left><P5Sketch :sketch="viewer" :is_card="true"></P5Sketch></template>
    <template #right>
      <TabLayout>
        <TabContent title="Symmetry">
          <div class="form-row">
            <label
              >Symmetry Type:
              <select id="symmetry-type" v-model="symmetry_type" @change="change_symmetry">
                <option v-for="(symmetry, index) in SYMMETRY_TYPES" :key="index" :value="symmetry">
                  {{ get_label(symmetry) }}
                </option>
              </select>
            </label>
          </div>
          <p>
            Select a symmetry type from the dropdown above. Then switch to the Pattern tab to edit
            the curve.
          </p>
          <p>
            <strong>Note:</strong> changing the symmetry type will reset the pattern! This is
            because the mathematical constraints are often different from one symmetry type to the
            next.
          </p>
          <details>
            <summary>Math Details</summary>
            <p>
              Symmetry types are of the form: "
              <math><mi>k</mi></math>
              -fold symmetry of type
              <math><mi>d</mi></math>
              ".
              <math><mi>k</mi></math> determines how many "petals" the pattern will have. Meanwhile,
              <math><mi>d</mi></math> determines how far around the circle you move for each petal.
            </p>
            <p>
              For example, 5-fold symmetry of type 1 draws the petals one by one counterclockwise
              (like a pentagon). Meanwhile 5-fold symmetry of type 2 would visit every second petal
              (like a star).
            </p>
          </details>
        </TabContent>
        <TabContent title="Pattern">
          <p>
            Select a term from the grid. Then click and drag in the complex plane below to edit the
            term. Curves need at least 2 terms (else the result will be a circle).
          </p>
          <div class="form-row">
            <P5Sketch :sketch="term_grid" :is_card="false"></P5Sketch>
          </div>
          <div class="form-row">
            <P5Sketch :sketch="picker" :is_card="false"></P5Sketch>
          </div>
          <details>
            <summary>Math Details</summary>
            <p>
              As described in the book, these curves are a Fourier series (i.e. sum of circular
              motion) of the form:
            </p>
            <math display="block" class="tml-display" style="display: block math">
              <mrow>
                <mi>f</mi>
                <mo form="prefix" stretchy="false">(</mo>
                <mi>t</mi>
                <mo form="postfix" stretchy="false">)</mo>
                <mo>=</mo>
                <mrow>
                  <munder>
                    <mo movablelimits="false">∑</mo>
                    <mi>n</mi>
                  </munder>
                </mrow>
                <msub>
                  <mi>a</mi>
                  <mi>n</mi>
                </msub>
                <msup>
                  <mi>e</mi>
                  <mrow>
                    <mi>i</mi>
                    <mi>n</mi>
                    <mi>t</mi>
                  </mrow>
                </msup>
              </mrow>
            </math>
            <p>
              Based on your choice in the Symmetry tab, this page will select the integer
              frequencies
              <math><mi>n</mi></math> to produce the selected symmetry.
            </p>
            <p>
              The number next to each spinner represents the frequency. To create (at least) k-fold
              symmetry, the terms you choose must satisfy:
            </p>
            <!-- Generated with https://temml.org/ -->
            <math
              xmlns="http://www.w3.org/1998/Math/MathML"
              display="block"
              class="tml-display"
              style="display: block math"
            >
              <mrow>
                <mi>n</mi>
                <mo>≡</mo>
                <mi>d</mi>
                <mo></mo>
                <mspace width="1em"></mspace>
                <mo form="prefix" stretchy="false">(</mo>
                <mrow>
                  <mtext></mtext>
                  <mi>mod</mi>
                </mrow>
                <mspace width="0.3333em"></mspace>
                <mi>k</mi>
                <mo form="postfix" stretchy="false">)</mo>
              </mrow>
            </math>
            <p>
              Note that it is possible to produce curves with <em>more</em> symmetry than the
              selected option, by picking terms that are evenly spaced apart.
            </p>
            <p>
              Note: the spinner animation is just to show the relative speed of each spinner. The
              spinners are slowed down so they're easier to follow with your eyes.
            </p>
          </details>
        </TabContent>
        <TabContent title="Export">
          <div v-if="pattern_base64" class="form-row">
            <RouterLink
              :to="{ path: '/curve_symmetry', query: { pattern: pattern_base64 } }"
              target="_blank"
              class="center"
              >Link to curve</RouterLink
            >
          </div>
          <div v-else>Create a pattern using the other tabs, then a link will appear here</div>
        </TabContent>
      </TabLayout>
    </template>
  </TwoColumns>
</template>
