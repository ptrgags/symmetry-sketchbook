const ROSETTE_CURVE_VERT_SHADER = `
#define MAX_TERMS ${MAX_TERMS}
#define PI 3.1415
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

varying vec2 uv;

void main() {
    float t = max(aTexCoord.x, aTexCoord.y);
    
    float x = cos(t * 2.0 * PI);
    float y = sin(t * 2.0 * PI);
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = vec4(aTexCoord.x, 0.01 * aTexCoord.y, 0.0, 1.0);
    uv = aTexCoord;
}
`;

const ROSETTE_CURVE_FRAG_SHADER = `
#define MAX_TERMS ${MAX_TERMS}
#define PI 3.1415
precision highp float;

varying vec2 uv;

void main() {
    gl_FragColor = vec4(1.0, 0.0, .0, 1.0);
}
`;

class RosetteCurveShader {
    constructor() {
        this._shader = undefined;
        this._enabled = false;
        this._coeffs = undefined;
        this._symmetries = [];
    }
    
    init_shader() {
        const program = createShader(ROSETTE_CURVE_VERT_SHADER, ROSETTE_CURVE_FRAG_SHADER);
        this._shader = program;
        this.enable();
        
        program.setUniform('time', 0.0);
        program.setUniform('zoom', 1.0);
        program.setUniform('aspect', width/height);
        program.setUniform('show_ref_geometry', 0.0);
    }
    
    get symmetries() {
        return this._symmetries;
    }
    
    set symmetries(symmetries) {
        this._symmetries = symmetries;
        for (const symmetry of this._symmetries) {
            symmetry.log();
        }
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
        
        const NUM_VERTICES = 256;
        
        //quad(0, 0, 1, 0, 1, 1, 0, 1);
        beginShape();
        for (let i = 0; i < NUM_VERTICES; i++) {
            const t = i / (NUM_VERTICES - 1);
            const x = cos(t);
            const y = sin(t);
            vertex(x, y, 0, t, 0);
        }
        endShape();
        
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
    
    set_animation(animation_params) {
        this.enable();
        const animation_buffer = this._pad_zeros(animation_params, MAX_TERMS);
        this._shader.setUniform('animation', animation_buffer);
    }
}
