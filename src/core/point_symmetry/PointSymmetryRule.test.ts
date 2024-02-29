import { describe, test, expect } from 'vitest'
import { IDENTITY, PointSymmetryRule, get_rotation_power } from './PointSymmetryRule'

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

describe('PointSymmetryRule', () => {
  describe('get_rotation_power', () => {
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
      output_rotations: 2
    }

    const OUTPUT_REFLECTION = {
      output_reflection: true
    }

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
})
