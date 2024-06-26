import type { DropdownOption } from '@/core/DropdownOption'
import { WallpaperPatternSerializer } from '@/core/serialization/SerializedWallpaperPattern'
import type { WallpaperPattern } from '@/sketches/WallpaperSketch'

const PATTERN_SERIALIZER = new WallpaperPatternSerializer()

export const WALLPAPER_PATTERNS: DropdownOption<WallpaperPattern>[] = [
  {
    id: 'butterflies',
    label: 'Butterflies',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,2.000,-0.346,2.565',
          '1.000,2.000,0.346,2.565',
          '-2.000,1.000,1.000,5.896',
          '2.000,1.000,-1.000,5.896',
          '0.000,0.000,0.958,3.742',
          '-2.000,-1.000,-1.000,5.896',
          '2.000,-1.000,1.000,5.896',
          '-1.000,-2.000,0.346,2.565',
          '1.000,-2.000,-0.346,2.565'
        ]
      },
      group: 'pgg'
    }
  },
  {
    id: 'throwback_2017',
    label: 'Throwback to 2017',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,2.000,0.636,5.642',
          '0.000,1.000,0.355,5.907',
          '-1.000,0.000,0.355,5.907',
          '-1.000,-1.000,0.636,5.642',
          '1.000,-1.000,0.355,5.907',
          '2.000,-1.000,0.636,5.642'
        ]
      },
      group: 'p3'
    }
  },
  {
    id: 'circles_triangles',
    label: 'Circles and Triangles',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,3.000,0.315,5.209',
          '-3.000,2.000,0.315,5.209',
          '-1.000,2.000,0.680,5.397',
          '-2.000,1.000,0.680,5.397',
          '1.000,1.000,0.680,5.397',
          '2.000,1.000,0.315,5.209',
          '-2.000,-1.000,0.315,5.209',
          '-1.000,-1.000,0.680,5.397',
          '2.000,-1.000,0.680,5.397',
          '1.000,-2.000,0.680,5.397',
          '3.000,-2.000,0.315,5.209',
          '1.000,-3.000,0.315,5.209'
        ]
      },
      group: 'p6'
    }
  },
  {
    id: 'wavy',
    label: 'Wavy',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,1.000,0.287,4.282',
          '0.000,1.000,0.648,1.141',
          '0.000,-1.000,0.648,1.141',
          '1.000,-1.000,0.287,4.282'
        ]
      },
      group: 'p2'
    }
  },
  {
    id: 'bubble_grid',
    label: 'Bubble Grid',
    value: {
      version: 1,
      series: {
        terms: [
          '-2.000,2.000,1.000,4.896',
          '2.000,2.000,1.000,4.896',
          '0.000,1.000,-1.095,5.348',
          '-1.000,0.000,-0.923,2.157',
          '1.000,0.000,-0.923,2.157',
          '0.000,-1.000,-1.095,5.348',
          '-2.000,-2.000,1.000,4.896',
          '2.000,-2.000,1.000,4.896'
        ]
      },
      group: 'pgg'
    }
  },
  {
    id: 'cursed_frog',
    label: 'Cursed Frog',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,2.000,1.221,5.416',
          '1.000,2.000,1.000,1.710',
          '2.000,1.000,1.000,1.710',
          '2.000,-1.000,1.221,5.416'
        ]
      },
      group: 'cm'
    }
  },
  {
    id: 'interconnected',
    label: 'Interconnected',
    value: {
      version: 1,
      series: {
        terms: [
          '-3.000,3.000,0.465,5.079',
          '0.000,3.000,0.465,5.079',
          '-2.000,2.000,0.402,3.998',
          '0.000,2.000,0.402,3.998',
          '-1.000,1.000,0.441,3.325',
          '0.000,1.000,0.441,3.325',
          '-3.000,0.000,0.465,5.079',
          '-2.000,0.000,0.402,3.998',
          '-1.000,0.000,0.441,3.325',
          '1.000,0.000,0.441,3.325',
          '2.000,0.000,0.402,3.998',
          '3.000,0.000,0.465,5.079',
          '0.000,-1.000,0.441,3.325',
          '1.000,-1.000,0.441,3.325',
          '0.000,-2.000,0.402,3.998',
          '2.000,-2.000,0.402,3.998',
          '0.000,-3.000,0.465,5.079',
          '3.000,-3.000,0.465,5.079'
        ]
      },
      group: 'p31m'
    }
  },
  {
    id: 'diamond_blobs',
    label: 'Diamond Blobs',
    value: {
      version: 1,
      series: {
        terms: [
          '0.000,1.000,0.478,2.690',
          '-1.000,0.000,0.341,5.537',
          '1.000,0.000,0.341,5.537',
          '0.000,-1.000,0.478,2.690'
        ]
      },
      group: 'p2'
    }
  },
  {
    id: 'sinusoidal',
    label: 'Sinusoidal',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,1.000,0.740,6.173',
          '1.000,1.000,-0.740,6.173',
          '-1.000,0.000,-1.000,3.103',
          '1.000,0.000,-1.000,3.103',
          '-1.000,-1.000,-0.740,6.173',
          '1.000,-1.000,0.740,6.173'
        ]
      },
      group: 'pmg'
    }
  },
  {
    id: 'masquerade',
    label: 'Masquerade',
    value: {
      version: 1,
      series: {
        terms: [
          '1.000,2.000,0.822,0.372',
          '-2.000,1.000,-0.822,0.372',
          '2.000,1.000,-0.822,0.372',
          '1.000,-2.000,0.822,0.372'
        ]
      },
      group: 'p4m_pmm'
    }
  },
  {
    id: 'scales',
    label: 'Scales',
    value: {
      version: 1,
      series: {
        terms: [
          '-2.000,2.000,-0.435,5.878',
          '2.000,2.000,-0.435,5.878',
          '-2.000,1.000,-0.178,0.455',
          '-1.000,1.000,-0.516,2.768',
          '1.000,1.000,-0.516,2.768',
          '2.000,1.000,-0.178,0.455',
          '-2.000,-1.000,0.178,0.455',
          '-1.000,-1.000,0.516,2.768',
          '1.000,-1.000,0.516,2.768',
          '2.000,-1.000,0.178,0.455',
          '-2.000,-2.000,0.435,5.878',
          '2.000,-2.000,0.435,5.878'
        ]
      },
      group: 'pmm_pm'
    }
  },
  {
    id: 'rolling_hills',
    label: 'Rolling Hills',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,-1.000,1.000,0.784',
          '1.000,-1.000,1.000,0.784',
          '-2.000,-2.000,-1.000,0.258',
          '-1.000,-2.000,-0.664,0.998',
          '1.000,-2.000,0.664,0.998',
          '2.000,-2.000,1.000,0.258'
        ]
      },
      group: 'pg_p1'
    }
  },
  {
    id: 'busy_kitchen',
    label: 'Busy Kitchen',
    value: {
      version: 1,
      series: {
        terms: [
          '-2.000,3.000,0.137,1.387',
          '-1.000,3.000,0.091,0.645',
          '1.000,3.000,-0.091,0.645',
          '2.000,3.000,-0.137,1.387',
          '-3.000,2.000,-0.137,1.387',
          '-1.000,2.000,0.191,0.579',
          '1.000,2.000,-0.191,0.579',
          '3.000,2.000,0.137,1.387',
          '-3.000,1.000,-0.091,0.645',
          '-2.000,1.000,-0.191,0.579',
          '2.000,1.000,0.191,0.579',
          '3.000,1.000,0.091,0.645',
          '-3.000,-1.000,0.091,0.645',
          '-2.000,-1.000,0.191,0.579',
          '2.000,-1.000,-0.191,0.579',
          '3.000,-1.000,-0.091,0.645',
          '-3.000,-2.000,0.137,1.387',
          '-1.000,-2.000,-0.191,0.579',
          '1.000,-2.000,0.191,0.579',
          '3.000,-2.000,-0.137,1.387',
          '-2.000,-3.000,-0.137,1.387',
          '-1.000,-3.000,-0.091,0.645',
          '1.000,-3.000,0.091,0.645',
          '2.000,-3.000,0.137,1.387'
        ]
      },
      group: 'p4m_p4'
    }
  },
  {
    id: 'superposition',
    label: 'Superposition',
    value: {
      version: 1,
      series: {
        terms: [
          '-2.000,2.000,-0.367,5.684',
          '-1.000,2.000,-0.534,3.786',
          '0.000,2.000,0.367,5.684',
          '-2.000,1.000,0.534,3.786',
          '1.000,1.000,0.534,3.786',
          '-2.000,0.000,0.367,5.684',
          '2.000,0.000,-0.367,5.684',
          '-1.000,-1.000,-0.534,3.786',
          '2.000,-1.000,-0.534,3.786',
          '0.000,-2.000,-0.367,5.684',
          '1.000,-2.000,0.534,3.786',
          '2.000,-2.000,0.367,5.684'
        ]
      },
      group: 'p6_p3'
    }
  },
  {
    id: 'bendy_straws',
    label: 'Bendy Straws',
    value: {
      version: 1,
      series: {
        terms: [
          '-3.000,2.000,0.137,1.037',
          '-1.000,2.000,0.744,5.487',
          '1.000,2.000,0.744,5.487',
          '3.000,2.000,0.137,1.037',
          '-2.000,1.000,1.072,0.977',
          '2.000,1.000,-1.072,0.977',
          '-2.000,-1.000,-1.072,0.977',
          '2.000,-1.000,1.072,0.977',
          '-3.000,-2.000,0.137,1.037',
          '-1.000,-2.000,0.744,5.487',
          '1.000,-2.000,0.744,5.487',
          '3.000,-2.000,0.137,1.037'
        ]
      },
      group: 'cmm_pmg'
    }
  },
  {
    id: 'blobs',
    label: 'Blobs',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,2.000,0.214,3.434',
          '1.000,2.000,-0.214,3.434',
          '-2.000,1.000,0.447,0.485',
          '2.000,1.000,0.447,0.485',
          '-1.000,-1.000,0.838,5.245',
          '1.000,-1.000,0.838,5.245'
        ]
      },
      group: 'pg_p1'
    }
  },
  {
    id: 'bowties',
    label: 'Bowties',
    value: {
      version: 1,
      series: {
        terms: [
          '-1.000,2.000,0.346,0.936',
          '1.000,2.000,0.279,1.843',
          '-2.000,1.000,0.346,0.936',
          '2.000,1.000,0.279,1.843',
          '-2.000,-1.000,0.279,1.843',
          '2.000,-1.000,0.346,0.936',
          '-1.000,-2.000,0.279,1.843',
          '1.000,-2.000,0.346,0.936'
        ]
      },
      group: 'pmm_cmm'
    }
  },
  {
    id: 'ooze',
    label: 'Ooze',
    value: {
      version: 1,
      series: {
        terms: [
          '0.000,3.000,-0.372,3.921',
          '-2.000,2.000,-0.472,0.342',
          '0.000,2.000,-0.477,0.850',
          '-1.000,1.000,-0.806,6.119',
          '2.000,1.000,-0.045,6.246',
          '-2.000,-1.000,0.045,6.246',
          '1.000,-1.000,0.806,6.119',
          '0.000,-2.000,0.477,0.850',
          '2.000,-2.000,0.472,0.342',
          '0.000,-3.000,0.372,3.921'
        ]
      },
      group: 'p2_p1'
    }
  }
].map((x) => {
  return {
    id: x.id,
    label: x.label,
    value: PATTERN_SERIALIZER.deserialize(x.value)
  }
})
