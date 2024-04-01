import type { DropdownOption } from '@/core/DropdownOption'
import { PolynomialPatternSerializer } from '@/core/serialization/SerializedPolynomialPattern'
import type { PolynomialPattern } from '@/sketches/PolynomialSketch'

const PATTERN_SERIALIZER = new PolynomialPatternSerializer()

export const FRIEZE_PATTERNS: DropdownOption<PolynomialPattern>[] = [
  {
    id: 'branching',
    label: 'Branching',
    value: {
      version: 1,
      series: {
        terms: [
          '1.000,4.000,0.690,1.022',
          '2.000,4.000,0.173,6.101',
          '0.000,3.000,1.241,4.094',
          '3.000,0.000,1.633,1.994',
          '-1.000,0.000,1.060,1.533',
          '1.000,-2.000,2.021,6.139',
          '-1.000,-2.000,1.414,0.278',
          '-1.000,-3.000,0.720,0.412',
          '-4.000,-2.000,0.767,4.086',
          '-1.000,-4.000,2.474,5.563'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'sideways_hills',
    label: 'Sideways Hills',
    value: {
      version: 1,
      series: {
        terms: [
          '0.000,1.000,0.802,4.261',
          '1.000,0.000,0.802,4.261',
          '-2.000,1.000,1.497,5.125',
          '1.000,-2.000,1.497,5.125',
          '-2.000,-1.000,1.129,0.295',
          '-1.000,-2.000,1.129,0.295',
          '-4.000,-1.000,0.051,6.062',
          '-1.000,-4.000,0.051,6.062'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'klecksographie',
    label: 'Klecksographie',
    value: {
      version: 1,
      series: {
        terms: [
          '2.000,4.000,0.045,5.795',
          '4.000,1.000,0.320,3.707',
          '0.000,3.000,1.200,2.173',
          '2.000,1.000,0.685,5.372',
          '3.000,0.000,0.369,6.061',
          '0.000,1.000,1.978,5.196',
          '1.000,1.000,1.680,5.264',
          '-1.000,0.000,1.978,5.196',
          '-1.000,-1.000,1.680,5.264',
          '-3.000,0.000,1.200,2.173',
          '-1.000,-2.000,0.685,5.372',
          '0.000,-3.000,0.369,6.061',
          '-4.000,-2.000,0.045,5.795',
          '-1.000,-4.000,0.320,3.707'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'bones',
    label: 'Bones',
    value: {
      version: 1,
      series: {
        terms: [
          '-2.000,6.000,1.418,4.382',
          '2.000,2.000,1.871,4.110',
          '-6.000,6.000,1.930,2.331',
          '0.000,0.000,2.205,2.357',
          '2.000,-2.000,1.338,1.843',
          '4.000,-4.000,1.836,2.276',
          '-3.000,1.000,2.559,2.334',
          '-1.000,-1.000,1.246,3.905',
          '-6.000,2.000,1.549,4.139',
          '2.000,-6.000,1.402,5.294',
          '3.000,-9.000,1.201,6.055'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'musical_cutlery',
    label: 'Music and Cutlery',
    value: {
      version: 1,
      series: {
        terms: [
          '-4.000,8.000,0.627,3.435',
          '8.000,-4.000,0.627,3.435',
          '1.000,1.000,1.838,5.956',
          '-2.000,2.000,1.555,4.157',
          '2.000,-2.000,1.555,4.157',
          '-6.000,2.000,1.365,5.819',
          '2.000,-6.000,1.365,5.819'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'spine',
    label: 'Spine',
    value: {
      version: 1,
      series: {
        terms: [
          '-7.000,11.000,0.248,5.264',
          '-1.000,5.000,0.729,5.526',
          '5.000,-1.000,0.729,5.526',
          '11.000,-7.000,0.248,5.264',
          '-5.000,7.000,2.041,0.716',
          '-2.000,4.000,1.747,2.561',
          '4.000,-2.000,1.747,2.561',
          '7.000,-5.000,2.041,0.716',
          '-3.000,3.000,1.000,2.063',
          '3.000,-3.000,1.000,2.063',
          '-7.000,5.000,2.041,0.716',
          '-4.000,2.000,1.747,2.561',
          '2.000,-4.000,1.747,2.561',
          '5.000,-7.000,2.041,0.716',
          '-11.000,7.000,0.248,5.264',
          '-5.000,1.000,0.729,5.526',
          '1.000,-5.000,0.729,5.526',
          '7.000,-11.000,0.248,5.264'
        ]
      },
      rotation_order: 6
    }
  },
  {
    id: 'chaotic',
    label: 'Chaotic',
    value: {
      version: 1,
      series: {
        terms: [
          '5.000,-2.000,0.632,5.874',
          '1.000,0.000,1.449,5.409',
          '3.000,-4.000,1.577,2.325',
          '-3.000,-1.000,0.894,4.334'
        ]
      },
      rotation_order: 3
    }
  },
  {
    id: 'crossed_streams',
    label: 'Crossed Streams',
    value: {
      version: 1,
      series: {
        terms: [
          '5.000,1.000,1.366,-1.282',
          '-2.000,6.000,1.836,0.995',
          '1.000,1.000,0.406,-3.290',
          '-1.000,-1.000,0.406,4.861',
          '2.000,-6.000,1.836,0.575',
          '-5.000,-1.000,1.366,2.853'
        ]
      },
      rotation_order: 4
    }
  },
  {
    id: 'stretched_two',
    label: 'Stretched Two',
    value: {
      version: 1,
      series: {
        terms: [
          '0.000,6.000,0.453,5.668',
          '1.000,4.000,0.045,3.630',
          '-3.000,6.000,0.654,1.850',
          '-1.000,2.000,0.077,5.111'
        ]
      },
      rotation_order: 3
    }
  },
  {
    id: 'boomerangs',
    label: 'Boomerangs',
    value: {
      version: 1,
      series: {
        terms: [
          '1.000,3.000,0.502,0.713',
          '4.000,0.000,0.268,2.412',
          '-4.000,0.000,0.268,2.412',
          '-1.000,-3.000,0.502,0.713'
        ]
      },
      rotation_order: 2
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PATTERN_SERIALIZER.deserialize(x.value)
  }
})