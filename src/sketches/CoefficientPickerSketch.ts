import p5 from 'p5'
import { Sketch } from '@/core/Sketch'
import { ComplexRect } from '@/core/Complex'
import type { Pixel } from '@/core/Pixel'

const WIDTH_PX = 400
const CENTER_PX = WIDTH_PX / 2

// Coefficients will be limited to the range [-2, 2] + [-2, 2]i
const WIDTH_COMPLEX = 4.0
const RADIUS_COMPLEX = WIDTH_COMPLEX / 2

const PIXELS_PER_UNIT = WIDTH_PX / WIDTH_COMPLEX

/**
 * Convert from pixel space to a complex number
 * @param pixel The pixel
 * @returns The corresponding complex number a + bi
 */
function to_complex(pixel: Pixel): ComplexRect {
  const { x, y } = pixel
  const real = (x - CENTER_PX) / PIXELS_PER_UNIT
  const imag = -(y - CENTER_PX) / PIXELS_PER_UNIT
  return new ComplexRect(real, imag)
}

/**
 * Convert from the complex plane to pixel space
 * @param z The complex number
 * @returns The corresponding pixel (x, y)
 */
function to_pixel(z: ComplexRect): Pixel {
  const { real, imag } = z
  const x = CENTER_PX + real * PIXELS_PER_UNIT
  const y = CENTER_PX - imag * PIXELS_PER_UNIT
  return { x, y }
}

function snap_complex(complex: ComplexRect): ComplexRect {
  let { real, imag } = complex
  const SNAP_RADIUS = 4.0 / PIXELS_PER_UNIT

  // Snap to edges of screen
  if (real > RADIUS_COMPLEX - SNAP_RADIUS) {
    real = RADIUS_COMPLEX
  } else if (real < -RADIUS_COMPLEX + SNAP_RADIUS) {
    real = -RADIUS_COMPLEX
  }

  if (imag > RADIUS_COMPLEX - SNAP_RADIUS) {
    imag = RADIUS_COMPLEX
  } else if (imag < -RADIUS_COMPLEX + SNAP_RADIUS) {
    imag = -RADIUS_COMPLEX
  }

  // Snap to the origin
  const magnitude = Math.sqrt(real * real + imag * imag)
  if (magnitude <= SNAP_RADIUS) {
    real = 0
    imag = 0
  }

  // Snap to the unit circle
  if (Math.abs(magnitude - 1.0) <= SNAP_RADIUS) {
    real /= magnitude
    imag /= magnitude
  }

  return new ComplexRect(real, imag)
}

function snap_pixel(pixel: Pixel): Pixel {
  const z = to_complex(pixel)
  const snapped_z = snap_complex(z)
  return to_pixel(snapped_z)
}

export interface CoefficientPickerState {
  coefficient: ComplexRect
}

export class CoefficientPickerSketch extends Sketch<CoefficientPickerState> {
  canvas?: HTMLElement
  setup(p: p5) {
    const canvas = p.createCanvas(WIDTH_PX, WIDTH_PX)

    this.canvas = canvas.elt as HTMLElement
    Sketch.show_canvas(canvas.elt)
  }

  draw(p: p5) {
    const { coefficient } = this.state

    p.background(0)

    p.stroke(255)
    p.noFill()

    // Draw the unit circle
    p.circle(CENTER_PX, CENTER_PX, 2.0 * PIXELS_PER_UNIT)

    // Draw a line and dot for the current coefficient
    const { x: saved_x, y: saved_y } = to_pixel(coefficient)
    const orange = p.color(255, 127, 0)
    p.stroke(orange)
    p.noFill()
    p.line(CENTER_PX, CENTER_PX, saved_x, saved_y)
    p.fill(orange)
    p.noStroke()
    const DOT_RADIUS = 4
    p.circle(saved_x, saved_y, 2 * DOT_RADIUS)

    // Draw a line to the mouse, snapping to
    // geometry
    p.stroke(255)
    p.noFill()
    const { x: mx, y: my } = snap_pixel({ x: p.mouseX, y: p.mouseY })
    p.line(CENTER_PX, CENTER_PX, mx, my)
  }

  emit_mouse_event(p: p5, event_name: string) {
    const x = p.mouseX
    const y = p.mouseY
    if (x < 0 || x >= p.width || y < 0 || y >= p.height) {
      // Not our event, bubble it up.
      return true
    }

    // Compute a complex point
    const z = to_complex({ x, y })

    // Snap the point to key geometry in the complex plane
    const z_snapped = snap_complex(z)
    this.state.coefficient = z_snapped

    this.events.dispatchEvent(new CustomEvent(event_name, { detail: z_snapped }))
  }

  mouse_released(p: p5): boolean {
    if (!this.canvas || !Sketch.is_visible(this.canvas)) {
      return true
    }

    this.emit_mouse_event(p, 'change')

    return false
  }

  mouse_dragged(p: p5): boolean {
    if (!this.canvas || !Sketch.is_visible(this.canvas)) {
      return true
    }

    this.emit_mouse_event(p, 'input')
    return false
  }
}
