import { Color } from '../Color'
import { PALETTE_TYPES } from '../point_symmetry/PaletteType'
import {
  ReferenceGeometryPrefix,
  type PointSymmetryPalette,
  type ReferenceGeometry
} from '../point_symmetry/PointSymmetryPalette'
import { is_hex_string, is_number, is_object } from '../validation'
import type { Serializer } from './serialization'

export interface SerializedReferenceGeometry {
  xyrt_flags: boolean[]
  // Store the color as a hex string rather than an array of number
  color: string
  thickness: number
}

class RefGeometrySerializer implements Serializer<ReferenceGeometry, SerializedReferenceGeometry> {
  serialize(value: ReferenceGeometry): SerializedReferenceGeometry {
    return {
      xyrt_flags: value.xyrt_flags,
      // Pack the color as a hex string since that's usually shorter in JSON
      color: value.color.to_hex(),
      thickness: value.thickness
    }
  }

  validate(value: any): value is SerializedReferenceGeometry {
    if (
      !Array.isArray(value.xyrt_flags) ||
      value.xyrt_flags.length !== 4 ||
      value.xyrt_flags.some((x: any) => typeof x !== 'boolean')
    ) {
      console.error('xyrt_flags must be an an array of 4 booleans')
      return false
    }

    if (!is_hex_string(value.color, 'color')) {
      return false
    }

    if (!is_number(value.thickness, 'thickness')) {
      return false
    }

    return true
  }

  deserialize(serialized: SerializedReferenceGeometry): ReferenceGeometry {
    return {
      xyrt_flags: serialized.xyrt_flags,
      color: Color.from_hex(serialized.color),
      thickness: serialized.thickness
    }
  }
}

type ReferenceGeometrySettings = {
  [prefix in ReferenceGeometryPrefix]: SerializedReferenceGeometry
}

export interface SerializedPointSymmetryPalette {
  palette_type: string
  // The primary color used in every palette
  primary_color: string
  // The secondary color for some palettes
  secondary_color: string
  // What color to use for points "far away" from the unit disk
  // (either near the origin or near infinity). this color is _multiplied_
  // into the final color.
  far_color: string
  // Raise the distancce field to a power to lighten/darken the output
  far_power: number
  // Settings for displaying reference geometry in the shader
  ref_geom: ReferenceGeometrySettings
}

export class PointSymmetryPaletteSerializer
  implements Serializer<PointSymmetryPalette, SerializedPointSymmetryPalette>
{
  serialize(value: PointSymmetryPalette): SerializedPointSymmetryPalette {
    const geom_seriailzer = new RefGeometrySerializer()

    const serialized_geom: ReferenceGeometrySettings = {
      input_axes: geom_seriailzer.serialize(value.ref_geom.input_axes),
      output_axes: geom_seriailzer.serialize(value.ref_geom.output_axes),
      pulse: geom_seriailzer.serialize(value.ref_geom.pulse),
      grid: geom_seriailzer.serialize(value.ref_geom.grid)
    }

    return {
      palette_type: value.palette_type.id,
      primary_color: value.primary_color.to_hex(),
      secondary_color: value.secondary_color.to_hex(),
      far_color: value.far_color.to_hex(),
      far_power: value.far_power,
      ref_geom: serialized_geom
    }
  }

  validate(value: any): value is SerializedPointSymmetryPalette {
    const palette_type = PALETTE_TYPES.find((x) => x.id === value.palette_type)
    if (!palette_type) {
      const valid_values = PALETTE_TYPES.map((x) => x.id)
      console.error(`invalid palette_type, valid values are: [${valid_values.join(', ')}]`)
      return false
    }

    if (!is_hex_string(value.primary_color, 'primary_color')) {
      return false
    }
    if (!is_hex_string(value.secondary_color, 'primary_color')) {
      return false
    }
    if (!is_hex_string(value.far_color, 'far_color')) {
      return false
    }
    if (!is_number(value.far_power, 'far_power')) {
      return false
    }

    if (!is_object(value.ref_geom, 'ref_geom')) {
      return false
    }

    // Make sure we have one of each type of reference geometry struct
    const valid_prefixes: string[] = Object.values(ReferenceGeometryPrefix).sort()
    const prefixes = Object.keys(value.ref_geom).sort()
    const different = valid_prefixes.some((x, i) => x !== prefixes[i])
    if (different) {
      console.error(`ref_geom must have keys [${valid_prefixes.join(', ')}]`)
      return false
    }

    const geom_validator = new RefGeometrySerializer()
    for (const [key, geom] of Object.entries(value.ref_geom)) {
      // The key has already been validated above

      // Validate the structure of the reference geometry
      if (!geom_validator.validate(geom)) {
        console.error(`invalid reference geometry: ${key}`)
        return false
      }
    }

    return true
  }

  deserialize(serialized: SerializedPointSymmetryPalette): PointSymmetryPalette {
    const geom_serializer = new RefGeometrySerializer()

    const packed_ref_geom = serialized.ref_geom
    const ref_geom: { [prefix in ReferenceGeometryPrefix]: ReferenceGeometry } = {
      input_axes: geom_serializer.deserialize(packed_ref_geom.input_axes),
      output_axes: geom_serializer.deserialize(packed_ref_geom.output_axes),
      pulse: geom_serializer.deserialize(packed_ref_geom.pulse),
      grid: geom_serializer.deserialize(packed_ref_geom.grid)
    }

    return {
      palette_type: PALETTE_TYPES.find((x) => x.id === serialized.palette_type) ?? PALETTE_TYPES[0],
      primary_color: Color.from_hex(serialized.primary_color),
      secondary_color: Color.from_hex(serialized.secondary_color),
      far_color: Color.from_hex(serialized.far_color),
      far_power: serialized.far_power,
      ref_geom
    }
  }
}
