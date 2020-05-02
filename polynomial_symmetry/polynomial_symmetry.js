let image_input;
let update_button;

let polyline_model;

let image_texture;
const log = new Log();
const poly_shader = new PolynomialShader();
const rosette_curve_shader = new RosetteCurveShader();
const placeholder = new Checkerboard();
//const placeholder = new HalfPlanes();
const DEFAULT_COEFFICIENTS = new Coefficients([
    [1, 0, 1, 0],
    [2, 0, 1/2, 0],
    [3, 0, 1/3, 0],
    [4, 0, 1/4, 0],
    [5, 0, 1/5, 0],
    [6, 0, 1/6, 0],
    [7, 0, 1/7, 0],
    [8, 0, 1/8, 0],
    [9, 0, 1/9, 0]
]);
const DEFAULT_ANIMATION = [
    0,
    0,
    0
];

const SYMM_NONE = new SymmetryRule();

const SYMM_IN_MIRROR = new SymmetryRule({
    input_mirror: 1
});

const SYMM_IN_INVERSION = new SymmetryRule({
    input_inversion: 1
});

const SYMM_IN_CIRCLE_INVERSION = new SymmetryRule({
    input_mirror: 1,
    input_inversion: 1
});

const SYMM_OUT_MIRROR = new SymmetryRule({
    output_mirror: 1
});

const SYMM_IN_ROTATION = new SymmetryRule({
    folds: 4,
    input_rotation: 1
});

const SYMM_IN_MIRROR_OUT_MIRROR = new SymmetryRule({
    input_mirror: 1,
    output_mirror: 1,
});

let zoom = 3;
const ZOOM_DELTA = 0.5;

function preload() {
    polyline_model = loadModel('assets/polyline.obj');
}

function setup() {
    const canvas = createCanvas(512, 512, WEBGL);
    canvas.parent('p5-canvas');
    canvas.canvas.addEventListener('wheel', update_zoom);
    textureMode(NORMAL);
    
    const camera_texture = new WebcamTexture();
    camera_texture.make_graphics();
    
    log.connect();
    
    // Create the placeholder image
    placeholder.make_graphics(256, 256);
    
    // Setup the shader
    poly_shader.init_shader();
    poly_shader.set_zoom(zoom);
    poly_shader.symmetries = [SYMM_IN_ROTATION];
    poly_shader.set_texture(placeholder);
    //poly_shader.set_texture(camera_texture);
    
    poly_shader.set_coefficients(DEFAULT_COEFFICIENTS);
    poly_shader.set_animation(DEFAULT_ANIMATION);
    poly_shader.disable();
    
    rosette_curve_shader.init_shader();
    rosette_curve_shader.set_zoom(zoom);
    rosette_curve_shader.symmetries = [SYMM_IN_ROTATION];
    rosette_curve_shader.set_coefficients(DEFAULT_COEFFICIENTS);
    rosette_curve_shader.set_animation(DEFAULT_ANIMATION);
    rosette_curve_shader.disable();
    
    // Hook up the image input dialog
    image_input = document.getElementById('image-input');
    image_input.addEventListener('change', upload_image);
    
    // Update coefficients
    update_button = document.getElementById('update-params');
    update_button.addEventListener('click', update_coefficients);
    
    // Random 10 coefficients
    random_button = document.getElementById('random-params');
    random_button.addEventListener('click', set_random_coefficients);
    
    // Update Symmetry Rule
    symmetry_button = document.getElementById('update-symmetry');
    symmetry_button.addEventListener('click', update_symmetry);
}

function draw() {
    background(0);
    poly_shader.draw();
    rosette_curve_shader.draw();
}

function upload_image(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
        const url = e.target.result;
        update_texture(url);
    });
    reader.readAsDataURL(file);
}

function update_texture(url) {
    loadImage(url, img => {
        const texture = new ImageTexture(img);
        poly_shader.set_texture(texture);
    });
}

function set_random_coefficients() {
    terms = [];
    for (let i = 0; i < 10; i++) {
        const n = floor(random(-10, 10 + 1));
        const m = floor(random(-10, 10 + 1));
        const amp = 1.0 / (n - m + 1);
        const phase = random(TWO_PI);
        terms.push([n, m, amp, phase]);
    }
    
    const coeffs = new Coefficients(terms);
    poly_shader.set_coefficients(coeffs);
    rosette_curve_shader.set_coefficients(coeffs);
}

function update_coefficients() {
    const coeff_input = document.getElementById('coeffs');
    const coefficients = parse_coefficients(coeff_input.value);
    poly_shader.set_coefficients(coefficients);
    rosette_curve_shader.set_coefficients(coefficients);
    
    const animation_input = document.getElementById('animation');
    const anim_params = parse_animation_params(animation_input.value);
    
    if (anim_params.length > 0) {
        poly_shader.set_animation(anim_params);
    }
}

function * parse_tuples(text) {
    const tuple_regex = /\(([^)]*)\)/g;
    const separator_regex = /,\s*/;
    
    var match = tuple_regex.exec(text);
    while(match) {
        const tuple = match[1];
        const fields = tuple.split(separator_regex);
        const values = fields.map(parseFloat);
        yield values;
        match = tuple_regex.exec(text);
    }
}

function parse_coefficients(text) {
    tuples = [];
    for (const tuple of parse_tuples(text)) {
        if (tuple.length < 2 || 4 < tuple.length) {
            console.warn(`Coefficients should have 2-4 components, got ${tuple} instead`);
        }

        // Start with defaults and fill in what values are given
        const coeffs = [0, 0, 1, 0,];
        for (let i = 0; i < tuple.length; i++) {
            coeffs[i] = tuple[i];
        }
        
        tuples.push(coeffs);
    }
    
    return new Coefficients(tuples);
}

function parse_animation_params(text) {
    params = [];
    for (const token of text.split(/,\s*/)) {
        if (token === '') {
            continue;
        }
        
        params.push(parseFloat(token));
    }
    return params;
}

function value_or_default(id, default_val) {
    const element = document.getElementById(id);
    const value = parseInt(element.value);
    
    if (isFinite(value)) {
        return value;
    }
    
    return default_val;
}

function update_symmetry() {
    const symmetry = new SymmetryRule({
        folds: value_or_default('folds', 1),
        input_rotation: value_or_default('in-rotation', 0),
        input_mirror: value_or_default('in-reflection', 0),
        input_inversion: value_or_default('inversion', 0),
        output_rotation: value_or_default('out-rotation', 0),
        output_mirror: value_or_default('out-reflection', 0),
    });
    poly_shader.symmetries = [symmetry];
    poly_shader.set_coefficients();
    
    rosette_curve_shader.symmetries = [symmetry];
    rosette_curve_shader.set_coefficients();
}

function update_zoom(event) {
    zoom += ZOOM_DELTA * -Math.sign(event.wheelDeltaY);
    zoom = max(zoom, ZOOM_DELTA);
    poly_shader.set_zoom(zoom);
    rosette_curve_shader.set_zoom(zoom);
    
    event.preventDefault();
}

function mouseMoved() {
    const mouse_uv = [mouseX / width, 1.0 - mouseY / height];
    rosette_curve_shader.set_mouse_uv(mouse_uv);
}
