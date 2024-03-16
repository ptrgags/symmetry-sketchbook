<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { ROSETTES } from '@/presets/parametric_curves'
import { ParametricCurveSketch } from '@/sketches/ParametricCurveSketch'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { FourierSeries } from '@/core/curve_symmetry/FourierSeries'
import { uncompress_base64 } from '@/core/serialization'

const route = useRoute()

const selected_preset = defineModel<string>('selected_preset')
const show_arm = defineModel<boolean>('show_arm', { default: true })

const sketch = new ParametricCurveSketch({
  pattern: undefined,
  show_arm: true
})

async function handle_query() {
  const query = route.query
  if (query.preset) {
    const preset_str = query.preset as string
    const preset = ROSETTES[preset_str]
    if (!preset) {
      throw new Error('invalid preset')
    }
    selected_preset.value = preset_str
    return
  }

  if (query.pattern) {
    const json = await uncompress_base64(query.pattern as string)
    // This log line is intentionally here to make it easier to copy and paste
    // parameters so I can make presets.
    console.log(json)
    const series = FourierSeries.from_json(json)
    if (!series) {
      throw new Error('invalid pattern')
    }

    selected_preset.value = undefined
    sketch.pattern = series
    sketch.restart_animation()
    return
  }

  // No query params, just select the first one from the dropdown
  selected_preset.value = Object.keys(ROSETTES)[0]
}

onMounted(() => {
  handle_query().catch(console.error)
})

watch(selected_preset, (value) => {
  if (!value) {
    // If we don't have a value, it was because the pattern was set via
    // ?pattern=<base64 string>, this is handled elsewhere
    return
  }

  sketch.pattern = ROSETTES[value]
  sketch.restart_animation()
})

watch(show_arm, (value) => {
  sketch.show_arm = value
})
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
      <select id="preset-select" v-model="selected_preset">
        <option v-for="key in Object.keys(ROSETTES)" :key="key" :value="key">{{ key }}</option>
      </select>
      <div class="form-row">
        <label><input type="checkbox" v-model="show_arm" /> Show drawing arm</label>
      </div>
      <p>
        This sketch generates curves by adding together circular motions. Each joint of the drawing
        machine represents a circular motion with a frequency (how fast it spins), and amplitude
        (length of arm) and phase (starting angle).
      </p>
    </template>
  </TwoColumns>
</template>
