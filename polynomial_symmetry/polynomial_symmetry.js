let polyline_model;

const log = new Log();
const symmetries = new SymmetryManager();
const textures = new TextureManager([256, 256]);
const poly_shader = new PolynomialShader();
const rosette_curve_shader = new RosetteCurveShader();

let image_texture;
let show_curves = false;

const BUILT_IN_TEXTURES = {
    checkerboard: new Checkerboard(),
    half_planes: new HalfPlanes()
};

const webcam = new WebcamTexture();

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

const DEFAULT_SYMMETRY = new SymmetryRule({
    folds: 4,
    input_rotation: 1
});

let zoom = 3;
const ZOOM_DELTA = 0.5;

function preload() {
    polyline_model = loadModel('assets/polyline.obj');
}

function setup() {
    const canvas = createCanvas(400, 400, WEBGL);
    canvas.parent('p5-canvas');
    canvas.canvas.addEventListener('wheel', update_zoom);
    textureMode(NORMAL);
    
    log.connect();
    
    // Setup the shader
    poly_shader.init_shader();
    poly_shader.set_zoom(zoom);
    poly_shader.set_coefficients(DEFAULT_COEFFICIENTS);
    poly_shader.set_animation(DEFAULT_ANIMATION);
    poly_shader.disable();
    
    rosette_curve_shader.init_shader();
    rosette_curve_shader.set_zoom(zoom);
    rosette_curve_shader.set_coefficients(DEFAULT_COEFFICIENTS);
    rosette_curve_shader.set_animation(DEFAULT_ANIMATION);
    rosette_curve_shader.disable();
    
    symmetries.shaders = [poly_shader, rosette_curve_shader];
    symmetries.add_symmetry(DEFAULT_SYMMETRY);
    symmetries.update_panel();
    
    textures.shaders = [poly_shader, rosette_curve_shader];
    textures.texture = BUILT_IN_TEXTURES.checkerboard;
    
    attach_handlers();
}

function setup_texture_dropdown() {
    const dropdown = document.getElementById('builtin-select');
    for (const key of Object.keys(BUILT_IN_TEXTURES)) {
        const option = document.createElement('option');
        option.value = key;
        option.innerHTML = key;
        dropdown.appendChild(option);
    }
    
    dropdown.addEventListener('change', select_texture);
}

function select_texture(e) {
    textures.texture = BUILT_IN_TEXTURES[e.target.value];
}

function attach_handlers() {
    // Hook up the image input dialog
    const image_input = document.getElementById('image-input');
    image_input.addEventListener('change', upload_image);
    
    // Update coefficients
    const update_button = document.getElementById('update-params');
    update_button.addEventListener('click', update_coefficients);
    
    // Random 10 coefficients
    const random_button = document.getElementById('random-params');
    random_button.addEventListener('click', set_random_coefficients);
    
    // Update Symmetry Rule
    const symmetry_button = document.getElementById('add-point-symmetry');
    symmetry_button.addEventListener('click', add_point_symmetry);
    
    const webcam_button = document.getElementById('use-webcam');
    webcam_button.addEventListener('click', use_webcam);
    
    const clear_symmetry_button = document.getElementById('clear-symmetries');
    clear_symmetry_button.addEventListener('click', clear_symmetries);
    
    const toggle_ref_geometry = document.getElementById('toggle-ref-geometry');
    toggle_ref_geometry.addEventListener('click', update_ref_geometry);
    
    const toggle_curve = document.getElementById('toggle-display-curves');
    toggle_curve.addEventListener('click', update_display_curves);
    
    setup_texture_dropdown();
}

function use_webcam() {
    textures.texture = webcam;
}

function update_ref_geometry(e) {
    const show_ref_geometry = e.target.checked;
    poly_shader.set_show_ref_geometry(show_ref_geometry);
}

function update_display_curves(e) {
    show_curves = e.target.checked;
}

function draw() {
    background(0);
    poly_shader.draw();
    
    if (show_curves) {
        rosette_curve_shader.draw();
    }
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
        const tex = new ImageTexture(img);
        textures.texture = tex;
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
    
    /*
    const animation_input = document.getElementById('animation');
    const anim_params = parse_animation_params(animation_input.value);
    
    if (anim_params.length > 0) {
        poly_shader.set_animation(anim_params);
    }
    */
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
        
        const [n, m, amp, phase] = coeffs;
        const adjusted_phase = mod(radians(phase), TWO_PI);
        
        tuples.push([n, m, amp, adjusted_phase]);
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

function add_point_symmetry() {
    const symmetry = new SymmetryRule({
        folds: value_or_default('folds', 1),
        input_rotation: value_or_default('in-rotation', 0),
        input_mirror: value_or_default('in-reflection', 0),
        input_inversion: value_or_default('inversion', 0),
        output_rotation: value_or_default('out-rotation', 0),
        output_mirror: value_or_default('out-reflection', 0),
    });
    symmetries.add_symmetry(symmetry);
}

function clear_symmetries() {
    symmetries.clear_symmetries();
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
