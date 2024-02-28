export interface GridIndices2D {
  row: number
  col: number
}

export namespace GridMath2D {
  /**
   * Take a 1D array index and compute the row and column. This
   * assumes a row-major array
   * @param index The 1D index
   * @param grid_width The width of the grid
   * @returns The row and column of this grid cell
   */
  export function to_indices_2d(index: number, grid_width: number): GridIndices2D {
    const row = Math.floor(index / grid_width)
    const col = index % grid_width
    return { row, col }
  }

  export function to_index_1d(indices: GridIndices2D, grid_width: number): number {
    const { row, col } = indices
    return row * grid_width + col
  }

  // Coordinate operations

  export function identity(indices: GridIndices2D) {
    return indices
  }

  export function flip_col({ row, col }: GridIndices2D, grid_size: number) {
    return { row, col: grid_size - 1 - col }
  }

  // Negate the signed row. This corresponds to a_nm -> a_(-m)(-n)
  // (swap + negate)
  export function flip_row({ row, col }: GridIndices2D, grid_size: number) {
    return { row: grid_size - 1 - row, col }
  }

  // flip both row and column
  export function flip_both({ row, col }: GridIndices2D, grid_size: number) {
    return { row: grid_size - 1 - row, col: grid_size - 1 - col }
  }
}
