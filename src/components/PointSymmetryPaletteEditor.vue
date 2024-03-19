<script setup lang="ts">
import ColorPicker from './ColorPicker.vue'

import RangeSlider from './RangeSlider.vue'
import { PALETTE_TYPES } from '@/core/point_symmetry/PaletteType'
import { type PointSymmetryPalette } from '@/core/point_symmetry/PointSymmetryPalette'
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: PointSymmetryPalette
}>()

const palette = ref<PointSymmetryPalette>(props.modelValue)

const emit = defineEmits<{
  (e: 'update:modelValue', value: PointSymmetryPalette): void
}>()

watch(palette, (value) => emit('update:modelValue', value), { deep: true })
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
</template>
