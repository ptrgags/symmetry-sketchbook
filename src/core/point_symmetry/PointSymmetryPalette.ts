import { Color } from '../Color'
import { PALETTE_TYPES, type PaletteType } from './PaletteType'

export interface ReferenceGeometry {
  // Which coordinate directions are enabled for x, y, r or theta
  xyrt_flags: boolean[]
  // color [r, g, b] in [0, 1] for each component
  color: Color
  // Line thickness
  thickness: number
}

export interface SerializedReferenceGeometry {
  xyrt_flags: boolean[]
  // Store the hex string rather than numbers as it will be more compact
  // in the JSON
  color: string
  thickness: number
}

export enum ReferenceGeometryPrefix {
  // Axes in the input space. Doesn't look fancy, but it helps get your bearings
  InputAxes = 'input_axes',
  // Axes in the output (palette) space. This gets warped by the polynomial
  OutputAxes = 'output_axes',
  // Pulses in one or more of the coordinate dimensions
  Pulse = 'pulse',
  // Grid lines in the input space that get warped by the polynomial
  Grid = 'grid'
}

export interface PointSymmetryPalette {
  // The primary and secondary color can be applied a few different ways,
  // so this selects between them
  palette_type: PaletteType
  // The primary color used in every palette
  primary_color: Color
  // The secondary color for some palettes
  secondary_color: Color
  // What color to use for points "far away" from the unit disk
  // (either near the origin or near infinity). this color is _multiplied_
  // into the final color.
  far_color: Color
  // Raise the distancce field to a power to lighten/darken the output
  far_power: number
  // Settings for displaying reference geometry in the shader
  ref_geom: { [prefix in ReferenceGeometryPrefix]: ReferenceGeometry }
}

export const DEFAULT_PALETTE: PointSymmetryPalette = {
  palette_type: PALETTE_TYPES[0],
  primary_color: new Color(0.5, 0.0, 1.0),
  secondary_color: new Color(0.5, 1.0, 0.0),
  far_color: new Color(0.0, 0.0, 0.0),
  far_power: 4,
  ref_geom: {
    input_axes: {
      xyrt_flags: [false, false, false, false],
      color: new Color(1, 1, 1),
      thickness: 0.01
    },
    output_axes: {
      xyrt_flags: [false, false, false, false],
      color: new Color(0, 1, 1),
      thickness: 0.1
    },
    pulse: {
      xyrt_flags: [false, false, false, false],
      color: new Color(1, 1, 0),
      thickness: 0.1
    },
    grid: {
      xyrt_flags: [false, false, false, false],
      color: new Color(1, 1, 1),
      thickness: 0.1
    }
  }
} as const
