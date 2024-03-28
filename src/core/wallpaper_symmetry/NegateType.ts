import { ComplexPolar } from '../Complex'
import type { Frequency2D } from '../Frequency2D'

export type NegateType =
  // -1 always
  | 'negate'
  // (-1)^n
  | 'negate_n'
  // (-1)^m
  | 'negate_m'
  // (-1)^(m + n)
  | 'negate_nm'
  // (-1)^(n + 1)
  | 'negate_m1'
  // (-1)^(n + 1)
  | 'negate_n1'
  // (-1)^(n + m + 1)
  | 'negate_nm1'
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
  },
  negate_m1: ({ r, theta }, { m }) => {
    const sign = Math.pow(-1, m + 1)
    return new ComplexPolar(sign * r, theta)
  },
  negate_n1: ({ r, theta }, { n }) => {
    const sign = Math.pow(-1, n + 1)
    return new ComplexPolar(sign * r, theta)
  },
  negate_nm1: ({ r, theta }, { n, m }) => {
    const sign = Math.pow(-1, n + m + 1)
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
