<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { PolynomialSketch } from '@/sketches/PolynomialSketch'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'
import { from_compressed_json } from '@/core/serialization/serialization'
import { is_string } from '@/core/validation'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import { PointSymmetryPaletteSerializer } from '@/core/serialization/SerializedPointSymmetryPalette'
import { default_palette } from '@/core/point_symmetry/PointSymmetryPalette'
import { type ReferenceGeometryCollection, default_ref_geom } from '@/core/ReferenceGeometry'
import ReferenceGeometryEditor from '@/components/ReferenceGeometryEditor.vue'

const route = useRoute()

const DEFAULT_PATTERN = {
  series: FourierSeries2D.from_tuples([[1, 0, 1, 0]]),
  rotation_order: 8
}
const PATTERN_SERIALIZER = new PolynomialPatternSerializer()
const PALETTE_SERIALIZER = new PointSymmetryPaletteSerializer()

const ref_geom = defineModel<ReferenceGeometryCollection>('ref_geom', { default: default_ref_geom })

const sketch = new PolynomialSketch({
  symmetry_mode: 'rosette',
  pattern: DEFAULT_PATTERN,
  palette: default_palette(),
  ref_geom: ref_geom.value
})

async function handle_palette(palette_string: string) {
  const palette = await from_compressed_json(palette_string, PALETTE_SERIALIZER)
  if (palette) {
    sketch.palette = palette
  }
}

async function handle_query() {
  const query = route.query

  if (query.palette && is_string(query.palette, 'palette')) {
    handle_palette(query.palette)
  }

  if (query.pattern && is_string(query.pattern, 'pattern')) {
    const pattern = await from_compressed_json(query.pattern, PATTERN_SERIALIZER)
    if (pattern) {
      sketch.pattern = pattern
    }
  }
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
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>Rosette Gallery</h1>
      <details class="form-row">
        <summary>Reference Geometry</summary>
        <ReferenceGeometryEditor v-model="ref_geom"></ReferenceGeometryEditor>
      </details>
    </template>
  </TwoColumns>
</template>
