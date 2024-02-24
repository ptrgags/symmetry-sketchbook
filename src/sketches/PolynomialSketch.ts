import { DEFAULT_COEFFICIENTS } from '@/core/FourierSeries2D'
import { Sketch } from '@/core/Sketch'
import { PolynomialShader } from '@/shaders/PolynomialShader'
import p5 from 'p5'

export interface PolynomialState {
  symmetry_mode: 'rosette' | 'frieze'
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
    this.shader.set_coefficients(DEFAULT_COEFFICIENTS)
    this.shader.set_animation([])
    this.shader.disable()
  }

  draw(p: p5) {
    p.background(0, 40, 45)
    this.shader.draw()
    this.shader.disable()
  }
}
