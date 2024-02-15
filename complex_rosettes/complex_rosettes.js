import { PALETTES } from "./colors.js";
import { ROSETTES } from "./patterns.js";
import { Complex } from "./Complex.js";

const MAX_X = 1.5;
const BLOCK_SIZE = 16;

const state = {
    images: {},
    images_loaded: false,
    color_wheel_dirty: true,
    palette: "abstract",
    pattern: "rot2_1",
};

function populate_dropdown(id, options, initial_value, on_change) {
    const select = document.getElementById(id);
    for (const [key, { name }] of Object.entries(options)) {
        const option = document.createElement("option");
        option.value = key;
        option.innerText = name;
        select.appendChild(option);
    }
    select.onchange = on_change;
    select.value = initial_value;
}

export function init_ui() {
    populate_dropdown("pattern-select", ROSETTES, state.pattern, (e) => {
        state.pattern = e.target.value;
    });
    populate_dropdown("palette-select", PALETTES, state.palette, (e) => {
        state.palette = e.target.value;
    });
}

function get_z(p, x, y) {
    const hw = p.width / 2.0;
    const hh = p.height / 2.0;
    const u = ((x - hw) / hw) * MAX_X;
    const v = (-(y - hh) / hw) * MAX_X;

    return new Complex(u, v);
}

/**
 * Rendering pixel-by-pixel on the CPU is too slow,
 * so render one pixel in each NxN block, scanning through
 * over time.
 *
 * callback is a function Complex -> Complex to visualize
 */
function interleave_render(p, palette, callback) {
    if (palette.uses_hsb) {
        p.colorMode(p.HSB, 1, 1, 1, 1);
    }

    const blocks_wide = Math.ceil(p.width / BLOCK_SIZE);
    const blocks_tall = Math.ceil(p.height / BLOCK_SIZE);
    const x_offset = p.frameCount % BLOCK_SIZE;
    const y_offset = Math.floor(p.frameCount / BLOCK_SIZE) % BLOCK_SIZE;
    console.log(x_offset, y_offset);

    p.noFill();
    for (let i = 0; i < blocks_wide; i++) {
        const x = i * BLOCK_SIZE + x_offset;

        for (let j = 0; j < blocks_tall; j++) {
            const y = j * BLOCK_SIZE + y_offset;
            const z = get_z(p, x, y);
            const w = callback(z);
            const c = palette.get_color(p, w);
            p.stroke(c);
            p.point(x, y);
        }
    }

    if (palette.uses_hsb) {
        p.colorMode(p.RGB, 255, 255, 255, 255);
    }
}

export const rosette_sketch = (p) => {
    // HACK: Texture palette needs to access the
    // images object in Texture.color_impl, but since
    // that's declared after Texture, stash it on the
    // sketch so it can be accessed in that function.
    p.symmetry_state = state;

    p.preload = () => {
        state.images.abstract = p.loadImage("abstract.jpg", (img) => {
            img.loadPixels();
            state.images_loaded = true;
        });
    };

    p.setup = () => {
        p.createCanvas(500, 700);
        p.background(0);
    };

    p.draw = () => {
        const pattern = ROSETTES[state.pattern].value;
        const palette = PALETTES[state.palette].value;
        interleave_render(p, palette, (z) => {
            return pattern.compute(z);
        });
    };
};

export const color_wheel_sketch = (p) => {
    p.symmetry_state = state;

    p.setup = () => {
        p.createCanvas(500, 700);
        p.background(0);
    };

    p.draw = () => {
        if (!state.images_loaded) {
            return;
        }

        const palette = PALETTES[state.palette].value;

        // To display the color wheel, just render the
        // identity function, f(z) = z
        interleave_render(p, palette, (z) => z);
    };
};
