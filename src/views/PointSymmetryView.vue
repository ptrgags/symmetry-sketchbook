<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { PolynomialSketch } from '@/sketches/PolynomialSketch'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { from_compressed_json } from '@/core/serialization/serialization'
import { is_string } from '@/core/validation'
import { FourierSeries2DSerializer } from '@/core/serialization/SerializedFourierSeries2D'

const route = useRoute()

const DEFAULT_PATTERN = FourierSeries2D.from_tuples([[1, 0, 1, 0]])

const sketch = new PolynomialSketch({
  symmetry_mode: 'rosette',
  pattern: DEFAULT_PATTERN,
  rotation_order: 8
})

async function handle_query() {
  const query = route.query
  if (query.pattern && is_string(query.pattern, 'pattern')) {
    const series = await from_compressed_json(query.pattern, new FourierSeries2DSerializer())
    if (series) {
      sketch.pattern = series
    }
  }

  sketch.pattern = DEFAULT_PATTERN
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
