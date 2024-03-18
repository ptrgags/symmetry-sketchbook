import { Color } from '../Color'
import { is_hex_string, is_number, is_string } from '../validation'
import { WallpaperPaletteType, type WallpaperPalette } from '../wallpaper_symmetry/WallpaperPalette'
import type { Serializer } from './serialization'

export interface SerializedWallpaperPalette {
  palette_type: WallpaperPaletteType
  diagonal_thickness: number
  colors: string[]
}

export class WallpaperPaletteSerializer
  implements Serializer<WallpaperPalette, SerializedWallpaperPalette>
{
  serialize(value: WallpaperPalette): SerializedWallpaperPalette {
    return {
      palette_type: value.palette_type,
      diagonal_thickness: value.diagonal_thickness,
      colors: value.colors.map((x) => x.to_hex())
    }
  }

  validate(value: any): value is SerializedWallpaperPalette {
    const valid_palette_types = Object.values(WallpaperPaletteType)
    if (!valid_palette_types.includes(value.palette_type)) {
      console.error(`palette_type must be one of ${valid_palette_types}`)
      return false
    }

    if (!is_number(value.diagonal_thickness, 'diagonal_thickness')) {
      return false
    }

    if (!Array.isArray(value.colors)) {
      console.error('colors must be an array of hex strings')
      return false
    }

    for (let i = 0; i < value.colors.length; i++) {
      if (!is_hex_string(value.colors[i], `colors[${i}]`)) {
        return false
      }
    }

    return true
  }

  deserialize(serialized: SerializedWallpaperPalette): WallpaperPalette {
    return {
      palette_type: serialized.palette_type,
      diagonal_thickness: serialized.diagonal_thickness,
      colors: serialized.colors.map(Color.from_hex)
    }
  }
}
