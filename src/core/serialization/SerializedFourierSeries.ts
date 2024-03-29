import { FourierSeries, type FourierTuple } from '../curve_symmetry/FourierSeries'
import type { Serializer } from './serialization'
import { CSVSerializer } from './tuples'

export interface SerializedFourierSeries {
  terms: string[]
}

const TUPLE_LENGTH = 3
const DIGITS = 3
const CSV_SERIALIZER = new CSVSerializer(TUPLE_LENGTH, DIGITS)

export class FourierSeriesSerializer implements Serializer<FourierSeries, SerializedFourierSeries> {
  serialize(value: FourierSeries): SerializedFourierSeries {
    const tuple_csv: string[] = value.terms.map((term) => {
      const { frequency, coefficient } = term
      const { r, theta } = coefficient
      return CSV_SERIALIZER.serialize([frequency, r, theta])
    })

    return {
      terms: tuple_csv
    }
  }

  validate(value: any): value is SerializedFourierSeries {
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

  deserialize(serialized: SerializedFourierSeries) {
    const tuples: FourierTuple[] = serialized.terms.map((x) => {
      const [frequency, r, theta] = CSV_SERIALIZER.deserialize(x)
      return [frequency, r, theta]
    })

    return FourierSeries.from_tuples(tuples)
  }
}
