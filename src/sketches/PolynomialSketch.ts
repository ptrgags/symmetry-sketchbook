import { Color } from '@/core/Color'
import { FourierSeries2D, type SerializedFourierSeries2D } from '@/core/FourierSeries2D'
import { Sketch } from '@/core/Sketch'
import type { SecondaryColorType } from '@/core/point_symmetry/PaletteType'
import {
  ReferenceGeometryPrefix,
  type PointSymmetryPalette
} from '@/core/point_symmetry/PointSymmetryPalette'
import { PolynomialShader } from '@/shaders/PolynomialShader'
import p5 from 'p5'

export interface PolynomialPattern {
  series: FourierSeries2D
  rotation_order: number
}

export interface PolynomialState {
  symmetry_mode: 'rosette' | 'frieze'
  palette: PointSymmetryPalette
  pattern: PolynomialPattern
}

export class PolynomialSketch extends Sketch<PolynomialState> {
  shader: PolynomialShader

  constructor(state: PolynomialState) {
    super(state)
    this.shader = new PolynomialShader(state.symmetry_mode)
  }

  setup(p: p5) {
    const canvas = p.createCanvas(500, 700, p.WEBGL)
    Sketch.show_canvas(canvas.elt)

    this.shader.init(p)
    this.shader.set_uniform('show_palette', false)

    // Setting these properties updates the uniforms
    this.pattern = this.state.pattern
    this.palette = this.state.palette

    this.shader.disable()
  }

  draw(p: p5) {
    p.background(0, 40, 45)
    this.shader.draw()
    this.shader.disable()
  }

  mouse_moved(p: p5) {
    const mouse_uv: [number, number] = [p.mouseX / p.width, 1.0 - p.mouseY / p.height]
    this.shader.set_mouse_uv(mouse_uv)

    return false
  }

  set pattern(value: PolynomialPattern) {
    this.state.pattern = value
    this.shader.set_coefficients(value.series)
    this.shader.set_uniform('rotation_order', value.rotation_order)
  }

  set show_palette(value: boolean) {
    this.shader.set_uniform('show_palette', value)
  }

  set_color(prefix: string, value: Color) {
    this.shader.set_uniform(`${prefix}_color`, value.to_vec3())
  }

  set_xyrt_flags(prefix: string, value: boolean[]) {
    this.shader.set_uniform(`${prefix}_xyrt`, value.map(Number))
  }

  set_thickness(prefix: string, value: number) {
    this.shader.set_uniform(`${prefix}_thickness`, value)
  }

  set invert_palette(value: boolean) {
    this.shader.set_uniform('invert_palette', value)
  }

  set secondary_color_mode(value: SecondaryColorType) {
    this.shader.set_uniform('secondary_color_mode', value)
  }

  set far_power(value: number) {
    this.shader.set_uniform('far_power', value)
  }

  set palette(value: PointSymmetryPalette) {
    this.state.palette = value
    this.set_color('primary', value.primary_color)
    this.set_color('secondary', value.secondary_color)
    this.set_color('far', value.far_color)

    this.invert_palette = value.palette_type.invert
    this.secondary_color_mode = value.palette_type.secondary_color
    this.far_power = value.far_power

    for (const prefix of Object.values(ReferenceGeometryPrefix)) {
      const ref_geom = value.ref_geom[prefix]
      this.set_xyrt_flags(prefix, ref_geom.xyrt_flags)
      this.set_color(prefix, ref_geom.color)
      this.set_thickness(prefix, ref_geom.thickness)
    }
  }
}
