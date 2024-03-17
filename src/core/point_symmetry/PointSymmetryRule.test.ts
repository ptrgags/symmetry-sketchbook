import { describe, test, expect } from 'vitest'
import {
  IDENTITY,
  PointSymmetryRule,
  get_freq_diff,
  get_partner_type,
  get_rotation_power
} from './PointSymmetryRule'
import { fail } from 'assert'

function ignore_signed_zero(x: number): number {
  if (x === 0) {
    return 0
  }

  return x
}

function test_rotation_power(rule: PointSymmetryRule, inputs: number[], expected: number[]) {
  const actual = inputs.map((x) => get_rotation_power(rule, x))
  // because toStrictEqual() treats 0 different from -0 :(
  expect(actual.map(ignore_signed_zero)).toStrictEqual(expected.map(ignore_signed_zero))
}

function test_freq_diff(rule: PointSymmetryRule, inputs: number[], expected: number[]) {
  const actual = inputs.map((x) => get_freq_diff(rule, x))
  expect(actual).toStrictEqual(expected)
}

describe('PointSymmetryRule', () => {
  // Fragments of rules to combine with identity for brevity
  const INPUT_ROTATION = {
    rotation_folds: 3,
    input_rotation: true
  }

  const INPUT_REFLECTION = {
    input_reflection: true
  }

  const INPUT_INVERSION = {
    input_inversion: true
  }

  const OUTPUT_ROTATION = {
    rotation_folds: INPUT_ROTATION.rotation_folds,
    output_rotations: 2
  }

  const OUTPUT_REFLECTION = {
    output_reflection: true
  }

  describe('get_partner_type', () => {
    test('identity', () => {
      expect(get_partner_type(IDENTITY)).toBe('identity')

      const rotation = { ...IDENTITY, ...INPUT_ROTATION }
      expect(get_partner_type(rotation)).toBe('identity')

      const output_rotation = { ...IDENTITY, ...INPUT_ROTATION, ...OUTPUT_ROTATION }
      expect(get_partner_type(output_rotation)).toBe('identity')

      const even_flips = { ...IDENTITY, ...INPUT_REFLECTION, ...OUTPUT_REFLECTION }
      expect(get_partner_type(even_flips)).toBe('identity')
    })

    test('flip_col', () => {
      const reflection = { ...IDENTITY, ...INPUT_REFLECTION }
      expect(get_partner_type(reflection)).toBe('flip_col')

      const output_reflection = { ...IDENTITY, ...INPUT_ROTATION, ...OUTPUT_REFLECTION }
      expect(get_partner_type(output_reflection)).toBe('flip_col')
    })

    test('flip_row', () => {
      const circle_inversion = { ...IDENTITY, ...INPUT_INVERSION, ...INPUT_REFLECTION }
      expect(get_partner_type(circle_inversion)).toBe('flip_row')

      const roto_inversion = {
        ...IDENTITY,
        ...INPUT_ROTATION,
        ...INPUT_INVERSION,
        ...INPUT_REFLECTION
      }
      expect(get_partner_type(roto_inversion)).toBe('flip_row')

      const with_output = { ...circle_inversion, ...OUTPUT_ROTATION }
      expect(get_partner_type(with_output)).toBe('flip_row')
    })

    test('flip_both', () => {
      const inversion = { ...IDENTITY, ...INPUT_INVERSION }
      expect(get_partner_type(inversion)).toBe('flip_both')

      const roto_complex_inversion = { ...IDENTITY, ...INPUT_ROTATION, ...INPUT_INVERSION }
      expect(get_partner_type(roto_complex_inversion)).toBe('flip_both')
    })
  })

  describe('get_rotation_power', () => {
    const INPUT_DIFFS = [-3, -2, -1, 0, 1, 2, 3]
    test('transformations without rotations', () => {
      const ZERO = [0, 0, 0, 0, 0, 0, 0]
      test_rotation_power(IDENTITY, INPUT_DIFFS, ZERO)

      const reflection = {
        ...IDENTITY,
        ...INPUT_REFLECTION
      }
      test_rotation_power(reflection, INPUT_DIFFS, ZERO)

      const inversion = {
        ...IDENTITY,
        ...INPUT_INVERSION
      }
      test_rotation_power(inversion, INPUT_DIFFS, ZERO)

      const out_reflection = {
        ...IDENTITY,
        ...OUTPUT_REFLECTION
      }
      test_rotation_power(out_reflection, INPUT_DIFFS, ZERO)
    })

    test('rotation with even input flips', () => {
      // P = (-1)^(even) diff = diff
      const EXPECTED = INPUT_DIFFS

      const rotation = {
        ...IDENTITY,
        ...INPUT_ROTATION
      }

      test_rotation_power(rotation, INPUT_DIFFS, EXPECTED)

      const roto_inversion = {
        ...IDENTITY,
        ...INPUT_ROTATION,
        ...INPUT_INVERSION,
        ...INPUT_REFLECTION
      }
      test_rotation_power(roto_inversion, INPUT_DIFFS, EXPECTED)
    })

    test('rotation with odd input flips', () => {
      // P = (-1)^(odd) diff = -diff
      const EXPECTED = INPUT_DIFFS.map((x) => -x)

      const rotated_mirror = {
        ...IDENTITY,
        ...INPUT_ROTATION,
        ...INPUT_REFLECTION
      }

      test_rotation_power(rotated_mirror, INPUT_DIFFS, EXPECTED)

      const roto_complex_inversion = {
        ...IDENTITY,
        ...INPUT_ROTATION,
        ...INPUT_INVERSION
      }
      test_rotation_power(roto_complex_inversion, INPUT_DIFFS, EXPECTED)
    })

    test('color turning (no input rotations)', () => {
      // Test cases like:
      // P = (0) - u
      // or
      // P = (0) + u
      //
      // which are cases where we have no input rotations but any number
      // of input reflections
      const no_in_rotation = {
        ...IDENTITY,
        ...INPUT_REFLECTION
      }

      const out_rotations = OUTPUT_ROTATION.output_rotations
      const EXPECTED_POSITIVE = INPUT_DIFFS.map(() => out_rotations)
      const EXPECTED_NEGATIVE = INPUT_DIFFS.map(() => -out_rotations)

      const no_out_flip = {
        ...no_in_rotation,
        ...OUTPUT_ROTATION
      }

      test_rotation_power(no_out_flip, INPUT_DIFFS, EXPECTED_NEGATIVE)

      const out_flip = {
        ...no_in_rotation,
        ...OUTPUT_ROTATION,
        ...OUTPUT_REFLECTION
      }
      test_rotation_power(out_flip, INPUT_DIFFS, EXPECTED_POSITIVE)
    })

    test('color turning (input rotations, even flips)', () => {
      // Handle a case
      // P = diff - u
      // or
      // P = diff + u
      const even_flips = {
        ...IDENTITY,
        ...INPUT_ROTATION,
        ...INPUT_REFLECTION,
        ...INPUT_INVERSION
      }

      const out_rotations = OUTPUT_ROTATION.output_rotations
      const EXPECTED_ADD = INPUT_DIFFS.map((diff) => diff + out_rotations)
      const EXPECTED_SUBTRACT = INPUT_DIFFS.map((diff) => diff - out_rotations)

      const no_out_flip = {
        ...even_flips,
        ...OUTPUT_ROTATION
      }

      test_rotation_power(no_out_flip, INPUT_DIFFS, EXPECTED_SUBTRACT)

      const out_flip = {
        ...even_flips,
        ...OUTPUT_ROTATION,
        ...OUTPUT_REFLECTION
      }
      test_rotation_power(out_flip, INPUT_DIFFS, EXPECTED_ADD)
    })

    test('color turning (input rotations, odd flips)', () => {
      // Handle a case
      // P = -diff - u
      // or
      // P = -diff + u
      const odd_flips = {
        ...IDENTITY,
        ...INPUT_ROTATION,
        ...INPUT_INVERSION
      }

      const out_rotations = OUTPUT_ROTATION.output_rotations
      const EXPECTED_ADD = INPUT_DIFFS.map((diff) => -diff + out_rotations)
      const EXPECTED_SUBTRACT = INPUT_DIFFS.map((diff) => -diff - out_rotations)

      const no_out_flip = {
        ...odd_flips,
        ...OUTPUT_ROTATION
      }

      test_rotation_power(no_out_flip, INPUT_DIFFS, EXPECTED_SUBTRACT)

      const out_flip = {
        ...odd_flips,
        ...OUTPUT_ROTATION,
        ...OUTPUT_REFLECTION
      }
      test_rotation_power(out_flip, INPUT_DIFFS, EXPECTED_ADD)
    })
  })

  describe('get_freq_diff', () => {
    const INPUT_COLS = [-3, -2, -1, 0, 1, 2, 3]
    test('most transforms are ignored', () => {
      const IGNORED = [
        // No input rotations
        IDENTITY,
        { ...IDENTITY, ...INPUT_REFLECTION },
        { ...IDENTITY, ...INPUT_INVERSION },
        { ...IDENTITY, ...INPUT_INVERSION, ...INPUT_INVERSION },
        { ...IDENTITY, ...INPUT_INVERSION, ...OUTPUT_ROTATION },
        { ...IDENTITY, ...INPUT_REFLECTION, ...OUTPUT_REFLECTION },
        // Rotation + mirrors
        { ...IDENTITY, ...INPUT_ROTATION, ...INPUT_REFLECTION },
        { ...IDENTITY, ...INPUT_ROTATION, ...OUTPUT_REFLECTION },
        // Despite an even number of flips, this is not really a rotation
        // constraint because it constrains the coefficient value, not
        // the indices
        { ...IDENTITY, ...INPUT_ROTATION, ...INPUT_REFLECTION, ...OUTPUT_REFLECTION }
      ]

      for (const rule of IGNORED) {
        test_freq_diff(rule, INPUT_COLS, INPUT_COLS)
      }
    })

    test('handles rotation symmetry', () => {
      const rotation = {
        ...IDENTITY,
        ...INPUT_ROTATION
      }
      const EXPECTED_ROTATION = INPUT_COLS.map((x) => 3 * x)

      test_freq_diff(rotation, INPUT_COLS, EXPECTED_ROTATION)

      const color_turn = {
        ...rotation,
        ...OUTPUT_ROTATION
      }

      const EXPECTED_COLOR_TURN = INPUT_COLS.map((x) => 3 * x + 2)

      test_freq_diff(color_turn, INPUT_COLS, EXPECTED_COLOR_TURN)
    })
  })

  describe('indices_to_diff_sum', () => {
    test('no rotation', () => {
      fail('not implemented')
    })

    test('rotation', () => {
      fail('not implemented')
    })

    test('handles odd diagonals correctly', () => {
      fail('not implemented')
    })
  })

  describe('enforce_self_partner_constraint', () => {
    test('throws for partner constraint', () => {
      fail('not implemented')
    })

    test('returns zero if term is invalid', () => {
      fail('not implemented')
    })

    test('no output transformation', () => {
      fail('not implemented')
    })

    test('output mirrors', () => {
      fail('not implemented')
    })

    test('output rotations', () => {
      fail('not implemented')
    })

    test('both mirrors and rotations', () => {
      fail('not implemented')
    })
  })

  describe('get_partner_term', () => {
    test('throws for self-partner constraint', () => {
      fail('not implemented')
    })

    test('mirrored partner term', () => {
      fail('not implemented')
    })

    test('rotated partner term', () => {
      fail('not implemented')
    })

    test('rotated and mirrored partner term', () => {
      fail('not implemented')
    })
  })
})
