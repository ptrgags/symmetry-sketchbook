import { describe, test, expect } from 'vitest'
import { compress_base64, uncompress_base64 } from './serialization'

describe('serialization', () => {
  const json = '{"foo": 3, "bar": "hello world"}'
  const compressed = 'H4sIAAAAAAAACqtWSsvPV7JSMNZRUEpKLFKyUlDKSM3JyVcozy/KSVGqBQA4SB0UIAAAAA=='

  test('gzip and base64 string', async () => {
    const base64 = await compress_base64(json)
    expect(base64).toBe(compressed)
  })

  test('un-base64 and gunzip string', async () => {
    const uncompressed = await uncompress_base64(compressed)
    expect(uncompressed).toBe(json)
  })

  test('compress_base64 and uncompress_base64 are inverses', async () => {
    const compress_uncompress = await uncompress_base64(await compress_base64(json))
    expect(compress_uncompress).toBe(json)

    const uncompress_compress = await compress_base64(await uncompress_base64(compressed))
    expect(uncompress_compress).toBe(compressed)
  })
})
