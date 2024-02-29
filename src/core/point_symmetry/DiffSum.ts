import { type Frequency2D } from '../Frequency2D'

/**
 * The symmetry constraints don't directly work on the frequencies
 * n, m of frequency space, but rather the diagonals
 * (diff, sum) = (n - m, n + m). This is because when you expand
 *
 * z^n conj(z)^m
 *
 * you get:
 *
 * r^(n + m) exp(i * theta * (n - m))
 */
export interface DiffSum {
  diff: number
  sum: number
}

/**
 * Convert to diff/sum space
 * @param frequencies The integer frequencies (n, m)
 * @returns The difference and sum, (n - m, n + m)
 */
export function frequencies_to_diff_sum(frequencies: Frequency2D): DiffSum {
  const { n, m } = frequencies
  const diff = n - m
  const sum = n + m
  return { diff, sum }
}

/**
 * inverse mapping that gets back the original frequencies
 * @param diff_sum The difference and sum of frequencies
 * @returns the frequencies, (n, m)
 */
export function diff_sum_to_frequencies(diff_sum: DiffSum): Frequency2D {
  const { diff, sum } = diff_sum

  //   (diff + sum) / 2
  // = (n - m + n + m) / 2
  // = (2n) / 2
  // = n
  const n = (diff + sum) / 2
  //   (sum - diff) / 2
  // = (n + m - n + m) / 2
  // = (2m) / 2
  // = m
  const m = (sum - diff) / 2
  return { n, m }
}
