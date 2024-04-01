<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import ReferenceGeometryEditor from '@/components/ReferenceGeometryEditor.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import TabLayout from '@/components/TabLayout.vue'
import TabContent from '@/components/TabContent.vue'
import { ComplexPolar, ComplexRect } from '@/core/Complex'
import { FourierSeries2D, type FourierTerm2D } from '@/core/FourierSeries2D'
import { PolynomialSymmetry } from '@/core/point_symmetry/PolynomialSymmetry'
import { type PolynomialSymmetryRule, IDENTITY } from '@/core/point_symmetry/PolynomialSymmetryRule'
import {
  type CoefficientPickerState,
  CoefficientPickerSketch
} from '@/sketches/CoefficientPickerSketch'
import { PolynomialSketch, type PolynomialPattern } from '@/sketches/PolynomialSketch'
import { TermGridSketch, type TermGridState } from '@/sketches/TermGridSketch'
import { ref, computed, watch, onMounted } from 'vue'
import PolynomialSymmetryEditor from '@/components/PolynomialSymmetryEditor.vue'
import PolynomialPaletteEditor from '@/components/PolynomialPaletteEditor.vue'
import { default_palette, type PolynomialPalette } from '@/core/point_symmetry/PolynomialPalette'
import { to_compressed_json } from '@/core/serialization/serialization'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import { PolynomialPaletteSerializer } from '@/core/serialization/SerializedPolynomialPalette'
import { default_ref_geom, type ReferenceGeometryCollection } from '@/core/ReferenceGeometry'

// The frequencies will be [-MAX_FREQ, MAX_FREQ] in each direction
const MAX_FREQ = 3
const GRID_SIZE = 2 * MAX_FREQ + 1
const TERM_COUNT = GRID_SIZE * GRID_SIZE
const CENTER_1D = MAX_FREQ
// The center term is sometimes not editable, or it only affects the constant
// term. But selecting the one above it will produce visible results in most
// if not all cases.
const DEFAULT_TERM = (CENTER_1D - 1) * GRID_SIZE + CENTER_1D

const PATTERN_SERIALIZER = new PolynomialPatternSerializer()
const PALETTE_SERIALIZER = new PolynomialPaletteSerializer()

// Vue state

const props = defineProps<{
  symmetryMode: 'rosette' | 'frieze'
}>()

const title = computed<string>(() => {
  return props.symmetryMode === 'frieze' ? 'Frieze Maker' : 'Rosette Maker'
})

const viewer_path = computed<string>(() => {
  return props.symmetryMode === 'frieze' ? '/frieze_symmetry' : '/point_symmetry'
})

const symmetry = ref(new PolynomialSymmetry(GRID_SIZE, [IDENTITY]))

const palette = ref<PolynomialPalette>(default_palette())
const initial_pattern: PolynomialPattern = {
  series: FourierSeries2D.from_tuples([[1, 0, 1, 0]]),
  rotation_order: 4
}

const ref_geom = defineModel<ReferenceGeometryCollection>('ref_geom', {
  default: default_ref_geom
})

const pattern_base64 = ref<string>()
const palette_base64 = ref<string>()

// p5.js sketches -------------------

const viewer = new PolynomialSketch({
  symmetry_mode: props.symmetryMode,
  pattern: initial_pattern,
  palette: palette.value,
  ref_geom: ref_geom.value
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

// Event Handling ------------------------

// When a new term is selected, pass that term to the picker
term_grid.events.addEventListener('term-selected', (e) => {
  const z = (e as CustomEvent).detail as ComplexPolar
  coefficient_picker_state.coefficient = z.to_rect()
})

function update_pattern_link(pattern: PolynomialPattern) {
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

  // When the rotation order is 1, we only have mirrors and inversions.
  // This looks better with more sectors, so set it to 4
  const folds = symmetry.value.first_rule.rotation_folds ?? 1
  const rotation_order = folds >= 2 ? folds : 4

  const pattern: PolynomialPattern = {
    rotation_order,
    series: new FourierSeries2D(terms)
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

function toggle_palette(e: Event) {
  const checkbox = e.target as HTMLInputElement
  viewer.show_palette = checkbox.checked
}

function change_symmetry(rules: PolynomialSymmetryRule[]) {
  symmetry.value = new PolynomialSymmetry(GRID_SIZE, rules)

  const coefficients = term_grid_state.coefficients
  coefficients.fill(ComplexPolar.ZERO)

  term_grid_state.selected_index = DEFAULT_TERM
  term_grid_state.frequency_map = (indices) => symmetry.value.frequency_map(indices)
  term_grid_state.editable_map = (indices) => symmetry.value.is_editable(indices)

  coefficient_picker_state.coefficient = ComplexRect.ZERO

  update_viewer()
}

function update_palette_link(value: PolynomialPalette) {
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
    update_palette_link(value)
  },
  { deep: true }
)

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
  <h2>{{ title }}</h2>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="viewer" :is_card="true"></P5Sketch>
    </template>
    <template #right>
      <TabLayout>
        <TabContent title="Symmetry">
          <PolynomialSymmetryEditor
            :symmetry-mode="props.symmetryMode"
            @update:model-value="change_symmetry"
          />
          <p>
            <strong>Note:</strong> changing the symmetry type will reset the pattern! This is
            because the mathematical constraints are often different from one symmetry type to the
            next. A new pattern can be created in the Pattern tab.
          </p>
          <details class="form-row">
            <summary>Math Details</summary>
            <p>
              As described in the first half of <cite>Creating Symmetry</cite> by Frank Farris,
              rosettes and friezes can be made using complex polynomials of the form:
            </p>
            <math display="block" class="tml-display" style="display: block math">
              <mtable displaystyle="true" columnalign="right left">
                <mtr>
                  <mtd class="tml-right" style="padding: 0.7ex 0em 0.7ex 0em">
                    <mrow>
                      <msub>
                        <mi>f</mi>
                        <mrow>
                          <mi>r</mi>
                          <mi>o</mi>
                          <mi>s</mi>
                          <mi>e</mi>
                          <mi>t</mi>
                          <mi>t</mi>
                          <mi>e</mi>
                        </mrow>
                      </msub>
                      <mo form="prefix" stretchy="false">(</mo>
                      <mi>z</mi>
                      <mo form="postfix" stretchy="false">)</mo>
                    </mrow>
                  </mtd>
                  <mtd class="tml-left" style="padding: 0.7ex 0em 0.7ex 0em">
                    <mrow>
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
                        <mi>z</mi>
                        <mi>n</mi>
                      </msup>
                      <msup>
                        <mover>
                          <mi>z</mi>
                          <mo
                            stretchy="false"
                            class="tml-xshift"
                            style="math-style: normal; math-depth: 0"
                            >‾</mo
                          >
                        </mover>
                        <mi>m</mi>
                      </msup>
                    </mrow>
                  </mtd>
                </mtr>
                <mtr>
                  <mtd class="tml-right" style="padding: 0.7ex 0em 0.7ex 0em">
                    <mrow>
                      <msub>
                        <mi>f</mi>
                        <mrow>
                          <mi>f</mi>
                          <mi>r</mi>
                          <mi>i</mi>
                          <mi>e</mi>
                          <mi>z</mi>
                          <mi>e</mi>
                        </mrow>
                      </msub>
                      <mo form="prefix" stretchy="false">(</mo>
                      <mi>z</mi>
                      <mo form="postfix" stretchy="false">)</mo>
                    </mrow>
                  </mtd>
                  <mtd class="tml-left" style="padding: 0.7ex 0em 0.7ex 0em">
                    <mrow>
                      <mo>=</mo>
                      <msub>
                        <mi>f</mi>
                        <mrow>
                          <mi>r</mi>
                          <mi>o</mi>
                          <mi>s</mi>
                          <mi>e</mi>
                          <mi>t</mi>
                          <mi>t</mi>
                          <mi>e</mi>
                        </mrow>
                      </msub>
                      <mo form="prefix" stretchy="false">(</mo>
                      <msup>
                        <mi>e</mi>
                        <mrow>
                          <mi>i</mi>
                          <mi>z</mi>
                        </mrow>
                      </msup>
                      <mo form="postfix" stretchy="false">)</mo>
                    </mrow>
                  </mtd>
                </mtr>
              </mtable>
            </math>
            <p>
              By careful choice of the coefficients, symmetries of these equations turn into
              symmetries of the complex function.
            </p>
            <p>
              This form does quite a bit of math behind the scenes to take the symmetry description,
              and produce constraints for the grid of terms to help enforce the symmetry. The basics
              are described in chapters 7-8 of the book, but I had to derive the generalization of
              the patterns myself.
            </p>
          </details>
          <details class="form-row">
            <summary>Known Issues</summary>
            <p>
              This page is the most experimental one of the entire website. It mostly works, but
              checking the rest is rather tedious. I may return to it someday, but I don't want to
              hold up showing off the rest of this project that is working.
            </p>
            <ul>
              <li>
                Roto-inversions/glide reflections seem to be buggy, I haven't gotten around to
                debugging it.
              </li>
              <li>
                The symmetry options aren't restrictive enough and allow some invalid symmetry
                rules. For example, for roto-inversions the number of rotations must be even, else
                the pattern won't line up with itself after a full circle.
              </li>
              <li>
                For the color turning/reversing symmetry options, I realized too late that the
                recipes are a lot more restrictive than I thought. Since mirrors/inversions are
                involutions (repeating it twice cancels it out), the only valid color turn for those
                cases is a half turn.
              </li>
            </ul>
            <p>
              If I ever update this in the future, the main thing would be to redo this form. If I
              figure out an exhaustive list of cases, then a dropdown like in the wallpaper maker
              page would make this a lot simpler for everyone.
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
            <input id="toggle-palette" type="checkbox" @change="toggle_palette" />
            <label for="toggle-palette"> Show color palette</label>
          </div>
          <PolynomialPaletteEditor v-model="palette"></PolynomialPaletteEditor>
          <details class="form-row">
            <summary>Reference Geometry</summary>
            <ReferenceGeometryEditor v-model="ref_geom"></ReferenceGeometryEditor>
          </details>
        </TabContent>
        <TabContent title="Export">
          <div v-if="pattern_base64" class="form-row">
            <RouterLink
              :to="{
                path: viewer_path,
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

<style>
details {
  width: 100%;
}
</style>
