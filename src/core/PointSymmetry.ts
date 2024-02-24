import type { ComplexPolar } from './Complex'
import { swap, type Frequency2D } from './Frequency2D'
import { to_indices_2d, type GridIndices2D, to_index_1d } from './GridIndices2D'

export abstract class PointSymmetry {
  // Grid size. This must be an odd number
  grid_size: number
  center_1d: number

  constructor(grid_size: number) {
    this.grid_size = grid_size
    this.center_1d = Math.floor(this.grid_size / 2)
  }

  /**
   * Map from (row, col) of the grid to frequency space (n, m)
   * such that the middle term of the grid is (0, 0), and
   * the frequencies increase by one per grid cell.
   * @param indices The grid indices (row, col)
   * @returns
   */
  indices_to_freq(indices: GridIndices2D): Frequency2D {
    const { row, col } = indices
    const n = col - this.center_1d
    const flipped_row = this.grid_size - 1 - row
    const m = flipped_row - this.center_1d
    return { n, m }
  }

  /**
   * Inverse of freq_to_indices
   * @param frequencies The frequencies (n, m)
   * @returns The corresponding grid indices (row, col)
   */
  freq_to_indices(frequencies: Frequency2D): GridIndices2D {
    const { n, m } = frequencies
    const col = n + this.center_1d
    const flipped_row = m + this.center_1d
    const row = this.grid_size - 1 - flipped_row
    return { row, col }
  }

  abstract is_enabled(indices: GridIndices2D): boolean
  abstract update_coefficients(
    coefficients: ComplexPolar[],
    index: number,
    term: ComplexPolar
  ): void
}

export class Identity extends PointSymmetry {
  is_enabled(): boolean {
    return true
  }

  update_coefficients(coefficients: ComplexPolar[], index: number, term: ComplexPolar): void {
    coefficients[index] = term
  }
}

/**
 * Mirror symmetry over the x-axis.
 *
 * This requires a_mn = a_nm
 */
export class MirrorX extends PointSymmetry {
  is_enabled(indices: GridIndices2D): boolean {
    const { n, m } = this.indices_to_freq(indices)
    // The mirror symmetry rule requires a_nm = a_mn, so we'll only
    // allow editing the ones on or below the diagonal n = m
    return m <= n
  }

  update_coefficients(coefficients: ComplexPolar[], index: number, term: ComplexPolar) {
    // Set a_nm
    coefficients[index] = term

    // For mirror symmetry over the real axis, we need
    // a_mn = a_nm
    const indices = to_indices_2d(index, this.grid_size)
    const frequencies = this.indices_to_freq(indices)
    const swapped_frequencies = swap(frequencies)
    const partner_indices = this.freq_to_indices(swapped_frequencies)
    const partner_index = to_index_1d(partner_indices, this.grid_size)
    coefficients[partner_index] = term
  }
}
