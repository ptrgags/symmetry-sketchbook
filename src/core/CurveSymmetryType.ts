// n-fold symmetry of type m
export interface CurveSymmetryType {
  folds: number
  type: number
}

export const SYMMETRY_TYPES: CurveSymmetryType[] = [
  {
    folds: 2,
    type: 1
  },
  {
    folds: 3,
    type: 1
  },
  {
    folds: 4,
    type: 1
  },
  {
    folds: 5,
    type: 1
  },
  {
    folds: 5,
    type: 2
  },
  {
    folds: 6,
    type: 1
  },
  {
    folds: 7,
    type: 1
  },
  {
    folds: 7,
    type: 2
  },
  {
    folds: 7,
    type: 3
  }
  // TODO: symmetry types for 8-12
]
