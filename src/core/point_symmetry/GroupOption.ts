import type { ColorTurnEditorConstraint } from './ColorTurnEditorConstraint'
import { InputSymmetryType } from './InputSymmetryType'

export interface GroupOption {
  id: string
  label: {
    rosette: string
    frieze: string
  }
  first_constraint: ColorTurnEditorConstraint
  second_constraint?: ColorTurnEditorConstraint
  third_constraint?: ColorTurnEditorConstraint
}

export const NO_ROTATION_OPTIONS: GroupOption[] = [
  {
    id: 'identity',
    label: {
      rosette: 'No Symmetry',
      frieze: 'No Symmetry'
    },
    first_constraint: {
      input_symmetry: InputSymmetryType.Identity,
      output_reflection_editable: true
    }
  },
  {
    id: 'mirror_x',
    label: {
      rosette: 'Mirror',
      frieze: 'Mirrors (horizontal)'
    },
    first_constraint: {
      input_symmetry: InputSymmetryType.Mirror,
      output_reflection_editable: true
    }
  },
  {
    id: 'inversion',
    label: {
      rosette: 'Circle inversion',
      frieze: 'Mirror (vertical)'
    },
    first_constraint: {
      input_symmetry: InputSymmetryType.CircleInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'reciprocal',
    label: {
      rosette: 'Complex inversion',
      frieze: 'Rotations'
    },
    first_constraint: {
      input_symmetry: InputSymmetryType.ComplexInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'mirror_inversion',
    label: {
      rosette: 'Mirror + Complex inversion',
      frieze: 'Mirror (horizontal) + rotations'
    },
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
    label: {
      rosette: 'Rotation',
      frieze: 'Translations'
    },
    first_constraint: {
      input_symmetry: InputSymmetryType.Rotation,
      output_reflection_editable: true
    }
  },
  {
    id: 'p11g',
    label: {
      rosette: 'Roto-inversion',
      frieze: 'Glide Reflections'
    },
    first_constraint: {
      input_symmetry: InputSymmetryType.RotoInversion,
      output_reflection_editable: true
    }
  },
  {
    id: 'p1m1',
    label: {
      rosette: 'Rotation + Mirror',
      frieze: 'Translations + Mirrors (horizontal)'
    },
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
    label: {
      rosette: 'Rotation + Circle inversion',
      frieze: 'Translations + Mirror (vertical)'
    },
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
    label: {
      rosette: 'Rotation + Complex inversion',
      frieze: 'Translations + Rotations'
    },
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
    label: {
      rosette: 'Roto-inversion + Mirror',
      frieze: 'Glide Reflections + Mirrors (horizontal)'
    },
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
    label: {
      rosette: 'Rotation + Complex Inversion + Mirror',
      frieze: 'Translations + Mirrors'
    },
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
