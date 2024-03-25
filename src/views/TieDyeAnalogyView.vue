<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { AnimationState, TieDyeAnalogySketch, TieDyeState } from '@/sketches/TieDyeAnalogySketch'
import { computed, ref } from 'vue'

const sketch = new TieDyeAnalogySketch({
  tie_dye_state: TieDyeState.Initial,
  animation_state: AnimationState.Pausing,
  reference_frame: 0,
  transition_percent: 0.0
})

const tie_dye_state = ref<TieDyeState>(TieDyeState.Initial)

const description = computed<string>(() => {
  switch (tie_dye_state.value) {
    case TieDyeState.Initial:
      return 'Step 1: (Setup) Start with an uncolored complex plane. This is like a blank t-shirt.'
    case TieDyeState.Tying:
      return 'Step 2: (Tying) Next, apply a complex polynomial to warp the plane. This is like tying up the t-shirt.'
    case TieDyeState.Dyeing:
      return 'Step 3: (Dyeing) Color the points based on where they land. This is like dyeing the t-shirt.'
    case TieDyeState.Untying:
      return 'Step 4: (Untying) Finally, return the points to where they came while keeping the colors. This is like untying the t-shirt to see the pattern.'
    default:
      return ''
  }
})

sketch.events.addEventListener('tie_dye_step', (e) => {
  const step = (e as CustomEvent).detail as TieDyeState
  tie_dye_state.value = step
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>Tie-Dye Analogy</h1>
      <p>{{ description }}</p>
    </template>
  </TwoColumns>
</template>
