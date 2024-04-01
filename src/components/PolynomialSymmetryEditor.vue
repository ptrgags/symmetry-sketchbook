<script setup lang="ts">
import { toggle } from '@/core/ui_util'
import {
  has_reflection,
  has_inversion,
  has_rotation
} from '@/core/point_symmetry/InputSymmetryType'
import { type PolynomialSymmetryRule } from '@/core/point_symmetry/PolynomialSymmetryRule'
import { computed, ref, watch } from 'vue'
import { type ColorTurnValue } from './ColorTurnEditor.vue'
import ColorTurnEditor from './ColorTurnEditor.vue'
import {
  NO_ROTATION_OPTIONS,
  ROTATION_OPTIONS,
  type GroupOption
} from '@/core/point_symmetry/GroupOption'
import type { ColorTurnEditorConstraint } from '@/core/point_symmetry/ColorTurnEditorConstraint'

const rotation_folds = defineModel<number>('rotation_folds', { default: 1 })

const no_rotation_group = defineModel<GroupOption>('no_rotation_group', {
  default: NO_ROTATION_OPTIONS[0]
})
const rotation_group = defineModel<GroupOption>('rotation_group', {
  default: ROTATION_OPTIONS[0]
})

const symmetry_group = computed<GroupOption>(() => {
  if (rotation_folds.value === 1) {
    return no_rotation_group.value
  }

  return rotation_group.value
})

const color_turning_enabled = ref<boolean>(false)
const toggle_color_turning = toggle(color_turning_enabled)

const first_color_turn = defineModel<ColorTurnValue>('first_color_turn')
const second_color_turn = defineModel<ColorTurnValue>('second_color_turn')
const third_color_turn = defineModel<ColorTurnValue>('third_color_turn')

defineProps<{
  symmetryMode: 'rosette' | 'frieze'
  value?: PolynomialSymmetryRule[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PolynomialSymmetryRule[]): void
}>()

function make_rule(
  rotation_folds: number,
  constraint: ColorTurnEditorConstraint,
  output_rotations: number,
  output_reflection: boolean
): PolynomialSymmetryRule {
  const input_symmetry = constraint.input_symmetry
  const input_rotation = has_rotation(input_symmetry)
  const input_reflection = has_reflection(input_symmetry)
  const input_inversion = has_inversion(input_symmetry)
  return {
    rotation_folds,
    input_rotation,
    input_reflection,
    input_inversion,
    output_rotations,
    output_reflection
  }
}

watch(
  [
    rotation_folds,
    symmetry_group,
    color_turning_enabled,
    first_color_turn,
    second_color_turn,
    third_color_turn
  ],
  (new_value) => {
    const [folds, group, color_turn_enabled, output1, output2, output3] = new_value
    if (!group) {
      return undefined
    }

    // Unless we defined a color-turning symmetry, there will be no output
    // transformations
    const default_output = {
      output_rotations: 0,
      output_reflection: false
    }

    // Every symmetry group has at least one constrait
    const constraint = group.first_constraint
    const output_symmetry1 = color_turn_enabled && output1 ? output1 : default_output
    const first_rule: PolynomialSymmetryRule = make_rule(
      folds,
      constraint,
      output_symmetry1.output_rotations,
      output_symmetry1.output_reflection
    )

    const rules: PolynomialSymmetryRule[] = [first_rule]

    if (group.second_constraint) {
      const constraint2 = group.second_constraint
      const output_symmetry2 = color_turn_enabled && output2 ? output2 : default_output

      // If the reflection was not editable, it was because we want to match
      // the value in the first constraint
      const reflection2 = constraint2.output_reflection_editable
        ? output_symmetry2.output_reflection
        : output_symmetry1.output_reflection
      const second_rule = make_rule(
        folds,
        constraint2,
        output_symmetry2.output_rotations,
        reflection2
      )
      rules.push(second_rule)
    }

    if (group.third_constraint) {
      const constraint3 = group.third_constraint
      const output_symmetry3 = color_turn_enabled && output3 ? output3 : default_output

      // Same thing: match the value of the first constraint if needed
      const reflection3 = constraint3.output_reflection_editable
        ? output_symmetry3.output_reflection
        : output_symmetry1.output_reflection
      const third_rule = make_rule(
        folds,
        constraint3,
        output_symmetry3.output_rotations,
        reflection3
      )
      rules.push(third_rule)
    }

    emit('update:modelValue', rules)
  }
)
</script>

<template>
  <div class="form-row">
    <label for="rotation-folds">Rotation folds (1 = no rotation) </label>
    <input
      id="rotation-folds"
      type="number"
      min="1"
      max="12"
      step="1"
      v-model.number="rotation_folds"
    />
  </div>
  <div class="form-row">
    <label for="symmetry-group">Symmetry Type: </label>
    <select v-if="rotation_folds === 1" id="symmetry-group" v-model="no_rotation_group">
      <option v-for="option in NO_ROTATION_OPTIONS" :key="option.id" :value="option">
        {{ option.label[$props.symmetryMode] }}
      </option>
    </select>
    <select v-else id="symmetry-group" v-model="rotation_group">
      <option v-for="option in ROTATION_OPTIONS" :key="option.id" :value="option">
        {{ option.label[$props.symmetryMode] }}
      </option>
    </select>
  </div>
  <div v-if="symmetry_group" class="form-row">
    <label for="color-turning-enabled">Color Turning Symmetry? </label>
    <input id="color-turning-enabled" type="checkbox" @change="toggle_color_turning" />
  </div>
  <ColorTurnEditor
    v-if="color_turning_enabled && symmetry_group"
    :constraint="symmetry_group.first_constraint"
    :rotation-folds="rotation_folds"
    v-model="first_color_turn"
  ></ColorTurnEditor>
  <ColorTurnEditor
    v-if="color_turning_enabled && symmetry_group?.second_constraint"
    :constraint="symmetry_group.second_constraint"
    :rotation-folds="rotation_folds"
    v-model="second_color_turn"
  ></ColorTurnEditor>
  <ColorTurnEditor
    v-if="color_turning_enabled && symmetry_group?.third_constraint"
    :constraint="symmetry_group.third_constraint"
    :rotation-folds="rotation_folds"
    v-model="third_color_turn"
  ></ColorTurnEditor>
</template>
