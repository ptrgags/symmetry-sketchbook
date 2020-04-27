let image_input;
let update_button;

let image_texture;
const poly_shader = new PolynomialShader();
const placeholder = new Checkerboard();
const DEFAULT_COEFFICIENTS = new Coefficients([
    [1, 0, 1, 0],
    [2, 0, 1/2, 0],
    [3, 0, 1/3, 90]
]);
const DEFAULT_ANIMATION = [
    0,
    1,
    0
];

const SYMM_NONE = new SymmetryRule();

/*
const SYMM_IN_MIRROR = new SymmetryRule({
    input_mirror: 1
});
*/

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

/*
 * Need to handle self-partners
const SYMM_IN_ROTATION = new SymmetryRule({
    folds: 3,
    input_rotation: 1
});


const SYMM_IN_MIRROR_OUT_MIRROR = new SymmetryRule({
    input_mirror: 1,
    output_mirror: 1,
});
*/

let zoom = 3;
const ZOOM_DELTA = 0.5;

function setup() {
    createCanvas(512, 512, WEBGL);
    textureMode(NORMAL);
    
    // Create the placeholder image
    placeholder.make_graphics(256, 256);
    
    // Setup the shader
    poly_shader.init_shader();
    poly_shader.set_zoom(zoom);
    poly_shader.symmetries = [SYMM_IN_CIRCLE_INVERSION];
    poly_shader.set_texture(placeholder);
    
    poly_shader.set_coefficients(DEFAULT_COEFFICIENTS);
    poly_shader.set_animation(DEFAULT_ANIMATION);
    poly_shader.disable();
    
    // Hook up the image input dialog
    image_input = document.getElementById('image-input');
    image_input.addEventListener('change', upload_image);
    
    //Update coefficients
    update_button = document.getElementById('update-image');
    update_button.addEventListener('click', update_coefficients);
}

function draw() {
    background(0);
    poly_shader.draw();
    
    /*
    stroke(0, 255, 255);
    strokeWeight(4);
    noFill();
    beginShape(LINES);
    vertex(0, 0);
    vertex(255, 255);
    endShape();
    */
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

function update_coefficients() {
    const coeff_input = document.getElementById('coeffs');
    const coefficients = parse_coefficients(coeff_input.value);
    poly_shader.set_coefficients(coefficients);
    
    if (coefficients.length > 0) {
        poly_shader.set_coefficients(coefficients);
    }
    
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

function mouseWheel(event) {
    zoom += ZOOM_DELTA * -Math.sign(event.wheelDeltaY);
    zoom = max(zoom, ZOOM_DELTA);
    poly_shader.set_zoom(zoom);
}
