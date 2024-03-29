import type { Frequency2D } from '../Frequency2D'

export type WallpaperPartnerType =
  | 'negate'
  | 'negate_n'
  | 'negate_m'
  | 'swap'
  | 'negate_swap'
  | 'negate_m_swap'
export type PartnerFunc = (frequencies: Frequency2D) => Frequency2D

const PARTNER_FUNCTIONS: { [key in WallpaperPartnerType]: PartnerFunc } = {
  negate: ({ n, m }) => {
    return { n: -n, m: -m }
  },
  negate_n: ({ n, m }) => {
    return { n: -n, m }
  },
  negate_m: ({ n, m }) => {
    return { n, m: -m }
  },
  swap: ({ n, m }) => {
    return { n: m, m: n }
  },
  negate_swap: ({ n, m }) => {
    return { n: -m, m: -n }
  },
  negate_m_swap: ({ n, m }) => {
    return { n: -m, m: n }
  }
}

export function get_partner_frequencies(
  partner_type: WallpaperPartnerType,
  frequencies: Frequency2D
): Frequency2D {
  return PARTNER_FUNCTIONS[partner_type](frequencies)
}
