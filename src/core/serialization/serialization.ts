import { compress_base64, uncompress_base64 } from './gzip_base64'

/**
 * Interface for a class that can serialize a type to a packed representation
 */
export interface Serializer<Value, Serialized> {
  /**
   * Serialize a value into a type that's more compact when JSON-ified.
   * @param value The original object
   * @returns The packed representation of this object
   */
  serialize(value: Value): Serialized
  /**
   * Given an arbitrary JSON object, check that it matches the schema of
   * the serialized type.
   * @param value The JSON object of unknown shape
   */
  validate(value: any): value is Serialized
  /**
   * Given a valid, serialized representation, unpack it to the real type
   * @param serialized The serialized value
   * @returns the unpacked value
   */
  deserialize(serialized: Serialized): Value
}

export function to_json<Value, Serialized>(
  value: Value,
  serializer: Serializer<Value, Serialized>
): string {
  const serialized = serializer.serialize(value)
  const with_version = {
    // I don't know if I'll ever make a second version, so hardcoding this
    // to 1 for now.
    version: 1,
    ...serialized
  }
  return JSON.stringify(with_version)
}

export async function to_compressed_json<Value, Serialized>(
  value: Value,
  serializer: Serializer<Value, Serialized>
) {
  const json = to_json(value, serializer)
  return await compress_base64(json)
}

export function from_json<Value, Serialized>(
  value: string,
  serializer: Serializer<Value, Serialized>
): Value | undefined {
  let parsed
  try {
    parsed = JSON.parse(value)
  } catch (e) {
    console.error(`Could not parse JSON: ${e}`)
    return undefined
  }

  // Right now, all the versions are 1. If that ever changes, consider
  // making the parameters have a dictionary of version number to serializer
  if (parsed.version !== 1) {
    console.error(`version ${parsed.version} is not allowed! Version must be 1]`)
    return undefined
  }

  if (!serializer.validate(parsed)) {
    // Errors will already be logged by the validation function
    return undefined
  }

  const deserialized = serializer.deserialize(parsed)
  // Log the deserialized values at info level so I can copy the values whenever I
  // want to make new presets
  console.info(deserialized)
  return deserialized
}

export async function from_compressed_json<Value, Serialized>(
  compressed: string,
  serializer: Serializer<Value, Serialized>
): Promise<Value | undefined> {
  const json = await uncompress_base64(compressed)
  return from_json(json, serializer)
}
