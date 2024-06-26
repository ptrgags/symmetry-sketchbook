import { ComplexPolar } from '../Complex'
import type { GridIndices2D } from '../GridIndices2D'
import { mod } from '../math'
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
export interface PolynomialSymmetryRule {
  rotation_folds: number
  input_rotation: boolean
  input_reflection: boolean
  input_inversion: boolean
  output_rotations: number
  output_reflection: boolean
}

export const IDENTITY: PolynomialSymmetryRule = {
  rotation_folds: 1,
  input_rotation: false,
  input_reflection: false,
  input_inversion: false,
  output_rotations: 0,
  output_reflection: false
}

export function get_partner_type(rule: PolynomialSymmetryRule): PartnerType {
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

function input_flips(rule: PolynomialSymmetryRule): number {
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
export function get_rotation_power(rule: PolynomialSymmetryRule, frequency_diff: number): number {
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
export function get_freq_diff(rule: PolynomialSymmetryRule, signed_col: number): number {
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
  symmetry_rule: PolynomialSymmetryRule
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

export function enforce_self_partner_constraint(
  rule: PolynomialSymmetryRule,
  frequency_diff: number,
  term: ComplexPolar
): ComplexPolar {
  if (get_partner_type(rule) !== 'identity') {
    throw new Error('rule is not a self-partner constraint!')
  }

  // the rule is now of the form
  //
  // a_nm = rotate_k^P mirror? a_nm
  //
  // This is one of the following:
  //
  // a_nm = a_nm                   -> pass through term unchanged
  // a_nm = rotate_k^P a_nm        -> Check that P == 0 (mod k)
  // a_nm = mirror a_nm            -> force a_nm to be real (special case of
  //                                  next rule)
  // a_nm = rotate_k^P mirror a_nm -> force a_nm to be constrained to a line

  const folds = rule.rotation_folds
  const rotation_power = get_rotation_power(rule, frequency_diff)

  // mirror constraints are
  //
  // a_nm = rotate_k^P mirror a_nm
  //
  // since mirror means flip over the x-axis (direction vector 1)
  // in general this means flip over the line pointing in the direction
  // rotate_k^P.
  //
  // so to enforce this constraint, project a_nm onto rotate_k^P, which
  // constrains the coefficient to a line
  if (rule.output_reflection) {
    const line_direction = ComplexPolar.root_of_unity(folds, rotation_power)

    const term_rect = term.to_rect()
    const direction_rect = line_direction.to_rect()
    const length = term_rect.dot(direction_rect)
    return line_direction.scale(length)
  }

  // Rotation constraints should be handled by the term grid,
  // but it doesn't hurt to check!
  //
  // a_nm = rotate_k^P a_nm is only possible if rotate_k^P = 1
  // which only happens if P == 0 (mod k)
  const rotation_count = mod(rotation_power, folds)
  if ((rule.input_rotation || rule.output_rotations > 0) && rotation_count !== 0) {
    console.warn('Term invalid for rotation constraint. Setting to 0')
    return ComplexPolar.ZERO
  }

  // If we reached here, the constraint is a_nm = a_nm which is always true
  return term
}

export function get_partner_term(
  rule: PolynomialSymmetryRule,
  frequency_diff: number,
  term: ComplexPolar
): ComplexPolar {
  if (get_partner_type(rule) === 'identity') {
    throw new Error('Trying to compute partner coefficient for a self-partner rule')
  }

  // We want to compute rotate_k^P * mirror? depending on the rule
  const flipped = rule.output_reflection ? term.conj : term

  const rotation_power = get_rotation_power(rule, frequency_diff)
  const rotation_factor = ComplexPolar.root_of_unity(rule.rotation_folds, rotation_power)
  const rotated = flipped.mult(rotation_factor)

  return rotated
}
