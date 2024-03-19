import { Color } from '../Color'
import { PALETTE_TYPES, type PaletteType } from './PaletteType'

export interface PointSymmetryPalette {
  // The primary and secondary color can be applied a few different ways,
  // so this selects between them
  palette_type: PaletteType
  // The primary color used in every palette
  primary_color: Color
  // The secondary color for some palettes
  secondary_color: Color
  // What color to use for points "far away" from the unit disk
  // (either near the origin or near infinity). this color is _multiplied_
  // into the final color.
  far_color: Color
  // Raise the distancce field to a power to lighten/darken the output
  far_power: number
}

export function default_palette(): PointSymmetryPalette {
  return {
    palette_type: PALETTE_TYPES[0],
    primary_color: new Color(0.5, 0.0, 1.0),
    secondary_color: new Color(0.5, 1.0, 0.0),
    far_color: new Color(0.0, 0.0, 0.0),
    far_power: 4
  } as const
}
