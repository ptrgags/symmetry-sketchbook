import p5 from 'p5'
import { Sketch } from '@/core/Sketch'
import { type Pixel } from '@/core/Pixel'
import { FourierSeries } from '@/core/curve_symmetry/FourierSeries'
import { draw_polyline } from '@/core/sketch_util'

const MAX_X = 2.0
const PERIOD = 800
const THICKNESS = 3.0

// TODO: How much of this state should be exposed?
// the pattern and showing the arm are the main things,
// start_frame and curve are internal details...
export interface ParametricCurveState {
  pattern?: FourierSeries
  show_arm: boolean
}

export class ParametricCurveSketch extends Sketch<ParametricCurveState> {
  start_frame: number = 0
  curve: Pixel[] = []

  setup(p: p5) {
    const canvas = p.createCanvas(500, 700)
    Sketch.show_canvas(canvas.elt)
  }

  draw(p: p5) {
    p.background(0)
    const { pattern, show_arm } = this.state

    if (!pattern) {
      return
    }

    const frame = p.frameCount - this.start_frame
    const t = (frame / PERIOD) * p.TWO_PI

    p.push()
    p.translate(p.width / 2, p.height / 2)
    const scale_factor = p.width / (2 * MAX_X)
    p.scale(scale_factor, -scale_factor)
    p.strokeWeight(THICKNESS / scale_factor)

    const sums: Pixel[] = [...pattern.partial_sums(t)].map((z) => {
      return { x: z.real, y: z.imag }
    })
    if (frame < PERIOD) {
      this.curve.push(sums[sums.length - 1])
    }

    p.noFill()
    p.strokeJoin(p.ROUND)
    p.stroke(71, 142, 204)
    draw_polyline(p, this.curve, frame >= PERIOD)

    if (show_arm) {
      p.stroke(255)
      draw_polyline(p, sums, false)
    }

    p.pop()
  }

  set show_arm(value: boolean) {
    this.state.show_arm = value
  }

  set pattern(value: FourierSeries) {
    this.state.pattern = value
  }

  recompute_curve() {
    const pattern = this.state.pattern
    if (!pattern) {
      return
    }

    const n = this.curve.length
    for (let frame = 0; frame < n; frame++) {
      const t = (frame / PERIOD) * 2.0 * Math.PI
      const z = pattern.compute(t)
      this.curve[frame] = {
        x: z.real,
        y: z.imag
      }
    }
  }

  restart_animation() {
    this.curve.length = 0
    this.start_frame = this.sketch?.frameCount ?? 0
  }
}
