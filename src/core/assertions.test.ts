import { describe, expect, test } from 'vitest'
import { assert_nonnegative, assert_ge } from './assertions'

describe('assert_nonnegative', () => {
  test('throws for negative value', () => {
    expect(() => assert_nonnegative(-1, 'invalid')).toThrowError()
  })

  test('does not throw for valid values', () => {
    expect(() => assert_nonnegative(0, 'valid')).not.toThrowError()
    expect(() => assert_nonnegative(42, 'valid')).not.toThrowError()
  })
})

describe('assert_ge', () => {
  test('throws for value too small', () => {
    expect(() => assert_ge(0, 1, 'invalid')).toThrowError()
  })

  test('throws for value valid', () => {
    expect(() => assert_ge(1, 1, 'valid')).not.toThrowError()
    expect(() => assert_ge(2, 1, 'valid')).not.toThrowError()
  })
})
