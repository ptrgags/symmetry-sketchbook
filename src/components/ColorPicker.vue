<script setup lang="ts">
defineProps<{
  modelValue: number[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
}>()

function vec3_to_color(rgb_f32: number[]): string {
  const rgb_u8 = rgb_f32.map((val) => Math.floor(val * 255.0))
  const [r_hex, g_hex, b_hex] = rgb_u8.map((val) => val.toString(16).padStart(2, '0'))
  return `#${r_hex}${g_hex}${b_hex}`
}

function color_to_vec3(color_str: string): number[] {
  // parse #rrggbb -> [0, 255]^3 -> [0.0, 1.0]^3
  const parts = [0, 1, 2].map((x) => color_str.substring(1 + 2 * x, 1 + 2 * (x + 1)))
  const rgb_u8 = parts.map((str) => parseInt(str, 16))
  const rgb_f32 = rgb_u8.map((val) => val / 255.0)
  return rgb_f32
}

function on_change(e: Event) {
  const color_picker = e.target as HTMLInputElement
  const color_str = color_picker.value
  emit('update:modelValue', color_to_vec3(color_str))
}
</script>

<template>
  <div class="form-row">
    <input id="color-picker" type="color" :value="vec3_to_color(modelValue)" @input="on_change" />
    <label for="color-picker"> <slot></slot></label>
  </div>
</template>
