import type p5 from 'p5'
import { Sketch } from '@/core/Sketch.js'
import { TieDyeShader } from '@/shaders/TieDyeShader.js'
import { SecondaryColorType } from '@/core/point_symmetry/PaletteType.js'
import { FourierSeries2D } from '@/core/FourierSeries2D'

export enum TieDyeState {
  // Initial grid, no coloring
  Initial = 0,
  // Warp the grid using the polynomial
  Tying = 1,
  // Dye the grid while still warped
  Dyeing = 2,
  // Unwarp the grid, to see the
  Untying = 3
}

export enum AnimationState {
  // Animation pauses for a moment at each state
  Pausing = 0,
  // Transitioning from the current state to state + 1
  Animating = 1
}

const ANIMATING_FRAMES = 120
const PAUSING_FRAMES = 60

function get_tie_amount(state: TieDyeState, transition_percent: number) {
  switch (state) {
    case TieDyeState.Initial:
      return transition_percent
    case TieDyeState.Tying:
      return 1
    case TieDyeState.Dyeing:
      return 1.0 - transition_percent
    case TieDyeState.Untying:
      return 0
  }
}

function get_dye_amount(state: TieDyeState, transition_percent: number) {
  switch (state) {
    case TieDyeState.Initial:
      return 0
    case TieDyeState.Tying:
      return transition_percent
    case TieDyeState.Dyeing:
      return 1.0
    case TieDyeState.Untying:
      return 1.0 - transition_percent
  }
}

export interface TieDyeAnalogyState {
  tie_dye_state: TieDyeState
  animation_state: AnimationState
  reference_frame: number
  transition_percent: number
}

export class TieDyeAnalogySketch extends Sketch<TieDyeAnalogyState> {
  shader: TieDyeShader

  constructor(state: TieDyeAnalogyState) {
    super(state)
    this.shader = new TieDyeShader()
  }

  preload(p: p5) {
    this.shader.preload(p)
  }

  setup(p: p5) {
    const canvas = p.createCanvas(500, 700, p.WEBGL)
    Sketch.show_canvas(canvas.elt)

    this.shader.init(p)
    this.shader.set_coefficients(
      FourierSeries2D.from_tuples([
        [1, 0, 1, 0],
        [3, 1, 0.5, 0]
      ])
    )

    this.shader.disable()
  }

  update_animation(frame: number) {
    const state = this.state
    const elapsed_frames = frame - state.reference_frame

    if (state.animation_state === AnimationState.Pausing) {
      state.transition_percent = 0.0

      if (elapsed_frames >= PAUSING_FRAMES) {
        state.animation_state = AnimationState.Animating
        state.reference_frame = frame
      }
    } else if (state.animation_state === AnimationState.Animating) {
      // Create an interpolation factor based on the frame count.
      state.transition_percent = elapsed_frames / (ANIMATING_FRAMES - 1)

      if (elapsed_frames >= ANIMATING_FRAMES) {
        state.tie_dye_state = (state.tie_dye_state + 1) % 4
        state.animation_state = AnimationState.Pausing
        state.reference_frame = frame
      }
    }
  }

  draw(p: p5) {
    this.update_animation(p.frameCount)

    const { tie_dye_state, transition_percent } = this.state

    this.shader.set_uniform('tie', get_tie_amount(tie_dye_state, transition_percent))
    this.shader.set_uniform('dye', get_dye_amount(tie_dye_state, transition_percent))

    p.background(0, 40, 45)
    this.shader.draw()
  }
}
