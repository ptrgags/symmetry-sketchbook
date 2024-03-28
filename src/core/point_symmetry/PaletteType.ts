export enum SecondaryColorType {
  None = 0,
  Halves = 1,
  Alternating = 2,
  InsideCircle = 3
}

export interface PaletteType {
  id: string
  label: string
  secondary_color: SecondaryColorType
  invert: boolean
}

export const PALETTE_TYPES: PaletteType[] = [
  { id: 'primary', label: 'Primary Only', invert: false, secondary_color: SecondaryColorType.None },
  {
    id: 'secondary-half',
    label: 'Primary + secondary (halves)',
    invert: false,
    secondary_color: SecondaryColorType.Halves
  },
  {
    id: 'secondary-alternate',
    label: 'Primary + secondary (alternating)',
    invert: false,
    secondary_color: SecondaryColorType.Alternating
  },
  {
    id: 'secondary-circle',
    label: 'Primary + secondary (inside circle)',
    invert: false,
    secondary_color: SecondaryColorType.InsideCircle
  },
  {
    id: 'invert-primary',
    label: 'Inverted primary',
    invert: true,
    secondary_color: SecondaryColorType.None
  },
  {
    id: 'invert-secondary-alternate',
    label: 'Inverted primary + secondary (alternating)',
    invert: true,
    secondary_color: SecondaryColorType.Alternating
  },
  {
    id: 'invert-secondary-circle',
    label: 'Inverted primary + secondary (circle)',
    invert: true,
    secondary_color: SecondaryColorType.InsideCircle
  }
]
