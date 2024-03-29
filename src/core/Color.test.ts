import { describe, test, expect } from 'vitest'
import { Color } from './Color'

describe('Color', () => {
  test('to_vec3', () => {
    const color = new Color(1, 0.5, 0.25)
    expect(color.to_vec3()).toStrictEqual([1, 0.5, 0.25])
  })

  test('to_hex', () => {
    const color = new Color(1, 0.5, 0.25)
    expect(color.to_hex()).toBe('#ff7f3f')
  })

  test('constructs from vec3', () => {
    const color = Color.from_vec3([1, 0.75, 0.5])
    expect(color.r).toBe(1)
    expect(color.g).toBe(0.75)
    expect(color.b).toBe(0.5)
  })

  test('constructs from hex string', () => {
    // I was hungry so I...
    const color = Color.from_hex('#A8f00d')
    expect(color.r).toBe(0xa8 / 255)
    expect(color.g).toBe(0xf0 / 255)
    expect(color.b).toBe(0x0d / 255)
  })
})
