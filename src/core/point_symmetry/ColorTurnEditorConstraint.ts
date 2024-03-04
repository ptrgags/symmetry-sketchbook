import type { InputSymmetryType } from './InputSymmetryType'

export interface ColorTurnEditorConstraint {
  input_symmetry: InputSymmetryType
  // For the second/third constraint, sometimes
  // the input_reflection and output_reflection
  // must match, so turn off the checkbox
  output_reflection_editable: boolean
}
