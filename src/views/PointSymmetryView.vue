<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { PolynomialSketch, type PolynomialState } from '@/sketches/PolynomialSketch'
import { FourierSeries2D } from '@/core/FourierSeries2D'

const state: PolynomialState = {
  symmetry_mode: 'rosette',
  pattern: FourierSeries2D.from_tuples([[1, 0, 1, 0]]),
  rotation_order: 8
}

const sketch = new PolynomialSketch(state)
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
