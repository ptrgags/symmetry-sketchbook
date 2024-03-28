<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { AnimationState, TieDyeAnalogySketch, TieDyeState } from '@/sketches/TieDyeAnalogySketch'
import { ref } from 'vue'

const sketch = new TieDyeAnalogySketch({
  tie_dye_state: TieDyeState.Initial,
  animation_state: AnimationState.Pausing,
  reference_frame: 0,
  transition_percent: 0.0
})

const tie_dye_state = ref<TieDyeState>(TieDyeState.Initial)

sketch.events.addEventListener('tie_dye_step', (e) => {
  const step = (e as CustomEvent).detail as TieDyeState
  tie_dye_state.value = step
})

function step_class(state: TieDyeState): string[] {
  if (tie_dye_state.value === state) {
    return ['highlight-step']
  } else {
    return []
  }
}
</script>

<template>
  <h2>Tie-Dye Analogy</h2>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <p>
        The symmetric patterns used in this website are functions of complex numbers. I find the
        easiest way to explain this is with the following analogy of tie-dyeing a t-shirt:
      </p>
      <ol>
        <li>
          <span :class="step_class(TieDyeState.Initial)">Setup</span> &mdash; Start with an
          uncolored complex plane. This is like a blank t-shirt.
        </li>
        <li>
          <span :class="step_class(TieDyeState.Tying)">Tying</span> &mdash; Next, apply a complex
          polynomial to warp the plane. This is like tying up the t-shirt.
        </li>
        <li>
          <span :class="step_class(TieDyeState.Dyeing)">Dyeing</span> &mdash; Color the points based
          on where they land. This is like dyeing the t-shirt.
        </li>
        <li>
          <span :class="step_class(TieDyeState.Untying)">Untying</span> &mdash; Finally, return the
          points to where they came while keeping the colors. This is like untying the t-shirt to
          see the pattern.
        </li>
      </ol>
    </template>
  </TwoColumns>
</template>

<style scoped>
.highlight-step {
  color: var(--color-accent-dark);
}
</style>
