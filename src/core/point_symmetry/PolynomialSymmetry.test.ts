import { describe, test, expect } from 'vitest'
import { PolynomialSymmetry } from './PolynomialSymmetry'

describe('PolynomialSymmetry', () => {
  describe('validation', () => {
    test('throws for empty rule list', () => {
      expect(() => {
        return new PolynomialSymmetry(3, [])
      }).toThrowError()
    })
  })
})
