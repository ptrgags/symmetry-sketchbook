import type { ComplexPolar } from '../Complex'
import type { Frequency2D } from '../Frequency2D'
import {
  to_signed,
  type GridIndices2D,
  to_indices_2d,
  to_index_1d,
  to_unsigned
} from '../GridIndices2D'
import { apply_base_symmetry } from './BaseSymmetryRule'
import { negate_term } from './NegateType'
import { get_partner_frequencies } from './WallpaperPartnerType'
import type { WallpaperSymmetryGroup } from './WallpaperSymmetryGroup'

export class WallpaperSymmetry {
  grid_size: number
  group: WallpaperSymmetryGroup

  constructor(grid_size: number, group: WallpaperSymmetryGroup) {
    this.grid_size = grid_size
    this.group = group
  }

  frequency_map(indices: GridIndices2D): Frequency2D {
    // TODO: Eventually the symmetry rule will apply some constraints
    const { row: m, col: n } = to_signed(indices, this.grid_size)
    return { n, m }
  }

  inverse_frequency_map(frequencies: Frequency2D): GridIndices2D {
    const { n, m } = frequencies
    return to_unsigned({ row: m, col: n }, this.grid_size)
  }

  is_enabled(): boolean {
    // TODO: Eventually the symmetry rule will apply some constraints
    return true
  }

  update_coefficients(coefficients: ComplexPolar[], index: number, first_term: ComplexPolar) {
    const indices = to_indices_2d(index, this.grid_size)
    const frequencies = this.frequency_map(indices)

    type TermUpdate = [Frequency2D, ComplexPolar]
    const terms_to_update: TermUpdate[] = []

    if (this.group.base_rule) {
      // If we have a base rule for square or hexagon lattices, then
      // there is a quadruple/triple of frequencies that must match

      // This finds the frequencies not including the current one
      const partner_frequencies = apply_base_symmetry(this.group.base_rule, frequencies)
      // +1 for the current term.
      const count = partner_frequencies.length + 1
      const normalized = first_term.scale(1 / count)

      const new_terms: TermUpdate[] = [frequencies, ...partner_frequencies].map((x) => {
        return [x, normalized]
      })
      terms_to_update.push(...new_terms)
    } else {
      // Usual case of no base rule, just push the first term
      terms_to_update.push([frequencies, first_term])
    }

    const rules = this.group.rules ?? []
    for (const rule of rules) {
      const new_terms: TermUpdate[] = terms_to_update.map(([frequencies, term]) => {
        const partner_frequencies = get_partner_frequencies(rule.partner, frequencies)

        let partner_term = term
        if (rule.negate) {
          partner_term = negate_term(rule.negate, term, frequencies)
        }

        return [partner_frequencies, partner_term]
      })

      terms_to_update.push(...new_terms)
    }

    // Update the coefficient grid
    for (const [frequencies, term] of terms_to_update) {
      const term_indices = this.inverse_frequency_map(frequencies)
      const index = to_index_1d(term_indices, this.grid_size)
      coefficients[index] = term
    }
  }
}
