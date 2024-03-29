<script setup lang="ts">
import { toggle } from '@/core/ui_util'
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean[]
  }>(),
  {
    modelValue: () => [false, false, false, false]
  }
)

const [x_val, y_val, r_val, theta_val] = props.modelValue
const x = ref(x_val)
const y = ref(y_val)
const r = ref(r_val)
const theta = ref(theta_val)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean[]): void
}>()

watch([x, y, r, theta], (new_value) => {
  emit('update:modelValue', new_value)
})

const toggle_x = toggle(x)
const toggle_y = toggle(y)
const toggle_r = toggle(r)
const toggle_theta = toggle(theta)
</script>

<template>
  <div>
    Enabled:
    <label><input type="checkbox" :checked="x" @change="toggle_x" />x</label>
    <label><input type="checkbox" :checked="y" @change="toggle_y" />y</label>
    <label><input type="checkbox" :checked="r" @change="toggle_r" />r</label>
    <label><input type="checkbox" :checked="theta" @change="toggle_theta" />theta</label>
  </div>
</template>
