<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch></P5Sketch>
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
