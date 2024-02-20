const sketch = (p) => {
    p.state = {
        dimensions: {
            width: 100,
            height: 100,
            rows: 1,
            cols: 1,
        },
        coefficients: [],
    };

    p.resize_grid = (dimensions) => {
        p.state.dimensions = dimensions;
        p.resizeCanvas(dimensions.width, dimensions.height);
        p.state.coefficients = [];
    };

    p.set_coefficients = (coefficients) => {
        const dimensions = p.state.dimensions;
        if (coefficients.length !== dimensions.rows * dimensions.cols) {
            throw new Error(
                "The number of coefficients must be the same as the grid size"
            );
        }

        p.state.coefficients = coefficients;
    };

    p.setup = () => {
        const dimensions = p.state.dimensions;
        const canvas = p.createCanvas(dimensions.width, dimensions.height);
        p.background(0);

        // For some reason p5 hides the canvas when
        // in the Shadow DOM. unhide it.
        canvas.canvas.style.visibility = "";
        canvas.canvas.removeAttribute("data-hidden");
    };

    p.draw = () => {
        p.background(0);

        const dimensions = p.state.dimensions;

        const cell_width = dimensions.width / dimensions.cols;
        const cell_height = dimensions.height / dimensions.rows;

        // The coordinate grids go from [-2, 2] to [2, 2]
        // so the width in the complex plane is 4.0
        const pixels_per_unit_x = cell_width / 4.0;
        const pixels_per_unit_y = cell_height / 4.0;

        for (let i = 0; i < dimensions.rows; i++) {
            const center_y = (i + 0.5) * cell_height;
            for (let j = 0; j < dimensions.cols; j++) {
                const index = i * dimensions.cols + j;
                const coefficient = p.state.coefficients[index];

                const center_x = (j + 0.5) * cell_width;
                p.stroke(255);
                p.noFill();
                p.ellipse(
                    center_x,
                    center_y,
                    2.0 * pixels_per_unit_x,
                    2.0 * pixels_per_unit_y
                );

                if (coefficient) {
                    const [amplitude, phase] = coefficient;
                    const real = amplitude * p.cos(phase);
                    const imag = amplitude * -p.sin(phase);
                    const x = center_x + real * pixels_per_unit_x;
                    const y = center_y + imag * pixels_per_unit_y;

                    p.noStroke();
                    p.fill(255, 127, 0);
                    p.circle(x, y, 8);
                } else {
                    p.noStroke();
                    p.fill(127);
                    p.circle(center_x, center_y, 8);
                }
            }
        }
    };
};

function parse_coefficients(csv) {
    const values = csv.split(",").map((x) => parseFloat(x));
    if (values.length % 2 === 1) {
        throw new Error(
            "coefficients must have an even number of values, ie.e. amp1,phase1,amp2,phase2, etc."
        );
    }

    const result = [];
    for (let i = 0; i < values.length / 2; i++) {
        const amp = values[2 * i];
        const phase = values[2 * i + 1];
        result.push([amp, phase]);
    }
    return result;
}

/**
 * For complex polynomials we care about, there are many coefficients
 * with either one or two indices. This grid helps select and visualize them.
 */
class CoefficientGrid extends HTMLElement {
    static observedAttributes = [
        "width",
        "height",
        "rows",
        "cols",
        "coefficients",
    ];

    constructor() {
        super();

        this._sketch = undefined;

        this._dimensions = {
            width: undefined,
            height: undefined,
            rows: undefined,
            cols: undefined,
        };
        this._coefficients = [[0, 0]];

        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<div id="container"></div>`;
    }

    attributeChangedCallback(name, old_value, new_value) {
        // This component only cares
        if (old_value === new_value) {
            return;
        }

        if (["width", "height", "rows", "cols"].includes(name)) {
            this._dimensions[name] = parseInt(new_value);
            this.resize();
        } else if (name === "coefficients") {
            this._coefficients = parse_coefficients(new_value);
            this.change_coefficients();
        }
    }

    connectedCallback() {
        const container = this.shadowRoot.getElementById("container");
        this._sketch = new p5(sketch, container);
        this.resize();
        this.change_coefficients();

        console.log("connected");
    }

    resize() {
        if (!this._sketch) {
            return;
        }

        this._sketch.resize_grid(this._dimensions);
    }

    change_coefficients() {
        if (!this._sketch) {
            return;
        }

        this._sketch.set_coefficients(this._coefficients);
    }
}

customElements.define("sym-coefficient-grid", CoefficientGrid);
