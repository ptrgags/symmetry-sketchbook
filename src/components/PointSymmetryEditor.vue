<script setup lang="ts">
import { ref } from 'vue'
const rotation_folds = ref<number>(1)

function update_rotation(event: Event) {
  const number_input = event.target as HTMLInputElement
  rotation_folds.value = parseInt(number_input.value)
}
</script>

<template>
  <label for="rotation_folds">Rotation folds (1 = no rotation)</label>
  <input id="rotation_folds" type="number" min="1" max="12" value="1" />
</template>
