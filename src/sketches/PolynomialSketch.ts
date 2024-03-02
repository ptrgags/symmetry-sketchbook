import { FourierSeries2D } from '@/core/FourierSeries2D'
import { Sketch } from '@/core/Sketch'
import type { SecondaryColorType } from '@/core/point_symmetry/PaletteType'
import { PolynomialShader } from '@/shaders/PolynomialShader'
import p5 from 'p5'

export interface PolynomialState {
  symmetry_mode: 'rosette' | 'frieze'
  pattern: FourierSeries2D
  rotation_order: number
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
    this.shader.set_coefficients(this.state.pattern)
    this.shader.set_uniform('rotation_order', this.state.rotation_order)

    this.set_color('primary', [0.5, 0.0, 1.0])
    this.set_color('secondary', [0.5, 1.0, 0.0])
    this.set_color('far', [0.0, 0.0, 0.0])
    this.shader.set_uniform('far_power', 4)

    this.set_color('pulse', [1, 1, 0])
    this.set_color('input_axes', [1, 1, 1])
    this.set_color('output_axes', [0, 1, 1])
    this.set_color('grid', [0.8, 0.8, 0.8])

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

  recompute() {
    this.shader.set_coefficients(this.state.pattern)
  }

  set show_palette(value: boolean) {
    this.shader.set_uniform('show_palette', value)
  }

  set_color(prefix: string, value: number[]) {
    this.shader.set_uniform(`${prefix}_color`, value)
  }

  set_xyrt_flags(prefix: string, value: boolean[]) {
    this.shader.set_uniform(`${prefix}_xyrt`, value.map(Number))
  }

  set_thickness(prefix: string, value: number) {
    this.shader.set_uniform(`${prefix}_thickness`, value)
  }

  set rotation_order(value: number) {
    // When the rotation order is 1, we only have mirrors and inversions.
    // This looks better with more sectors, so set it to 4
    const order = value >= 2 ? value : 4

    this.shader.set_uniform('rotation_order', order)
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
