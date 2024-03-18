<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { Color } from '@/core/Color'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { FourierSeries2DSerializer } from '@/core/serialization/SerializedFourierSeries2D'
import { from_compressed_json } from '@/core/serialization/serialization'
import { is_string } from '@/core/validation'
import { WALLPAPER_GROUPS } from '@/core/wallpaper_symmetry/WallpaperSymmetryGroup'
import { WallpaperSketch, type WallpaperState } from '@/sketches/WallpaperSketch'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const DEFAULT_PATTERN = FourierSeries2D.from_tuples([
  [1, 0, 1, 0],
  [0, 1, 1, 0]
])

const sketch = new WallpaperSketch({
  pattern: DEFAULT_PATTERN,
  palette: [new Color(1, 0, 0), new Color(0, 1, 0), new Color(0, 0, 1)],
  group: WALLPAPER_GROUPS.p2
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
      <h1>Wallpaper Gallery</h1>
    </template>
  </TwoColumns>
</template>
