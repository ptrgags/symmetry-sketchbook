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

  constructor(state: WallpaperState) {
    super(state)
    this.shader = new WallpaperShader()
  }

  setup(p: p5) {
    const canvas = p.createCanvas(500, 700, p.WEBGL)
    Sketch.show_canvas(canvas.elt)

    p.textureMode(p.NORMAL)

    this.update_palette([
      [1, 0, 0],
      [1, 1, 0]
    ])

    this.shader.init(p)
    this.recompute()
    this.shader.disable()
  }

  draw(p: p5) {
    p.background(0, 40, 45)
    this.shader.draw()
  }

  set show_palette(value: boolean) {
    this.shader.set_uniform('show_palette', value)
  }

  update_palette(colors: number[][]) {
    if (!this.sketch) {
      return
    }

    const flattened = colors.flat()
    const remaining = Math.max(3 * 12 - flattened.length, 0)
    const padding = new Array(remaining).fill(0.0)
    const values = [...flattened, ...padding]
    this.shader.set_uniform('palette_colors', values)
    this.shader.set_uniform('color_count', colors.length)

    /*
    const img = this.sketch.createImage(colors.length, 1)
    img.loadPixels()
    for (const [index, color] of colors.entries()) {
      const [r, g, b] = color
      const c = this.sketch.color(255 * r, 255 * g, 255 * b)
      img.set(index, 0, c)
    }
    console.log(img.pixels)
    img.updatePixels()

    this.shader.set_uniform('tex_palette', img)
    */
  }

  set palette_colors(value: number[][]) {
    this.update_palette(value)
  }

  recompute() {
    this.shader.set_coefficients(this.state.pattern)
    const lattice = get_lattice(this.state.group.lattice)
    this.shader.set_lattice(...lattice)

    const color_reversing = this.state.group.color_reversing ?? ColorReversingType.None
    this.shader.set_uniform('color_reversing_type', color_reversing)
  }
}
