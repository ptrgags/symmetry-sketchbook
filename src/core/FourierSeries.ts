import { ComplexRect, ComplexPolar } from './Complex'

export interface FourierTerm {
  frequency: number
  coefficient: ComplexPolar
}

export type FourierTuple = [freq: number, amp: number, phase: number]

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

  /**
   * Shorthand string for representing a curve in the form
   * freq,amp,phase:freq,amp,phase:...
   * note that phase is scaled so it is a multiple of pi
   */
  to_string(): string {
    const terms = []
    for (const { frequency, coefficient } of this.terms) {
      const { r: amplitude, theta: phase } = coefficient
      const term_str = `${frequency},${amplitude},${phase / Math.PI}`
      terms.push(term_str)
    }
    return terms.join(':')
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

  /**
   * Load a pattern from a string in the same format as
   * to_string()
   */
  static from_string(str: string): FourierSeries {
    const terms: FourierTerm[] = str
      .trim()
      .split(':')
      .map((term_str) => {
        const [freq_str, amp_str, phase_str] = term_str.split(',')
        const freq = parseInt(freq_str)
        const amp = parseFloat(amp_str)
        const phase = parseFloat(phase_str) * Math.PI

        if (!isFinite(freq)) {
          throw new Error('frequency must be an integer')
        }

        if (!isFinite(amp)) {
          throw new Error('amplitude must be a real number')
        }

        if (!isFinite(phase)) {
          throw new Error('phase must be a real number')
        }

        return {
          frequency: freq,
          coefficient: new ComplexPolar(amp, phase)
        }
      })
      .sort()

    return new FourierSeries(terms)
  }
}
