<script setup lang="ts">
import ColorPicker from './ColorPicker.vue'
import RangeSlider from './RangeSlider.vue'

import { type ReferenceGeometryCollection } from '@/core/ReferenceGeometry'
import XYRTFlags from './XYRTFlags.vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: ReferenceGeometryCollection
}>()

const ref_geom = ref<ReferenceGeometryCollection>(props.modelValue)

const emit = defineEmits<{
  (e: 'update:modelValue', value: ReferenceGeometryCollection): void
}>()

watch(
  ref_geom,
  (value) => {
    emit('update:modelValue', value)
  },
  { deep: true }
)
</script>

<template>
  <h3>Axes</h3>
  <XYRTFlags id="input-axes-xyrt" v-model="ref_geom.input_axes.xyrt_flags" />
  <ColorPicker id="input-axes-color" v-model="ref_geom.input_axes.color">Color</ColorPicker>
  <RangeSlider
    id="input-axes-thickness"
    :min="0.001"
    :max="0.1"
    :step="0.001"
    v-model="ref_geom.input_axes.thickness"
    >Thickness:</RangeSlider
  >

  <h3>Palette Axes</h3>
  <XYRTFlags id="output-axes-xyrt" v-model="ref_geom.output_axes.xyrt_flags" />
  <ColorPicker id="output-axes-color" v-model="ref_geom.output_axes.color">Color</ColorPicker>
  <RangeSlider
    id="output-axes-thickness"
    :min="0.001"
    :max="0.5"
    :step="0.001"
    v-model="ref_geom.output_axes.thickness"
    >Thickness:</RangeSlider
  >

  <h3>Pulses</h3>
  <XYRTFlags id="pulse-xyrt" v-model="ref_geom.pulse.xyrt_flags" />
  <ColorPicker id="pulse-color" v-model="ref_geom.pulse.color">Color</ColorPicker>
  <RangeSlider
    id="pulse-thickness"
    :min="0.001"
    :max="0.5"
    :step="0.001"
    v-model="ref_geom.pulse.thickness"
    >Thickness:</RangeSlider
  >

  <h3>Grid Lines</h3>
  <XYRTFlags id="grid-xyrt" v-model="ref_geom.grid.xyrt_flags" />
  <ColorPicker id="grid-color" v-model="ref_geom.grid.color">Color</ColorPicker>
  <RangeSlider
    id="grid-thickness"
    :min="0.001"
    :max="0.5"
    :step="0.001"
    v-model="ref_geom.grid.thickness"
    >Thickness:</RangeSlider
  >
</template>
