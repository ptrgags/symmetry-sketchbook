import p5 from 'p5'
import { Sketch } from '@/core/Sketch'
import type { ComplexPolar } from '@/core/Complex'
import type { GridIndices2D } from '@/core/GridIndices2D'
import type { Frequency2D } from '@/core/Frequency2D'

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
  // If specified, this callback is used to label the frequencies
  // and animate the spinner speed
  frequency_map?: (indices: GridIndices2D) => number | Frequency2D
  editable_map?: (indices: GridIndices2D) => boolean
}

export class TermGridSketch extends Sketch<TermGridState> {
  canvas?: HTMLElement
  setup(p: p5) {
    const { cell_size, rows, cols } = this.state
    const canvas = p.createCanvas(cols * cell_size, rows * cell_size)
    p.background(0)

    this.canvas = canvas.elt as HTMLElement
    Sketch.show_canvas(canvas.elt)
  }

  can_edit(indices: GridIndices2D): boolean {
    if (!this.state.editable_map) {
      return true
    }

    return this.state.editable_map(indices)
  }

  draw_term(p: p5, indices: GridIndices2D) {
    const { cols, cell_size, coefficients } = this.state

    // The coordinate grids go from [-2, 2] to [2, 2]
    // so the width in the complex plane is 4.0
    const pixels_per_unit = cell_size / 4.0

    const { row, col } = indices
    const index = row * cols + col
    const coefficient = coefficients[index]

    if (!coefficient) {
      throw new Error(
        `The coefficients array has the incorrect number of terms! it must have ${this.state.rows * cols}`
      )
    }

    if (!this.can_edit(indices)) {
      p.fill(64)
      p.noStroke()
      p.rect(col * cell_size, row * cell_size, cell_size, cell_size)
      return
    }

    const center_y = (row + 0.5) * cell_size
    const center_x = (col + 0.5) * cell_size
    if (this.state.frequency_map) {
      const frequencies = this.state.frequency_map(indices)
      let freq_str
      let spinner_frequency
      if (typeof frequencies === 'number') {
        const n = frequencies
        freq_str = `${n}`
        spinner_frequency = n
      } else {
        const { n, m } = frequencies
        freq_str = `${n},${m}`
        // z^n conj(z)^m expands to r^(n + m)exp(i * theta * (n - m)),
        // the frequency is the n - m part
        spinner_frequency = n - m
      }

      // draw a spinning line
      const t = 0.01 * p.frameCount
      const spin_x = 0.5 * cell_size * p.cos(spinner_frequency * t)
      const spin_y = 0.5 * cell_size * -p.sin(spinner_frequency * t)
      p.noFill()
      p.stroke(255)
      p.line(center_x, center_y, center_x + spin_x, center_y + spin_y)

      // Label the term with the frequency
      p.noStroke()
      p.fill(255)
      p.textSize(cell_size / 4)
      p.textAlign(p.RIGHT)
      const margin = cell_size / 16
      p.text(freq_str, (col + 1) * cell_size - margin, (row + 1) * cell_size - margin)
    }

    // Draw the unit circle
    p.stroke(255)
    p.noFill()
    p.circle(center_x, center_y, 2.0 * pixels_per_unit)

    // Check if the amplitude is nonzero
    const coefficient_nonzero = coefficient && coefficient.r !== 0

    const ORANGE = p.color(255, 127, 0)
    const DARK_GREY = p.color(127)

    if (coefficient_nonzero) {
      const { r: amplitude, theta: phase } = coefficient
      const real = amplitude * p.cos(phase)
      const imag = amplitude * -p.sin(phase)
      const x = center_x + real * pixels_per_unit
      const y = center_y + imag * pixels_per_unit

      p.stroke(ORANGE)
      p.noFill()
      p.line(center_x, center_y, x, y)

      p.noStroke()
      p.fill(ORANGE)
      p.circle(x, y, 8)
    } else {
      p.noStroke()
      p.fill(DARK_GREY)
      p.circle(center_x, center_y, 8)
    }
  }

  draw(p: p5) {
    const { cell_size, rows, cols, selected_index } = this.state
    p.background(0)

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.draw_term(p, { row: i, col: j })
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
    if (!this.canvas || !Sketch.is_visible(this.canvas)) {
      return true
    }

    const { cell_size, rows, cols, selected_index, coefficients } = this.state

    const col = Math.floor(p.mouseX / cell_size)
    const row = Math.floor(p.mouseY / cell_size)

    if (col < 0 || col >= cols || row < 0 || row >= rows) {
      return true
    }

    if (!this.can_edit({ row, col })) {
      return false
    }

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

    return false
  }
}
