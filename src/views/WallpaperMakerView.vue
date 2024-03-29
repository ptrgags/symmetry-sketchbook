<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TabContent from '@/components/TabContent.vue'
import TabLayout from '@/components/TabLayout.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import ReferenceGeometryEditor from '@/components/ReferenceGeometryEditor.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { WallpaperSketch, type WallpaperPattern } from '@/sketches/WallpaperSketch'
import { WallpaperSymmetry } from '@/core/wallpaper_symmetry/WallpaperSymmetry'
import { computed, onMounted, ref, watch } from 'vue'
import {
  CoefficientPickerSketch,
  type CoefficientPickerState
} from '@/sketches/CoefficientPickerSketch'
import {
  COLOR_REVERSING_GROUPS,
  WALLPAPER_GROUPS,
  type WallpaperSymmetryGroup
} from '@/core/wallpaper_symmetry/WallpaperSymmetryGroup'
import WallpaperPalettePicker from '@/components/WallpaperPaletteEditor.vue'
import { to_compressed_json } from '@/core/serialization/serialization'
import { type WallpaperPalette, DEFAULT_PALETTE } from '@/core/wallpaper_symmetry/WallpaperPalette'
import { WallpaperPaletteSerializer } from '@/core/serialization/SerializedWallpaperPalette'
import { default_ref_geom, type ReferenceGeometryCollection } from '@/core/ReferenceGeometry'
import { WallpaperPatternSerializer } from '@/core/serialization/SerializedWallpaperPattern'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
const DEFAULT_TERM = CENTER_1D * GRID_SIZE + CENTER_1D

const PATTERN_SERIALIZER = new WallpaperPatternSerializer()
const PALETTE_SERIALIZER = new WallpaperPaletteSerializer()

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

const palette = ref<WallpaperPalette>(DEFAULT_PALETTE)

const ref_geom = defineModel<ReferenceGeometryCollection>('ref_geom', {
  default: default_ref_geom
})

const pattern_base64 = ref<string>()
const palette_base64 = ref<string>()

// P5.js sketches ----------------------------

const initial_pattern: WallpaperPattern = {
  series: FourierSeries2D.from_tuples([
    [1, 0, 1, 0],
    [0, 1, 1, 0]
  ]),
  group: symmetry_group.value
}

const viewer = new WallpaperSketch({
  pattern: initial_pattern,
  palette: palette.value
})

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

function update_pattern_link(pattern: WallpaperPattern) {
  // Also update the link to the viewer
  to_compressed_json(pattern, PATTERN_SERIALIZER)
    .then((x) => {
      pattern_base64.value = x
    })
    .catch(console.error)
}

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

  const pattern: WallpaperPattern = {
    series: new FourierSeries2D(terms),
    group: group.value
  }
  viewer.pattern = pattern
  update_pattern_link(pattern)
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

function update_palette_link(value: WallpaperPalette) {
  to_compressed_json(value, PALETTE_SERIALIZER)
    .then((x) => {
      palette_base64.value = x
    })
    .catch(console.error)
}

watch(
  palette,
  (value) => {
    viewer.palette = value
    update_palette_link
  },
  { deep: true }
)

watch(group, (new_value) => {
  const selected_group = new_value ?? WALLPAPER_GROUPS.p1
  symmetry.value = new WallpaperSymmetry(GRID_SIZE, selected_group)

  const coefficients = term_grid_state.coefficients
  coefficients.fill(ComplexPolar.ZERO)
  term_grid_state.selected_index = DEFAULT_TERM
  term_grid_state.frequency_map = (indices) => symmetry.value.frequency_map(indices)
  term_grid_state.editable_map = (indices) => symmetry.value.is_editable(indices)
  update_viewer()
})

watch(
  ref_geom,
  (value) => {
    viewer.ref_geom = value
  },
  { deep: true }
)

onMounted(() => {
  update_pattern_link(initial_pattern)
  update_palette_link(palette.value)
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="viewer" :is_card="true"></P5Sketch>
    </template>
    <template #right>
      <h2>Wallpaper Maker</h2>
      <TabLayout>
        <TabContent title="Symmetry">
          <p>
            Using the dropdowns below, select a
            <a href="https://en.wikipedia.org/wiki/Wallpaper_group">wallpaper group</a> or one of
            the color-reversing variations listed in <cite>Creating Symmetry</cite>
          </p>
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
          <details>
            <summary>Math Details</summary>
            <p>
              Wallpaper waves are the sum of plane waves traveling in different directions. Given
              how I implemented them in the shader, I phrase it slightly differently than the book
              does. The formula looks like this:
            </p>
            <math display="block" class="tml-display" style="display: block math">
              <mrow>
                <mi>f</mi>
                <mo form="prefix" stretchy="false">(</mo>
                <mi>z</mi>
                <mo form="postfix" stretchy="false">)</mo>
                <mo>=</mo>
                <mrow>
                  <munder>
                    <mo movablelimits="false">∑</mo>
                    <mrow>
                      <mi>n</mi>
                      <mo separator="true">,</mo>
                      <mi>m</mi>
                    </mrow>
                  </munder>
                </mrow>
                <msub>
                  <mi>a</mi>
                  <mrow>
                    <mi>n</mi>
                    <mo separator="true">,</mo>
                    <mi>m</mi>
                  </mrow>
                </msub>
                <msup>
                  <mi>e</mi>
                  <mrow>
                    <mn>2</mn>
                    <mi>π</mi>
                    <mi>i</mi>
                    <mo form="prefix" stretchy="false">(</mo>
                    <mi>k</mi>
                    <mo>⋅</mo>
                    <msup>
                      <mi>A</mi>
                      <mrow>
                        <mo form="prefix" stretchy="false" lspace="0em" rspace="0em">−</mo>
                        <mn>1</mn>
                      </mrow>
                    </msup>
                    <mi>z</mi>
                    <mo form="postfix" stretchy="false" lspace="0em" rspace="0em">)</mo>
                  </mrow>
                </msup>
              </mrow>
            </math>
            <p>
              Where <math><mi>A</mi></math> is a matrix that changes to the basis of the lattice,
              <math><mi>k</mi></math> is the wave vector (integer frequencies) and the dot
              represents a dot product (which makes the wave point in the direction of
              <math><mi>k</mi></math> )
            </p>
            <p>
              Similarly to the rosettes/friezes, the form takes the selected symmetry type and
              applies constraints to the coefficients to produce the desired symmetry.
            </p>
          </details>
        </TabContent>
        <TabContent title="Pattern">
          <p>
            Select a term from the grid. Then click and drag in the complex plane below to edit the
            term.
          </p>
          <div class="form-row">
            <P5Sketch :sketch="term_grid" :is_card="false"></P5Sketch>
          </div>
          <div class="form-row">
            <P5Sketch :sketch="coefficient_picker" :is_card="false"></P5Sketch>
          </div>
        </TabContent>
        <TabContent title="Palette">
          <p>
            Select a palette type and edit the colors to customize your design. The "Show color
            palette" button shows what the color palette looks like for reference. See the
            <RouterLink to="/point_symmetry/tie_dye_analogy">Tie-Dye Analogy page</RouterLink> for
            an explanation of how the palette is applied.
          </p>
          <div class="form-row">
            <label>
              <input id="toggle-palette" type="checkbox" v-model="show_palette" />
              Show color palette
            </label>
          </div>
          <div class="form-row">
            <WallpaperPalettePicker v-model="palette"></WallpaperPalettePicker>
          </div>
          <details class="form-row">
            <summary>Reference Geometry</summary>
            <ReferenceGeometryEditor v-model="ref_geom"></ReferenceGeometryEditor>
          </details>
        </TabContent>
        <TabContent title="Export">
          <div v-if="pattern_base64" class="form-row">
            <RouterLink
              :to="{
                path: '/wallpaper_symmetry',
                query: { custom_pattern: pattern_base64, custom_palette: palette_base64 }
              }"
              target="_blank"
              >Viewer Link</RouterLink
            >
          </div>
          <div v-else>Create a pattern using the other tabs, then a link will appear here</div>
        </TabContent>
      </TabLayout>
    </template>
  </TwoColumns>
</template>
