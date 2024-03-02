<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { WallpaperSketch, type WallpaperState } from '@/sketches/WallpaperSketch'

const state: WallpaperState = {
  pattern: FourierSeries2D.from_tuples([
    [1, 0, 1, 0],
    [0, 1, 1, 0]
  ])
}

const sketch = new WallpaperSketch(state)
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
