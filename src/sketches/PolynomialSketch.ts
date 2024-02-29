import { FourierSeries2D } from '@/core/FourierSeries2D'
import { Sketch } from '@/core/Sketch'
import { PolynomialShader } from '@/shaders/PolynomialShader'
import p5 from 'p5'

export interface PolynomialState {
  symmetry_mode: 'rosette' | 'frieze'
  pattern: FourierSeries2D
  rotation_order: number
}

function color_to_vec3(color_str: string): number[] {
  // parse #rrggbb -> [0, 255]^3 -> [0.0, 1.0]^3
  const parts = [0, 1, 2].map((x) => color_str.substring(1 + 2 * x, 1 + 2 * (x + 1)))
  const rgb_u8 = parts.map((str) => parseInt(str, 16))
  const rgb_f32 = rgb_u8.map((val) => val / 255.0)
  return rgb_f32
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
    this.shader.set_uniform('monochrome', color_to_vec3('#9661ff'))
    this.shader.set_uniform('cosine_colors', [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0])
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
    this.shader.disable()
  }

  set show_palette(value: boolean) {
    this.shader.set_uniform('show_palette', value)
  }

  set primary_color(value: string) {
    this.shader.set_uniform('primary_color', color_to_vec3(value))
  }

  set secondary_color(value: string) {
    this.shader.set_uniform('primary_color', color_to_vec3(value))
  }

  set pulse_color(value: string) {
    this.shader.set_uniform('pulse_color', color_to_vec3(value))
  }

  set grid_color(value: string) {
    this.shader.set_uniform('grid_color', color_to_vec3(value))
  }

  set cosine_palette(value: string[]) {
    const components = value.flatMap(color_to_vec3)
    this.shader.set_uniform('cosine_colors', components)
  }

  set rotation_order(value: number) {
    // When the rotation order is 1, we only have mirrors and inversions.
    // This looks better with more sectors, so set it to 4
    const order = value >= 2 ? value : 4

    this.shader.set_uniform('rotation_order', order)
  }
}
