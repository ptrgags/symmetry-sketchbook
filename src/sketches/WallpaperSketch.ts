import { FourierSeries2D } from '@/core/FourierSeries2D'
import { Sketch } from '@/core/Sketch'
import { WallpaperShader } from '@/shaders/WallpaperShader'
import type p5 from 'p5'

export interface WallpaperState {
  pattern: FourierSeries2D
}

export class WallpaperSketch extends Sketch<WallpaperState> {
  shader: WallpaperShader

  constructor(state: WallpaperState) {
    super(state)
    this.shader = new WallpaperShader()
  }

  setup(p: p5) {
    const canvas = p.createCanvas(500, 700, p.WEBGL)
    Sketch.show_canvas(canvas.elt)

    this.shader.init(p)
    this.shader.set_coefficients(this.state.pattern)
    this.shader.set_animation([])
    this.shader.set_lattice([1, 0], [0, 1])
    this.shader.disable()
  }

  draw(p: p5) {
    p.background(0, 40, 45)
    this.shader.draw()
  }
}
