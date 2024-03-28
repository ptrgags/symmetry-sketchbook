<script setup lang="ts">
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { PARAMETRIC_CURVES } from '@/presets/parametric_curves'
import { ParametricCurveSketch } from '@/sketches/ParametricCurveSketch'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { from_compressed_json } from '@/core/serialization/serialization'
import { FourierSeriesSerializer } from '@/core/serialization/SerializedFourierSeries'
import type { FourierSeries } from '@/core/curve_symmetry/FourierSeries'
import { get_string_param } from '@/core/query_util'

const PATTERN_SERIALIZER = new FourierSeriesSerializer()

const route = useRoute()

const selected_preset = ref<FourierSeries>()
const show_arm = ref<boolean>(true)

const sketch = new ParametricCurveSketch({
  pattern: undefined,
  show_arm: true
})

async function handle_pattern(preset_id: string | undefined, custom_pattern: string | undefined) {
  if (custom_pattern) {
    const series = await from_compressed_json(custom_pattern, PATTERN_SERIALIZER)
    if (series) {
      selected_preset.value = undefined
      sketch.pattern = series
      sketch.restart_animation()
      return
    }
  }

  if (preset_id) {
    const preset = PARAMETRIC_CURVES.find((x) => x.id === preset_id)
    if (preset) {
      selected_preset.value = preset.value
      sketch.pattern = preset.value
      sketch.restart_animation()
      return
    }
  }

  selected_preset.value = PARAMETRIC_CURVES[0].value
  sketch.pattern = selected_preset.value
  sketch.restart_animation()
}

async function handle_query() {
  const query = route.query

  handle_pattern(
    get_string_param(query.pattern, 'pattern'),
    get_string_param(query.custom_pattern, 'custom_pattern')
  )
}

onMounted(() => {
  handle_query().catch(console.error)
})

watch(selected_preset, (value) => {
  if (!value) {
    return
  }

  sketch.pattern = value
  sketch.restart_animation()
})

watch(show_arm, (value) => {
  sketch.show_arm = value
})
</script>

<template>
  <h2>Curve Symmetry Gallery</h2>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch" :is_card="true"></P5Sketch>
    </template>
    <template #right>
      <div class="form-row">
        <DropdownSelect :options="PARAMETRIC_CURVES" v-model="selected_preset"
          >Select Preset:
        </DropdownSelect>
      </div>
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
