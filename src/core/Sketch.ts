/* eslint-disable @typescript-eslint/no-unused-vars */
import p5 from 'p5'

export abstract class Sketch<State> {
  events: EventTarget
  state: State
  sketch?: p5

  constructor(state: State) {
    this.events = new EventTarget()
    this.state = state
  }

  // p5 callbacks, but I find underscores easier to read 🐍
  setup(p: p5) {}
  draw(p: p5) {}
  mouse_released(p: p5): boolean {
    return true
  }

  /**
   * p5.js expects the sketch to be a closure in a certain
   * form, so this method builds that closure
   * @returns The closure to pass into the p5 constructor
   */
  to_closure(): (p: p5) => void {
    return (p: p5) => {
      this.sketch = p

      p.setup = () => this.setup(p)
      p.draw = () => this.draw(p)
      p.mouseReleased = () => this.mouse_released(p)
    }
  }

  /**
   * Wrap this sketch in a p5.js instance
   *
   * It also saves a reference to the sketch in this.sketch so
   * sketch helper methods can find it later
   *
   * @param parent The parent element the canvas will be attached to
   * @returns The created sketch
   */
  wrap(parent: HTMLElement): p5 {
    this.sketch = new p5(this.to_closure(), parent)
    return this.sketch
  }

  // p5.js hides the canvas in the shadow DOM
  // so this method un-hides it
  static show_canvas(canvas: HTMLElement) {
    canvas.style.visibility = ''
    canvas.removeAttribute('data-hidden')
  }
}
