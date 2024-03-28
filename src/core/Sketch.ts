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
  preload(p: p5) {}
  setup(p: p5) {}
  draw(p: p5) {}
  mouse_released(p: p5): boolean {
    return true
  }
  mouse_dragged(p: p5): boolean {
    return true
  }
  mouse_moved(p: p5): boolean {
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

      p.preload = () => this.preload(p)
      p.setup = () => this.setup(p)
      p.draw = () => this.draw(p)
      p.mouseReleased = () => this.mouse_released(p)
      p.mouseDragged = () => this.mouse_dragged(p)
      p.mouseMoved = () => this.mouse_moved(p)
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

  /**
   * On some pages, I put the sketch inside a tab that may
   * use v-show (which sets display: none). Since that's an
   * ancestor of the sketch's canvas, checking this requires
   * travelling up the tree
   *
   * @param canvas The canvas used for rendering
   */
  static is_visible(canvas: HTMLElement) {
    let node: HTMLElement | null = canvas
    while (node !== null) {
      if (getComputedStyle(node).display === 'none') {
        return false
      }

      node = node.parentElement
    }

    return true
  }
}
