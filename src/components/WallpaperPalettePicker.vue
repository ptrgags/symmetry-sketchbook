<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorPicker from './ColorPicker.vue'
import { Color } from '@/core/Color'
import {
  type WallpaperPalette,
  WallpaperPaletteType
} from '@/core/wallpaper_symmetry/WallpaperPalette'

const props = defineProps<{
  modelValue: WallpaperPalette
}>()

const palette = ref<WallpaperPalette>(props.modelValue)

const emit = defineEmits<{
  (e: 'update:modelValue', value: WallpaperPalette): void
}>()

watch(
  palette,
  (new_value) => {
    emit('update:modelValue', new_value)
  },
  { deep: true }
)

function remove_color(index: number) {
  palette.value.colors = palette.value.colors.filter((x, i) => i !== index)
}

function add_color() {
  if (palette.value.colors.length >= 12) {
    return
  }
  palette.value.colors.push(new Color(0, 0, 0))
}
</script>

<template>
  <div class="form-row">
    <label>
      Palette Type
      <select v-model="palette.palette_type">
        <option :value="WallpaperPaletteType.HorizontalStripes">Horizontal Stripes</option>
        <option :value="WallpaperPaletteType.VerticalStripes">Vertical Stripes</option>
        <option :value="WallpaperPaletteType.Plaid">Plaid</option>
      </select>
    </label>
  </div>
  <div v-for="(color, index) in palette.colors" :key="index">
    <ColorPicker v-model="palette.colors[index]">Color {{ index + 1 }}</ColorPicker>
    <button @click="remove_color(index)">Remove Color</button>
  </div>
  <button @click="add_color">Add color</button>
</template>
