import type { BaseSymmetryRule } from './BaseSymmetryRule'
import type { LatticeType } from './WallpaperLattice'
import type { NegateType } from './NegateType'
import type { WallpaperPartnerType } from './WallpaperPartnerType'

export interface WallpaperSymmetryRule {
  partner: WallpaperPartnerType
  negate?: NegateType
}

export interface WallpaperSymmetryGroup {
  lattice: LatticeType
  base_rule?: BaseSymmetryRule
  rules?: WallpaperSymmetryRule[]
}

export const WALLPAPER_GROUPS: { [key: string]: WallpaperSymmetryGroup } = {
  // General lattice
  p1: {
    lattice: 'parallelogram'
  },
  p2: {
    lattice: 'parallelogram',
    rules: [{ partner: 'negate' }]
  },
  // Rhombic lattice
  cm: {
    lattice: 'rhombus',
    rules: [{ partner: 'swap' }]
  },
  cmm: {
    lattice: 'rhombus',
    rules: [{ partner: 'negate' }, { partner: 'swap' }]
  },
  // Rectangular lattice
  pm: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_m' }]
  },
  pg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_m', negate: 'negate_n' }]
  },
  pmm: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate' }, { partner: 'negate_n' }]
  },
  pmg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate' }, { partner: 'negate_m', negate: 'negate_n' }]
  },
  pgg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate' }, { partner: 'negate_m', negate: 'negate_nm' }]
  },
  // Square lattice
  p4: {
    lattice: 'square',
    base_rule: 'square'
  },
  p4m: {
    lattice: 'square',
    base_rule: 'square',
    rules: [{ partner: 'swap' }]
  },
  p4g: {
    lattice: 'square',
    base_rule: 'square',
    rules: [{ partner: 'swap', negate: 'negate_nm' }]
  },
  // Hexagon lattice
  p3: {
    lattice: 'hexagon',
    base_rule: 'hexagon'
  },
  p31m: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'swap' }]
  },
  p3m1: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'negate_swap' }]
  },
  p6: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'negate' }]
  },
  p6m: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'negate' }, { partner: 'swap' }]
  }
}
