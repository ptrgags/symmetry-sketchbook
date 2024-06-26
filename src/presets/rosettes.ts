import type { DropdownOption } from '@/core/DropdownOption'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import type { PolynomialPattern } from '@/sketches/PolynomialSketch'

const PATTERN_SERIALIZER = new PolynomialPatternSerializer()

export const ROSETTE_PATTERNS: DropdownOption<PolynomialPattern>[] = [
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
  },
  {
    id: 'ribbons_eightfold',
    label: 'Ribbons, Eightfold',
    value: {
      version: 1,
      series: {
        terms: [
          '-2.000,6.000,0.266,4.901',
          '6.000,-2.000,0.619,4.279',
          '-7.000,9.000,0.130,6.197',
          '1.000,1.000,1.782,5.998',
          '4.000,-4.000,2.368,0.770',
          '-9.000,7.000,0.130,6.197',
          '-1.000,-1.000,1.782,5.998',
          '-6.000,2.000,0.266,4.901',
          '2.000,-6.000,0.619,4.279'
        ]
      },
      rotation_order: 8
    }
  },
  {
    id: 'hex_fork',
    label: 'Hex Fork',
    value: {
      version: 1,
      series: {
        terms: [
          '0.000,3.000,0.813,0.457',
          '0.000,1.000,1.356,0.095',
          '0.000,-1.000,1.356,0.095',
          '0.000,-3.000,0.813,0.457'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'avoid_center',
    label: 'Avoid the Center',
    value: {
      version: 1,
      series: {
        terms: [
          '3.000,1.000,0.050,0.000',
          '1.000,1.000,1.360,0.000',
          '-2.000,-2.000,-0.894,0.000',
          '-1.000,-2.000,-0.863,0.000',
          '-1.000,-3.000,-0.670,0.000'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'curvilinear',
    label: 'Curvilinear',
    value: {
      version: 1,
      series: {
        terms: [
          '3.000,1.000,0.183,2.635',
          '0.000,1.000,1.323,3.922',
          '0.000,-2.000,1.252,1.203',
          '-1.000,-2.000,0.572,4.906'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'iris',
    label: 'Iris',
    value: {
      version: 1,
      series: {
        terms: ['1.000,0.000,0.685,0.815', '5.000,-8.000,1.739,0.879', '-20.000,15.000,1.814,2.286']
      },
      rotation_order: 12
    }
  },
  {
    id: 'crossroads',
    label: 'Crossroads',
    value: {
      version: 1,
      series: {
        terms: [
          '5.000,-1.000,0.042,3.416',
          '1.000,1.000,0.331,3.085',
          '4.000,-2.000,0.408,6.083',
          '-3.000,1.000,0.802,4.233',
          '2.000,-4.000,0.295,4.099',
          '-3.000,-1.000,0.411,3.193',
          '-1.000,-3.000,1.341,4.705',
          '-3.000,-3.000,0.056,0.770',
          '0.000,-6.000,0.641,1.204'
        ]
      },
      rotation_order: 2
    }
  },
  {
    id: 'interlock',
    label: 'Interlock',
    value: {
      version: 1,
      series: {
        terms: [
          '-3.000,8.000,0.224,1.796',
          '9.000,-4.000,0.224,1.796',
          '-1.000,4.000,1.247,0.717',
          '5.000,-2.000,1.247,0.717',
          '-5.000,6.000,0.566,4.481',
          '-2.000,3.000,0.328,3.361',
          '1.000,0.000,1.127,4.498',
          '4.000,-3.000,0.328,3.361',
          '7.000,-6.000,0.566,4.481',
          '-6.000,5.000,0.566,4.481',
          '-3.000,2.000,0.328,3.361',
          '0.000,-1.000,1.127,4.498',
          '3.000,-4.000,0.328,3.361',
          '6.000,-7.000,0.566,4.481',
          '-4.000,1.000,1.247,0.717',
          '2.000,-5.000,1.247,0.717',
          '-8.000,3.000,0.224,1.796',
          '4.000,-9.000,0.224,1.796'
        ]
      },
      rotation_order: 6
    }
  },
  {
    id: 'insanity_rose',
    label: 'Insanity Rose',
    value: {
      version: 1,
      series: {
        terms: [
          '7.000,-1.000,0.680,2.719',
          '-10.000,14.000,0.503,2.841',
          '-7.000,9.000,1.121,0.270',
          '1.000,1.000,0.341,4.683',
          '9.000,-7.000,0.051,3.805',
          '-4.000,4.000,2.800,5.488',
          '4.000,-4.000,2.800,5.488',
          '-9.000,7.000,0.051,3.805',
          '-1.000,-1.000,0.341,4.683',
          '7.000,-9.000,1.121,0.270',
          '10.000,-14.000,0.503,2.841',
          '-7.000,1.000,0.680,2.719'
        ]
      },
      rotation_order: 8
    }
  },
  {
    id: 'perforated_star',
    label: 'Perforated Star',
    value: {
      version: 1,
      series: {
        terms: [
          '3.000,-2.000,0.187,5.341',
          '4.000,-6.000,0.757,1.425',
          '-2.000,-2.000,1.049,6.090',
          '2.000,-8.000,0.252,4.792'
        ]
      },
      rotation_order: 5
    }
  },
  {
    id: 'complex_handshake',
    label: 'Complex Handshake',
    value: {
      version: 1,
      series: {
        terms: [
          '2.000,1.000,1.100,5.426',
          '0.000,1.000,1.699,0.999',
          '-1.000,0.000,1.699,0.999',
          '-1.000,-2.000,1.100,5.426'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'too_many_forks',
    label: 'Too Many Forks',
    value: {
      version: 1,
      series: {
        terms: [
          '12.000,-7.000,0.355,5.535',
          '8.000,-5.000,0.620,3.322',
          '11.000,-8.000,2.637,2.432',
          '1.000,0.000,1.000,5.420',
          '10.000,-9.000,0.111,2.688',
          '-7.000,4.000,0.618,4.242',
          '2.000,-5.000,1.000,2.893',
          '5.000,-8.000,0.055,4.340'
        ]
      },
      rotation_order: 6
    }
  },
  {
    id: 'bent',
    label: 'Bent',
    value: {
      version: 1,
      series: {
        terms: [
          '1.000,3.000,0.313,2.646',
          '2.000,2.000,0.252,5.536',
          '2.000,1.000,0.042,4.592',
          '1.000,-1.000,0.049,1.469',
          '-2.000,-1.000,1.489,3.792',
          '-2.000,-4.000,0.055,1.097'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'forbidden_donut',
    label: 'Forbidden Donut',
    value: {
      version: 1,
      series: {
        terms: [
          '0.000,3.000,0.165,6.215',
          '-4.000,5.000,0.263,1.242',
          '4.000,-5.000,0.263,1.242',
          '0.000,-3.000,0.165,6.215'
        ]
      },
      rotation_order: 3
    }
  },
  {
    id: 'intersection',
    label: 'Intersection',
    value: {
      version: 1,
      series: {
        terms: ['1.000,0.000,0.615,6.101', '-1.000,-1.000,1.106,2.373']
      },
      rotation_order: 4
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PATTERN_SERIALIZER.deserialize(x.value)
  }
})
