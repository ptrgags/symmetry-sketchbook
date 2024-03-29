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
  <p>
    These options help visualize key points in the complex plane. This is aimed at the
    mathematically curious, but I find it also adds some artistic flair to the image!
  </p>
  <p>Note: reference geometry is not included when exporting patterns.</p>
  <h3>Axes</h3>

  <div class="form-row">
    <XYRTFlags id="input-axes-xyrt" v-model="ref_geom.input_axes.xyrt_flags" />
  </div>
  <div class="form-row">
    <ColorPicker id="input-axes-color" v-model="ref_geom.input_axes.color">Color: </ColorPicker>
  </div>
  <div class="form-row">
    <RangeSlider
      id="input-axes-thickness"
      :min="0.001"
      :max="0.1"
      :step="0.001"
      v-model="ref_geom.input_axes.thickness"
      >Thickness:
    </RangeSlider>
  </div>
  <div class="form-row">
    <details>
      <summary>Help</summary>
      Overlay a set of axes to show where you are in the complex plane
    </details>
  </div>

  <h3>Palette Axes</h3>

  <div class="form-row">
    <XYRTFlags id="output-axes-xyrt" v-model="ref_geom.output_axes.xyrt_flags" />
  </div>
  <div class="form-row">
    <ColorPicker id="output-axes-color" v-model="ref_geom.output_axes.color">Color: </ColorPicker>
  </div>
  <div class="form-row">
    <RangeSlider
      id="output-axes-thickness"
      :min="0.001"
      :max="0.5"
      :step="0.001"
      v-model="ref_geom.output_axes.thickness"
      >Thickness:
    </RangeSlider>
  </div>
  <details class="form-row">
    <summary>Help</summary>
    include axes in the color palette. Since these patterns significantly distort the complex plane,
    this helps you see how the axes warp.
  </details>

  <h3>Pulses</h3>
  <div class="form-row">
    <XYRTFlags id="pulse-xyrt" v-model="ref_geom.pulse.xyrt_flags" />
  </div>
  <div class="form-row">
    <ColorPicker id="pulse-color" v-model="ref_geom.pulse.color">Color: </ColorPicker>
  </div>
  <div class="form-row">
    <RangeSlider
      id="pulse-thickness"
      :min="0.001"
      :max="0.5"
      :step="0.001"
      v-model="ref_geom.pulse.thickness"
      >Thickness:
    </RangeSlider>
  </div>
  <div class="form-row">
    <details>
      <summary>Help</summary>
      Create animated pulses in one of the coordinate directions to help visualize how the
      coordinate directions warp.
    </details>
  </div>

  <h3>Grid Lines</h3>
  <div class="form-row">
    <XYRTFlags id="grid-xyrt" v-model="ref_geom.grid.xyrt_flags" />
  </div>
  <div class="form-row">
    <ColorPicker id="grid-color" v-model="ref_geom.grid.color">Color</ColorPicker>
  </div>
  <div class="form-row">
    <RangeSlider
      id="grid-thickness"
      :min="0.001"
      :max="0.5"
      :step="0.001"
      v-model="ref_geom.grid.thickness"
      >Thickness:</RangeSlider
    >
  </div>
  <div class="form-row">
    <details>
      <summary>Help</summary>
      Draw parallel grid lines in the palette to show how the coordinate grid warps.
    </details>
  </div>
</template>
