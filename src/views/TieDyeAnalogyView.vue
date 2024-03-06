<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { AnimationState, TieDyeAnalogySketch, TieDyeState } from '@/sketches/TieDyeAnalogySketch'

const sketch = new TieDyeAnalogySketch({
  tie_dye_state: TieDyeState.Initial,
  animation_state: AnimationState.Pausing,
  reference_frame: 0,
  transition_percent: 0.0
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>Tie-Dye Analogy</h1>
    </template>
  </TwoColumns>
</template>
