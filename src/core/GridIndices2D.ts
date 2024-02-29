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
  if (indices.row < 0 || indices.row >= grid_size || indices.col < 0 || indices.col >= grid_size) {
    throw new Error(`${label}: indices must be in the range [0, ${grid_size}]`)
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
