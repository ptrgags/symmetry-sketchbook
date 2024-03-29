import { describe, test, expect } from 'vitest'
import { mod, radians, rand_int } from './math'

describe('mod', () => {
  test('works for positive x', () => {
    expect(mod(0, 3)).toBe(0)
    expect(mod(1, 3)).toBe(1)
    expect(mod(2, 3)).toBe(2)
    expect(mod(3, 3)).toBe(0)
    expect(mod(4, 3)).toBe(1)
  })

  test('works for negative x', () => {
    expect(mod(-1, 4)).toBe(3)
    expect(mod(-2, 4)).toBe(2)
    expect(mod(-3, 4)).toBe(1)
    expect(mod(-4, 4)).toBe(0)
    expect(mod(-5, 4)).toBe(3)
  })
})

describe('radians', () => {
  test('converts degrees to radians', () => {
    expect(radians(0)).toBe(0)
    expect(radians(30)).toBeCloseTo(Math.PI / 6)
    expect(radians(45)).toBeCloseTo(Math.PI / 4)
    expect(radians(60)).toBeCloseTo(Math.PI / 3)
    expect(radians(90)).toBeCloseTo(Math.PI / 2)

    expect(radians(-30)).toBeCloseTo(-Math.PI / 6)
  })
})

describe('rand_int', () => {
  test('generates numbers in the given range (inclusive)', () => {
    const RESULT_RANGE = [1, 2, 3, 4, 5, 6]
    for (let i = 0; i < 10; i++) {
      expect(RESULT_RANGE.includes(rand_int(1, 6)))
    }
  })
})
