/**
 * A description of a point symmetry. Symmetries are of the form:
 *
 * f input_transform = output_transform f
 *
 * More specifically, I support rules of the form:
 *
 * f rotate_k? invert? mirror? = rotate_k^u mirror? f
 *
 * where:
 * - rotate_k is a k-fold rotation: rotate_k(z) = e^(2pi * i / k) * z
 * - invert is a complex inversion: invert(z) = 1/z
 * - mirror is the complex conjugate: mirror(z) = conj(z)
 * - u is how many times to apply "color turning" to the output
 * - question marks mean the transformations are conditionally applied.
 */
export interface PointSymmetryRule {
  rotation_folds: number
  input_rotation: boolean
  input_reflection: boolean
  input_inversion: boolean
  output_rotations: number
  output_reflection: boolean
}

export const IDENTITY: PointSymmetryRule = {
  rotation_folds: 1,
  input_rotation: false,
  input_reflection: false,
  input_inversion: false,
  output_rotations: 0,
  output_reflection: false
}

/**
 * When updating terms of the fourier series, we have rules of the form
 *
 * b = rotate_k^P * a
 *
 * where
 *
 * P = input_sign * input_rotation * frequency_diff - output_sign * output_rotations
 * frequency_diff = (n - m)
 * input_rotation = integer representation of rule.input_rotation (boolean)
 * input_sign = -1 if there's an odd number of input flips, else 1
 * output_sign = -1 if there's an output reflection, else 1
 *
 * This method computes that P exponent
 *
 * @param rule The rule
 * @param frequency_diff The frequency difference (n - m)
 * @returns The number of rotations to apply
 */
export function get_rotation_power(rule: PointSymmetryRule, frequency_diff: number): number {
  // The sign of the first term depends on how many times we applied an
  // involution to the input
  const input_flips = Number(rule.input_inversion) + Number(rule.input_reflection)
  const input_sign = Math.pow(-1, input_flips)

  const input_rotation = Number(rule.input_rotation)

  const output_sign = Math.pow(-1, Number(rule.output_reflection))
  const output_rotations = rule.output_rotations

  return input_sign * input_rotation * frequency_diff - output_sign * output_rotations
}
