import type { ComplexPolar } from '../Complex'
import type { Frequency2D } from '../Frequency2D'
import { to_signed, type GridIndices2D } from '../GridIndices2D'

export class WallpaperSymmetry {
  grid_size: number
  constructor(grid_size: number) {
    this.grid_size = grid_size
  }

  frequency_map(indices: GridIndices2D): Frequency2D {
    // TODO: Eventually the symmetry rule will apply some constraints
    const { row: m, col: n } = to_signed(indices, this.grid_size)
    return { n, m }
  }

  is_enabled(): boolean {
    // TODO: Eventually the symmetry rule will apply some constraints
    return true
  }

  update_coefficients(coefficients: ComplexPolar[], index: number, original_term: ComplexPolar) {
    coefficients[index] = original_term
  }
}
