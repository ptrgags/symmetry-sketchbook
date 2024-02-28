import { describe, expect, test } from 'vitest'
import { type GridIndices2D, GridMath2D } from './GridIndices2D'

describe('GridMath2D', () => {
  describe('coordinate operations', () => {
    test('identity', () => {
      const INPUT_CELL = { row: 3, col: 4 }
      expect(GridMath2D.identity(INPUT_CELL)).toStrictEqual({ row: 3, col: 4 })
    })
  })
})
