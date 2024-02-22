<script setup lang="ts">
import { type TermGridState, TermGridSketch } from '@/sketches/TermGridSketch'
import P5Sketch from './P5Sketch.vue'
import { ref, type Ref } from 'vue'
import { ComplexPolar } from '@/core/Complex'

const sketch_state: Ref<TermGridState> = ref({
  cell_size: 100,
  rows: 1,
  cols: 11,
  selected_index: 5,
  coefficients: new Array(11).fill(new ComplexPolar(0, 0))
})

const sketch = new TermGridSketch(sketch_state.value)

sketch.events.addEventListener('term-selected', (e: Event) => {
  console.log((e as CustomEvent).detail)
})
</script>

<template>
  <P5Sketch :sketch="sketch"></P5Sketch>
  <p>Selected:</p>
</template>
