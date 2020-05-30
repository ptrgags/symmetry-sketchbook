import { Log } from './Log.js';
import { TextureManager, SymmetryManager, ShaderManager } from './managers.js';
import { PolynomialShader } from './shaders/PolynomialShader.js';
import { DemoShader } from './shaders/DemoShader.js';
import { RosetteCurveShader } from './shaders/RosetteCurveShader.js';
import { WallpaperShader } from './shaders/WallpaperShader.js';
import { RubberSheetShader } from './shaders/RubberSheetShader.js';
import { Checkerboard, HalfPlanes, WebcamTexture } from './Texture.js';
import { Coefficients } from './Coefficients.js';
import { PointSymmetry } from './PointSymmetry.js';
import { WallpaperSymmetry } from './WallpaperSymmetry.js';
import { MAX_TERMS, TWO_PI, mod } from './math_util.js';

import './components/Checkbox.js';
import './components/Dropdown.js';

window.log = new Log();
const shaders = new ShaderManager();
const symmetries = new SymmetryManager(shaders);
const textures = new TextureManager(shaders, [256, 256]);

const SHADER_OPTIONS = [{
    label: 'Polynomial Rosettes',
    value: 'poly-rosette',
    shader: new PolynomialShader('rosette')
}, {
    label: 'Polynomial Friezes',
    value: 'poly-frieze',
    shader: new PolynomialShader('frieze')
}, {
    label: 'Parametric Rosette Curves',
    value: 'rosette-curve',
    shader: new RosetteCurveShader()
}, {
    label: '"Tie-dye" Rosettes',
    value: 'tie-dye-rosette',
    shader: new DemoShader('rosette')
}, {
    label: '"Tie-dye" Friezes',
    value: 'tie-dye-frieze',
    shader: new DemoShader('frieze')
}, {
    label: 'Wallpaper',
    value: 'wallpaper',
    shader: new WallpaperShader()
}, {
    label: 'Rubber Sheet',
    value: 'rubber-sheet',
    shader: new RubberSheetShader()
}];

for (const {value, shader} of SHADER_OPTIONS) {
    shaders.add_shader(value, shader);
}

const LATTICE_OPTIONS = [{
    label: 'Square',
    value: 'square'
}, {
    label: 'Rectangle',
    value: 'rectangle'
}, {
    label: 'Rhombus',
    value: 'rhombus'
}, {
    label: 'Hexagon',
    value: 'hexagon',
}, {
    label: 'Parallelogram',
    value: 'parallelogram',
}, {
    label: 'Random',
    value: 'random'
}];

function random_vec() {
    const x = 2.0 * Math.random() - 1.0;
    const y = 2.0 * Math.random() - 1.0;
    return [x, y]
}

const THIRD_TURN = 2.0 * Math.PI / 3.0;
const LATTICE_BASIS_VECTORS = {
    'square': [
        [1, 0],
        [0, 1],
    ], 
    'rectangle': [
        [2, 0],
        [0, 1]
    ],
    'rhombus': [
        [1, 2],
        [1, -2]
    ],
    'hexagon': [
        [1, 0],
        [Math.cos(THIRD_TURN), Math.sin(THIRD_TURN)]
    ],
    'parallelogram': [
        [1, 0],
        [1, 2]
    ],
    'random': [
        random_vec(),
        random_vec()
    ],
};

const BUILT_IN_TEXTURES = {
    checkerboard: new Checkerboard(),
    half_planes: new HalfPlanes()
};
const BUILT_IN_TEXTURE_OPTIONS = Object.keys(BUILT_IN_TEXTURES).map(key => {
    return {label: key, value: key};
});

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

let enable_standing_waves = false;
let zoom = 3;
const ZOOM_DELTA = 0.5;

function preload(sketch) {
    shaders.preload(sketch);
}

function pick_size() {
    const container = find("#canvas-pane");
    const style = getComputedStyle(container);
    const margin = 2 * 16;
    return [
        parseFloat(style.width) - margin,
        parseFloat(style.height) - margin
    ];
}

function setup(sketch) {
    const [w, h] = pick_size();
    const canvas = sketch.createCanvas(w, h, sketch.WEBGL);
    canvas.parent('p5-canvas');
    canvas.canvas.addEventListener('wheel', update_zoom);
    sketch.textureMode(sketch.NORMAL);
    
    log.connect();

    shaders.init(sketch);
    shaders.set_uniform('zoom', zoom);
    shaders.set_uniform('aspect', w / h);
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

function select_texture(name) {
    textures.texture = BUILT_IN_TEXTURES[name];
}

function find(query) {
    return document.querySelector(query);
}

function attach_handlers() {
    find('#image-input').addEventListener('change', upload_image); 
    find('#update-params').addEventListener('click', update_coefficients); 
    find('#random-params').addEventListener('click', set_random_coefficients);
    find('#quasi-params-5').addEventListener('click', set_quasi_coefficients(5));
    find('#quasi-params-7').addEventListener('click', set_quasi_coefficients(7));

    find('#update-animation').addEventListener('click', update_animation); 
    find('#random-animation').addEventListener('click', random_animation);
    find('#no-animation').addEventListener('click', no_animation); 
    find('#add-point-symmetry').addEventListener('click', add_point_symmetry); 
    find('#add-wallpaper-symmetry').addEventListener('click', add_wallpaper_symmetry); 
    find('#use-webcam').addEventListener('click', use_webcam); 
    find('#clear-symmetries').addEventListener('click', clear_symmetries);

    find('#toggle-standing-waves').click(toggle_standing_waves);
    find('#toggle-wave-components').click(toggle_wave_components);
    find('#toggle-ref-geometry').click(update_ref_geometry);

    find('#builtin-textures')
        .set_options(BUILT_IN_TEXTURE_OPTIONS)
        .change(select_texture);

    find('#shader-select')
        .set_options(SHADER_OPTIONS)
        .change(select_shader);

    find('#lattice-select')
        .set_options(LATTICE_OPTIONS)
        .change(select_lattice);
}

function use_webcam() {
    textures.texture = webcam;
}

function toggle_standing_waves(checked) {
    shaders.set_uniform('enable_standing_waves', checked);
}

function toggle_wave_components(checked) {
    shaders.set_uniform('show_wave_components', checked);
}

function update_ref_geometry(checked) {
    shaders.set_uniform('show_ref_geometry', checked);
}

function select_shader(shader_id) {
    shaders.hide_all();
    shaders.set_show(shader_id, true);
}

function select_lattice(lattice_type) {
    const [e1, e2] = LATTICE_BASIS_VECTORS[lattice_type];
    shaders.set_lattice(e1, e2);
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

function set_quasi_coefficients(k) {
    return () => {
        const terms = [];
        for (let i = 0; i < k; i++) {
            const angle = i * TWO_PI / k;
            const n = sketch.cos(angle);
            const m = sketch.sin(angle);
            const amp = 1.0;
            const phase = 0.0;
            terms.push([n, m, amp, phase]);
        }

        const coeffs = new Coefficients(terms);
        shaders.set_coefficients(coeffs);

    };
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
        const adjusted_phase = mod(sketch.radians(phase), TWO_PI);
        
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

function add_wallpaper_symmetry() {
    const symmetry = new WallpaperSymmetry({
        negate: checkbox_int('#rule-negate-nm'),
        negate_n: checkbox_int('#rule-negate-n'),
        negate_m: checkbox_int('#rule-negate-m'),
        swap: checkbox_int('#rule-swap-nm'),
        rotate_n: checkbox_int('#rule-rot-n'),
        rotate_nm: checkbox_int('#rule-rot-nm'),
        hex: checkbox_int('#rule-hex'),
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

function mouse_moved(sketch) {
    const mouse_uv = [sketch.mouseX / sketch.width, 1.0 - sketch.mouseY / sketch.height];
    shaders.set_mouse_uv(mouse_uv);
}

let pan = {x: 0, y: 0};
function mouse_dragged(sketch, event) {
    pan.x += event.movementX;
    pan.y += event.movementY;

    const pan_uv = [pan.x / sketch.width, -pan.y / sketch.height];
    shaders.set_pan_uv(pan_uv);
}

function resize(sketch) {
    const [w, h] = pick_size();
    sketch.resizeCanvas(w, h);
    shaders.set_uniform('aspect', w / h);
}

function main() {
    const closure = (sketch) => {
        sketch.preload = () => preload(sketch);
        sketch.setup = () => setup(sketch);
        sketch.draw = () => draw(sketch);
        sketch.mouseMoved = () => mouse_moved(sketch);
        sketch.windowResized = () => resize(sketch);
        sketch.mouseDragged = (event) => mouse_dragged(sketch, event);
    }
    window.sketch = new p5(closure);
}

main();
