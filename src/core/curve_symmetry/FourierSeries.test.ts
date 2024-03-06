import { describe, test, expect } from 'vitest'
import { FourierSeries, SerializedFourierSeries } from './FourierSeries'
import { ComplexPolar } from '../Complex'

describe('FourierSeries serialization', () => {
  test('to_json works', () => {
    const series = FourierSeries.from_tuples([
      [1, 1, 0],
      [3, 0.5, 0.1]
    ])

    const json = series.to_json()
    expect(JSON.parse(json)).toStrictEqual({
      version: 1,
      terms: [
        [1, 1, 0],
        [3, 0.5, 0.1]
      ]
    })
  })

  test('from_json returns undefined for bad input', () => {
    expect(FourierSeries.from_json('not json')).not.toBeDefined()
    expect(FourierSeries.from_json('[1, 2, 3]')).not.toBeDefined()
    expect(FourierSeries.from_json('{}')).not.toBeDefined()
    expect(FourierSeries.from_json('{"version": 2}')).not.toBeDefined()
    expect(FourierSeries.from_json('{"version": 2, "terms": [["foo"]]}')).not.toBeDefined()
    expect(FourierSeries.from_json('{"version": 2, "terms": [[1, 2, 3], 3]}')).not.toBeDefined()
    expect(FourierSeries.from_json('{"version": 2, "terms": [[1, 2, 3, 4]]}')).not.toBeDefined()
  })

  test('deserializes', () => {
    const series: SerializedFourierSeries = {
      version: 1,
      terms: [
        [1, 1, 0],
        [2, 0.5, 0]
      ]
    }

    const unserialized = FourierSeries.from_json(JSON.stringify(series))
    expect(unserialized).toBeDefined()
    expect(unserialized!.terms).toStrictEqual([
      { frequency: 1, coefficient: new ComplexPolar(1, 0) },
      { frequency: 2, coefficient: new ComplexPolar(0.5, 0) }
    ])
  })
})
