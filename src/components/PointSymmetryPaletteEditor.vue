<script setup lang="ts">
import ColorPicker from './ColorPicker.vue'
import XYRTFlags from './XYRTFlags.vue'
import RangeSlider from './RangeSlider.vue'
import { PALETTE_TYPES, type PaletteType } from '@/core/point_symmetry/PaletteType'
import {
  ReferenceGeometryPrefix,
  type PointSymmetryPalette
} from '@/core/point_symmetry/PointSymmetryPalette'
import { ref, watch } from 'vue'
import type { Color } from '@/core/Color'

const props = defineProps<{
  modelValue: PointSymmetryPalette
}>()

const palette = ref<PointSymmetryPalette>(props.modelValue)

const emit = defineEmits<{
  // Update with the whole struct. Used for serializing the palette.
  (e: 'update:modelValue', value: PointSymmetryPalette): void

  // More granular updates for setting uniforms
  (e: 'update:paletteType', paletteType: PaletteType): void
  (e: 'update:color', prefix: string, color: Color): void
  (e: 'update:farPower', value: number): void
  (e: 'update:xyrtFlags', prefix: string, xyrt_flags: boolean[]): void
  (e: 'update:thickness', prefix: string, thickness: number): void
}>()

watch(
  () => palette.value.palette_type,
  (value) => emit('update:paletteType', value)
)

watch(
  () => palette.value.primary_color,
  (value) => emit('update:color', 'primary', value)
)
watch(
  () => palette.value.secondary_color,
  (value) => emit('update:color', 'secondary', value)
)
watch(
  () => palette.value.far_color,
  (value) => emit('update:color', 'far', value)
)
watch(
  () => palette.value.far_power,
  (value) => emit('update:farPower', 20 - value)
)

// For each of these reference geometry types the options are the same
for (const prefix of Object.values(ReferenceGeometryPrefix)) {
  watch(
    () => palette.value.ref_geom[prefix].xyrt_flags,
    (value) => {
      emit('update:xyrtFlags', prefix, value)
    }
  )
  watch(
    () => palette.value.ref_geom[prefix].color,
    (value) => {
      emit('update:color', prefix, value)
    }
  )
  watch(
    () => palette.value.ref_geom[prefix].thickness,
    (value) => {
      emit('update:thickness', prefix, value)
    }
  )
}
</script>

<template>
  <div class="form-row">
    <label for="palette-type">Palette Type: </label>
    <select id="palette-type" v-model="palette.palette_type">
      <option v-for="option in PALETTE_TYPES" :key="option.id" :value="option">
        {{ option.label }}
      </option>
    </select>
  </div>
  <div class="form-row">
    <ColorPicker id="primary-color" v-model="palette.primary_color">Primary Color</ColorPicker>
  </div>
  <div class="form-row">
    <ColorPicker id="secondary-color" v-model="palette.secondary_color"
      >Secondary Color</ColorPicker
    >
  </div>

  <div class="form-row">
    <ColorPicker id="far-color" v-model="palette.far_color">Far Away Color</ColorPicker>
  </div>
  <div class="form-row">
    <RangeSlider id="far-power" :min="1" :max="19" v-model="palette.far_power"
      >Far Away Fade</RangeSlider
    >
  </div>

  <details class="form-row">
    <summary>Reference Geometry</summary>

    <h3>Axes</h3>
    <XYRTFlags id="input-axes-xyrt" v-model="palette.ref_geom.input_axes.xyrt_flags" />
    <ColorPicker id="input-axes-color" v-model="palette.ref_geom.input_axes.color"
      >Color</ColorPicker
    >
    <RangeSlider
      id="input-axes-thickness"
      :min="0.001"
      :max="0.1"
      :step="0.001"
      v-model="palette.ref_geom.input_axes.thickness"
      >Thickness:</RangeSlider
    >

    <h3>Palette Axes</h3>
    <XYRTFlags id="output-axes-xyrt" v-model="palette.ref_geom.output_axes.xyrt_flags" />
    <ColorPicker id="output-axes-color" v-model="palette.ref_geom.output_axes.color"
      >Color</ColorPicker
    >
    <RangeSlider
      id="output-axes-thickness"
      :min="0.001"
      :max="0.5"
      :step="0.001"
      v-model="palette.ref_geom.output_axes.thickness"
      >Thickness:</RangeSlider
    >

    <h3>Pulses</h3>
    <XYRTFlags id="pulse-xyrt" v-model="palette.ref_geom.pulse.xyrt_flags" />
    <ColorPicker id="pulse-color" v-model="palette.ref_geom.pulse.color">Color</ColorPicker>
    <RangeSlider
      id="pulse-thickness"
      :min="0.001"
      :max="0.5"
      :step="0.001"
      v-model="palette.ref_geom.pulse.thickness"
      >Thickness:</RangeSlider
    >

    <h3>Grid Lines</h3>
    <XYRTFlags id="grid-xyrt" v-model="palette.ref_geom.grid.xyrt_flags" />
    <ColorPicker id="grid-color" v-model="palette.ref_geom.grid.color">Color</ColorPicker>
    <RangeSlider
      id="grid-thickness"
      :min="0.001"
      :max="0.5"
      :step="0.001"
      v-model="palette.ref_geom.grid.thickness"
      >Thickness:</RangeSlider
    >
  </details>
</template>
