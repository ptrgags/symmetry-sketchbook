import { Color } from '../Color'
import { PALETTE_TYPES } from '../point_symmetry/PaletteType'
import { type PolynomialPalette } from '../point_symmetry/PolynomialPalette'
import { is_hex_string, is_number } from '../validation'
import type { Serializer } from './serialization'

export interface SerializedPolynomialPalette {
  palette_type: string
  // The primary color used in every palette
  primary_color: string
  // The secondary color for some palettes
  secondary_color: string
  // What color to use for points "far away" from the unit disk
  // (either near the origin or near infinity). this color is _multiplied_
  // into the final color.
  far_color: string
  // Raise the distancce field to a power to lighten/darken the output
  far_power: number
}

export class PolynomialPaletteSerializer
  implements Serializer<PolynomialPalette, SerializedPolynomialPalette>
{
  serialize(value: PolynomialPalette): SerializedPolynomialPalette {
    return {
      palette_type: value.palette_type.id,
      primary_color: value.primary_color.to_hex(),
      secondary_color: value.secondary_color.to_hex(),
      far_color: value.far_color.to_hex(),
      far_power: value.far_power
    }
  }

  validate(value: any): value is SerializedPolynomialPalette {
    const palette_type = PALETTE_TYPES.find((x) => x.id === value.palette_type)
    if (!palette_type) {
      const valid_values = PALETTE_TYPES.map((x) => x.id)
      console.error(`invalid palette_type, valid values are: [${valid_values.join(', ')}]`)
      return false
    }

    if (!is_hex_string(value.primary_color, 'primary_color')) {
      return false
    }
    if (!is_hex_string(value.secondary_color, 'primary_color')) {
      return false
    }
    if (!is_hex_string(value.far_color, 'far_color')) {
      return false
    }
    if (!is_number(value.far_power, 'far_power')) {
      return false
    }

    return true
  }

  deserialize(serialized: SerializedPolynomialPalette): PolynomialPalette {
    return {
      palette_type: PALETTE_TYPES.find((x) => x.id === serialized.palette_type) ?? PALETTE_TYPES[0],
      primary_color: Color.from_hex(serialized.primary_color),
      secondary_color: Color.from_hex(serialized.secondary_color),
      far_color: Color.from_hex(serialized.far_color),
      far_power: serialized.far_power
    }
  }
}
