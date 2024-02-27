export type UpToThree<T> = undefined | T | [T, T] | [T, T, T]
export function to_tuple3<T>(values: T[]): UpToThree<T> {
  if (values.length === 0) {
    return undefined
  }

  if (values.length <= 3) {
    return values
  }

  throw new Error('to_tuple3(): values must have 0-3 elements')
}
