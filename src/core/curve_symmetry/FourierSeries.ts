import { ComplexRect, ComplexPolar } from '../Complex'

export interface FourierTerm {
  frequency: number
  coefficient: ComplexPolar
}

export type FourierTuple = [freq: number, amp: number, phase: number]

function is_tuple(value: any): value is FourierTuple {
  if (!Array.isArray(value)) {
    console.error('value must be an array')
    return false
  }

  if (value.length !== 3) {
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

function tuple_to_csv(tuple: FourierTuple, digits: number): string {
  const fixed = tuple.map((x) => x.toFixed(digits))
  return fixed.join(',')
}

function csv_to_tuple(csv: string): FourierTuple | undefined {
  const components = csv.split(',')
  if (components.length !== 3) {
    console.error(`tuple CSV ${csv} must be freq,amp,phase`)
    return undefined
  }

  const numeric = components.map(parseFloat)
  for (const val of numeric) {
    if (!isFinite(val)) {
      console.error('Components must be numbers')
      return undefined
    }
  }

  const [freq, amp, phase] = numeric
  return [freq, amp, phase]
}

export interface SerializedFourierSeries {
  version: 1
  terms: string[]
}

function is_series(value: any): value is SerializedFourierSeries {
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

/**
 * This class represents a finite sum of circular motions of the form
 *
 * f(t) = sum_k a_k e^(i n_k t)
 *
 * where a_k = amplitude * e^(i phase) is a complex number
 *       n_k is an integer
 *       t is a real number, typically in the range [0, 2 pi]
 */
export class FourierSeries {
  terms: FourierTerm[]

  /**
   * terms - an array of triples [frequency, amplitude, phase]
   * the terms must be specified in ascending order so the
   * partial sums are predictable.
   */
  constructor(terms: FourierTerm[]) {
    this.terms = terms
  }

  /**
   * Compute the sum for a particular value of t.
   * @param t The current time step
   */
  compute(t: number): ComplexRect {
    let x = 0.0
    let y = 0.0
    for (const { frequency, coefficient } of this.terms) {
      const { r: amp, theta: phase } = coefficient
      x += amp * Math.cos(frequency * t - phase)
      y += amp * Math.sin(frequency * t - phase)
    }
    return new ComplexRect(x, y)
  }

  /**
   * Compute the full trajectory of a point following this
   * fourier series, i.e. making the t parameter go from 0 to 2pi
   * @param points How many points for the trajectory
   * @returns A list of points on the curve
   */
  compute_trajectory(num_points: number): ComplexRect[] {
    const curve: ComplexRect[] = new Array(num_points)

    for (let i = 0; i < num_points; i++) {
      const t = (i / num_points) * 2.0 * Math.PI
      curve[i] = this.compute(t)
    }

    return curve
  }

  /**
   * Compute the partial sums. This is used for making the drawing machine
   * arm
   * @param t The time step to compute at
   */
  *partial_sums(t: number): Generator<ComplexRect, undefined, undefined> {
    yield new ComplexRect(0, 0)

    let x = 0.0
    let y = 0.0
    for (const { frequency, coefficient } of this.terms) {
      const { r: amp, theta: phase } = coefficient
      x += amp * Math.cos(frequency * t - phase)
      y += amp * Math.sin(frequency * t - phase)
      yield new ComplexRect(x, y)
    }
  }

  /**
   * Return a new curve scaled by a real number.
   * this is done by scaling the amplitudes
   */
  scale(amount: number): FourierSeries {
    const terms: FourierTerm[] = this.terms.map(({ frequency, coefficient }) => {
      return {
        frequency,
        coefficient: coefficient.scale(amount)
      }
    })
    return new FourierSeries(terms)
  }

  /**
   * Rotate a curve by an angle in radians
   * This is done by adding the angle to the phase of all terms.
   */
  rotate(angle: number) {
    const terms: FourierTerm[] = this.terms.map(({ frequency, coefficient }) => {
      return {
        frequency,
        coefficient: coefficient.rotate(angle)
      }
    })
    return new FourierSeries(terms)
  }

  to_json(): string {
    // Convert the coefficients to CSV to 3 digits after the decimal point
    // to keep the URLs shorter.
    const tuple_csv: string[] = this.terms.map((term) => {
      const { frequency, coefficient } = term
      const { r, theta } = coefficient
      const tuple: FourierTuple = [frequency, r, theta]
      return tuple_to_csv(tuple, 3)
    })

    const serialized: SerializedFourierSeries = {
      version: 1,
      terms: tuple_csv
    }

    return JSON.stringify(serialized)
  }

  static from_json(json: string): FourierSeries | undefined {
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

    // is_series checks that the tuples will be valid
    const tuples: FourierTuple[] = parsed.terms
      .map(csv_to_tuple)
      .filter((x): x is FourierTuple => x !== undefined)

    return FourierSeries.from_tuples(tuples)
  }

  static from_tuples(coefficients: FourierTuple[]): FourierSeries {
    const terms: FourierTerm[] = coefficients.map(([freq, amp, phase]) => {
      return {
        frequency: freq,
        coefficient: new ComplexPolar(amp, phase)
      }
    })

    return new FourierSeries(terms)
  }
}
