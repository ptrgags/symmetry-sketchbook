<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import TabLayout from '@/components/TabLayout.vue'
import TabContent from '@/components/TabContent.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { type PointSymmetryRule, SymmetryRules, NO_SYMMETRY } from '@/core/PointSymmetry'
import {
  type CoefficientPickerState,
  CoefficientPickerSketch
} from '@/sketches/CoefficientPickerSketch'
import { PolynomialSketch, type PolynomialState } from '@/sketches/PolynomialSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { ref, computed } from 'vue'
import PointSymmetryEditor from '@/components/PointSymmetryEditor.vue'

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
  symmetry_mode: 'rosette' | 'frieze'
}>()

const title = computed<string>(() => {
  return props.symmetry_mode === 'frieze' ? 'Frieze Maker' : 'Rosette Maker'
})

const symmetry = ref<SymmetryRules>(new SymmetryRules(GRID_SIZE, [NO_SYMMETRY]))

// p5.js sketches -------------------

const viewer_state: PolynomialState = {
  symmetry_mode: props.symmetry_mode,
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

function update_coefficient(e: Event) {
  const z = (e as CustomEvent).detail as ComplexRect
  symmetry.value.update_coefficients(
    term_grid_state.coefficients,
    term_grid_state.selected_index,
    z.to_polar()
  )

  update_viewer()
}

picker.events.addEventListener('change', update_coefficient)
picker.events.addEventListener('input', update_coefficient)

function toggle_palette(e: Event) {
  const checkbox = e.target as HTMLInputElement
  viewer.show_palette = checkbox.checked
}

function change_symmetry(rules: PointSymmetryRule[]) {
  symmetry.value = new SymmetryRules(GRID_SIZE, rules)

  const coefficients = term_grid_state.coefficients
  coefficients.fill(ComplexPolar.ZERO)

  term_grid_state.selected_index = DEFAULT_TERM
  term_grid_state.frequency_map = (indices) => symmetry.value.frequency_map(indices)
  term_grid_state.editable_map = (indices) => symmetry.value.is_enabled(indices)

  viewer.rotation_order = rules[0].rotation_folds ?? 1

  picker_state.coefficient = ComplexRect.ZERO

  update_viewer()
}

function set_monochrome(e: Event) {
  const color_picker = e.target as HTMLInputElement
  const color = color_picker.value
  viewer.monochrome = color
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
        <TabContent title="Choose Symmetry">
          <PointSymmetryEditor @update:model-value="change_symmetry" />
        </TabContent>
        <TabContent title="Edit Pattern">
          <P5Sketch :sketch="term_grid"></P5Sketch> <P5Sketch :sketch="picker"></P5Sketch>
        </TabContent>
        <TabContent title="Display Settings">
          <input id="toggle-palette" type="checkbox" @change="toggle_palette" />
          <label for="toggle-palette">Show color palette</label>
          <br />
          <input id="monochrome" type="color" value="#9661ff" @input="set_monochrome" />
          <label for="monochrome">Palette color</label>
        </TabContent>
      </TabLayout>
    </template>
  </TwoColumns>
</template>
