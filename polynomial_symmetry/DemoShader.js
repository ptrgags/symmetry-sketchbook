const MAX_TERMS = 64;

const PATTERN_TYPES = {
    ROSETTE: 0,
    FRIEZE: 1
};

const DEMO_VERT_SHADER = (type) => `
#define PATTERN_TYPE ${type}
#define MAX_TERMS ${MAX_TERMS}
#define PI 3.141592
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// n = powers[i].x = exponent of z
// m = powers[i].y = exponent of conj(z)
uniform vec2 powers[MAX_TERMS];
// a_nm corresponding to the (n, m) in powers
// this represents the coefficient of z^n conj(z)^m
// These are stored as (amplitude, phase). phase is
// in radians.
uniform vec2 coeffs[MAX_TERMS];

uniform float aspect;
uniform float zoom;

// Elapsed time since the page load in seconds.
uniform float time;

varying vec2 uv;
varying vec2 warped_pos;

// Mouse position across the canvas. Might be outside
// [0, 1] if the mouse is outside the canvas.
uniform vec2 mouse_uv;

vec2 to_polar(vec2 rect) {
    float r = length(rect);
    float theta = atan(rect.y, rect.x);
    return vec2(r, theta);
}

vec2 to_rect(vec2 polar) {
    float x = polar.x * cos(polar.y);
    float y = polar.x * sin(polar.y);
    return vec2(x, y);
}

#if PATTERN_TYPE == ${PATTERN_TYPES.ROSETTE}
vec2 compute_polynomial(vec2 z) {
    vec2 z_polar = to_polar(z);
    vec2 sum = vec2(0.0);
    for (int i = 0; i < MAX_TERMS; i++) {
        // compute a_nm z^n conj(z)^m
        // which can be written as 
        // a_nm.r * z.r^(n + m) * exp(i * ((n - m) * z.theta + a_nm.theta)) 
        
        // powers
        vec2 nm = powers[i];
        float n = nm.x;
        float m = nm.y;
        
        // amplitude, phase
        vec2 coeff = coeffs[i];
        
        float r = coeff.x * pow(z_polar.x, n + m);
        float theta = z_polar.y * (n - m) + coeff.y;
        
        vec2 rect = to_rect(vec2(r, theta));
        sum += rect;
    }
    return sum;
}
#elif PATTERN_TYPE == ${PATTERN_TYPES.FRIEZE}
vec2 compute_polynomial(vec2 z) {    
    vec2 sum = vec2(0.0);
    for (int i = 0; i < MAX_TERMS; i++) {
        // Frieze symmetry is taken by composing the
        // rosette symmetry polynomial f(z) with Phi(z) = e^iz
        // to form f(Phi(z)) which expands to
        // a_nm.r * exp(-z.y * (n + m)) * expi(z.x * (n - m) + a_nm.theta)
        
        vec2 nm = powers[i];
        float n = nm.x;
        float m = nm.y;
        
        // amplitude, phase
        vec2 a_nm = coeffs[i];
        // Animate the phase
        a_nm.y += animation[i] * time;
        
        float r =  a_nm.x * exp(-z.y * (n + m));
        float theta = z.x * (n - m) + a_nm.y;
        
        vec2 rect = to_rect(vec2(r, theta));
        sum += rect;
        
    }
    return sum;
}
#endif

vec2 to_complex(vec2 uv) {
    return (uv - 0.5) * aspect * zoom;
}

vec2 to_uv(vec2 complex) {
    return complex / zoom / aspect + 0.5;
}

vec2 complex_to_clip(vec2 complex) {
    vec2 uv = to_uv(complex);
    return 2.0 * uv - 1.0;
}

void main() {
    uv = aTexCoord;
    
    vec2 grid_position = aPosition.xy;
    vec2 complex = to_complex(uv);
    vec2 z = compute_polynomial(complex);
    
    warped_pos = complex_to_clip(z);
    
    float t = clamp(mouse_uv.x, 0.0, 1.0);
    vec2 pos = mix(grid_position, warped_pos, t);
    
    gl_Position = vec4(pos, 0.0, 1.0); 
}
`;

const DEMO_FRAG_SHADER = `
#define GRID_WIDTH 49.0
precision highp float;

varying vec2 uv;
varying vec2 warped_pos;

// Texture from p5.js
uniform sampler2D texture0;


// Elapsed time since the page load in seconds.
uniform float time;

// current canvas aspect ratio (widt / height);
uniform float aspect;
// Scale factor for zooming
uniform float zoom;

uniform vec2 mouse_uv;

vec2 to_complex(vec2 uv) {
    return (uv - 0.5) * aspect * zoom;
}

vec2 to_uv(vec2 complex) {
    return complex / zoom / aspect + 0.5;
}

void main() {
    vec2 z_uv = to_uv(warped_pos);
    z_uv.y = 1.0 - z_uv.y;
    vec4 tex_color = texture2D(texture0, fract(z_uv));
    vec4 grid_lines = vec4(1.0);
    float t = clamp(mouse_uv.y, 0.0, 1.0);
    vec4 color = mix(grid_lines, tex_color, t); 
    
    vec2 cell_uv = fract(GRID_WIDTH * uv);
    vec2 from_center = 2.0 * abs(cell_uv - 0.5);
    float dist_from_center = max(from_center.x, from_center.y);
    float mask = 1.0 - step(dist_from_center, 0.8);
    
    gl_FragColor = mask * color;
}
`;

class DemoShader {
    constructor(type) {
        this._shader_type = type;
        this._shader = undefined;
        this._enabled = false;
        this._coeffs = undefined;
        this._initialized = false;
        this._symmetries = [];
    }
    
    init_shader() {
        const program = createShader(DEMO_VERT_SHADER(this._shader_type), DEMO_FRAG_SHADER);
        this._shader = program;
        this.enable();
        
        program.setUniform('time', 0.0);
        program.setUniform('zoom', 1.0);
        program.setUniform('aspect', width/height);
        this._initialized = true;
    }
    
    get symmetries() {
        return this._symmetries;
    }
    
    set symmetries(symmetries) {
        this._symmetries = symmetries;
    }
    
    enable() {        
        if (!this._enabled) {
            shader(this._shader);
            this._enabled = true;
        }
    }
    
    disable() {
        if (this._enabled) {
            resetShader();
            this._enabled = false;
        }
    }
    
   draw() {
        this.update_time();
        fill(0, 0, 0, 0);
        model(grid_model);
        
        // Disable when done to get ready for the next shader
        this.disable();
    }
    
    get shader() {
        return this._shader;
    }
    
    set_zoom(zoom) {
        this.enable();
        this._shader.setUniform('zoom', zoom);
    }
    
    update_time() {
        this.enable();
        this._shader.setUniform('time', millis() / 1000.0);
    }
    
    set_texture(texture) {
        this.enable();
        texture.set_wrapping();
        this._shader.setUniform('texture0', texture.texture);
    }
     
    _pad_zeros(values, desired_length) {
        const len = values.length;
        if (len > desired_length) {
            throw new Error(`Array is too long. Got ${len} elements, it should be ${desired_length}`);
        }
        
        const pad_length = desired_length - len;
        if (pad_length > 0) {
            const padding = Array(pad_length).fill(0);
            return values.concat(padding);
        } else {
            return values;
        }
    }
    
    _apply_symmetries(original_coefficients) {
        let coefficients = original_coefficients;
        for (const symmetry of this._symmetries) {
            coefficients = symmetry.apply_symmetry(coefficients);
        }
        return coefficients;
    }
    
    set_coefficients(original_coefficients) {
        this._coeffs = original_coefficients || this._coeffs;
        
        this.enable();
        const program = this._shader;
        
        // Apply symmetries, which often adds more terms to the polynomial
        const actual_coefficients = this._apply_symmetries(this._coeffs);
        //actual_coefficients.normalize();
        const {powers, coeffs} = actual_coefficients.arrays;
        
        // Since we always need to exactly fill the buffer,
        // add on some terms that are all equal to 0 to make sure
        // the calculation is performed correctly
        const powers_buffer = this._pad_zeros(powers, MAX_TERMS * 2);
        const coeffs_buffer = this._pad_zeros(coeffs, MAX_TERMS * 2); 
        
        program.setUniform('powers', powers_buffer);
        program.setUniform('coeffs', coeffs_buffer);
    }
    
    set_mouse_uv(mouse_uv) {
        // Sometimes mouse events are triggered too early
        if (!this._initialized) {
            return;
        }
        this.enable();
        this._shader.setUniform('mouse_uv', mouse_uv);
    }
}
