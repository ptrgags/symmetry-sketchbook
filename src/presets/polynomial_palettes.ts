import type { DropdownOption } from '@/core/DropdownOption'
import type { PolynomialPalette } from '@/core/point_symmetry/PolynomialPalette'
import { PolynomialPaletteSerializer } from '@/core/serialization/SerializedPolynomialPalette'

const PALETTE_SERIALIZER = new PolynomialPaletteSerializer()

export const ROSETTE_PALETTES: DropdownOption<PolynomialPalette>[] = [
  {
    id: 'royal_flower',
    label: 'Royal Flower',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#4400ff',
      secondary_color: '#ff8f0f',
      far_color: '#adff33',
      far_power: 4
    }
  },
  {
    id: 'pink_and_teal',
    label: 'Pink and Teal',
    value: {
      version: 1,
      palette_type: 'secondary-circle',
      primary_color: '#ff00c8',
      secondary_color: '#318a8c',
      far_color: '#cd6a88',
      far_power: 5
    }
  },
  {
    id: 'crimson_shadows',
    label: 'Crimson Shadows',
    value: {
      version: 1,
      palette_type: 'invert-primary',
      primary_color: '#bd160a',
      secondary_color: '#548b1d',
      far_color: '#3a2249',
      far_power: 19
    }
  },
  {
    id: 'red_green',
    label: 'Red and Green',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#a2fe90',
      secondary_color: '#bd5151',
      far_color: '#1c1212',
      far_power: 19
    }
  },
  {
    id: 'navy_white',
    label: 'Navy and White',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#312ef5',
      secondary_color: '#ffffff',
      far_color: '#3b2a50',
      far_power: 19
    }
  },
  {
    id: 'primaries',
    label: 'Primaries',
    value: {
      version: 1,
      palette_type: 'invert-secondary-alternate',
      primary_color: '#effc3b',
      secondary_color: '#ac2020',
      far_color: '#ffffff',
      far_power: 1
    }
  },
  {
    id: 'jurassic_begonia',
    label: 'Jurassic Begonia',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#2bac11',
      secondary_color: '#e43a9d',
      far_color: '#000000',
      far_power: 3
    }
  },
  {
    id: 'gold',
    label: 'Gold',
    value: {
      version: 1,
      palette_type: 'primary',
      primary_color: '#ffdd00',
      secondary_color: '#e43a9d',
      far_color: '#000000',
      far_power: 3
    }
  },
  {
    id: 'green_slime',
    label: 'Green Slime',
    value: {
      version: 1,
      palette_type: 'secondary-alternate',
      primary_color: '#253725',
      secondary_color: '#4dff29',
      far_color: '#787878',
      far_power: 19
    }
  },
  {
    id: 'purple_mint',
    label: 'Purple Mint',
    value: {
      version: 1,
      palette_type: 'secondary-alternate',
      primary_color: '#14ffb1',
      secondary_color: '#5e10ad',
      far_color: '#ec3cb4',
      far_power: 19
    }
  },
  {
    id: 'sakura',
    label: 'Sakura',
    value: {
      version: 1,
      palette_type: 'secondary-alternate',
      primary_color: '#eba2dc',
      secondary_color: '#edc0de',
      far_color: '#737373',
      far_power: 19
    }
  },
  {
    id: 'red_sea',
    label: 'Red Sea',
    value: {
      version: 1,
      palette_type: 'invert-secondary-circle',
      primary_color: '#48eac1',
      secondary_color: '#000000',
      far_color: '#4271ae',
      far_power: 1
    }
  },
  {
    id: 'bees',
    label: 'Bees',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#000000',
      secondary_color: '#ffff00',
      far_color: '#b5b5b5',
      far_power: 19
    }
  },
  {
    id: 'turquoise_noir',
    label: 'Turquoise Noir',
    value: {
      version: 1,
      palette_type: 'invert-secondary-circle',
      primary_color: '#ffffff',
      secondary_color: '#ff0000',
      far_color: '#ffffff',
      far_power: 19
    }
  },
  {
    id: 'blue_steel',
    label: 'Blue Steel',
    value: {
      version: 1,
      palette_type: 'secondary-circle',
      primary_color: '#a3bfff',
      secondary_color: '#3876b7',
      far_color: '#e36802',
      far_power: 19
    }
  },
  {
    id: 'lemon_lime',
    label: 'Lemon Lime',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#00ff6e',
      secondary_color: '#ffbb00',
      far_color: '#ffffff',
      far_power: 4
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PALETTE_SERIALIZER.deserialize(x.value)
  }
})

export const FRIEZE_PALETTES: DropdownOption<PolynomialPalette>[] = [
  {
    id: 'purple_green',
    label: 'Purple and Green',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#7f00ff',
      secondary_color: '#7fff00',
      far_color: '#ffffff',
      far_power: 4
    }
  },
  {
    id: 'cool_colors',
    label: 'Cool Colors',
    value: {
      version: 1,
      palette_type: 'secondary-alternate',
      primary_color: '#47e0ff',
      secondary_color: '#b4b6fe',
      far_color: '#9aedfe',
      far_power: 4
    }
  },
  {
    id: 'ink_stains',
    label: 'Ink Stains',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#16078d',
      secondary_color: '#ffffff',
      far_color: '#a7afec',
      far_power: 13
    }
  },
  {
    id: 'mint_silhouette',
    label: 'Mint Silhouette',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#000000',
      secondary_color: '#5cffb3',
      far_color: '#ffffff',
      far_power: 13
    }
  },
  {
    id: 'magenta_orange',
    label: 'Magenta and Orange',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#ff00f7',
      secondary_color: '#f57600',
      far_color: '#ffffff',
      far_power: 19
    }
  },
  {
    id: 'blue_fade',
    label: 'Blue Fade',
    value: {
      version: 1,
      palette_type: 'primary',
      primary_color: '#3e6efe',
      secondary_color: '#ffffff',
      far_color: '#e88787',
      far_power: 19
    }
  },
  {
    id: 'focus',
    label: 'Focus',
    value: {
      version: 1,
      palette_type: 'invert-secondary-alternate',
      primary_color: '#ff6600',
      secondary_color: '#11ff00',
      far_color: '#000000',
      far_power: 19
    }
  },
  {
    id: 'flamingo',
    label: 'Flamingo',
    value: {
      version: 1,
      palette_type: 'secondary-half',
      primary_color: '#f575a2',
      secondary_color: '#f3aaca',
      far_color: '#ffffff',
      far_power: 19
    }
  },
  {
    id: 'yolk',
    label: 'Yolk',
    value: {
      version: 1,
      palette_type: 'secondary-circle',
      primary_color: '#ffffff',
      secondary_color: '#ffbb00',
      far_color: '#ffffff',
      far_power: 19
    }
  },
  {
    id: 'red_black',
    label: 'Red and Black',
    value: {
      version: 1,
      palette_type: 'secondary-circle',
      primary_color: '#ff0000',
      secondary_color: '#000000',
      far_color: '#ffffff',
      far_power: 19
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PALETTE_SERIALIZER.deserialize(x.value)
  }
})
