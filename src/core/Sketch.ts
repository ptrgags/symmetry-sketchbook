import type p5 from "p5"

export abstract class Sketch<State> {
    events: EventTarget
    state: State

    constructor(state: State) {
        this.events = new EventTarget()
        this.state = state
    }

    // p5 callbacks, but now they take a state parameter
    abstract setup(p: p5): void
    abstract draw(p: p5): void 

    /**
     * p5.js expects the sketch to be a closure in a certain
     * form, so this method builds that closure
     * @returns The closure to pass into the p5 constructor
     */
    to_closure(): (p: p5) => void {
        return (p: p5) => {
            p.setup = () => this.setup(p)
            p.draw = () => this.setup(p)
        }
    }

    // p5.js hides the canvas in the shadow DOM
    // so this method un-hides it
    static show_canvas(canvas: HTMLElement) {
        canvas.style.visibility = ''
        canvas.removeAttribute('data-hidden')
    }
}
