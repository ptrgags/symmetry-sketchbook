<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TabContent from '@/components/TabContent.vue'
import TabLayout from '@/components/TabLayout.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { type WallpaperState, WallpaperSketch } from '@/sketches/WallpaperSketch'
import { WallpaperSymmetry } from '@/core/wallpaper_symmetry/WallpaperSymmetry'
import { computed, ref, watch } from 'vue'
import {
  CoefficientPickerSketch,
  type CoefficientPickerState
} from '@/sketches/CoefficientPickerSketch'
import {
  COLOR_REVERSING_GROUPS,
  WALLPAPER_GROUPS,
  type WallpaperSymmetryGroup
} from '@/core/wallpaper_symmetry/WallpaperSymmetryGroup'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
const DEFAULT_TERM = CENTER_1D * GRID_SIZE + CENTER_1D

// Vue state -----------------------------

const category = defineModel<string>('category', {
  default: 'wallpaper'
})

const symmetry_group = defineModel<WallpaperSymmetryGroup>('symmetry_group', {
  default: WALLPAPER_GROUPS.p1
})

const reversing_group = defineModel<WallpaperSymmetryGroup>('reversing_group', {
  default: COLOR_REVERSING_GROUPS.p1_p1
})

const group = computed<WallpaperSymmetryGroup>(() => {
  if (category.value === 'wallpaper') {
    return symmetry_group.value
  }

  return reversing_group.value
})

const show_palette = defineModel<boolean>('enable_palette', { default: false })

const symmetry = ref(new WallpaperSymmetry(GRID_SIZE, group.value))

// P5.js sketches ----------------------------

const viewer_state: WallpaperState = {
  pattern: FourierSeries2D.from_tuples([
    [1, 0, 1, 0],
    [0, 1, 1, 0]
  ]),
  group: symmetry_group.value
}

const viewer = new WallpaperSketch(viewer_state)

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

// Event Handling --------------------------

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

watch(show_palette, (show) => {
  viewer.show_palette = show
})

watch(group, (new_value) => {
  const selected_group = new_value ?? WALLPAPER_GROUPS.p1
  symmetry.value = new WallpaperSymmetry(GRID_SIZE, selected_group)

  const coefficients = term_grid_state.coefficients
  coefficients.fill(ComplexPolar.ZERO)
  term_grid_state.selected_index = DEFAULT_TERM
  term_grid_state.frequency_map = (indices) => symmetry.value.frequency_map(indices)
  term_grid_state.editable_map = (indices) => symmetry.value.is_editable(indices)

  viewer_state.group = selected_group
  update_viewer()
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="viewer"></P5Sketch>
    </template>
    <template #right>
      <h1>Wallpaper Maker</h1>
      <TabLayout>
        <TabContent title="Choose Symmetry">
          <div class="form-row">
            <label for="wallpaper-category">Select Category: </label>
            <select id="wallpaper-category" v-model="category">
              <option value="wallpaper">17 Wallpaper Groups</option>
              <option value="reversing">46 Color-reversing Wallpaper Groups</option>
            </select>
          </div>
          <div class="form-row">
            <label for="group">Select Wallpaper Group: </label>
            <select id="group" v-if="category === 'wallpaper'" v-model="symmetry_group">
              <option v-for="(value, key) in WALLPAPER_GROUPS" :key="key" :value="value">
                {{ key }}
              </option>
            </select>
            <select id="group" v-else v-model="reversing_group">
              <option v-for="(value, key) in COLOR_REVERSING_GROUPS" :key="key" :value="value">
                {{ key }}
              </option>
            </select>
          </div>
        </TabContent>
        <TabContent title="Edit Pattern">
          <P5Sketch :sketch="term_grid"></P5Sketch>
          <P5Sketch :sketch="coefficient_picker"></P5Sketch>
        </TabContent>
        <TabContent title="Display Settings">
          <h3>Color Palette</h3>
          <div class="form-row">
            <input id="toggle-palette" type="checkbox" v-model="show_palette" />
            <label for="toggle-palette"> Show color palette</label>
          </div>
        </TabContent>
      </TabLayout>
    </template>
  </TwoColumns>
</template>
