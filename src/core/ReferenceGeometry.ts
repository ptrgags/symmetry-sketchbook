import { Color } from './Color'

export interface ReferenceGeometry {
  // Which coordinate directions are enabled for x, y, r or theta
  xyrt_flags: boolean[]
  // color [r, g, b] in [0, 1] for each component
  color: Color
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

export type ReferenceGeometryCollection = { [prefix in ReferenceGeometryPrefix]: ReferenceGeometry }

// Implemented as a function because the UI may modify members at runtime
export function default_ref_geom(): ReferenceGeometryCollection {
  return {
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
  } as const
}
