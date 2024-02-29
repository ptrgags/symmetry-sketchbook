export enum InputSymmetryType {
  Identity,
  Rotation,
  Mirror,
  ComplexInversion,
  CircleInversion,
  RotoInversion
}

export function to_string(symmetry: InputSymmetryType): string {
  switch (symmetry) {
    case InputSymmetryType.Identity:
      return 'Identity'
    case InputSymmetryType.Rotation:
      return 'Rotation'
    case InputSymmetryType.Mirror:
      return 'Mirror'
    case InputSymmetryType.ComplexInversion:
      return 'Complex-inversion'
    case InputSymmetryType.CircleInversion:
      return 'Circle Inversion'
    case InputSymmetryType.RotoInversion:
      return 'Roto-inversion'
    default:
      return ''
  }
}

export function has_reflection(symmetry: InputSymmetryType): boolean {
  switch (symmetry) {
    case InputSymmetryType.Mirror:
    case InputSymmetryType.CircleInversion:
    case InputSymmetryType.RotoInversion:
      return true
  }

  return false
}

export function has_inversion(symmetry: InputSymmetryType): boolean {
  switch (symmetry) {
    case InputSymmetryType.ComplexInversion:
    case InputSymmetryType.CircleInversion:
    case InputSymmetryType.RotoInversion:
      return true
  }

  return false
}
