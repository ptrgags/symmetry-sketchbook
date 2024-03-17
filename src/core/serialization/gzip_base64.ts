/*
 * Utilities for gzip compressing + base64 encoding
 * Based on
 *
 * - https://gist.github.com/Explosion-Scratch/357c2eebd8254f8ea5548b0e6ac7a61b
 * - https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
 */

export async function compress_base64(data: string): Promise<string> {
  // Encode as UTF-8 bytes
  const encoder = new TextEncoder()
  const bytes = encoder.encode(data)

  // Apply gzip compression
  const gzip = new CompressionStream('gzip')
  const writer = gzip.writable.getWriter()
  writer.write(bytes)
  writer.close()
  const compressed_bytes = await new Response(gzip.readable).arrayBuffer()

  // Create of string of single-byte values
  const compressed_u8 = new Uint8Array(compressed_bytes)
  const bin_string = Array.from(compressed_u8, (byte) => String.fromCodePoint(byte)).join('')

  // Finally, base64 encode
  return btoa(bin_string)
}

export async function uncompress_base64(base64: string): Promise<string> {
  // Undo the base64 encoding
  const bin_string = atob(base64)
  const byte_values = bin_string.split('').map((x) => x.codePointAt(0) ?? 0)
  const compressed_bytes = new Uint8Array(byte_values)

  const gunzip = new DecompressionStream('gzip')
  const writer = gunzip.writable.getWriter()
  writer.write(compressed_bytes)
  writer.close()

  const uncompressed_buffer = await new Response(gunzip.readable).arrayBuffer()

  const decoder = new TextDecoder()
  return decoder.decode(uncompressed_buffer)
}
