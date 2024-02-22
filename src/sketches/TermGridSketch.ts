import p5 from 'p5'
import { Sketch } from '@/core/Sketch'
import type { ComplexPolar } from '@/core/Complex'

export interface TermGridState {
  // Cell size in pixels
  cell_size: number
  // How many rows of coefficients
  rows: number
  // How many columns of coefficients
  cols: number
  // Which coefficient is selected for editing.
  selected_index: number
  // A coefficients. it must have rows * cols entries
  coefficients: ComplexPolar[]
}

export class TermGridSketch extends Sketch<TermGridState> {
  setup(p: p5) {
    const { cell_size, rows, cols } = this.state
    const canvas = p.createCanvas(cols * cell_size, rows * cell_size)
    p.background(0)

    Sketch.show_canvas(canvas.elt)
  }

  draw_term(p: p5, row: number, col: number) {
    const { cols, cell_size, coefficients } = this.state

    // The coordinate grids go from [-2, 2] to [2, 2]
    // so the width in the complex plane is 4.0
    const pixels_per_unit = cell_size / 4.0

    const index = row * cols + col
    const coefficient = coefficients[index]

    if (!coefficient) {
      throw new Error(
        `The coefficients array has the incorrect number of terms! it must have ${this.state.rows * cols}`
      )
    }

    p.push()

    const center_y = (row + 0.5) * cell_size
    const center_x = (col + 0.5) * cell_size

    p.stroke(255)
    p.noFill()
    p.circle(center_x, center_y, 2.0 * pixels_per_unit)

    // Check if the amplitude is nonzero
    const coefficient_nonzero = coefficient && coefficient.r !== 0

    if (coefficient_nonzero) {
      const { r: amplitude, theta: phase } = coefficient
      const real = amplitude * p.cos(phase)
      const imag = amplitude * -p.sin(phase)
      const x = center_x + real * pixels_per_unit
      const y = center_y + imag * pixels_per_unit

      p.stroke(255, 127, 0)
      p.noFill()
      p.line(center_x, center_y, x, y)

      p.noStroke()
      p.fill(255, 127, 0)
      p.circle(x, y, 8)
    } else {
      p.noStroke()
      p.fill(127)
      p.circle(center_x, center_y, 8)
    }

    p.pop()
  }

  draw(p: p5) {
    const { cell_size, rows, cols, selected_index } = this.state
    p.background(0)

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.draw_term(p, i, j)
      }
    }

    p.push()

    // Highlight the selected cell
    const selected_row = Math.floor(selected_index / cols)
    const selected_col = selected_index % cols
    p.stroke(255, 255, 0)
    p.noFill()
    p.rect(selected_col * cell_size, selected_row * cell_size, cell_size, cell_size)

    p.pop()
  }

  mouse_released(p: p5): boolean {
    const { cell_size, rows, cols, selected_index, coefficients } = this.state

    const col = Math.floor(p.mouseX / cell_size)
    const row = Math.floor(p.mouseY / cell_size)

    if (0 <= col && col < cols && 0 <= row && row < rows) {
      const index = row * cols + col

      if (index !== selected_index) {
        this.state.selected_index = index
        const coefficient = coefficients[index]
        this.events.dispatchEvent(
          new CustomEvent('term-selected', {
            detail: coefficient
          })
        )
      }
    }

    return false
  }
}
