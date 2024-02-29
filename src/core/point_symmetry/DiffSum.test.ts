import { describe, test, expect } from 'vitest'
import { frequencies_to_diff_sum, diff_sum_to_frequencies } from './DiffSum'

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
})
