import { describe, expect, test } from 'vitest'
import {
  identity,
  flip_both,
  flip_row,
  flip_col,
  to_indices_2d,
  to_index_1d
} from './GridIndices2D'

describe('to_indices_2d', () => {
  test('throws for grid_width less than 1', () => {
    expect(() => to_indices_2d(3, 0)).toThrowError()
    expect(() => to_indices_2d(3, -1)).toThrowError()
  })

  test('throws for index out of bounds', () => {
    expect(() => to_indices_2d(-1, 4)).toThrowError()
  })

  test('converts 1D index to 2D indices', () => {
    const GRID_WIDTH = 4
    expect(to_indices_2d(0, GRID_WIDTH)).toStrictEqual({ row: 0, col: 0 })
    expect(to_indices_2d(4, GRID_WIDTH)).toStrictEqual({ row: 1, col: 0 })
  })
})

describe('to_index_1d', () => {
  const GRID_SIZE = 4
  const INPUT_CELL = { row: 2, col: 1 }
  test('throws for grid_width less than 1', () => {
    expect(() => to_index_1d(INPUT_CELL, 0)).toThrowError()
    expect(() => to_index_1d(INPUT_CELL, -1)).toThrowError()
  })

  test('throws for index out of bounds', () => {
    expect(() => to_index_1d({ row: -1, col: 0 }, GRID_SIZE)).toThrowError()
    expect(() => to_index_1d({ row: 20, col: 0 }, GRID_SIZE)).toThrowError()
    expect(() => to_index_1d({ row: 0, col: -1 }, GRID_SIZE)).toThrowError()
    expect(() => to_index_1d({ row: 0, col: 20 }, GRID_SIZE)).toThrowError()
  })

  test('converts 2D indices to 1D index', () => {
    expect(to_index_1d(INPUT_CELL, GRID_SIZE)).toBe(9)
  })
})

describe('coordinate operations', () => {
  const INPUT_CELL = { row: 3, col: 4 }
  const GRID_SIZE = 10

  const FUNCS = [identity, flip_col, flip_row, flip_both]

  test('throw for grid_size less than 1', () => {
    for (const func of FUNCS) {
      expect(() => func(INPUT_CELL, -1)).toThrowError()
      expect(() => func(INPUT_CELL, 0)).toThrowError()
    }
  })

  test('throw for out of bounds', () => {
    for (const func of FUNCS) {
      expect(() => func({ row: -1, col: 0 }, GRID_SIZE)).toThrowError()
      expect(() => func({ row: 20, col: 0 }, GRID_SIZE)).toThrowError()
      expect(() => func({ row: 0, col: -1 }, GRID_SIZE)).toThrowError()
      expect(() => func({ row: 0, col: 20 }, GRID_SIZE)).toThrowError()
    }
  })

  test('identity', () => {
    expect(identity(INPUT_CELL, GRID_SIZE)).toStrictEqual({ row: 3, col: 4 })
  })

  test('flip_col', () => {
    expect(flip_col(INPUT_CELL, GRID_SIZE)).toStrictEqual({ row: 3, col: 5 })
  })

  test('flip_row', () => {
    expect(flip_row(INPUT_CELL, GRID_SIZE)).toStrictEqual({ row: 6, col: 4 })
  })

  test('flip_both', () => {
    expect(flip_both(INPUT_CELL, GRID_SIZE)).toStrictEqual({ row: 6, col: 5 })
  })
})
