<script setup lang="ts">
import { toggle } from '@/core/ui_util'
import { computed, ref, watch, type Ref } from 'vue'
import { type ColorTurnValue, type ColorTurnEditorConstraint } from './ColorTurnEditor.vue'
import ColorTurnEditor from './ColorTurnEditor.vue'
import {
  InputSymmetryType,
  has_inversion,
  type PointSymmetryRule,
  has_reflection
} from '../core/PointSymmetry'

interface GroupOption {
  id: string
  label: string
  first_constraint: ColorTurnEditorConstraint
  second_constraint?: ColorTurnEditorConstraint
  third_constraint?: ColorTurnEditorConstraint
}

const NO_ROTATION_OPTIONS: GroupOption[] = [
  {
    id: 'identity',
    label: 'No Symmetry',
    first_constraint: {
      input_symmetry: InputSymmetryType.Identity,
      output_reflection_editable: true
    }
  },
  {
    id: 'mirror_x',
    label: 'Mirror',
    first_constraint: {
      input_symmetry: InputSymmetryType.Mirror,
      output_reflection_editable: true
    }
  },
  {
    id: 'inversion',
    label: 'Circle inversion',
    first_constraint: {
      input_symmetry: InputSymmetryType.CircleInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'reciprocal',
    label: 'Complex inversion',
    first_constraint: {
      input_symmetry: InputSymmetryType.ComplexInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'mirror_inversion',
    label: 'Mirror + Complex inversion',
    first_constraint: {
      input_symmetry: InputSymmetryType.Mirror,
      output_reflection_editable: true
    },
    second_constraint: {
      input_symmetry: InputSymmetryType.ComplexInversion,
      output_reflection_editable: true
    }
  }
]

const ROTATION_OPTIONS: GroupOption[] = [
  {
    id: 'p1',
    label: 'Rotation',
    first_constraint: {
      input_symmetry: InputSymmetryType.Rotation,
      output_reflection_editable: true
    }
  },
  {
    id: 'p11g',
    label: 'Roto-inversion',
    first_constraint: {
      input_symmetry: InputSymmetryType.RotoInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'p1m1',
    label: 'Rotation + Mirror',
    first_constraint: {
      input_symmetry: InputSymmetryType.Rotation,
      output_reflection_editable: true
    },
    second_constraint: {
      input_symmetry: InputSymmetryType.Mirror,
      output_reflection_editable: false
    }
  },
  {
    id: 'p11m',
    label: 'Rotation + Circle inversion',
    first_constraint: {
      input_symmetry: InputSymmetryType.Rotation,
      output_reflection_editable: true
    },
    second_constraint: {
      input_symmetry: InputSymmetryType.CircleInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'p2',
    label: 'Rotation + Complex inversion',
    first_constraint: {
      input_symmetry: InputSymmetryType.Rotation,
      output_reflection_editable: true
    },
    second_constraint: {
      input_symmetry: InputSymmetryType.ComplexInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'p2mg',
    label: 'Roto-inversion + Mirror',
    first_constraint: {
      input_symmetry: InputSymmetryType.RotoInversion,
      output_reflection_editable: true
    },
    second_constraint: {
      input_symmetry: InputSymmetryType.Mirror,
      output_reflection_editable: true
    }
  },
  {
    id: 'p2mm',
    label: 'Rotation + Complex Inversion + Mirror',
    first_constraint: {
      input_symmetry: InputSymmetryType.Rotation,
      output_reflection_editable: true
    },
    second_constraint: {
      input_symmetry: InputSymmetryType.ComplexInversion,
      output_reflection_editable: true
    },
    third_constraint: {
      input_symmetry: InputSymmetryType.Mirror,
      output_reflection_editable: false
    }
  }
]

const rotation_folds = defineModel<number>('rotation_folds', { default: 1 })
const symmetry_group = defineModel<GroupOption>('symmetry_group')

const color_turning_enabled = ref<boolean>(false)
const toggle_color_turning = toggle(color_turning_enabled)

const group_options = computed<GroupOption[]>(() => {
  if (rotation_folds.value === 1) {
    return NO_ROTATION_OPTIONS
  }

  return ROTATION_OPTIONS
})

const first_color_turn = defineModel<ColorTurnValue>('first_color_turn')
const second_color_turn = defineModel<ColorTurnValue>('second_color_turn')
const third_color_turn = defineModel<ColorTurnValue>('third_color_turn')

defineProps<{
  value?: PointSymmetryRule[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PointSymmetryRule[]): void
}>()

function make_rule(
  rotation_folds: number,
  constraint: ColorTurnEditorConstraint,
  output_rotations: number,
  output_reflection: boolean
): PointSymmetryRule {
  const input_symmetry = constraint.input_symmetry
  const input_reflection = has_reflection(input_symmetry)
  const input_inversion = has_inversion(input_symmetry)
  return {
    rotation_folds,
    // hard-coding to 1 because most of the times it doesn't matter
    input_rotations: 1,
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
    const first_rule: PointSymmetryRule = make_rule(
      folds,
      constraint,
      output_symmetry1.output_rotations,
      output_symmetry1.output_reflection
    )

    const rules: PointSymmetryRule[] = [first_rule]

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
  <div>
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
      <select id="symmetry-group" v-model="symmetry_group">
        <option v-for="option in group_options" :key="option.id" :value="option">
          {{ option.label }}
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
  </div>
</template>

<style>
.constraint {
  width: 100%;
  background-color: var(--color-background-light);
  margin: 4px 0;
  padding: 8px;
}
.form-row {
  width: 100%;
  margin: 4px 0;
}
</style>
