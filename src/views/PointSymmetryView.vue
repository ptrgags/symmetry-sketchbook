<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { PolynomialSketch, type PolynomialState } from '@/sketches/PolynomialSketch'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { useRoute } from 'vue-router'
import { uncompress_base64 } from '@/core/serialization'
import { onMounted } from 'vue'

const route = useRoute()

const sketch = new PolynomialSketch({
  symmetry_mode: 'rosette',
  pattern: FourierSeries2D.from_tuples([[1, 0, 1, 0]]),
  rotation_order: 8
})

async function handle_query() {
  const query = route.query
  if (query.pattern) {
    const json = await uncompress_base64(query.pattern as string)
    // This log line is intentionally here to make it easier to copy and paste
    // parameters so I can make presets.
    console.log(json)

    const series = FourierSeries2D.from_json(json)
    if (!series) {
      throw new Error('invalid pattern')
    }

    sketch.pattern = series
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
