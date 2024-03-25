<script setup lang="ts" generic="T">
import type { Sketch } from '@/core/Sketch'
import p5 from 'p5'
import { ref, onMounted, type Ref } from 'vue'

const props = defineProps<{
  sketch: Sketch<T>
}>()

const container: Ref<HTMLElement | null> = ref(null)

onMounted(() => {
  if (container.value) {
    props.sketch.wrap(container.value)
  }
})
</script>

<template>
  <div class="vertical" ref="container"></div>
</template>

<style>
.vertical canvas {
  max-width: 80vw;
  object-fit: contain;
}
</style>
