import { FourierSeries2D } from '@/core/FourierSeries2D'
import { Sketch } from '@/core/Sketch'
import { ColorReversingType } from '@/core/wallpaper_symmetry/ColorReversingType'
import { get_lattice } from '@/core/wallpaper_symmetry/WallpaperLattice'
import type { WallpaperSymmetryGroup } from '@/core/wallpaper_symmetry/WallpaperSymmetryGroup'
import { WallpaperShader } from '@/shaders/WallpaperShader'
import type p5 from 'p5'

export interface WallpaperState {
  pattern: FourierSeries2D
  group: WallpaperSymmetryGroup
}

export class WallpaperSketch extends Sketch<WallpaperState> {
  shader: WallpaperShader
  palette?: p5.Graphics

  constructor(state: WallpaperState) {
    super(state)
    this.shader = new WallpaperShader()
  }

  setup(p: p5) {
    const canvas = p.createCanvas(500, 700, p.WEBGL)
    Sketch.show_canvas(canvas.elt)

    this.shader.init(p)
    this.recompute()
    this.shader.disable()
  }

  draw(p: p5) {
    p.background(0, 40, 45)
    this.shader.draw()
  }

  recompute() {
    this.shader.set_coefficients(this.state.pattern)
    const lattice = get_lattice(this.state.group.lattice)
    this.shader.set_lattice(...lattice)

    const color_reversing = this.state.group.color_reversing ?? ColorReversingType.None
    this.shader.set_uniform('color_reversing_type', color_reversing)
  }
}
