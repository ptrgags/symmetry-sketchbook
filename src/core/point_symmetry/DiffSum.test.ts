import { describe, test, expect } from 'vitest'
import { frequencies_to_diff_sum, diff_sum_to_frequencies, diff_row_to_sum } from './DiffSum'

describe('DiffSum', () => {
  describe('frequencies_to_diff_sum', () => {
    test('computes difference and sum', () => {
      expect(frequencies_to_diff_sum({ n: 5, m: 8 })).toStrictEqual({
        diff: -3,
        sum: 13
      })
    })
  })

  describe('diff_sum_to_frequencies', () => {
    test('computes frequencies', () => {
      expect(diff_sum_to_frequencies({ diff: 2, sum: 6 })).toStrictEqual({
        n: 4,
        m: 2
      })
    })
  })

  describe('diff_row_to_sum', () => {
    const ROW_INPUT = [-3, -2, -1, 0, 1, 2, 3]
    test('even diff', () => {
      const EXPECTED = [-6, -4, -2, 0, 2, 4, 6]
      const sums = ROW_INPUT.map((x) => diff_row_to_sum(4, x))
      expect(sums).toStrictEqual(EXPECTED)
    })

    test('odd diff', () => {
      const EXPECTED = [-5, -3, -1, 0, 1, 3, 5]
      const sums = ROW_INPUT.map((x) => diff_row_to_sum(3, x))
      expect(sums).toStrictEqual(EXPECTED)
    })
  })
})
