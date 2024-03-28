<script setup lang="ts" generic="T">
import type { Sketch } from '@/core/Sketch'
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
/** If we can't fit the full image, make it half as big to preserve the aspect ratio */
@media screen and (max-width: 500px) {
  .vertical canvas {
    max-width: 250px;
    max-height: 350px;
  }
}

/** I'd be surprised if there's a phone this narrow, but better safe than sorry */
@media screen and (max-width: 250px) {
  .vertical canvas {
    max-width: 125px;
    max-height: 175px;
  }
}
</style>
