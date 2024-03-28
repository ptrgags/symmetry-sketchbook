export function assert_nonnegative(value: number, label: string): asserts value {
  if (value < 0) {
    throw new Error(`${label} must be non-negative`)
  }
}

export function assert_ge(value: number, min: number, label: string): asserts value {
  if (value < min) {
    throw new Error(`${label} must be greater than ${min}`)
  }
}
