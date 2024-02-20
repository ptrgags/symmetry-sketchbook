import { FourierSeries } from "../../curve_symmetry/FourierSeries.js";
import { ROSETTES } from "../../curve_symmetry/patterns.js";

const MAX_X = 2.0;
const PERIOD = 800;
const THICKNESS = 3.0;

function draw_polyline(p, points, close) {
    p.beginShape();
    for (const [x, y] of points) {
        p.vertex(x, y);
    }

    if (close) {
        p.endShape(p.CLOSE);
    } else {
        p.endShape();
    }
}

const sketch = (p) => {
    p.state = {
        show_arm: true,
        pattern: undefined,
        curve: [],
        start_frame: 0,
    };

    p.set_pattern = (series) => {
        const state = p.state;
        state.pattern = series;
        state.curve.length = 0;
        state.start_frame = p.frameCount;
    };

    p.set_preset = (id) => {
        const pattern = ROSETTES[id];
        p.set_pattern(pattern);
    };

    p.set_terms = (term_string) => {
        try {
            const pattern = FourierSeries.from_string(term_string);
            p.set_pattern(pattern);
        } catch (error) {
            p.set_pattern(undefined);
        }
    };

    p.setup = () => {
        const canvas = p.createCanvas(500, 700);

        // For some reason p5 hides the canvas when
        // in the Shadow DOM. unhide it.
        canvas.canvas.style.visibility = "";
        canvas.canvas.removeAttribute("data-hidden");

        p.background(0);
    };

    p.draw = () => {
        p.background(0);
        const { start_frame, pattern, curve, show_arm } = p.state;

        if (!pattern) {
            return;
        }

        const frame = p.frameCount - start_frame;
        const t = (frame / PERIOD) * p.TWO_PI;

        p.push();
        p.translate(p.width / 2, p.height / 2);
        const scale_factor = p.width / (2 * MAX_X);
        p.scale(scale_factor, -scale_factor);
        p.strokeWeight(THICKNESS / scale_factor);

        const sums = [...pattern.partial_sums(t)];
        if (frame < PERIOD) {
            curve.push(sums[sums.length - 1]);
        }

        p.noFill();
        p.strokeJoin(p.ROUND);
        p.stroke(71, 142, 204);
        draw_polyline(p, curve, frame >= PERIOD);

        if (show_arm) {
            p.stroke(255);
            draw_polyline(p, sums, false);
        }

        p.pop();
    };
};

class ParametricRosetteViewer extends HTMLElement {
    static observedAttributes = ["show-arm", "preset", "terms"];

    constructor() {
        super();

        this._sketch = undefined;

        this._display_arm = true;

        // These are mutually exclusive, writing to one erases the other.
        this._preset = undefined;
        this._terms = undefined;

        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
            <div id="container"></div>
            <style>
                #container {
                    display: inline-block;
                }
            </style>
        `;
    }

    connectedCallback() {
        const container = this.shadowRoot.getElementById("container");
        this._sketch = new p5(sketch, container);
        this.update_arm();
        this.update_rosette();
    }

    update_arm() {
        if (!this._sketch) {
            return;
        }

        this._sketch.state.show_arm = this._show_arm;
    }

    update_rosette() {
        if (!this._sketch) {
            return;
        }

        if (this._preset) {
            this._sketch.set_preset(this._preset);
        } else if (this._terms) {
            this._sketch.set_terms(this._terms);
        }
    }

    attributeChangedCallback(name, old_value, new_value) {
        if (old_value === new_value) {
            return;
        }

        if (name === "show-arm") {
            this._show_arm = new_value === "true" ? true : false;
            this.update_arm();
        } else if (name === "preset") {
            this._preset = new_value;
            this._terms = undefined;
            this.update_rosette();
        } else if (name === "terms") {
            this._terms = new_value;
            this._preset = undefined;
            this.update_rosette();
        }
    }
}

customElements.define("sym-parametric-rosette", ParametricRosetteViewer);
