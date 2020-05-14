const ROSETTE_CURVE_VERT_SHADER = `
#define MAX_TERMS ${MAX_TERMS}
#define THICKNESS 0.01
#define PI 3.1415
attribute vec3 aPosition;

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

// Mouse position across the canvas. Might be outside
// [0, 1] if the mouse is outside the canvas.
uniform vec2 mouse_uv;

varying vec2 uv;
varying vec2 curve;

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

vec2 compute_rosette(vec2 z, float t) {
    vec2 z_polar = to_polar(z);
    vec2 sum = vec2(0.0);
    for (int i = 0; i < MAX_TERMS; i++) {
        // Similar to the polynomial shader, except now
        // we're plugging in the circle z*e^(i * 2pi * t) = r * exp(i * 2pi * t + phase)
        // a_nm circle(z, t)^n conj(circle(z, t))^m
        // = a_nm.r * expi(a_nm.theta) * z.r^n * expi(n * (2pi * t + phase)) * z.r^m * expi(-m * (2pi * t + phase))  
        // = a_nm.r * z.r^(n + m) * expi((n - m) * (2pi * t + phase) + a_nm.theta)
        
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
        float theta = (n - m) * (2.0 * PI * t + z_polar.y) + coeff.y;
        
        vec2 rect = to_rect(vec2(r, theta));
        sum += rect;
    }
    return sum;
}

void main() {
    // Starting point is mouse position. however, offset the line slightly to create some thickness.
    float row = aPosition.y;
    float sidestep = mix(-THICKNESS, THICKNESS, row);
    vec2 direction = normalize(mouse_uv - 0.5);
    vec2 offset_uv = mouse_uv + sidestep * direction;
    vec2 z = to_complex(offset_uv);
    
    float t = aPosition.x;
    
    curve = compute_rosette(z, t);
    vec2 clip_position = complex_to_clip(curve);
    
    gl_Position = vec4(clip_position, 0.0, 1.0);
    uv = aPosition.xy;
}
`;

const ROSETTE_CURVE_FRAG_SHADER = `
#define MAX_TERMS ${MAX_TERMS}
#define PI 3.1415
precision highp float;

varying vec2 uv;
varying vec2 curve;

// current canvas aspect ratio (width / height);
uniform float aspect;
// Scale factor for zooming
uniform float zoom;

// Texture from p5.js
uniform sampler2D texture0;

vec2 to_uv(vec2 complex) {
    return complex / zoom / aspect + 0.5;
}

void main() {
    float t = uv.x;
    float center_dist = abs(uv.y - 0.5);
    float outer_strip = 1.0 - step(0.15, center_dist);
    float inner_strip = 1.0 - step(0.1, center_dist);
    
    vec2 z_uv = to_uv(curve);
    z_uv.y = 1.0 - z_uv.y;
    
    vec4 value_color = texture2D(texture0, z_uv);
    vec4 direction_color = vec4(t);
    
    vec4 image = vec4(0.0);
    image = mix(image, direction_color, outer_strip);
    image = mix(image, value_color, inner_strip);
    gl_FragColor = image;
}
`;

class RosetteCurveShader {
    constructor() {
        this._shader = undefined;
        this._enabled = false;
        this._initialized = false;
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
        model(polyline_model);
        
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
    
    set_mouse_uv(mouse_uv) {
        // Sometimes mouse events are triggered too early
        if (!this._initialized) {
            return;
        }
        this.enable();
        this._shader.setUniform('mouse_uv', mouse_uv);
    }
    
    set_texture(texture) {
        this.enable();
        texture.set_wrapping();
        this._shader.setUniform('texture0', texture.texture);
    }
}