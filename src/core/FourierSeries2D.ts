import { ComplexPolar } from './Complex.js'
import { type Frequency2D } from './Frequency2D.js'
//import { rand_int } from './math_util.js'

export interface FourierTerm2D {
  frequencies: Frequency2D
  coefficient: ComplexPolar
}

export type FourierTuple2D = [freq_n: number, freq_m: number, amp: number, phase: number]

function is_tuple(value: any): value is FourierTuple2D {
  if (!Array.isArray(value)) {
    console.error('value must be an array')
    return false
  }

  if (value.length !== 4) {
    console.error('value tuple must have 4 elements')
    return false
  }

  for (const component of value) {
    if (typeof component !== 'number') {
      console.error(`component ${component} must be a number`)
      return false
    }
  }

  return true
}

function tuple_to_csv(tuple: FourierTuple2D, digits: number): string {
  const fixed = tuple.map((x) => x.toFixed(digits))
  return fixed.join(',')
}

function csv_to_tuple(csv: string): FourierTuple2D | undefined {
  const components = csv.split(',')
  if (components.length !== 4) {
    console.error(`tuple CSV ${csv} must be freq_n,freq_m,amp,phase`)
    return undefined
  }

  const numeric = components.map(parseFloat)
  for (const val of numeric) {
    if (!isFinite(val)) {
      console.error('components must be numbers')
      return undefined
    }
  }

  const [n, m, amp, phase] = numeric
  return [n, m, amp, phase]
}

export interface SerializedFourierSeries2D {
  version: 1
  terms: string[]
}

function is_series(value: any): value is SerializedFourierSeries2D {
  if (value.version !== 1) {
    console.error('version must be 1')
    return false
  }

  const terms = value.terms ?? []
  if (!Array.isArray(terms)) {
    console.error('terms must be an array')
    return false
  }

  for (const term of terms) {
    if (!is_tuple(csv_to_tuple(term))) {
      return false
    }
  }

  return true
}

// A list of (freq_n, freq_m, amp, phase) coefficients
// representing complex numbers a_nm in a complex polynomial
// f(z) = sum_nm a_nm z^n conj(z)^m (point symmetry)
// or
// f(z) = sum_nm a_nm exp(2pi * i * dot(nm, z)) (wallpaper symmetry)
export class FourierSeries2D {
  terms: FourierTerm2D[]

  constructor(terms: FourierTerm2D[]) {
    this.terms = terms
  }

  // Fancy syntax that just defines for...of
  // behavior.
  // usage: for (const [n, m, amp phase] of coefficients) {}
  *[Symbol.iterator]() {
    yield* this.terms
  }

  /**
   * How many terms are included in this sum?
   */
  get length() {
    return this.terms.length
  }

  /**
   * Normalize the terms so the maximum sum has magnitude 1.
   */
  normalize() {
    let sum = 0
    for (const { coefficient } of this.terms) {
      sum += coefficient.r
    }

    this.terms = this.terms.map(({ frequencies, coefficient }) => {
      const { r, theta } = coefficient
      return {
        frequencies,
        coefficient: new ComplexPolar(r / sum, theta)
      }
    })
  }

  // pack the frequencies as [n1, m1, n2, m2, ...]
  get frequencies_array(): number[] {
    return this.terms.flatMap((term) => {
      const { n, m } = term.frequencies
      return [n, m]
    })
  }

  // Pack the coefficients as [amp1, phase1, amp2, phase2, ...]
  get coefficients_array(): number[] {
    return this.terms.flatMap((term) => {
      const { r, theta } = term.coefficient
      return [r, theta]
    })
  }

  to_json(): string {
    const tuple_csv: string[] = this.terms.map((term) => {
      const { frequencies, coefficient } = term
      const { n, m } = frequencies
      const { r, theta } = coefficient
      const tuple: FourierTuple2D = [n, m, r, theta]
      return tuple_to_csv(tuple, 3)
    })

    const serialized: SerializedFourierSeries2D = {
      version: 1,
      terms: tuple_csv
    }

    return JSON.stringify(serialized)
  }

  /*
  get arrays() {
    const powers = []
    const coeffs = []
    for (const [n, m, amp, phase] of this) {
      powers.push(n, m)
      coeffs.push(amp, phase)
    }

    return {
      powers,
      coeffs
    }
  }
  */

  /*
  to_html() {
    const parts = []
    for (const [n, m, amp, phase] of this) {
      const amp3 = amp.toPrecision(3)
      const phase_deg3 = degrees(phase).toPrecision(3)
      const tuple = `(${n}, ${m}, ${amp3}, ${phase_deg3}°)`
      parts.push(tuple)
    }
    return parts.join('<br/>')
  }
  */

  /*
  static from_random() {
    const terms = []

    for (let i = 0; i < 5; i++) {
      const n = rand_int(-10, 10)
      const m = rand_int(-10, 10)
      const amp = 1.0 / (n - m + 1)
      const phase = 2.0 * Math.PI * Math.random()
      terms.push({
        frequencies: { n, m },
        coefficient: new ComplexPolar(amp, phase)
      })
    }

    return new FourierSeries2D(terms)
  }
  */

  static from_json(json: string): FourierSeries2D | undefined {
    let parsed
    try {
      parsed = JSON.parse(json)
    } catch (e) {
      console.error(e)
      return undefined
    }

    if (!is_series(parsed)) {
      return undefined
    }

    const tuples: FourierTuple2D[] = parsed.terms
      .map(csv_to_tuple)
      .filter((x): x is FourierTuple2D => x !== undefined)

    return FourierSeries2D.from_tuples(tuples)
  }

  static from_quasi_symmetry(k: 5 | 7): FourierSeries2D {
    const terms = []
    for (let i = 0; i < k; i++) {
      const angle = (i * 2.0 * Math.PI) / k
      const n = Math.cos(angle)
      const m = Math.sin(angle)
      const amp = 1.0 / k
      const phase = 0.0
      terms.push({
        frequencies: { n, m },
        coefficient: new ComplexPolar(amp, phase)
      })
    }

    return new FourierSeries2D(terms)
  }

  static from_tuples(tuples: FourierTuple2D[]): FourierSeries2D {
    const terms = tuples.map((x) => {
      const [n, m, amp, phase] = x
      return {
        frequencies: {
          n,
          m
        },
        coefficient: new ComplexPolar(amp, phase)
      }
    })

    return new FourierSeries2D(terms)
  }
}

export const DEFAULT_COEFFICIENTS = FourierSeries2D.from_tuples([
  // d = 0
  [1, 1, 1, 0],
  // d = 3
  [4, 1, 1 / 3, 0],
  // d = 6
  [7, 1, 1 / 5, 0],
  // d = 9
  [9, 0, 1 / 6, 0]
])
