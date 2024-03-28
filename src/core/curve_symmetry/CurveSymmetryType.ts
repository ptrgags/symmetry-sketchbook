// n-fold symmetry of order m
export class CurveSymmetryType {
  readonly folds: number
  readonly order: number

  constructor(folds: number, type: number) {
    this.folds = folds
    this.order = type
  }

  /**
   * To make a curve with this symmetry type, all the frequencies are of the
   * form <folds>k + <order>.
   * @param index A signed integer index, k
   * @returns The corresponding frequency as a signed integer
   */
  get_frequency(index: number) {
    return this.folds * index + this.order
  }
}

export const SYMMETRY_TYPES: CurveSymmetryType[] = [
  // List all the visually distinct symmetry types with 2-12 fold rotations.
  // Not all orders are included for 2 main reasons:
  //
  // - large orders are just the reverse direction of small orders
  //   (e.g 3k + 1 is the opposite of 3k + 2) because 2 = -1 (mod 3)
  // - If the folds and order must be co-prime, else it reduces to a different
  //   symmetry. (e.g. 4k + 2 -> 2k + 1)
  //
  // 1-fold (no symmetry)
  new CurveSymmetryType(1, 0),
  // 2-fold: 1
  new CurveSymmetryType(2, 1),
  // 3-fold: 1 | 2
  new CurveSymmetryType(3, 1),
  // 4-fold: 1 2 | 3
  // note that (4, 2) is the same as (2, 1)
  new CurveSymmetryType(4, 1),
  // 5-fold: 1 2 | 3 4
  new CurveSymmetryType(5, 1),
  new CurveSymmetryType(5, 2),
  // 6-fold: 1 2 3 | 4 5
  // note that (6, 2) is the same as (3, 1)
  // note that (6, 3) is the same as (2, 1)
  new CurveSymmetryType(6, 1),
  // 7-fold: 1 2 3 | 4 5 6
  new CurveSymmetryType(7, 1),
  new CurveSymmetryType(7, 2),
  new CurveSymmetryType(7, 3),
  // 8-fold: 1 2 3 4 | 5 6 7
  // note that (8, 2) is the same as (4, 1)
  // note that (8, 4) is the same as (2, 1)
  new CurveSymmetryType(8, 1),
  new CurveSymmetryType(8, 3),
  // 9-fold: 1 2 3 4 | 5 6 7 8
  // note that (9, 3) is the same as (3, 1)
  new CurveSymmetryType(9, 1),
  new CurveSymmetryType(9, 2),
  new CurveSymmetryType(9, 4),
  // 10-fold: 1 2 3 4 5 | 6 7 8 9
  // note that (10, 2) is the same as (5, 1)
  // note that (10, 4) is the same as (5, 2)
  // note that (10, 5) is the same as (2, 1)
  new CurveSymmetryType(10, 1),
  new CurveSymmetryType(10, 3),
  new CurveSymmetryType(10, 4),
  // 11-fold: 1 2 3 4 5 | 6 7 8 9 10
  new CurveSymmetryType(11, 1),
  new CurveSymmetryType(11, 2),
  new CurveSymmetryType(11, 3),
  new CurveSymmetryType(11, 4),
  new CurveSymmetryType(11, 5),
  // 12-fold: 1 2 3 4 5 6 | 7 8 9 10 11
  // note that (12, 2) is the same as ()
  // note that (12, 3) is the same as ()
  // note that (12, 4) is the same as ()
  // note that (12, 6) is the same as ()
  new CurveSymmetryType(12, 1),
  new CurveSymmetryType(12, 5)
]
