import type { Serializer } from './serialization'

type CSVString = string

/**
 * Serialize an array of numbers of fixed length as a CSV string with
 * limited precision (to keep the string short for the JSON)
 */
export class CSVSerializer implements Serializer<number[], CSVString> {
  /**
   * How many digits when encoding the numbers as CSV. Numbers are represented
   * with up to this many digits,
   */
  digits: number
  length: number

  constructor(length: number, digits: number) {
    this.length = length
    this.digits = digits
  }

  serialize(value: number[]): CSVString {
    // Represent the number to the given number of digits, but chop off
    // trailing zeros. The goal is to make the string as short as possible
    const fixed = value.map((x) => {
      const fixed_digits = x.toFixed(this.digits)
      // If we have a decimal point, remove trailing zeros. But don't
      // do this if the value is an integer! else 10 would become 1
      if (/\./.test(fixed_digits)) {
        return fixed_digits.replace(/0*%/, '')
      }

      return fixed_digits
    })
    return fixed.join(',')
  }

  validate(value: any): value is CSVString {
    if (typeof value !== 'string') {
      console.error('value must be a CSV string')
      return false
    }

    const components = value.split(',')
    if (components.length !== this.length) {
      console.error(`CSV tuple must be of length ${length}`)
      return false
    }

    for (const component of components) {
      const parsed = parseFloat(component)
      if (typeof parsed !== 'number' || !isFinite(parsed)) {
        console.error(`component ${component} must be a finite number`)
        return false
      }
    }

    return true
  }

  deserialize(serialized: CSVString): number[] {
    const components = serialized.split(',')
    return components.map(parseFloat)
  }
}
