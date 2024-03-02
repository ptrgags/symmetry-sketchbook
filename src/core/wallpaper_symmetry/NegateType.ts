import { ComplexPolar } from '../Complex'
import type { Frequency2D } from '../Frequency2D'

export type NegateType = 'negate' | 'negate_n' | 'negate_m' | 'negate_nm'
type NegateFunc = (term: ComplexPolar, frequencies: Frequency2D) => ComplexPolar

const NEGATE_FUNCTIONS: { [key in NegateType]: NegateFunc } = {
  negate: ({ r, theta }) => new ComplexPolar(-r, theta),
  negate_n: ({ r, theta }, { n }) => {
    const sign = Math.pow(-1, n)
    return new ComplexPolar(sign * r, theta)
  },
  negate_m: ({ r, theta }, { m }) => {
    const sign = Math.pow(-1, m)
    return new ComplexPolar(sign * r, theta)
  },
  negate_nm: ({ r, theta }, { n, m }) => {
    const sign = Math.pow(-1, n + m)
    return new ComplexPolar(sign * r, theta)
  }
}

export function negate_term(
  negate_type: NegateType,
  term: ComplexPolar,
  frequencies: Frequency2D
): ComplexPolar {
  return NEGATE_FUNCTIONS[negate_type](term, frequencies)
}
