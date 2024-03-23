import { fail } from 'assert'
import { describe, test, expect } from 'vitest'
import { PolynomialSymmetry } from './PolynomialSymmetry'

describe('PolynomialSymmetry', () => {
  describe('validation', () => {
    test('throws for empty rule list', () => {
      expect(() => {
        return new PolynomialSymmetry(3, [])
      }).toThrowError()
    })

    test('throws for multiple rules with the same partner type', () => {
      fail('not implemented')
    })
  })

  describe('first_rule', () => {
    test('returns first rule', () => {
      fail('not implemented')
    })
  })

  describe('is_editable', () => {
    test('returns true in most cases', () => {
      fail('not implemented')
    })

    test('returns false on the center line when the frequency diff is odd', () => {
      fail('not implemented')
    })
  })

  describe('frequency_map', () => {
    test('no rotations', () => {
      fail('not implemented')
    })

    test('input rotations', () => {
      fail('not implemented')
    })

    test('output rotations', () => {
      fail('not implemented')
    })

    test('both input and output rotations', () => {
      fail('not implemented')
    })
  })

  describe('update_coefficients', () => {
    test('update single term', () => {
      fail('not implemented')
    })

    test('self constraint', () => {
      fail('not implemented')
    })

    test('partner constraint', () => {
      fail('not implemented')
    })

    test('two partner constraints', () => {
      fail('not implemented')
    })

    test('self and partner constraint', () => {
      fail('not implemented')
    })
  })
})
