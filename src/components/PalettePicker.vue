<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorPicker from './ColorPicker.vue'

const props = defineProps<{
  modelValue: number[][]
}>()

const colors = ref<number[][]>(props.modelValue)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[][]): void
}>()

watch(
  colors,
  (new_value) => {
    emit('update:modelValue', new_value)
  },
  { deep: true }
)

function remove_color(index: number) {
  colors.value = colors.value.filter((x, i) => i !== index)
}

function add_color() {
  if (colors.value.length >= 12) {
    return
  }
  colors.value.push([0, 0, 0])
}
</script>

<template>
  <div v-for="(color, index) in colors" :key="index">
    <ColorPicker v-model="colors[index]">Color {{ index + 1 }}</ColorPicker>
    <button @click="remove_color(index)">Remove Color</button>
  </div>
  <button @click="add_color">Add color</button>
</template>
