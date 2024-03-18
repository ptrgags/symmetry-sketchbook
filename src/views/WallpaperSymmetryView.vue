<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { FourierSeries2DSerializer } from '@/core/serialization/SerializedFourierSeries2D'
import { WallpaperPaletteSerializer } from '@/core/serialization/SerializedWallpaperPalette'
import { from_compressed_json } from '@/core/serialization/serialization'
import { is_string } from '@/core/validation'
import { DEFAULT_PALETTE } from '@/core/wallpaper_symmetry/WallpaperPalette'
import { WALLPAPER_GROUPS } from '@/core/wallpaper_symmetry/WallpaperSymmetryGroup'
import { WallpaperSketch } from '@/sketches/WallpaperSketch'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const DEFAULT_PATTERN = FourierSeries2D.from_tuples([
  [1, 0, 1, 0],
  [0, 1, 1, 0]
])

const sketch = new WallpaperSketch({
  pattern: DEFAULT_PATTERN,
  palette: DEFAULT_PALETTE,
  group: WALLPAPER_GROUPS.p2
})

const PALETTE_SERIALIZER = new WallpaperPaletteSerializer()

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
    const series = await from_compressed_json(query.pattern, new FourierSeries2DSerializer())
    if (series) {
      sketch.pattern = series
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
      <h1>Wallpaper Gallery</h1>
    </template>
  </TwoColumns>
</template>
