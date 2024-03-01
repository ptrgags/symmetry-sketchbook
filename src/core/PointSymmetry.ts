import { ComplexPolar } from './Complex'
import { type Frequency2D } from './Frequency2D'
import {
  type GridIndices2D,
  to_indices_2d,
  to_index_1d,
  identity,
  flip_col,
  flip_both,
  flip_row
} from './GridIndices2D'
import { mod } from './math'
import { diff_sum_to_frequencies, type DiffSum } from './point_symmetry/DiffSum'
import { PARTNER_FUNCTIONS } from './point_symmetry/PartnerType'
import {
  get_freq_diff,
  get_partner_type,
  get_rotation_power,
  type PointSymmetryRule
} from './point_symmetry/PointSymmetryRule'

function indices_to_diff_sum(
  signed_indices: GridIndices2D,
  symmetry_rule: PointSymmetryRule
): DiffSum {
  const { row, col } = signed_indices

  // Rotation symmetry puts constraints on which frequencies we can use, but
  // this only affects the frequency difference, not the sum
  const diff = get_freq_diff(symmetry_rule, col)

  // For the sum, we can choose anything we want, so ideally we'd do
  // sum = row and be done with it, but there's one minor subtlety to consider:
  //
  // Look at the diagonals of an integer grid:
  //
  // n ->    ^               sum -->
  // 0 1 2 3 |               0      diff
  // 1 2 3 4 m     -->      1 1      |
  // 2 3 4 5               2 2 2     v
  // 3 4 5 6              3 3 3 3
  //                       4 4 4
  //                        5 5
  //                         6
  //
  //                         ^
  //                         |
  //              they don't line up vertically! :'(
  //
  // We could just shift every other row. However, some symmetry rules
  // require the grid of coefficients to be updated symmetric over the line
  // m = -n (corresponding to the diagonal: sum = (n + m) = (n - n) = 0)
  // so to do this, I want every other line of terms to expand outwards so
  // the terms line up. This will require turning off some coefficients
  // on the center line. That will be handled elsewhere so I'll just
  // set it to 0:
  //
  //       sum ->
  //     1 0 0 0 0
  //     1 1 x 1 1  diff
  //     2 2 2 2 2   |
  //     3 3 x 3 3   v
  //     4 4 4 4 4
  //     5 5 x 5 5
  //     6 6 x 6 6

  // note that we check the parity of the computed diagonal, not the
  // column number!
  const parity = mod(diff, 2)
  let sum
  if (parity == 0) {
    // The sum diagonals with integer solutions happen every other diagonal
    // hence the * 2
    sum = 2 * row
  } else if (parity == 1 && row == 0) {
    // These are the terms that we will ignore in the UI. For now
    // just set it to 0
    sum = 0
  } else {
    // We want the odd diagonals, however we want this pattern
    // to be symmetric around the origin (2 * row + 1 would not work!).
    //
    // Here's one way to do this:
    //
    // https://www.desmos.com/calculator/rrn7cirfgo
    //
    // input:  ... -3, -2, -1, 0, 1, 2, 3, ...
    // output: ... -5, -3, -1, 0, 1, 3, 5, ...
    sum = 2 * Math.sign(row) * Math.max(Math.abs(row) - 0.5, 0)
  }

  return { diff, sum }
}

function validate_rules(rules: PointSymmetryRule[]) {
  if (rules.length === 0) {
    throw new Error('There must be at least one rule')
  }

  const visited_types: Set<string> = new Set()
  for (const rule of rules) {
    const partner_type = get_partner_type(rule)
    if (visited_types.has(partner_type)) {
      throw new Error(`Can't have multiple rules with the same pairing: ${partner_type}`)
    }
  }
}

export class PointSymmetry {
  grid_size: number
  center_1d: number
  self_rule?: PointSymmetryRule
  partner_rules: PointSymmetryRule[] = []

  constructor(grid_size: number, rules: PointSymmetryRule[]) {
    this.grid_size = grid_size
    this.center_1d = Math.floor(this.grid_size / 2)

    validate_rules(rules)

    for (const rule of rules) {
      const partner_type = get_partner_type(rule)

      if (partner_type === 'identity') {
        this.self_rule = rule
      } else {
        this.partner_rules.push(rule)
      }
    }
  }

  get first_rule(): PointSymmetryRule {
    return this.self_rule ?? this.partner_rules[0]
  }

  /**
   * Map from unsigned (row, col) where each is in [0, GRID_SIZE] to signed
   * values [-floor(grid_size / 2), floor(grid_size / 2)]
   *
   * @param indices The unsigned indices
   * @returns
   */
  to_signed(unsigned_indices: GridIndices2D): GridIndices2D {
    const { row, col } = unsigned_indices
    const flipped_row = this.grid_size - 1 - row
    return {
      col: col - this.center_1d,
      row: flipped_row - this.center_1d
    }
  }

  /**
   * Inverse of to_signed
   * @param frequencies The frequencies (n, m)
   * @returns The corresponding grid indices (row, col)
   */
  to_unsigned(signed_indices: GridIndices2D): GridIndices2D {
    const { row, col } = signed_indices
    const flipped_row = row + this.center_1d
    return {
      row: this.grid_size - 1 - flipped_row,
      col: col + this.center_1d
    }
  }

  is_enabled(indices: GridIndices2D): boolean {
    const signed_indices = this.to_signed(indices)
    const { diff, sum } = indices_to_diff_sum(signed_indices, this.first_rule)
    const parity = mod(diff, 2)
    if (parity === 1 && sum == 0) {
      return false
    }
    return true
  }

  frequency_map(indices: GridIndices2D): Frequency2D {
    const signed_indices = this.to_signed(indices)
    const diff_sum = indices_to_diff_sum(signed_indices, this.first_rule)
    return diff_sum_to_frequencies(diff_sum)
  }

  update_coefficients(coefficients: ComplexPolar[], index: number, term: ComplexPolar): void {
    // Always set a_nm
    coefficients[index] = term

    const indices = to_indices_2d(index, this.grid_size)

    /*
    if (this.self_rule) {
      // for a constraint like a_nm = rotate_k^P mirror^Q a_nm,
      // this can only be true if rotate is a 2-fold rotation, so this is
      // equivalent to saying a_nm = (-1)^P mirror^Q a_nm

      const flipped = this.self_rule.output_reflection ? term.conj : term

      const signed_indices = this.to_signed(indices)
      const diagonals = indices_to_diagonals(signed_indices, this.self_rule)
      const rotation_factor = get_rotation_factor(this.self_rule, diagonals.diff)
      const rotated = mod(rotation_factor, 2) === 1 ? 
    }*/

    // For "partner rules", a_nm has a partner coefficient a_(n')(m')
    // somewhere else in the grid. They will be related as:
    // a_(n')(m') = C * a_nm
    // with a scalar C that depends on the symmetry rule
    for (const rule of this.partner_rules) {
      // Find the index of the partner in the grid
      const partner_type = get_partner_type(rule)
      const partner_func = PARTNER_FUNCTIONS[partner_type]
      const partner_indices = partner_func(indices, this.grid_size)
      const partner_index = to_index_1d(partner_indices, this.grid_size)

      // If we have an output reflection and set a' = conj(a)
      const flipped = rule.output_reflection ? term.conj : term

      // Get the rotation factor, and do a' *= R
      const partner_signed = this.to_signed(partner_indices)
      const diagonals = indices_to_diff_sum(partner_signed, rule)
      const rotation_power = get_rotation_power(rule, diagonals.diff)
      const rotation_factor = ComplexPolar.root_of_unity(rule.rotation_folds, rotation_power)
      const rotated = flipped.mult(rotation_factor)

      // Set a' = C * a
      coefficients[partner_index] = rotated
    }
  }
}

export interface PointSymmetryInfo {
  id: string
  label: string
  symmetry: PointSymmetry
}
