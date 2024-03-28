import { ComplexPolar } from '../Complex'
import { type Frequency2D } from '../Frequency2D'
import { type GridIndices2D, to_indices_2d, to_index_1d, to_signed } from '../GridIndices2D'
import { mod } from '../math'
import { diff_sum_to_frequencies } from './DiffSum'
import { get_partner_indices } from './PartnerType'
import {
  enforce_self_partner_constraint,
  get_freq_diff,
  get_partner_term,
  get_partner_type,
  indices_to_diff_sum,
  type PolynomialSymmetryRule
} from './PolynomialSymmetryRule'

function validate_rules(rules: PolynomialSymmetryRule[]) {
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

export class PolynomialSymmetry {
  grid_size: number
  self_rule?: PolynomialSymmetryRule
  partner_rules: PolynomialSymmetryRule[] = []

  constructor(grid_size: number, rules: PolynomialSymmetryRule[]) {
    this.grid_size = grid_size

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

  get first_rule(): PolynomialSymmetryRule {
    return this.self_rule ?? this.partner_rules[0]
  }

  is_editable(indices: GridIndices2D): boolean {
    const signed_indices = to_signed(indices, this.grid_size)
    const { diff, sum } = indices_to_diff_sum(signed_indices, this.first_rule)
    const parity = mod(diff, 2)
    if (parity === 1 && sum == 0) {
      return false
    }
    return true
  }

  frequency_map(indices: GridIndices2D): Frequency2D {
    const signed_indices = to_signed(indices, this.grid_size)
    const diff_sum = indices_to_diff_sum(signed_indices, this.first_rule)
    return diff_sum_to_frequencies(diff_sum)
  }

  update_coefficients(coefficients: ComplexPolar[], index: number, original_term: ComplexPolar) {
    const indices = to_indices_2d(index, this.grid_size)
    const signed_indices = to_signed(indices, this.grid_size)

    let first_term = original_term
    if (this.self_rule) {
      const frequency_diff = get_freq_diff(this.self_rule, signed_indices.col)
      first_term = enforce_self_partner_constraint(this.self_rule, frequency_diff, original_term)
    }

    type TermUpdate = [GridIndices2D, ComplexPolar]
    const terms_to_update: TermUpdate[] = [[indices, first_term]]

    // For "partner rules", a_nm has a partner coefficient a_(n')(m')
    // somewhere else in the grid. They will be related as:
    // a_(n')(m') = C * a_nm
    // with a scalar C that depends on the symmetry rule
    for (const rule of this.partner_rules) {
      const partner_type = get_partner_type(rule)

      const new_terms: TermUpdate[] = terms_to_update.map(([indices, term]) => {
        // Find the partner in the grid
        const partner_indices = get_partner_indices(partner_type, indices, this.grid_size)

        // Apply the constraint to determine the value of this term
        const partner_signed = to_signed(partner_indices, this.grid_size)
        const frequency_diff = get_freq_diff(rule, partner_signed.col)
        const partner_term = get_partner_term(rule, frequency_diff, term)

        return [partner_indices, partner_term]
      })

      terms_to_update.push(...new_terms)
    }

    for (const [indices, value] of terms_to_update) {
      const index = to_index_1d(indices, this.grid_size)
      coefficients[index] = value
    }
  }
}
