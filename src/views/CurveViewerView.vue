<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { ROSETTES } from '@/presets/parametric_curves'
import { ParametricCurveSketch, type ParametricCurveState } from '@/sketches/ParametricCurveSketch'
import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FourierSeries } from '@/core/curve_symmetry/FourierSeries'

const route = useRoute()
console.log(route.query)

const DEFAULT_PRESET = '2k + 1'
const selected_preset = ref(DEFAULT_PRESET)

function pick_initial_pattern(): FourierSeries {
  const query = route.query
  if (query.preset) {
    const preset_str = query.preset as string
    const preset = ROSETTES[preset_str]
    if (preset) {
      selected_preset.value = preset_str
      return preset
    }
  }

  return ROSETTES[DEFAULT_PRESET]
}

const sketch_state: Ref<ParametricCurveState> = ref({
  pattern: pick_initial_pattern(),
  // can be set by UI
  show_arm: true
})

const sketch = new ParametricCurveSketch(sketch_state.value)

function change_pattern(event: Event) {
  const select = event.target as HTMLSelectElement
  sketch_state.value.pattern = ROSETTES[select.value]
  sketch.restart_animation()
}
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>Curve Symmetry</h1>
      <label for="preset-select">Select Preset:</label>
      &nbsp;
      <select id="preset-select" @change="change_pattern" :value="selected_preset">
        <option v-for="key in Object.keys(ROSETTES)" :key="key" :value="key">{{ key }}</option>
      </select>
      <p>
        This sketch generates curves by adding together circular motions. Each joint of the drawing
        machine represents a circular motion with a frequency (how fast it spins), and amplitude
        (length of arm) and phase (starting angle).
      </p>
    </template>
  </TwoColumns>
</template>
@/core/curve_symmetry/FourierSeries
