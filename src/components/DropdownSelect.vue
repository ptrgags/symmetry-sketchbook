<script setup lang="ts" generic="T">
import type { DropdownOption } from '@/core/DropdownOption'

const model = defineModel<T>()

const props = defineProps<{
  options: DropdownOption<T>[]
}>()
</script>

<template>
  <label>
    <slot></slot>
    <select v-model="model">
      <option v-for="option in props.options" :key="option.id" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
