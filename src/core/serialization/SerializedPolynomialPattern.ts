import type { PolynomialPattern } from '@/sketches/PolynomialSketch'
import {
  FourierSeries2DSerializer,
  type SerializedFourierSeries2D
} from './SerializedFourierSeries2D'
import type { Serializer } from './serialization'
import { is_number } from '../validation'

const SERIES_SERIALIZER = new FourierSeries2DSerializer()

export interface SerializedPolynomialPattern {
  series: SerializedFourierSeries2D
  rotation_order: number
}

export class PolynomialPatternSerializer
  implements Serializer<PolynomialPattern, SerializedPolynomialPattern>
{
  serialize(value: PolynomialPattern): SerializedPolynomialPattern {
    return {
      series: SERIES_SERIALIZER.serialize(value.series),
      rotation_order: value.rotation_order
    }
  }

  validate(value: any): value is SerializedPolynomialPattern {
    if (!is_number(value.rotation_order, 'rotation_order')) {
      return false
    }

    if (!SERIES_SERIALIZER.validate(value.series)) {
      return false
    }

    return true
  }

  deserialize(serialized: SerializedPolynomialPattern): PolynomialPattern {
    return {
      series: SERIES_SERIALIZER.deserialize(serialized.series),
      rotation_order: serialized.rotation_order
    }
  }
}
