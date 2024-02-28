<script setup lang="ts">
import { type InputSymmetryType, to_string } from '@/core/PointSymmetry'
import { toggle } from '@/core/ui_util'
import { ref, watch } from 'vue'

export interface ColorTurnValue {
  output_rotations: number
  output_reflection: boolean
}

export interface ColorTurnEditorConstraint {
  input_symmetry: InputSymmetryType
  // For the second/third constraint, sometimes
  // the input_reflection and output_reflection
  // must match, so turn off the checkbox
  output_reflection_editable: boolean
}

const props = withDefaults(
  defineProps<{
    constraint: ColorTurnEditorConstraint
    rotationFolds: number
    modelValue?: ColorTurnValue
  }>(),
  {
    rotationFolds: 0,
    value: () => {
      return { output_rotations: 0, output_reflection: false }
    }
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: ColorTurnValue): void
}>()

const rotations = defineModel<number>('rotations', { default: 0 })
const has_reflection = ref<boolean>(false)
const toggle_reflection = toggle(has_reflection)

watch([rotations, has_reflection], (new_value, old_value) => {
  const [new_rotations, new_reflection] = new_value
  const [old_rotations, old_reflection] = old_value

  if (new_rotations === old_rotations && new_reflection === old_reflection) {
    return
  }

  emit('update:modelValue', {
    output_rotations: new_rotations,
    output_reflection: new_reflection
  })
})
</script>
<template>
  <div class="constraint">
    <div class="form-row">Input symmetry: {{ to_string(constraint.input_symmetry) }}</div>
    <div class="form-row">
      <label for="third-output-rotation">Output Turns:</label>
      <input
        id="third-output-rotation"
        type="number"
        min="0"
        :max="props.rotationFolds - 1"
        step="1"
        v-model.number="rotations"
      />
    </div>
    <div v-if="constraint.output_reflection_editable" class="form-row">
      <label for="third-output-reflection">Output Reflection?:</label>
      <input id="third-output-reflection" type="checkbox" @change="toggle_reflection" />
    </div>
  </div>
</template>

<style></style>
