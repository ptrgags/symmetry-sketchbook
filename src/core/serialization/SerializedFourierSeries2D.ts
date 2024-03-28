import { FourierSeries2D, type FourierTuple2D } from '../FourierSeries2D'
import type { Serializer } from './serialization'
import { CSVSerializer } from './tuples'

export interface SerializedFourierSeries2D {
  terms: string[]
}

const TUPLE_LENGTH = 4
const DIGITS = 3
const CSV_SERIALIZER = new CSVSerializer(TUPLE_LENGTH, DIGITS)

export class FourierSeries2DSerializer
  implements Serializer<FourierSeries2D, SerializedFourierSeries2D>
{
  serialize(value: FourierSeries2D): SerializedFourierSeries2D {
    const tuple_csv: string[] = value.terms.map((term) => {
      const { frequencies, coefficient } = term
      const { n, m } = frequencies
      const { r, theta } = coefficient
      return CSV_SERIALIZER.serialize([n, m, r, theta])
    })

    return {
      terms: tuple_csv
    }
  }

  validate(value: any): value is SerializedFourierSeries2D {
    if (!Array.isArray(value.terms)) {
      console.error('terms must be an array')
      return false
    }

    for (const term of value.terms) {
      if (!CSV_SERIALIZER.validate(term)) {
        return false
      }
    }

    return true
  }

  deserialize(serialized: SerializedFourierSeries2D) {
    const tuples: FourierTuple2D[] = serialized.terms.map((x) => {
      const [n, m, r, theta] = CSV_SERIALIZER.deserialize(x)
      return [n, m, r, theta]
    })

    return FourierSeries2D.from_tuples(tuples)
  }
}
