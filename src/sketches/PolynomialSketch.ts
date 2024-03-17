import { Color } from '@/core/Color'
import { FourierSeries2D, type SerializedFourierSeries2D } from '@/core/FourierSeries2D'
import { Sketch } from '@/core/Sketch'
import type { SecondaryColorType } from '@/core/point_symmetry/PaletteType'
import { PolynomialShader } from '@/shaders/PolynomialShader'
import p5 from 'p5'

export interface PolynomialPattern {
  series: FourierSeries2D
  rotation_order: number
}

export interface PolynomialState {
  symmetry_mode: 'rosette' | 'frieze'
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
    this.shader.set_coefficients(this.state.pattern.series)
    this.shader.set_uniform('rotation_order', this.state.pattern.rotation_order)
    this.shader.set_uniform('show_palette', false)

    this.set_color('primary', new Color(0.5, 0.0, 1.0))
    this.set_color('secondary', new Color(0.5, 1.0, 0.0))
    this.set_color('far', new Color(0.0, 0.0, 0.0))
    this.shader.set_uniform('far_power', 4)

    this.set_color('pulse', new Color(1, 1, 0))
    this.set_color('input_axes', new Color(1, 1, 1))
    this.set_color('output_axes', new Color(0, 1, 1))
    this.set_color('grid', new Color(0.8, 0.8, 0.8))

    this.set_thickness('pulse', 0.1)
    this.set_thickness('grid', 0.1)
    this.set_thickness('input_axes', 0.1)
    this.set_thickness('output_axes', 0.1)

    this.shader.set_animation([])
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
}
