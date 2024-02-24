/**
 * 2D spacial frequencies, that serve as indices into a fourier series
 */
export interface Frequency2D {
  n: number
  m: number
}

export function swap(freqs: Frequency2D): Frequency2D {
  return {
    n: freqs.m,
    m: freqs.n
  }
}

export function negate(freqs: Frequency2D): Frequency2D {
  return {
    n: -freqs.n,
    m: -freqs.m
  }
}
