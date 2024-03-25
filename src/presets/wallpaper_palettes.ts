import type { DropdownOption } from '@/core/DropdownOption'
import { WallpaperPaletteSerializer } from '@/core/serialization/SerializedWallpaperPalette'
import type { WallpaperPalette } from '@/core/wallpaper_symmetry/WallpaperPalette'

const PALETTE_SERIALIZER = new WallpaperPaletteSerializer()

export const WALLPAPER_PALETTES: DropdownOption<WallpaperPalette>[] = [
  {
    id: 'orange',
    label: 'Orange',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 4,
      colors: ['#ff8800', '#ffa200', '#000000', '#000000']
    }
  },
  {
    id: 'warm',
    label: 'Warm',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 4,
      colors: ['#680808', '#000000', '#ff9500']
    }
  },
  {
    id: 'floral',
    label: 'Floral',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 4,
      colors: ['#fed7f7', '#ffc7e2', '#f9a9dc', '#1b640c', '#165412']
    }
  },
  {
    id: 'laser_plaid',
    label: 'Laser Plaid',
    value: {
      version: 1,
      palette_type: 2,
      diagonal_thickness: 2,
      colors: ['#000000', '#00ff00', '#00ff00', '#000000', '#000000', '#ffffff']
    }
  },
  {
    id: 'deep_sea',
    label: 'Deep Sea',
    value: {
      version: 1,
      palette_type: 1,
      diagonal_thickness: 2,
      colors: ['#182b49', '#133c67', '#144e85', '#205fa2', '#1263ba', '#1972d2', '#00e1ff']
    }
  },
  {
    id: 'playing_cards',
    label: 'Playing Cards',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 4,
      colors: ['#000000', '#ffffff', '#ff0000', '#ff0000', '#000000']
    }
  },
  {
    id: 'neapolitan',
    label: 'Neapolitan',
    value: {
      version: 1,
      palette_type: 1,
      diagonal_thickness: 2,
      colors: ['#412906', '#ffffff', '#fed2f2']
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PALETTE_SERIALIZER.deserialize(x.value)
  }
})
