import type { WallpaperPattern } from '@/sketches/WallpaperSketch'
import {
  FourierSeries2DSerializer,
  type SerializedFourierSeries2D
} from './SerializedFourierSeries2D'
import type { Serializer } from './serialization'
import {
  COLOR_REVERSING_GROUPS,
  WALLPAPER_GROUPS,
  find_group,
  find_group_id
} from '../wallpaper_symmetry/WallpaperSymmetryGroup'

const SERIES_SERIALIZER = new FourierSeries2DSerializer()

export interface SerializedWallpaperPattern {
  series: SerializedFourierSeries2D
  // Group name like cm or p4
  group: string
}

export class WallpaperPatternSerializer
  implements Serializer<WallpaperPattern, SerializedWallpaperPattern>
{
  serialize(value: WallpaperPattern): SerializedWallpaperPattern {
    return {
      series: SERIES_SERIALIZER.serialize(value.series),
      group: find_group_id(value.group)
    }
  }

  validate(value: any): value is SerializedWallpaperPattern {
    if (!SERIES_SERIALIZER.validate(value.series)) {
      return false
    }

    const is_regular_group = value.group in WALLPAPER_GROUPS
    const is_reversing_group = value.group in COLOR_REVERSING_GROUPS
    if (!is_regular_group && !is_reversing_group) {
      console.error('group must be a valid group ID')
      return false
    }

    return true
  }

  deserialize(serialized: SerializedWallpaperPattern): WallpaperPattern {
    return {
      series: SERIES_SERIALIZER.deserialize(serialized.series),
      group: find_group(serialized.group)
    }
  }
}
