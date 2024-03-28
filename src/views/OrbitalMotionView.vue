<script setup lang="ts">
import { OrbitalMotionSketch, type OrbitalMotionState } from '@/sketches/OrbitalMotionSketch'
import P5Sketch from '@/components/P5Sketch.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { watch } from 'vue'

const sketch_state: OrbitalMotionState = {
  planets: [
    {
      orbital_radius: 0,
      radius: 0.2,
      frequency: 0,
      color: [255, 127, 0]
    },
    {
      orbital_radius: 0.2,
      radius: 0.1,
      frequency: 25,
      color: [255, 255, 0]
    },
    {
      orbital_radius: 0.5,
      radius: 0.1,
      frequency: 11,
      color: [255, 0, 0]
    },
    {
      orbital_radius: 1.0,
      radius: 0.2,
      frequency: 5,
      color: [0, 255, 0]
    },
    {
      orbital_radius: 1.5,
      radius: 0.3,
      frequency: 2,
      color: [0, 0, 255]
    }
  ],
  reference_planet: 0
}

const sketch = new OrbitalMotionSketch(sketch_state)

const perspective = defineModel<number>('perspective', {
  default: 0
})

watch(perspective, (value) => {
  sketch_state.reference_planet = value ?? 0
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch"></P5Sketch>
    </template>
    <template #right>
      <h1>Orbital Motion</h1>
      <label for="preset-select">Select Perspective:</label>
      <select id="preset-select" v-model="perspective">
        <option v-for="i in sketch_state.planets.length" :key="i" :value="i - 1">
          {{ i === 1 ? 'Sun' : `Planet ${i - 1}` }}
        </option>
      </select>
      <p>
        The motion of a solar system looks very different depending on your perspective. Relative to
        the star at the center, the orbits are concentric circles. However, if you center the
        coordinates on one of the planets' centers (ignoring the spin of the planet), you get
        intricate patterns known as
        <a href="https://en.wikipedia.org/wiki/Epicycloid">epicycloids</a>.
      </p>
      <p>To see this change of perspective, select one of the planets from the dropdown above.</p>
      <details>
        <summary>Fun Fact: Spirograph Art</summary>
        A <a href="https://en.wikipedia.org/wiki/Spirograph">Spirograph</a> can draw epicycloids.
        This happens when the drawing gear rolls along the outside of the ring. What if you put the
        gear on the inside of the ring? you get a
        <a href="https://en.wikipedia.org/wiki/Hypocycloid">hypocycloid</a>
        instead.
      </details>
    </template>
  </TwoColumns>
</template>
