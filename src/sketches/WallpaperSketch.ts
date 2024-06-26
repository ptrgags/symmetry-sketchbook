import type { Color } from '@/core/Color'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import type { ReferenceGeometryCollection } from '@/core/ReferenceGeometry'
import { Sketch } from '@/core/Sketch'
import { ColorReversingType } from '@/core/wallpaper_symmetry/ColorReversingType'
import { get_lattice } from '@/core/wallpaper_symmetry/WallpaperLattice'
import type { WallpaperPalette } from '@/core/wallpaper_symmetry/WallpaperPalette'
import type { WallpaperSymmetryGroup } from '@/core/wallpaper_symmetry/WallpaperSymmetryGroup'
import { WallpaperShader, MAX_COLORS } from '@/shaders/WallpaperShader'
import type p5 from 'p5'

export interface WallpaperPattern {
  series: FourierSeries2D
  group: WallpaperSymmetryGroup
}

export interface WallpaperState {
  pattern: WallpaperPattern
  palette: WallpaperPalette
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

    this.shader.init(p)

    // Initialize uniforms
    this.pattern = this.state.pattern
    this.palette = this.state.palette

    this.shader.disable()
  }

  draw(p: p5) {
    p.background(0)
    this.shader.draw()
  }

  set pattern(value: WallpaperPattern) {
    this.state.pattern = value

    this.shader.set_coefficients(value.series)
    const lattice = get_lattice(value.group.lattice)
    this.shader.set_lattice(...lattice)

    const color_reversing = value.group.color_reversing ?? ColorReversingType.None
    this.shader.set_uniform('color_reversing_type', color_reversing)
  }

  set show_palette(value: boolean) {
    this.shader.set_uniform('show_palette', value)
  }

  set palette(value: WallpaperPalette) {
    this.state.palette = value

    if (!this.sketch) {
      return
    }

    const colors = value.colors.slice(0, MAX_COLORS)
    const flattened = colors.flatMap((c) => c.to_vec3())
    const remaining = Math.max(3 * MAX_COLORS - flattened.length, 0)
    const padding = new Array(remaining).fill(0.0)
    const values = [...flattened, ...padding]
    this.shader.set_uniform('palette_colors', values)
    this.shader.set_uniform('color_count', colors.length)

    this.shader.set_uniform('diagonal_density', 1.0 / value.diagonal_thickness)
    this.shader.set_uniform('palette_type', value.palette_type)
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

  set ref_geom(value: ReferenceGeometryCollection) {
    for (const [prefix, geom] of Object.entries(value)) {
      this.set_xyrt_flags(prefix, geom.xyrt_flags)
      this.set_color(prefix, geom.color)
      this.set_thickness(prefix, geom.thickness)
    }
  }
}
