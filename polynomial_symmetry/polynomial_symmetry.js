import { Log } from './Log.js';
import { TextureManager, SymmetryManager, ShaderManager } from './managers.js';
import { PolynomialShader } from './shaders/PolynomialShader.js';
import { DemoShader } from './shaders/DemoShader.js';
import { RosetteCurveShader } from './shaders/RosetteCurveShader.js';
import { WallpaperShader } from './shaders/WallpaperShader.js';
import { Coefficients } from './Coefficients.js';
import { PointSymmetry } from './PointSymmetry.js';
import { BUILT_IN_TEXTURES } from './Texture.js';
import { 
    WallpaperSymmetry,
    LATTICE_BASIS_VECTORS
} from './WallpaperSymmetry.js';
import { MAX_TERMS, TWO_PI, mod } from './math_util.js';
import { find } from './core/ui_util.js';

import './components/Checkbox.js';
import './components/Dropdown.js';
import './components/TextureSettings.js';
import './components/CoefficientSettings.js';
import './components/PointSymmetryPicker.js';

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

const DEFAULT_COEFFICIENTS = new Coefficients([
    [1, 1, 1, 0],
    [3, 1, 1/3, 0],
    [5, 1, 1/5, 0],
    [6, 0, 1/6, 0],
]);
const DEFAULT_ANIMATION = [
    1,
    0.5,
    0.8
];

const DEFAULT_SYMMETRY = new PointSymmetry({
    folds: 3,
    input_rotation: 1
});

let zoom = 3;
const ZOOM_DELTA = 0.5;

function preload(sketch) {
    shaders.preload(sketch);
}

function setup(sketch) {
    const canvas = sketch.createCanvas(500, 700, sketch.WEBGL);

    canvas.parent('p5-canvas');
    canvas.canvas.addEventListener('wheel', update_zoom);
    sketch.textureMode(sketch.NORMAL);
    
    log.connect();

    shaders.init(sketch);
    shaders.set_uniform('zoom', zoom);
    shaders.set_uniform('aspect', 5/7);
    shaders.set_coefficients(DEFAULT_COEFFICIENTS);
    shaders.set_animation(DEFAULT_ANIMATION);
    shaders.disable_all();
    shaders.set_show('poly-rosette', true);
    
    symmetries.add_symmetry(DEFAULT_SYMMETRY);
    symmetries.update_panel();
    
    textures.init(sketch);
    textures.texture = BUILT_IN_TEXTURES.checkerboard;
    
    attach_handlers(sketch);
}

function change_texture(texture) {
    textures.texture = texture;
}

function change_coefficients(coefficients) {
    shaders.set_coefficients(coefficients);
}

function add_point_symmetry(symmetry) {
    symmetries.add_symmetry(symmetry);
}

function attach_handlers(sketch) {
    // The TextureSettings UI needs a reference to the sketch in order
    // to load images as p5.Image
    find('#texture-settings')
        .set_sketch(sketch)
        .on_texture_changed(change_texture);
    
    find('#coefficient-settings')
        .on_coefficients_changed(change_coefficients);

    find('#update-animation').addEventListener('click', update_animation); 
    find('#random-animation').addEventListener('click', random_animation);
    find('#no-animation').addEventListener('click', no_animation); 
    find('#set-wallpaper-symmetry').addEventListener('click', set_wallpaper_symmetry); 
    find('#clear-symmetries').addEventListener('click', clear_symmetries);

    find('#toggle-standing-waves').click(toggle_standing_waves);
    find('#toggle-wave-components').click(toggle_wave_components);
    find('#toggle-ref-geometry').click(update_ref_geometry);

    find('#add-point-symmetry')
        .on_submit(add_point_symmetry);

    find('#shader-select')
        .set_options(SHADER_OPTIONS)
        .on_change(select_shader);

    find('#lattice-select')
        .set_options(LATTICE_OPTIONS)
        .on_change(select_lattice);

    find('#wallpaper-select')
        .set_options(WallpaperSymmetry.preset_options)
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

function set_wallpaper_symmetry() {
    const preset_name = find('#wallpaper-select').value;
    const symmetry = WallpaperSymmetry.from_preset(preset_name);

    symmetries.clear_symmetries();
    symmetries.add_symmetry(symmetry);

    shaders.set_lattice(...symmetry.lattice);
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

function main() {
    const closure = (sketch) => {
        sketch.preload = () => preload(sketch);
        sketch.setup = () => setup(sketch);
        sketch.draw = () => draw(sketch);
        sketch.mouseMoved = () => mouse_moved(sketch);
        sketch.mouseDragged = (event) => mouse_dragged(sketch, event);
    }
    window.sketch = new p5(closure);
}

main();
