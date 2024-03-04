import { ComplexRect } from '@/core/Complex'
import { FourierSeries } from '@/core/FourierSeries'
import { Sketch } from '@/core/Sketch'
import type p5 from 'p5'

const POINTS_PER_TRAJECTORY = 800
const MAX_X = 2.0
const THICKNESS = 3.0

export interface Planet {
  orbital_radius: number
  radius: number
  frequency: number
  color: [number, number, number]
}

export interface OrbitalMotionState {
  planets: Planet[]
  // Select a planet by index. 0 = sun, 1 = planet 1, and so on.
  reference_planet: number
}

function compute_orbit_series(planet: Planet) {
  return FourierSeries.from_tuples([[planet.frequency, planet.orbital_radius, 0]])
}

// The sun's motion relative to the sun is... no motion!
const SUN_ORBIT = FourierSeries.from_tuples([])

export class OrbitalMotionSketch extends Sketch<OrbitalMotionState> {
  // The orbit of a planet is modeled as circular motion, which can
  // be modeled as a fourier series.
  orbits: FourierSeries[]
  curves: ComplexRect[][]

  constructor(state: OrbitalMotionState) {
    super(state)
    this.orbits = state.planets.map(compute_orbit_series)
    this.curves = this.orbits.map((x) => x.compute_trajectory(POINTS_PER_TRAJECTORY))
  }

  setup(p: p5) {
    const canvas = p.createCanvas(500, 700)
    Sketch.show_canvas(canvas.elt)
  }

  draw(p: p5) {
    p.background(0)

    const { planets, reference_planet } = this.state
    const num_planets = planets.length

    p.push()
    // Shift and scale so we're in the
    p.translate(p.width / 2, p.height / 2)
    const scale_factor = p.width / (2 * MAX_X)
    p.scale(scale_factor, -scale_factor)

    const reference_curve = this.curves[reference_planet]

    // Draw the trajectories of each planet relative to the referene
    // planet
    p.noFill()
    p.strokeJoin(p.ROUND)
    p.strokeWeight(THICKNESS / scale_factor)
    for (let planet = 0; planet < num_planets; planet++) {
      const curve = this.curves[planet]
      p.stroke(...planets[planet].color)
      p.beginShape()
      for (let i = 0; i < POINTS_PER_TRAJECTORY; i++) {
        const point = curve[i].sub(reference_curve[i])
        p.vertex(point.real, point.imag)
      }
      p.endShape(p.CLOSE)
    }

    // Draw each planet as a circle
    for (let planet = 0; planet < num_planets; planet++) {
      const orbit = this.orbits[planet]
      const t = (p.frameCount / POINTS_PER_TRAJECTORY) * 2.0 * Math.PI
      const index = p.frameCount % POINTS_PER_TRAJECTORY
      const z = orbit.compute(t).sub(reference_curve[index])

      p.fill(...planets[planet].color)
      p.noStroke()
      p.circle(z.real, z.imag, planets[planet].radius)
    }

    p.pop()
  }
}
