<script setup lang="ts">
import type { ColorTurnEditorConstraint } from '@/core/point_symmetry/ColorTurnEditorConstraint'
import { to_string } from '@/core/point_symmetry/InputSymmetryType'
import { toggle } from '@/core/ui_util'
import { ref, watch } from 'vue'

export interface ColorTurnValue {
  output_rotations: number
  output_reflection: boolean
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
      <label>
        Output Turns:
        <input
          id="third-output-rotation"
          type="number"
          min="0"
          :max="props.rotationFolds - 1"
          step="1"
          v-model.number="rotations"
        />
      </label>
    </div>
    <div v-if="constraint.output_reflection_editable" class="form-row">
      <label
        >Output Reflection?:
        <input id="third-output-reflection" type="checkbox" @change="toggle_reflection"
      /></label>
    </div>
  </div>
</template>

<style></style>
