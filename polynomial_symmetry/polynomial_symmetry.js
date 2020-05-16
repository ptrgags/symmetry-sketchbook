import { Log } from './Log.js';
import { TextureManager, SymmetryManager, ShaderManager } from './managers.js';
import { PolynomialShader } from './shaders/PolynomialShader.js';
import { DemoShader } from './shaders/DemoShader.js';
import { RosetteCurveShader } from './shaders/RosetteCurveShader.js';
import { Checkerboard, HalfPlanes, WebcamTexture } from './Texture.js';
import { Coefficients } from './Coefficients.js';
import { PointSymmetry } from './SymmetryRule.js';
import { MAX_TERMS, TWO_PI, mod } from './util.js';

import './components/Checkbox.js';

window.log = new Log();
const shaders = new ShaderManager();
const symmetries = new SymmetryManager(shaders);
const textures = new TextureManager(shaders, [256, 256]);

shaders.add_shader('poly-rosette', new PolynomialShader('rosette'));
shaders.add_shader('poly-frieze', new PolynomialShader('frieze'));
shaders.add_shader('rosette-curve', new RosetteCurveShader('rosette'), true);
shaders.add_shader('demo-rosette', new DemoShader('rosette'));
shaders.add_shader('demo-frieze', new DemoShader('frieze'));

let image_texture;

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
    1,
    0
];

const DEFAULT_SYMMETRY = new PointSymmetry({
    folds: 4,
    input_rotation: 1
});

let zoom = 3;
const ZOOM_DELTA = 0.5;

function preload(sketch) {
    shaders.preload(sketch);
}

function setup(sketch) {
    //const canvas = createCanvas(800, 400, WEBGL);
    const canvas = sketch.createCanvas(400, 400, sketch.WEBGL);
    canvas.parent('p5-canvas');
    canvas.canvas.addEventListener('wheel', update_zoom);
    sketch.textureMode(sketch.NORMAL);
    
    log.connect();

    shaders.init(sketch);
    shaders.set_uniform('zoom', zoom);
    shaders.set_coefficients(DEFAULT_COEFFICIENTS);
    shaders.set_animation(DEFAULT_ANIMATION);
    shaders.disable_all();
    shaders.set_show('poly-rosette', true);
    
    symmetries.add_symmetry(DEFAULT_SYMMETRY);
    symmetries.update_panel();
    
    textures.init(sketch);
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

function find(query) {
    return document.querySelector(query);
}

function attach_handlers() {
    const image_input = document.getElementById('image-input');
    image_input.addEventListener('change', upload_image);
    
    const update_button = document.getElementById('update-params');
    update_button.addEventListener('click', update_coefficients);
    
    const random_button = document.getElementById('random-params');
    random_button.addEventListener('click', set_random_coefficients);

    const update_anim_button = document.getElementById('update-animation');
    update_anim_button.addEventListener('click', update_animation);
    
    // Ideally
    // find('random-animation').click((checked) => ...);
    const random_anim_button = document.getElementById('random-animation');
    random_anim_button.addEventListener('click', random_animation);

    const no_anim_button = document.getElementById('no-animation');
    no_anim_button.addEventListener('click', no_animation);
    
    const symmetry_button = document.getElementById('add-point-symmetry');
    symmetry_button.addEventListener('click', add_point_symmetry);
    
    const webcam_button = document.getElementById('use-webcam');
    webcam_button.addEventListener('click', use_webcam);
    
    const clear_symmetry_button = document.getElementById('clear-symmetries');
    clear_symmetry_button.addEventListener('click', clear_symmetries);

    find('#toggle-ref-geometry').click(update_ref_geometry);
    find('#toggle-display-curves').click(update_display_curves);
    find('#toggle-demo-mode').click(update_demo_mode);
    
    setup_texture_dropdown();
}

function use_webcam() {
    textures.texture = webcam;
}

function update_ref_geometry(checked) {
    shaders.set_uniform('show_ref_geometry', checked);
}

// bluh these display settings should be a dropdown
function update_demo_mode(checked) {
    shaders.set_show('demo-rosette', checked);
    shaders.set_show('poly-rosette', !checked);
}

function update_display_curves(checked) {
    shaders.set_show('demo-rosette', !checked);
    shaders.set_show('poly-rosette', !checked);
    shaders.set_show('rosette-curve', checked);
}

function draw(sketch) {
    sketch.background(0, 40, 45);
    shaders.draw();
}

function upload_image(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
        const url = e.target.result;
        textures.load_image(url);
    });
    reader.readAsDataURL(file);
}

function set_random_coefficients() {
    const terms = [];
    for (let i = 0; i < 10; i++) {
        const n = sketch.floor(sketch.random(-10, 10 + 1));
        const m = sketch.floor(sketch.random(-10, 10 + 1));
        const amp = 1.0 / (n - m + 1);
        const phase = sketch.random(TWO_PI);
        terms.push([n, m, amp, phase]);
    }
    
    const coeffs = new Coefficients(terms);
    shaders.set_coefficients(coeffs);
}

function update_coefficients() {
    const coeff_input = document.getElementById('coeffs');
    const coefficients = parse_coefficients(coeff_input.value);
    shaders.set_coefficients(coefficients); 
}

function update_animation() {
    const animation_input = document.getElementById('animation');
    const anim_params = parse_animation_params(animation_input.value);
    
    if (anim_params.length > 0) {
        shaders.set_animation(anim_params);
    }
}

function random_animation() {
    const anim_params = [];
    for (let i = 0; i < MAX_TERMS; i++) {
        anim_params.push(TWO_PI * sketch.random());
    }
    shaders.set_animation(anim_params);
}

function no_animation() {
    const anim_params = new Array(MAX_TERMS).fill(0);
    shaders.set_animation(anim_params);
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
    const tuples = [];
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
    const params = [];
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

function checkbox_int(query) {
    const checked = find(query).checked;
    return checked ? 1 : 0
}

function add_point_symmetry() {
    const symmetry = new PointSymmetry({
        folds: value_or_default('folds', 1),
        input_rotation: value_or_default('in-rotation', 0),
        input_mirror: checkbox_int('#in-reflection'),
        input_inversion: checkbox_int('#inversion'),
        output_rotation: value_or_default('out-rotation', 0),
        output_mirror: checkbox_int('#out-reflection'),
    });
    symmetries.add_symmetry(symmetry);
}

function clear_symmetries() {
    symmetries.clear_symmetries();
}

function update_zoom(event) {
    zoom += ZOOM_DELTA * -Math.sign(event.wheelDeltaY);
    zoom = Math.max(zoom, ZOOM_DELTA);
    shaders.set_uniform('zoom', zoom);
    
    event.preventDefault();
}

function mouseMoved(sketch) {
    const mouse_uv = [sketch.mouseX / sketch.width, 1.0 - sketch.mouseY / sketch.height];
    shaders.set_mouse_uv(mouse_uv);
}

function main() {
    const closure = (sketch) => {
        sketch.preload = () => preload(sketch);
        sketch.setup = () => setup(sketch);
        sketch.draw = () => draw(sketch);
        sketch.mouseMoved = () => mouseMoved(sketch);
    }
    window.sketch = new p5(closure);
}


main();
