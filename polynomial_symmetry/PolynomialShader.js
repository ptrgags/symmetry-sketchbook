const MAX_TERMS = 64;
const POLYNOMIAL_VERT_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 uv;

void main() {
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = position;
    uv = aTexCoord;
    
    // Flip y.
    uv.y = 1.0 - uv.y;
}
`;

const POLYNOMIAL_FRAG_SHADER = `
#define MAX_TERMS ${MAX_TERMS}
#define PI 3.1415
precision highp float;

varying vec2 uv;

// Texture from p5.js
uniform sampler2D texture0;

// n = powers[i].x = exponent of z
// m = powers[i].y = exponent of conj(z)
uniform vec2 powers[MAX_TERMS];
// a_nm corresponding to the (n, m) in powers
// this represents the coefficient of z^n conj(z)^m
// These are stored as (amplitude, phase). phase is
// in radians.
uniform vec2 coeffs[MAX_TERMS];
// animation parameters. for each (n, m) term
// we have a phase delta, which turns the coefficient into:
// (r, theta + phase_delta * time))
uniform float animation[MAX_TERMS];
// Elapsed time since the page load in seconds.
uniform float time;

// current canvas aspect ratio (width / height);
uniform float aspect;
// Scale factor for zooming
uniform float zoom;

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

vec2 compute_polynomial(vec2 z) {
    vec2 z_polar = to_polar(z);
    vec2 sum = vec2(0.0);
    for (int i = 0; i < MAX_TERMS; i++) {
        // compute a_nm z^n conj(z)^m
        // which can be written as 
        // a_nm.r * z.r^n * exp(i * ((n - m) * z.theta + a_nm.theta)) 
        
        // powers
        vec2 nm = powers[i];
        float n = nm.x;
        float m = nm.y;
        
        // amplitude, phase
        vec2 coeff = coeffs[i];
        
        // Animate the coefficients for a fun twist.
        // (sometimes literally)
        coeff.y += animation[i] * time;
        
        float r = coeff.x * pow(z_polar.x, n + m);
        float theta = z_polar.y * (n - m) + coeff.y;
        
        vec2 rect = to_rect(vec2(r, theta));
        sum += rect;
    }
    return sum;
}

vec2 to_complex(vec2 uv) {
    return (uv - 0.5) * aspect * zoom;
}

vec2 to_uv(vec2 complex) {
    return complex / zoom / aspect + 0.5;
}

void main() {
    vec2 complex = to_complex(uv);
    vec2 z = compute_polynomial(complex);
    vec2 z_uv = to_uv(z);
    vec4 output_color = texture2D(texture0, fract(z_uv));
    
    float unit_circle_dist = abs(length(complex) - 1.0);
    float unit_circle_mask = smoothstep(0.02, 0.01, unit_circle_dist);
    
    float modulus = length(z);
    float far_away = smoothstep(10.0, 50.0, modulus);
    float near_zero = smoothstep(0.11, 0.1, modulus);
    
    const vec4 YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
    const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);
    
    vec4 image = output_color;
    image = mix(image, YELLOW, unit_circle_mask);
    image = mix(image, YELLOW, near_zero);
    image = mix(image, BLACK, far_away);
    gl_FragColor = image;
}
`;

// ====================================================================

class PolynomialShader {
    constructor() {
        this._shader = undefined;
        this._enabled = false;
        this._coeffs = undefined;
        this._symmetries = [];
    }
    
    init_shader() {
        const program = createShader(POLYNOMIAL_VERT_SHADER, POLYNOMIAL_FRAG_SHADER);
        this._shader = program;
        this.enable();
        
        program.setUniform('time', 0.0);
        program.setUniform('zoom', 1.0);
        program.setUniform('aspect', width/height);
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
        if (this.enabled) {
            resetShader();
            this._enabled = false;
        }
    }
    
   draw() {
        this.update_time();
        noStroke();
        
        // This makes sure the alpha channel is enabled for
        // transparent images.
        fill(0, 0, 0, 0);
        
        // Draw a quad that spans the canvas. Since the vertex shader
        // ignores the model matrix, use clip coordinates
        const hw = 1;
        const hh = 1;
        quad(-hw, -hh, hw, -hh, hw, hh, -hw, hh);
        
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
        this.enable();
        const program = this._shader;
        
        // Apply symmetries, which often adds more terms to the polynomial
        const actual_coefficients = this._apply_symmetries(original_coefficients);
        actual_coefficients.normalize();
        const {powers, coeffs} = actual_coefficients.arrays;
        
        // Since we always need to exactly fill the buffer,
        // add on some terms that are all equal to 0 to make sure
        // the calculation is performed correctly
        const powers_buffer = this._pad_zeros(powers, MAX_TERMS * 2);
        const coeffs_buffer = this._pad_zeros(coeffs, MAX_TERMS * 2); 
        
        program.setUniform('powers', powers_buffer);
        program.setUniform('coeffs', coeffs_buffer);
    }
    
    set_animation(animation_params) {
        this.enable();
        const animation_buffer = this._pad_zeros(animation_params, MAX_TERMS);
        this._shader.setUniform('animation', animation_buffer);
    }
}
