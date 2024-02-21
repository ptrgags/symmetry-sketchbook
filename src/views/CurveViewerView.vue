<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { type ParametricCurveState, ParametricCurveViewer } from '@/sketches/ParametricCurveViewer'
import { ROSETTES } from '@/presets/parametric_curves'

const sketch_state: ParametricCurveState = {
  start_frame: 0,
  pattern: ROSETTES['2k + 1'],
  curve: [],
  show_arm: false
}

const sketch = new ParametricCurveViewer(sketch_state)
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>Curve Viewer</h1>
      <p>
        This sketch generates curves by adding together circular motions. Each joint of the drawing
        machine represents a circular motion with a frequency (how fast it spins), and amplitude
        (length of arm) and phase (starting angle).
      </p>
    </template>
  </TwoColumns>
</template>
