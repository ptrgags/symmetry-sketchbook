export interface GridIndices2D {
  row: number
  col: number
}

export function to_indices_2d(index: number, grid_width: number): GridIndices2D {
  const row = Math.floor(index / grid_width)
  const col = index % grid_width
  return { row, col }
}

export function to_index_1d(indices: GridIndices2D, grid_width: number): number {
  const { row, col } = indices
  return row * grid_width + col
}
