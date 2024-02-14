import { PALETTES } from './colors.js';
import { ROSETTES } from './patterns.js';
import { ComplexPolynomial } from './ComplexPolynomial.js';
import { Complex } from './Complex.js';

const MAX_X = 1.5;
const THICKNESS = 2.0;
const COLOR_WHEEL_SECTORS = 5 * 1;
const ZERO_THRESHOLD = 0.2;
const MAX_THRESHOLD = 1e9;
const POINTS_PER_FRAME = 2000;
const BLOCK_SIZE = 16;

let images = {};

const state = {
    images: {},
    images_loaded: false,
    color_wheel_dirty: true,
    palette: PALETTES[Object.keys(PALETTES)[0]],
    pattern: ROSETTES[Object.keys(ROSETTES)[0]],
}

function make_rosette_select() {
    const sel = createSelect();
    sel.position(10, 10);
    for (const x of Object.keys(ROSETTES)) {
        sel.option(x);
    }
    sel.changed(change_rosette);
}

function change_rosette(e) {
    const selected = e.target.value;
    pattern = ROSETTES[selected];
    background(0);
}

function make_palette_select() {
    const sel = createSelect();
    sel.position(width / 2 + 10, 10);
    for (const x of Object.keys(PALETTES)) {
        sel.option(x);
    }
    sel.changed(change_palette);
}

function change_palette(e) {
    const selected = e.target.value;
    palette = PALETTES[selected];
    background(0);
}

function setup() {
    createCanvas(2 * 500, 700);
    background(0);
    make_rosette_select();
    make_palette_select();
    refresh();
}

function draw() {
    refresh();
}

function refresh() {
    compute_polynomial();
    show_color_wheel();
}

function get_z(p, x, y) {
    const hw = p.width / 2.0;
    const hh = p.height / 2.0;
    const u = (x - hw) / hw * MAX_X;
    const v = -(y - hh) / hw * MAX_X;
    
    return new Complex(u, v);
}

function random_box(x, y, w, h) {
    const rand_x = round(w * random() + x);
    const rand_y = round(h * random() + y);
    return [rand_x, rand_y];
}

/*
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

function compute_polynomial(p, pattern, palette) {
    if (palette.uses_hsb) {
        p.colorMode(p.HSB, 1, 1, 1, 1);
    }

    const blocks_wide = Math.ceil(p.width / BLOCK_SIZE);
    const blocks_tall = Math.ceil(p.height / BLOCK_SIZE);
    const x_offset = p.frameCount % BLOCK_SIZE;
    const y_offset = Math.floor(p.frameCount / BLOCK_SIZE) % BLOCK_SIZE;

    p.noFill();
    for (let i = 0; i < blocks_wide; i++) {
        const x = i * BLOCK_SIZE + x_offset;

        for (let j = 0; j < blocks_tall; j++) {
            const y = j * BLOCK_SIZE + y_offset;
            const z = get_z(p, x, y);
            const w = pattern.compute(z);
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
        state.images.abstract = p.loadImage('abstract.jpg', (img) => {
            img.loadPixels();
            state.images_loaded = true;
        });
    };

    p.setup = () => {
        p.createCanvas(500, 700);
        p.background(0);
    };

    p.draw = () => {
        interleave_render(p, state.palette, z => {
            return state.pattern.compute(z);
        });
    }
};

function show_color_wheel(p, palette) {
    if (palette.uses_hsb) {
        p.colorMode(p.HSB, 1, 1, 1, 1);
    }

    p.noFill();
    for (let x = 0; x < p.width; x++) {
        for (let y = 0; y < p.height; y++) {
            const z = get_z(p, x, y);
            const c = palette.get_color(p, z);
            p.stroke(c);
            p.point(x, y);
        }
    }

    if (palette.uses_hsb) {
        p.colorMode(p.RGB, 255, 255, 255, 255);
    }
}

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

        // To display the color wheel, just render the
        // identity function, f(z) = z
        interleave_render(p, state.palette, z => z);
    }
};
