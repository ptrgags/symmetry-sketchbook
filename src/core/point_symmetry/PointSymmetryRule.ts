import type { GridIndices2D } from '../GridIndices2D'
import { diff_row_to_sum, type DiffSum } from './DiffSum'
import type { PartnerType } from './PartnerType'

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

export function get_partner_type(rule: PointSymmetryRule): PartnerType {
  // Using !== as XOR
  const swap = rule.input_reflection !== rule.output_reflection
  const invert = rule.input_inversion

  if (invert && swap) {
    return 'flip_row'
  }

  if (invert) {
    return 'flip_both'
  }

  if (swap) {
    return 'flip_col'
  }

  return 'identity'
}

function input_flips(rule: PointSymmetryRule): number {
  return Number(rule.input_inversion) + Number(rule.input_reflection)
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
  const input_sign = Math.pow(-1, input_flips(rule))

  const input_rotation = Number(rule.input_rotation)

  const output_sign = Math.pow(-1, Number(rule.output_reflection))
  const output_rotations = rule.output_rotations

  return input_sign * input_rotation * frequency_diff - output_sign * output_rotations
}

/**
 * In the polynomial editor (see PolynomialMakerView.vue), we want the term
 * grid to only contain valid terms. So contstrain them so the frequency diffs
 * of each column are spaced evenly apart according to the rotation rule.
 * @param rule The symmetry rule
 * @param signed_col The signed column number for the term grid
 * @return for pure input rotations, this returns the frequency difference for this column of the term grid. For all other cases, it returns the column number as-is
 */
export function get_freq_diff(rule: PointSymmetryRule, signed_col: number): number {
  const has_input_rotation = rule.input_rotation
  const has_involutions = rule.input_reflection || rule.input_inversion || rule.output_reflection

  // This contraint only applies when the corresponding coefficient
  // constraint would be:
  //
  //  a_nm = rotate_k^P a_nm
  //
  //  why?:
  //
  // - If the input is identity, the "rotation" would be a full turn so any
  //   frequency would be fine
  // - If the input is just a mirror/inversion/both, the coefficient constraint
  //   will relate two different terms. Here we only care about a constraint
  //   that deals with a single term (identity)
  // - what about the case where we have an input _and_ output reflection?
  //   while the rule would be: a_nm = rotate_k^P mirror a_nm, this constraint
  //   says that the coefficient's value is its own reflection in a rotated
  //   mirror, i.e. is on a particular line. This is a constraint on the
  //   _value_ of a_nm, not where it appears in the grid, so we can ignore
  //   it here.
  if (!has_input_rotation || has_involutions) {
    return signed_col
  }

  // we now have a symmetry rule of the form:
  //
  // f rotate_k = rotate_k^P f
  //
  // where P simplifies to:
  //
  // P = frequency_diff - output_rotations
  //
  // This is only true if rotate_k^P is the identity transform,
  // which means P = 0 (mod k)
  //
  // in other words, P = k * R for some integer R.
  // We want to plug in the colum number for R and solve for the
  // corresponding frequency difference. We get:
  //
  // diff - output_rotations = k * col
  // diff = k * col + output_rotations
  const folds = rule.rotation_folds
  const output_rotations = rule.output_rotations

  return folds * signed_col + output_rotations
}

/**
 * For the UI, we have a grid of terms, but we want to only allow editing
 * terms that match the symmetry rule. This function looks at the symmetry
 * rule and picks appropriate (diff, sum) frequencies
 * @param signed_indices The signed grid indices for a single grid cell
 * @param symmetry_rule The symmetry rule to apply
 * @returns A (diff, sum) of frequencies for this grid cell
 */
export function indices_to_diff_sum(
  signed_indices: GridIndices2D,
  symmetry_rule: PointSymmetryRule
): DiffSum {
  const { row, col } = signed_indices

  // Rotation symmetry puts constraints on which frequencies we can use,
  // everything else will pass through col as-is
  const diff = get_freq_diff(symmetry_rule, col)

  // The symmetry rule only affects the difference of frequencies, the
  // sum of frequencies can be anything we want, though the fact that the
  // diff, sum grid is at 45 degrees to the row, col grid restricts us a
  // little
  const sum = diff_row_to_sum(diff, row)
  return { diff, sum }
}
