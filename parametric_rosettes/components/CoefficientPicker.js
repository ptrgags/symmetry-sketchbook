const WIDTH = 400;
// This works best with a square canvas
const HEIGHT = WIDTH;

// Coefficients will be limited to the range [-2, 2] + [-2, 2]i
const SCALE = 2.0;
// width of canvas vs range of values in the complex plane.
const PIXELS_PER_UNIT = WIDTH / (2.0 * SCALE);

function to_complex(pixel) {
    const [x, y] = pixel;
    const real = (x - WIDTH / 2) / PIXELS_PER_UNIT;
    const imag = (y - HEIGHT / 2) / PIXELS_PER_UNIT;
    return [real, imag];
}

function to_pixel(complex) {
    const [real, imag] = complex;
    const x = real * PIXELS_PER_UNIT + WIDTH / 2;
    const y = imag * PIXELS_PER_UNIT + HEIGHT / 2;
    return [x, y];
}

function snap_complex(complex) {
    let [real, imag] = complex;
    const SNAP_RADIUS = 4.0 / PIXELS_PER_UNIT;

    // Snap to edges of screen
    if (real > SCALE - SNAP_RADIUS) {
        real = SCALE;
    } else if (real < -SCALE + SNAP_RADIUS) {
        real = -SCALE;
    }

    if (imag > SCALE - SNAP_RADIUS) {
        imag = SCALE;
    } else if (imag < -SCALE + SNAP_RADIUS) {
        imag = -SCALE;
    }

    // Snap to the origin
    const magnitude = Math.sqrt(real * real + imag * imag);
    if (magnitude <= SNAP_RADIUS) {
        real = 0;
        imag = 0;
    }

    // Snap to the unit circle
    if (Math.abs(magnitude - 1.0) <= SNAP_RADIUS) {
        real /= magnitude;
        imag /= magnitude;
    }

    return [real, imag];
}

// Snapping is done in the complex plane, so
// conjugate the snap function by the transformation
// to pixel space
function snap_pixel(pixel) {
    const z = to_complex(pixel);
    const snapped_z = snap_complex(z);
    return to_pixel(snapped_z);
}

// p5 sketch to make custom UI for selecting the coefficient.
// the sketch will have a couple extra callbacks set so
// CoefficientPicker can interact with it.
const sketch = (p) => {
    const state = {
        coefficient: {
            real: 0,
            imag: 0,
            phase: 0,
            angle: 0,
        },
    };

    // The component will set this callback
    p._on_coefficient_changed = undefined;

    p.setup = () => {
        const canvas = p.createCanvas(WIDTH, HEIGHT);

        // For some reason p5 hides the canvas when
        // in the Shadow DOM. unhide it.
        canvas.canvas.style.visibility = "";
        canvas.canvas.removeAttribute("data-hidden");
    };

    p.draw = () => {
        p.background(0, 0, 40);

        p.stroke(255);
        p.noFill();

        // Draw the unit circle
        const [cx, cy] = to_pixel([0, 0]);
        p.circle(cx, cy, 2.0 * PIXELS_PER_UNIT);

        // Draw a line and dot for the current coefficient
        const [saved_x, saved_y] = to_pixel([
            state.coefficient.real,
            state.coefficient.imag,
        ]);
        const orange = p.color(255, 127, 0);
        p.stroke(orange);
        p.noFill();
        p.line(cx, cy, saved_x, saved_y);
        p.fill(orange);
        p.noStroke();
        const DOT_RADIUS = 4;
        p.circle(saved_x, saved_y, 2 * DOT_RADIUS);

        // Draw a line to the mouse, snapping to
        // geometry
        p.stroke(255);
        p.noFill();
        const [mx, my] = snap_pixel([p.mouseX, p.mouseY]);
        p.line(cx, cy, mx, my);
    };

    p.mouseReleased = () => {
        const x = p.mouseX;
        const y = p.mouseY;
        if (x < 0 || x >= p.width || y < 0 || y >= p.height) {
            // Not our event, bubble it up.
            return true;
        }

        // Compute a complex point
        const [real, imag] = to_complex([x, y]);

        // Snap the point to key geometry in the complex plane
        const [real_snapped, imag_snapped] = snap_complex([real, imag]);

        // Also compute the amplitude and phase as this is more
        // useful in this symmetry program
        const amplitude = Math.sqrt(
            real_snapped * real_snapped + imag_snapped * imag_snapped
        );
        const phase = Math.atan2(imag_snapped, real_snapped);

        state.coefficient = {
            real: real_snapped,
            imag: imag_snapped,
            amplitude,
            phase,
        };

        if (p._on_coefficient_changed) {
            p._on_coefficient_changed(state.coefficient);
        }

        return false;
    };
};

/**
 * A custom HTML component that uses a small p5.js canvas
 * to let the user choose a complex number visually with the
 * mouse.
 */
class CoefficientPicker extends HTMLElement {
    constructor() {
        super();

        this._sketch = undefined;
        this._on_change = undefined;

        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<div id="picker"></div>`;
    }

    connectedCallback() {
        const parent = this.shadowRoot.getElementById("picker");
        this._sketch = new p5(sketch, parent);
    }

    on_change(callback) {
        this._sketch._on_coefficient_changed = callback;
        return this;
    }
}

customElements.define("sym-coefficient-picker", CoefficientPicker);
