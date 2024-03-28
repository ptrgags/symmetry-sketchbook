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
  },
  {
    id: 'progress',
    label: 'Progress',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 4,
      colors: [
        '#ffff00',
        '#ffffff',
        '#f4c7eb',
        '#a4e8fe',
        '#623b04',
        '#000000',
        '#ff0000',
        '#ff7300',
        '#eeff00',
        '#149022',
        '#1329cd',
        '#6214c2'
      ]
    }
  },
  {
    id: 'none_of_the_above',
    label: 'None of the Above',
    value: {
      version: 1,
      palette_type: 1,
      diagonal_thickness: 4,
      colors: ['#ffdd00', '#ffffff', '#9900ff', '#000000']
    }
  },
  {
    id: 'purple_grey',
    label: 'Purple and Grey',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 4,
      colors: ['#7300ff', '#ababab']
    }
  },
  {
    id: 'black_blue',
    label: 'Black and Blue',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 4,
      colors: ['#2c5d90', '#000000']
    }
  },
  {
    id: 'darkness',
    label: 'Darkness',
    value: {
      version: 1,
      palette_type: 2,
      diagonal_thickness: 20,
      colors: ['#471c73', '#17195e']
    }
  },
  {
    id: 'avocado',
    label: 'Avocado',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 20,
      colors: ['#000000', '#368514', '#614b0f', '#ffffff']
    }
  },
  {
    id: 'toothpaste',
    label: 'Toothpaste',
    value: {
      version: 1,
      palette_type: 1,
      diagonal_thickness: 20,
      colors: ['#14cbf0', '#ffffff', '#ffffff', '#ff0000', '#ffffff', '#ffffff']
    }
  },
  {
    id: 'earth',
    label: 'Earth',
    value: {
      version: 1,
      palette_type: 1,
      diagonal_thickness: 4,
      colors: ['#168d2a', '#0b20c1']
    }
  },
  {
    id: 'bright_plaid',
    label: 'Bright Plaid',
    value: {
      version: 1,
      palette_type: 2,
      diagonal_thickness: 1,
      colors: ['#8f8f8f', '#e44949', '#a522e2', '#ff7b00', '#fe7e06', '#0f701b']
    }
  },
  {
    id: 'dark_orange_with_context',
    label: 'Dark Orange with Context',
    value: {
      version: 1,
      palette_type: 2,
      diagonal_thickness: 1,
      colors: ['#61410a', '#000000', '#896606']
    }
  },
  {
    id: 'magenta',
    label: 'Magenta',
    value: {
      version: 1,
      palette_type: 0,
      diagonal_thickness: 1,
      colors: [
        '#fb00ff',
        '#ff00bb',
        '#680075',
        '#43014b',
        '#000000',
        '#d800f5',
        '#a80092',
        '#000000'
      ]
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PALETTE_SERIALIZER.deserialize(x.value)
  }
})
