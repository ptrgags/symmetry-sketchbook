import { type Frequency2D } from '../Frequency2D'
import { mod } from '../math'

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

/**
 * Helper function for get_freq_diff in PointSymmetryRule.ts
 *
 * As part of the the polynomial editor (see PolynomialMakerView.vue), we
 * want to compute a frequency pair for each term in a grid. The difference
 * depends on the symmetry rule, but the sum doesn't, so I'm putting it here.
 *
 * @param diff The frequency difference
 * @param row The row number in the term grid
 * @returns The sum for this term
 */
export function diff_row_to_sum(diff: number, signed_row: number): number {
  // For the sum, we can choose anything we want, so ideally we'd do
  // sum = row and be done with it, but there's one minor subtlety to consider:
  //
  // Look at the diagonals of an integer grid:
  //
  // n ->    ^               sum -->
  // 0 1 2 3 |               0      diff
  // 1 2 3 4 m     -->      1 1      |
  // 2 3 4 5               2 2 2     v
  // 3 4 5 6              3 3 3 3
  //                       4 4 4
  //                        5 5
  //                         6
  //
  //                         ^
  //                         |
  //              they don't line up vertically! :'(
  //
  // We could just shift every other row. However, some symmetry rules
  // require the grid of coefficients to be updated symmetric over the line
  // m = -n (corresponding to the diagonal: sum = (n + m) = (n - n) = 0)
  // so to do this, I want every other line of terms to expand outwards so
  // the terms line up. This will require turning off some coefficients
  // on the center line. That will be handled elsewhere so I'll just
  // set it to 0:
  //
  //       sum ->
  //     1 0 0 0 0
  //     1 1 x 1 1  diff
  //     2 2 2 2 2   |
  //     3 3 x 3 3   v
  //     4 4 4 4 4
  //     5 5 x 5 5
  //     6 6 x 6 6

  const parity = mod(diff, 2)
  if (parity == 0) {
    // The sum diagonals with integer solutions happen every other diagonal
    // hence the * 2
    return 2 * signed_row
  } else if (parity == 1 && signed_row == 0) {
    // These are the terms that we will ignore in the UI. For now
    // just set it to 0
    return 0
  }

  // We want the odd diagonals, however we want this pattern
  // to be symmetric around the origin (2 * row + 1 would not work!).
  //
  // Here's one way to do this:
  //
  // https://www.desmos.com/calculator/rrn7cirfgo
  //
  // input:  ... -3, -2, -1, 0, 1, 2, 3, ...
  // output: ... -5, -3, -1, 0, 1, 3, 5, ...
  return 2 * Math.sign(signed_row) * Math.max(Math.abs(signed_row) - 0.5, 0)
}
