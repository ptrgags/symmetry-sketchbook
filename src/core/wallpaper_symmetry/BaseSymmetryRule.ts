import type { Frequency2D } from '../Frequency2D'

export type BaseSymmetryRule = 'square' | 'hexagon'
type BaseSymmetryFunc = (frequencies: Frequency2D) => Frequency2D[]

const PARTNER_FUNCTIONS: { [key in BaseSymmetryRule]: BaseSymmetryFunc } = {
  // These two rules are only used for square and hex lattices
  square: ({ n, m }) => [
    { n: m, m: -n },
    { n: -n, m: -m },
    { n: -m, m: n }
  ],
  hexagon: ({ n, m }) => [
    { n: m, m: -(n + m) },
    { n: -(n + m), m: n }
  ]
}

export function apply_base_symmetry(
  rule: BaseSymmetryRule,
  frequencies: Frequency2D
): Frequency2D[] {
  return PARTNER_FUNCTIONS[rule](frequencies)
}
