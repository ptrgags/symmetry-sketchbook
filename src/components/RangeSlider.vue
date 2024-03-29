<script setup lang="ts">
defineProps<{
  modelValue: number
  min: number
  max: number
  step?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

function on_change(e: Event) {
  const slider = e.target as HTMLInputElement
  const value = parseFloat(slider.value)
  emit('update:modelValue', value)
}
</script>

<template>
  <label>
    <slot></slot>
    <input
      id="slider"
      type="range"
      :min="$props.min"
      :max="$props.max"
      :step="$props.step"
      :value="$props.modelValue"
      @input="on_change"
    />
  </label>
</template>

<style scoped>
input {
  height: 20px;
}
</style>
