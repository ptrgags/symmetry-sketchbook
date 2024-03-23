import type { DropdownOption } from '@/core/DropdownOption'
import type { PolynomialPalette } from '@/core/point_symmetry/PolynomialPalette'
import { PolynomialPaletteSerializer } from '@/core/serialization/SerializedPolynomialPalette'

const PALETTE_SERIALIZER = new PolynomialPaletteSerializer()

export const PALETTE_PRESETS: DropdownOption<PolynomialPalette>[] = [
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
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PALETTE_SERIALIZER.deserialize(x.value)
  }
})
