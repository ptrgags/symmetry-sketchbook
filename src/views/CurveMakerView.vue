<script setup lang="ts">
import TwoColumns from '@/components/TwoColumns.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import TermGrid from '@/components/TermGrid.vue'

import { ref, type Ref } from 'vue'
import { SYMMETRY_TYPES } from '@/core/CurveSymmetryType'
import { ParametricCurveViewer, type ParametricCurveState } from '@/sketches/ParametricCurveViewer'
import { FourierSeries } from '@/core/FourierSeries'

const symmetry_type = ref(SYMMETRY_TYPES[0])

const sketch_state: Ref<ParametricCurveState> = ref({
  pattern: FourierSeries.from_tuples([[1, 1, 0]]),
  show_arm: false
})
const sketch = new ParametricCurveViewer(sketch_state.value)
</script>

<template>
  <TwoColumns>
    <template #left>
      <h1>Curve Maker</h1>
      <label for="symmetry-type">Symmetry Type: </label>
      <select id="symmetry-type" v-model="symmetry_type">
        <option v-for="(symmetry, index) in SYMMETRY_TYPES" :key="index" :value="symmetry_type">
          {{ symmetry.folds }}-fold symmetry of type {{ symmetry.type }}
        </option>
      </select>
      <TermGrid></TermGrid>
      <CoefficientPicker></CoefficientPicker>
    </template>
    <template #right><P5Sketch :sketch="sketch"></P5Sketch></template>
  </TwoColumns>
</template>
