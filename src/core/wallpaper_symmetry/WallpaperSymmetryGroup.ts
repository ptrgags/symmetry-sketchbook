import type { BaseSymmetryRule } from './BaseSymmetryRule'
import type { LatticeType } from './WallpaperLattice'
import type { NegateType } from './NegateType'
import type { WallpaperPartnerType } from './WallpaperPartnerType'
import type { ParityRule } from './ParityRule'
import { ColorReversingType } from './ColorReversingType'

export interface WallpaperSymmetryRule {
  partner: WallpaperPartnerType
  negate?: NegateType
}

export interface WallpaperSymmetryGroup {
  lattice: LatticeType
  base_rule?: BaseSymmetryRule
  rules?: WallpaperSymmetryRule[]
  parity?: ParityRule
  color_reversing?: ColorReversingType
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
} as const

export const COLOR_REVERSING_GROUPS: { [key: string]: WallpaperSymmetryGroup } = {
  // General Lattice
  p1_p1: {
    lattice: 'parallelogram',
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  p2_p1: {
    lattice: 'parallelogram',
    rules: [{ partner: 'negate', negate: 'negate' }],
    color_reversing: ColorReversingType.Vertical
  },
  p2_p2: {
    lattice: 'parallelogram',
    rules: [{ partner: 'negate' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  // Rectangular cell without 2-fold rotations
  pg_p1: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_m1' }],
    color_reversing: ColorReversingType.Vertical
  },
  pm_p1: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  pg_pg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_m' }],
    parity: 'odd_n',
    color_reversing: ColorReversingType.Vertical
  },
  pm_pg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_m' }],
    parity: 'odd_m',
    color_reversing: ColorReversingType.Vertical
  },
  cm_pg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_m' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  pmg_pg: {
    lattice: 'rectangle',
    rules: [
      { partner: 'negate_n', negate: 'negate_m' },
      { partner: 'negate', negate: 'negate' }
    ],
    color_reversing: ColorReversingType.Horizontal
  },
  pgg_pg: {
    lattice: 'rectangle',
    rules: [
      { partner: 'negate_n', negate: 'negate_nm' },
      { partner: 'negate', negate: 'negate' }
    ],
    color_reversing: ColorReversingType.Horizontal
  },
  pm_pm_1: {
    lattice: 'rectangle',
    parity: 'odd_n',
    rules: [{ partner: 'negate_n' }],
    color_reversing: ColorReversingType.Horizontal
  },
  pm_pm_2: {
    lattice: 'rectangle',
    parity: 'odd_m',
    rules: [{ partner: 'negate_n' }],
    color_reversing: ColorReversingType.Horizontal
  },
  cm_pm: {
    lattice: 'rectangle',
    parity: 'odd_nm',
    rules: [{ partner: 'negate_n' }],
    color_reversing: ColorReversingType.Horizontal
  },
  pmm_pm: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n' }, { partner: 'negate', negate: 'negate' }],
    color_reversing: ColorReversingType.Vertical
  },
  pmg_pm: {
    lattice: 'rectangle',
    rules: [
      { partner: 'negate_n', negate: 'negate_m1' },
      { partner: 'negate', negate: 'negate' }
    ],
    color_reversing: ColorReversingType.Vertical
  },
  // Rhombic Lattice
  cm_p1: {
    lattice: 'rhombus',
    rules: [{ partner: 'swap', negate: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  cmm_p2: {
    lattice: 'rhombus',
    rules: [{ partner: 'swap', negate: 'negate' }, { partner: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  pm_cm: {
    lattice: 'rhombus',
    rules: [{ partner: 'swap' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Horizontal
  },
  cmm_cm: {
    lattice: 'rhombus',
    rules: [
      { partner: 'swap', negate: 'negate' },
      { partner: 'negate', negate: 'negate' }
    ],
    color_reversing: ColorReversingType.Vertical
  },
  pmm_cmm: {
    lattice: 'rhombus',
    rules: [{ partner: 'swap' }, { partner: 'negate' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  // Rectangular cell with half-turns
  pmm_p2: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate' }, { partner: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  // Not sure why this pmg_p2 and pgg_p2 don't seem to work. I double checked that this
  // matches the recipe in the table... I don't have time to worry about this
  // now, at least the other 44 groups work 😅
  pmg_p2: {
    lattice: 'rectangle',
    rules: [{ partner: 'swap', negate: 'negate_m1' }, { partner: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  pgg_p2: {
    lattice: 'rectangle',
    rules: [{ partner: 'swap', negate: 'negate_nm1' }, { partner: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  pmm_pmm: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n' }, { partner: 'negate' }],
    parity: 'odd_n',
    color_reversing: ColorReversingType.Vertical
  },
  cmm_pmm: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n' }, { partner: 'negate' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Horizontal
  },
  pmm_pmg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_m' }, { partner: 'negate' }],
    parity: 'odd_m',
    color_reversing: ColorReversingType.Horizontal
  },
  pmg_pmg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_m' }, { partner: 'negate' }],
    parity: 'odd_n',
    color_reversing: ColorReversingType.Horizontal
  },
  cmm_pmg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_m' }, { partner: 'negate' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  pmg_pgg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_nm' }, { partner: 'negate' }],
    parity: 'odd_n',
    color_reversing: ColorReversingType.Vertical
  },
  cmm_pgg: {
    lattice: 'rectangle',
    rules: [{ partner: 'negate_n', negate: 'negate_nm' }, { partner: 'negate' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Horizontal
  },
  // Square cell with negating 4-centers
  p4_p2: {
    lattice: 'square',
    // Not sure why, but I need to explicitly list partner: negate for a few
    // of these rather than using base_rule square. I think it has to do with
    // negate_m_swap conflicting with the base rule, but I don't fully
    // understand it.
    rules: [{ partner: 'negate' }, { partner: 'negate_m_swap', negate: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  p4m_pmm: {
    lattice: 'square',
    rules: [
      { partner: 'negate' },
      { partner: 'negate_m_swap', negate: 'negate' },
      { partner: 'swap', negate: 'negate' }
    ],
    color_reversing: ColorReversingType.Horizontal
  },
  p4g_pgg: {
    lattice: 'square',
    rules: [
      { partner: 'negate' },
      { partner: 'negate_m_swap', negate: 'negate' },
      { partner: 'swap', negate: 'negate_nm1' }
    ],
    color_reversing: ColorReversingType.Vertical
  },
  p4m_cmm: {
    lattice: 'square',
    rules: [
      { partner: 'negate' },
      { partner: 'negate_m_swap', negate: 'negate' },
      { partner: 'swap' }
    ],
    color_reversing: ColorReversingType.Vertical
  },
  p4g_cmm: {
    lattice: 'square',
    rules: [
      { partner: 'negate' },
      { partner: 'negate_m_swap', negate: 'negate' },
      { partner: 'swap', negate: 'negate_nm' }
    ],
    color_reversing: ColorReversingType.Vertical
  },
  // Square cell with positive 4-centers
  p4_p4: {
    lattice: 'square',
    base_rule: 'square',
    rules: [{ partner: 'negate_m_swap' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  p4m_p4: {
    lattice: 'square',
    base_rule: 'square',
    rules: [{ partner: 'negate_m_swap' }, { partner: 'swap', negate: 'negate' }],
    color_reversing: ColorReversingType.Vertical
  },
  p4g_p4: {
    lattice: 'square',
    base_rule: 'square',
    rules: [{ partner: 'negate_m_swap' }, { partner: 'swap', negate: 'negate_nm1' }],
    color_reversing: ColorReversingType.Horizontal
  },
  p4m_p4m: {
    lattice: 'square',
    base_rule: 'square',
    rules: [{ partner: 'negate_m_swap' }, { partner: 'swap' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  p4m_p4g: {
    lattice: 'square',
    base_rule: 'square',
    rules: [{ partner: 'negate_m_swap' }, { partner: 'swap', negate: 'negate_nm' }],
    parity: 'odd_nm',
    color_reversing: ColorReversingType.Vertical
  },
  // Hexagonal cell, p3 symmetry
  p31m_p3: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'swap', negate: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  p3m1_p3: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'negate_swap', negate: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  p6_p3: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'negate', negate: 'negate' }],
    color_reversing: ColorReversingType.Horizontal
  },
  // Hexagonal cell, p6m symmetry
  p6m_p31m: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'swap' }, { partner: 'negate', negate: 'negate' }],
    color_reversing: ColorReversingType.Vertical
  },
  p6m_p3m1: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'negate_swap' }, { partner: 'negate', negate: 'negate' }],
    color_reversing: ColorReversingType.Vertical
  },
  p6m_p6: {
    lattice: 'hexagon',
    base_rule: 'hexagon',
    rules: [{ partner: 'negate' }, { partner: 'swap', negate: 'negate' }],
    color_reversing: ColorReversingType.Vertical
  }
} as const

export function find_group(group_id: string): WallpaperSymmetryGroup {
  const group = WALLPAPER_GROUPS[group_id]
  if (group) {
    return group
  }

  const reversing_group = COLOR_REVERSING_GROUPS[group_id]
  if (reversing_group) {
    return reversing_group
  }

  throw new Error('group_id must be a valid wallpaper group ID')
}

// Reverse lookup of group IDs. This makes use of the fact that I only
// ever use the above tables as constants.
export function find_group_id(group: WallpaperSymmetryGroup): string {
  for (const [key, value] of Object.entries(WALLPAPER_GROUPS)) {
    if (value === group) {
      return key
    }
  }

  for (const [key, value] of Object.entries(COLOR_REVERSING_GROUPS)) {
    if (value === group) {
      return key
    }
  }

  throw new Error('group must be one of the WallpaperSymmetryGroup constants')
}
