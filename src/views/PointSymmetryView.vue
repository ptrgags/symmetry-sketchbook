<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { PolynomialSketch } from '@/sketches/PolynomialSketch'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { from_compressed_json } from '@/core/serialization/serialization'
import { is_string } from '@/core/validation'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import { PointSymmetryPaletteSerializer } from '@/core/serialization/SerializedPointSymmetryPalette'
import { DEFAULT_PALETTE } from '@/core/point_symmetry/PointSymmetryPalette'

const route = useRoute()

const DEFAULT_PATTERN = {
  series: FourierSeries2D.from_tuples([[1, 0, 1, 0]]),
  rotation_order: 8
}
const PATTERN_SERIALIZER = new PolynomialPatternSerializer()
const PALETTE_SERIALIZER = new PointSymmetryPaletteSerializer()

const sketch = new PolynomialSketch({
  symmetry_mode: 'rosette',
  pattern: DEFAULT_PATTERN,
  palette: DEFAULT_PALETTE
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
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>Rosette Gallery</h1>
    </template>
  </TwoColumns>
</template>
