import p5 from 'p5'

import { FourierSeries2D } from '@/core/FourierSeries2D'
import { Shader } from './Shader'

export const MAX_TERMS = 64

function pad_zeros(values: number[], desired_length: number): number[] {
  const len = values.length
  if (len > desired_length) {
    const len_str = `(${len / 2}, max=${desired_length / 2})`
    throw new Error(`Too many terms ${len_str}. Try again with fewer terms`)
  }

  const pad_length = desired_length - len
  if (pad_length > 0) {
    const padding = Array(pad_length).fill(0)
    return values.concat(padding)
  } else {
    return values
  }
}

export class SymmetryShader extends Shader {
  powers_buffer: number[]
  coefficients_buffer: number[]

  constructor() {
    super()
    this.powers_buffer = []
    this.coefficients_buffer = []
  }

  init(sketch: p5, vert: string, frag: string) {
    super.init(sketch, vert, frag)
    this.set_uniform('show_ref_geometry', 0.0)
    this.set_uniform('show_palette', false)
  }

  set_coefficients(pattern: FourierSeries2D) {
    const frequencies = pattern.frequencies_array
    const coefficients = pattern.coefficients_array

    // Reset the buffers so they're all 0
    this.powers_buffer = pad_zeros(frequencies, 2 * MAX_TERMS)
    this.coefficients_buffer = pad_zeros(coefficients, 2 * MAX_TERMS)

    this.enable()

    const shader = this.shader
    if (shader) {
      shader.setUniform('num_terms', pattern.length)
      // I'm sad, p5.js doesn't take typed arrays :(
      shader.setUniform('powers', this.powers_buffer)
      shader.setUniform('coeffs', this.coefficients_buffer)
    }
  }
}
