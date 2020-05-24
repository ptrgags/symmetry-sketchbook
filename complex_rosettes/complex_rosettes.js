const MAX_X = 1.5;
const THICKNESS = 2.0;
const COLOR_WHEEL_SECTORS = 5 * 1;
const ZERO_THRESHOLD = 0.2;
const MAX_THRESHOLD = 1e9;
const POINTS_PER_FRAME = 2000;
let palette = PALETTES[Object.keys(PALETTES)[0]];
let pattern = ROSETTES[Object.keys(ROSETTES)[0]];

let display_polynomial = true;
let images = {};

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

function preload() {
    images = {
        abstract: loadImage('abstract.jpg'),
    };
}

function setup() {
    createCanvas(2 * 500, 750);
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

function get_z(x, y) {
    const w = width / 2;
    const hw = w / 2.0;
    const hh = height / 2.0;
    const u = (x - hw) / hw * MAX_X;
    const v = -(y - hh) / hw * MAX_X;
    
    return new Complex(u, v);
}

function random_box(x, y, w, h) {
    const rand_x = round(w * random() + x);
    const rand_y = round(h * random() + y);
    return [rand_x, rand_y];
}

function show_color_wheel() {
    enable_hsb(palette);
    for (let i = 0; i < POINTS_PER_FRAME; i++) {
        const [x, y] = random_box(0, 0, width / 2, height);
        const z = get_z(x, y);
        const c = palette.get_color(z);
        noFill();
        stroke(c);
        point(x + width / 2, y);
    }
    disable_hsb(palette);
    
    fill(255);
    stroke(0);
    textSize(16);
}

function compute_polynomial() {
    enable_hsb(palette);
    for (let i = 0; i < POINTS_PER_FRAME; i++) {
        const [x, y] = random_box(0, 0, width / 2, height);
        const z = get_z(x, y);
        const w = pattern.compute(z);
        const c = palette.get_color(w);
        noFill();
        stroke(c);
        point(x, y);
    }
    disable_hsb(palette);
}

function keyReleased() {
    if (key === ' ') {
        display_polynomial = !display_polynomial;
        background(0);
    }
}
