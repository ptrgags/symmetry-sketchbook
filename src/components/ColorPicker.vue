<script setup lang="ts">
import { Color } from '@/core/Color'
import { watch } from 'vue'

const props = defineProps<{
  modelValue: Color
}>()

// vue hoists defineModel so set the default to black and then
// override it.
const color_hex = defineModel('color_hex', { default: '#000000' })
color_hex.value = props.modelValue.to_hex()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Color): void
}>()

watch(color_hex, (value) => {
  emit('update:modelValue', Color.from_hex(value))
})
</script>

<template>
  <label>
    <input type="color" v-model="color_hex" />
    <slot></slot>
  </label>
</template>
