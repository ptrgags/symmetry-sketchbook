let image_input;
let update_button;

let image_texture;
let poly_shader = new PolynomialShader();
const placeholder = new Checkerboard();

let zoom = 1.0;
const ZOOM_DELTA = 0.5;

function setup() {
    createCanvas(1500 / 4, 2100 / 4, WEBGL);
    textureMode(NORMAL);
    
    // Create the placeholder image
    placeholder.make_graphics(256, 256);
    
    // Setup the shader
    poly_shader.init_shader();
    poly_shader.set_texture(placeholder);
    
    // This is a hack for now, eventually I plan to make a Coefficients class.
    const default_coefficients = {
        // z + (1/2)z^2 + 1/3(z^3)
        powers: [1, 0, 2, 0, 3, 0],
        coeffs: [1, 0, 1/2, 0, 1/3, 0]
    };
    const default_animation = [0, 0, 1,];
    
    poly_shader.set_coefficients(default_coefficients);
    poly_shader.set_animation(default_animation);
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
    
    stroke(0, 255, 255);
    strokeWeight(4);
    noFill();
    beginShape(LINES);
    vertex(0, 0);
    vertex(255, 255);
    endShape();
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
    
    //const animation_input = document.getElementById('animation');
}

function * parse_tuples(text) {
    const tuple_regex = /\(([^)]*)\)/g;
    const separator_regex = /, */;
    
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
    indices = [];
    coefficients = [];
    for (const tuple of parse_tuples(text)) {
        if (tuple.length < 2 || 4 < tuple.length) {
            console.warn(`Coefficients should have 2-4 components, got ${tuple} instead`);
        }

        // Start with defaults and fill in what values are given
        const coeffs = [0, 0, 1, 0,];
        for (let i = 0; i < tuple.length; i++) {
            coeffs[i] = tuple[i];
        }
        
        const [n, m, amp, phase_deg] = coeffs;
        
        indices.push(n, m);
        coefficients.push(amp, radians(phase_deg));
    }
    
    // Most of the time the user will only enter a few terms. However,
    // to ensure the polynomial is computed properly, set all the remaining
    // terms to 0.
    while (indices.length < 2 * MAX_TERMS) {
        indices.push(0, 0);
        coefficients.push(0, 0);
    }
    
    // TODO: Return a Coefficients object eventually
    return {
        powers: indices, 
        coeffs: coefficients
    };
}

function mouseWheel(event) {
    zoom += ZOOM_DELTA * -Math.sign(event.wheelDeltaY);
    zoom = max(zoom, ZOOM_DELTA);
    poly_shader.set_zoom(zoom);
}
