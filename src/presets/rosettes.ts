import type { DropdownOption } from '@/core/DropdownOption'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import type { PolynomialPattern } from '@/sketches/PolynomialSketch'

const PATTERN_SERIALIZER = new PolynomialPatternSerializer()

export const ROSETTE_PRESETS: DropdownOption<PolynomialPattern>[] = [
  {
    id: 'hexaflower',
    label: 'Hexaflower',
    // Sixfold rotation symmetry
    value: {
      version: 1,
      series: {
        terms: [
          '1.000,1.000,1.342,5.819',
          '-6.000,6.000,1.000,5.713',
          '0.000,0.000,0.665,0.720',
          '2.000,-4.000,1.516,0.850',
          '-8.000,4.000,0.253,3.468',
          '6.000,-12.000,0.791,6.116'
        ]
      },
      rotation_order: 6
    }
  },
  {
    id: 'tritosis',
    label: 'Tritosis',
    value: {
      version: 1,
      series: {
        terms: [
          '1.000,1.000,0.290,1.028',
          '-4.000,2.000,1.522,4.686',
          '2.000,-4.000,1.522,4.686',
          '-3.000,0.000,1.321,0.930',
          '0.000,-3.000,1.321,0.930'
        ]
      },
      rotation_order: 3
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PATTERN_SERIALIZER.deserialize(x.value)
  }
})
