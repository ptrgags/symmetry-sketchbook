import type { PaletteType } from './PaletteType'

export interface ReferenceGeometry {
  // Which coordinate directions are enabled for x, y, r or theta
  xyrt_flags: boolean[]
  // color [r, g, b] in [0, 1] for each component
  color: number[]
  // Line thickness
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
  palette_type: PaletteType
  // The primary color used in every palette
  primary_color: number[]
  // The secondary color for some palettes
  secondary_color: number[]
  // What color to use for points "far away" from the unit disk
  // (either near the origin or near infinity). this color is _multiplied_
  // into the final color.
  far_color: number[]
  // Raise the distancce field to a power to lighten/darken the output
  far_power: number
  // Settings for displaying reference geometry in the shader
  ref_geom: { [prefix in ReferenceGeometryPrefix]: ReferenceGeometry }
}
