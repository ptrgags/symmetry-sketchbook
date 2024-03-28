import { assert_ge, assert_nonnegative } from './assertions'

/**
 * Grid indices on a square NxN grid
 */
export interface GridIndices2D {
  row: number
  col: number
}

function assert_index_in_bounds(index: number, grid_size: number, label: string): asserts index {
  if (index < 0 || index >= grid_size * grid_size) {
    throw new Error(`${label}: index must be in the range [0, ${grid_size * grid_size}]`)
  }
}

/**
 * Check that the input indices are within a grid_size x grid_size grid
 *
 * @param indices The indices to check
 * @param grid_size The width of the grid
 * @param label
 */
function assert_indices_in_bounds(
  indices: GridIndices2D,
  grid_size: number,
  label: string
): asserts indices {
  const { row, col } = indices
  if (row < 0 || row >= grid_size || col < 0 || col >= grid_size) {
    throw new Error(
      `${label}: indices must be in the range [0, ${grid_size}], got (${row}, ${col})`
    )
  }
}

/**
 * Take a 1D array index and compute the row and column. This
 * assumes a row-major array
 * @param index The 1D index
 * @param grid_width The width of the grid
 * @returns The row and column of this grid cell
 */
export function to_indices_2d(index: number, grid_width: number): GridIndices2D {
  assert_nonnegative(index, 'index')
  assert_index_in_bounds(index, grid_width, 'indices')
  assert_ge(grid_width, 1, 'grid_width')
  const row = Math.floor(index / grid_width)
  const col = index % grid_width
  return { row, col }
}

/**
 * Take a 2D array index and compute an index. This assumes a row-major array
 * @param indices The 1D index
 * @param grid_width The width of the grid
 * @returns
 */
export function to_index_1d(indices: GridIndices2D, grid_width: number): number {
  assert_nonnegative(grid_width, 'grid_width')
  assert_indices_in_bounds(indices, grid_width, 'indices')
  const { row, col } = indices
  return row * grid_width + col
}

// Coordinate operations

export function identity(indices: GridIndices2D, grid_size: number) {
  assert_nonnegative(grid_size, 'grid_size')
  assert_indices_in_bounds(indices, grid_size, 'indices')
  return indices
}

export function flip_col(indices: GridIndices2D, grid_size: number) {
  assert_nonnegative(grid_size, 'grid_size')
  assert_indices_in_bounds(indices, grid_size, 'indices')
  const { row, col } = indices
  return { row, col: grid_size - 1 - col }
}

// Negate the signed row. This corresponds to a_nm -> a_(-m)(-n)
// (swap + negate)
export function flip_row(indices: GridIndices2D, grid_size: number) {
  assert_nonnegative(grid_size, 'grid_size')
  assert_indices_in_bounds(indices, grid_size, 'indices')
  const { row, col } = indices
  return { row: grid_size - 1 - row, col }
}

// flip both row and column
export function flip_both(indices: GridIndices2D, grid_size: number) {
  assert_nonnegative(grid_size, 'grid_size')
  assert_indices_in_bounds(indices, grid_size, 'indices')
  const { row, col } = indices
  return { row: grid_size - 1 - row, col: grid_size - 1 - col }
}

/**
 * Map from unsigned (row, col) where each is in [0, GRID_SIZE] to signed
 * values [-floor(grid_size / 2), floor(grid_size / 2)]
 *
 * @param indices The unsigned indices
 * @returns
 */
export function to_signed(unsigned_indices: GridIndices2D, grid_size: number): GridIndices2D {
  assert_nonnegative(grid_size, 'grid_size')
  assert_indices_in_bounds(unsigned_indices, grid_size, 'indices')
  const { row, col } = unsigned_indices
  const flipped_row = grid_size - 1 - row
  const center = Math.floor(grid_size / 2)
  return {
    col: col - center,
    row: flipped_row - center
  }
}

/**
 * Inverse of to_signed
 * @param frequencies The frequencies (n, m)
 * @returns The corresponding grid indices (row, col)
 */
export function to_unsigned(signed_indices: GridIndices2D, grid_size: number): GridIndices2D {
  assert_nonnegative(grid_size, 'grid_size')
  const { row, col } = signed_indices
  const center = Math.floor(grid_size / 2)
  const flipped_row = row + center
  return {
    row: grid_size - 1 - flipped_row,
    col: col + center
  }
}
