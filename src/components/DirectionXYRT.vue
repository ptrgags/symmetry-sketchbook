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
  <div class="form-row">
    <input id="x" type="checkbox" :checked="x" @change="toggle_x" />
    <label for="x">x</label>
    <input id="y" type="checkbox" :checked="y" @change="toggle_y" />
    <label for="y">y</label>
    <input id="r" type="checkbox" :checked="r" @change="toggle_r" />
    <label for="r">r</label>
    <input id="theta" type="checkbox" :checked="theta" @change="toggle_theta" />
    <label for="theta">theta</label>
  </div>
</template>
