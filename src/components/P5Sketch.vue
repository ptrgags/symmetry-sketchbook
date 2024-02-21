<script setup lang="ts">
import p5 from 'p5'
import { ref, onMounted, type Ref } from 'vue'

const container: Ref<HTMLElement | null> = ref(null)

const closure = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(500, 700)

    const canvas_element = canvas.elt as HTMLElement

    canvas_element.style.visibility = ''
    canvas_element.removeAttribute('data-hidden')
  }

  p.draw = () => {
    p.background(127, 0, 255)
    p.rect(10, 10, 100, 100)
  }
}

onMounted(() => {
  if (container.value) {
    new p5(closure, container.value)
  }
})
</script>

<template>
  <div ref="container"></div>
</template>
