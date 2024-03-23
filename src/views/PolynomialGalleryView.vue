<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { PolynomialSketch, type PolynomialPattern } from '@/sketches/PolynomialSketch'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { useRoute } from 'vue-router'
import { computed, onMounted, watch } from 'vue'
import { from_compressed_json } from '@/core/serialization/serialization'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import { PolynomialPaletteSerializer } from '@/core/serialization/SerializedPolynomialPalette'
import { default_palette, type PolynomialPalette } from '@/core/point_symmetry/PolynomialPalette'
import { type ReferenceGeometryCollection, default_ref_geom } from '@/core/ReferenceGeometry'
import ReferenceGeometryEditor from '@/components/ReferenceGeometryEditor.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { ROSETTE_PRESETS } from '@/presets/rosettes'
import { get_string_param } from '@/core/query_util'
import { PALETTE_PRESETS } from '@/presets/polynomial_palettes'

const props = defineProps<{
  symmetryMode: 'rosette' | 'frieze'
}>()

const title = computed<string>(() => {
  return props.symmetryMode === 'frieze' ? 'Frieze Symmetry Gallery' : 'Rosette Symmetry Gallery'
})

const selected_pattern = defineModel<PolynomialPattern>('selected_pattern')
const selected_palette = defineModel<PolynomialPalette>('selected_palette')

const route = useRoute()

const DEFAULT_PATTERN: PolynomialPattern = {
  series: FourierSeries2D.from_tuples([[1, 0, 1, 0]]),
  rotation_order: 8
}
const PATTERN_SERIALIZER = new PolynomialPatternSerializer()
const PALETTE_SERIALIZER = new PolynomialPaletteSerializer()

const ref_geom = defineModel<ReferenceGeometryCollection>('ref_geom', { default: default_ref_geom })

const sketch = new PolynomialSketch({
  symmetry_mode: props.symmetryMode,
  pattern: DEFAULT_PATTERN,
  palette: default_palette(),
  ref_geom: ref_geom.value
})

async function handle_pattern(preset_id: string | undefined, custom_pattern: string | undefined) {
  if (custom_pattern) {
    const pattern = await from_compressed_json(custom_pattern, PATTERN_SERIALIZER)
    if (pattern) {
      selected_pattern.value = undefined
      sketch.pattern = pattern
      return
    }
  }

  if (preset_id) {
    const preset = ROSETTE_PRESETS.find((x) => x.id === preset_id)
    if (preset) {
      selected_pattern.value = preset.value
      sketch.pattern = preset.value
      return
    }
  }

  selected_pattern.value = ROSETTE_PRESETS[0].value
  sketch.pattern = selected_pattern.value
}

async function handle_palette(preset_id: string | undefined, custom_palette: string | undefined) {
  if (custom_palette) {
    const palette = await from_compressed_json(custom_palette, PALETTE_SERIALIZER)
    if (palette) {
      selected_palette.value = undefined
      sketch.palette = palette
      return
    }
  }

  if (preset_id) {
    const preset = PALETTE_PRESETS.find((x) => x.id == preset_id)
    if (preset) {
      selected_palette.value = preset.value
      sketch.palette = preset.value
    }
  }

  selected_palette.value = PALETTE_PRESETS[0].value
  sketch.palette = selected_palette.value
}

async function handle_query() {
  const query = route.query

  handle_palette(
    get_string_param(query.palette, 'palette'),
    get_string_param(query.custom_palette, 'custom_palette')
  )

  handle_pattern(
    get_string_param(query.pattern, 'pattern'),
    get_string_param(query.custom_pattern, 'custom_pattern')
  )
}

onMounted(() => {
  handle_query().catch(console.error)
})

watch(
  ref_geom,
  (value) => {
    sketch.ref_geom = value
  },
  { deep: true }
)

watch(selected_pattern, (value) => {
  console.log('selected', value)

  if (!value) {
    return
  }

  sketch.pattern = value
})

watch(selected_palette, (value) => {
  if (!value) {
    return
  }

  sketch.palette = value
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>{{ title }}</h1>
      <div class="form-row">
        <DropdownSelect :options="ROSETTE_PRESETS" v-model="selected_pattern"
          >Pattern:
        </DropdownSelect>
      </div>
      <div class="form-row">
        <DropdownSelect :options="PALETTE_PRESETS" v-model="selected_palette"
          >Palette:
        </DropdownSelect>
      </div>
      <details class="form-row">
        <summary>Reference Geometry</summary>
        <ReferenceGeometryEditor v-model="ref_geom"></ReferenceGeometryEditor>
      </details>
    </template>
  </TwoColumns>
</template>
