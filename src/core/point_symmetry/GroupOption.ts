import type { ColorTurnEditorConstraint } from './ColorTurnEditorConstraint'
import { InputSymmetryType } from './InputSymmetryType'

export interface GroupOption {
  id: string
  label: string
  first_constraint: ColorTurnEditorConstraint
  second_constraint?: ColorTurnEditorConstraint
  third_constraint?: ColorTurnEditorConstraint
}

export const NO_ROTATION_OPTIONS: GroupOption[] = [
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

export const ROTATION_OPTIONS: GroupOption[] = [
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
