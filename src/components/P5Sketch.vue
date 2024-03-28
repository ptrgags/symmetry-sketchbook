<script setup lang="ts" generic="T">
import type { Sketch } from '@/core/Sketch'
import { ref, onMounted, type Ref, computed } from 'vue'

const props = defineProps<{
  sketch: Sketch<T>
  // If true, this is a trading card aspect ratio card which needs slightly
  // different CSS to look right.
  is_card: boolean
}>()

const container: Ref<HTMLElement | null> = ref(null)

onMounted(() => {
  if (container.value) {
    props.sketch.wrap(container.value)
  }
})

const sketch_classes = computed<string[]>(() => {
  if (props.is_card) {
    return ['vertical', 'card']
  }

  return ['vertical', 'other-sketch']
})
</script>

<template>
  <div :class="sketch_classes" ref="container"></div>
</template>

<style>
/** Use this for  */
.other-sketch canvas {
  max-width: 80vw;
  object-fit: contain;
}

/** If we can't fit the full image, make it half as big to preserve the aspect ratio */
@media screen and (max-width: 500px) {
  .card canvas {
    max-width: 250px;
    max-height: 350px;
  }
}

/** I'd be surprised if there's a phone this narrow, but better safe than sorry */
@media screen and (max-width: 250px) {
  .card canvas {
    max-width: 125px;
    max-height: 175px;
  }
}
</style>
