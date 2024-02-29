<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import TabLayout from '@/components/TabLayout.vue'
import TabContent from '@/components/TabContent.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { type PointSymmetryRule, PointSymmetry, NO_SYMMETRY } from '@/core/PointSymmetry'
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

const symmetry = ref(new PointSymmetry(GRID_SIZE, [NO_SYMMETRY]))

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
  symmetry.value = new PointSymmetry(GRID_SIZE, rules)

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

const color1 = ref<string>('#ff0000')
const color2 = ref<string>('#00ff00')
const color3 = ref<string>('#0000ff')

function set_color1(e: Event) {
  const color_picker = e.target as HTMLInputElement
  color1.value = color_picker.value
  viewer.cosine_palette = [color1.value, color3.value, color2.value]
}
function set_color2(e: Event) {
  const color_picker = e.target as HTMLInputElement
  color2.value = color_picker.value
  viewer.cosine_palette = [color1.value, color3.value, color2.value]
}
function set_color3(e: Event) {
  const color_picker = e.target as HTMLInputElement
  color3.value = color_picker.value
  viewer.cosine_palette = [color1.value, color3.value, color2.value]
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
          <h3>Color Palette</h3>
          <div class="form-row">
            <input id="toggle-palette" type="checkbox" @change="toggle_palette" />
            <label for="toggle-palette"> Show color palette</label>
          </div>
          <div class="form-row">
            <label for="palette-type">Palette Type: </label>
            <select id="palette-type" value="primary">
              <option value="primary">Primary Only</option>
              <option value="secondary-half">Primary + secondary (halves)</option>
              <option value="secondary-alternate">Primary + secondary (alternating)</option>
              <option value="secondary-circle">Primary + secondary (inside circle)</option>
              <option value="invert-primary">Inverted primary</option>
              <option value="invert-secondary-alternate">
                Inverted primary + secondary (alternating)
              </option>
              <option value="invert-secondary-circle">Inverted primary + secondary (circle)</option>
            </select>
          </div>
          <div class="form-row">
            <input id="primary-color" type="color" value="#9661ff" />
            <label for="primary-color"> Primary Color</label>
          </div>
          <div class="form-row">
            <input id="secondary-color" type="color" value="#9661ff" />
            <label for="secondary-color"> Secondary Color</label>
          </div>
          <div class="form-row">
            <input id="far-color" type="color" value="#0000ff" />
            <label for="far-color"> Far Away Color</label>
          </div>

          <h3>Axes</h3>
          <div class="form-row">
            <input id="x-axis" type="checkbox" />
            <label for="x-axis">x</label>
            <input id="y-axis" type="checkbox" />
            <label for="y-axis">y</label>
            <input id="r-axis" type="checkbox" />
            <label for="r-axis">r</label>
            <input id="theta-axis" type="checkbox" />
            <label for="theta-axis">theta</label>
          </div>
          <div class="form-row">
            <input id="ref-color" type="color" value="#0000ff" />
            <label for="ref-color"> Color</label>
          </div>
          <div class="form-row">
            <label for="ref-thickness">Thickness: </label>
            <input id="ref-thickness" type="range" min="0.001" max="0.5" step="0.001" value="0.1" />
          </div>

          <h3>Pulses</h3>
          <div class="form-row">
            <input id="pulse-x" type="checkbox" />
            <label for="pulse-x">x</label>
            <input id="pulse-y" type="checkbox" />
            <label for="pulse-y">y</label>
            <input id="pulse-r" type="checkbox" />
            <label for="pulse-r">r</label>
            <input id="pulse-theta" type="checkbox" />
            <label for="pulse-theta">theta</label>
          </div>
          <div class="form-row">
            <input id="pulse-color" type="color" value="#0000ff" />
            <label for="pulse-color"> Color</label>
          </div>
          <div class="form-row">
            <label for="pulse-thickness">Thickness: </label>
            <input
              id="pulse-thickness"
              type="range"
              min="0.001"
              max="0.5"
              step="0.001"
              value="0.1"
            />
          </div>

          <h3>Grid Lines</h3>
          <div class="form-row">
            <input id="grid-x" type="checkbox" />
            <label for="grid-x">x</label>
            <input id="grid-y" type="checkbox" />
            <label for="grid-y">y</label>
            <input id="grid-r" type="checkbox" />
            <label for="grid-r">r</label>
            <input id="grid-theta" type="checkbox" />
            <label for="grid-theta">theta</label>
          </div>
          <div class="form-row">
            <div class="form-row">
              <input id="grid-color" type="color" value="#0000ff" />
              <label for="grid-color"> Color</label>
            </div>
            <label for="grid-thickness">Thickness: </label>
            <input
              id="grid-thickness"
              type="range"
              min="0.001"
              max="0.5"
              step="0.001"
              value="0.1"
            />
          </div>
        </TabContent>
      </TabLayout>
    </template>
  </TwoColumns>
</template>
