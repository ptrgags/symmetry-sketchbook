import { SymmetryShader } from './Shader.js';
import { common } from './common_glsl.js';

const VERT_SHADER = `
${common.defines}
#define THICKNESS 0.01

attribute vec3 aPosition;

${common.uniforms_polynomial}
${common.uniforms_animation}
${common.uniforms_view}
${common.uniforms_mouse}

varying vec2 uv;
varying vec2 curve;

${common.funcs_polar}
${common.funcs_view}

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
        float omega = animation[0] * length(nm);
        coeff.y -= omega * time;
        
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
    uv.y = 1.0 - uv.y;
}
`;

const FRAG_SHADER = `
${common.defines}
precision highp float;

varying vec2 uv;
varying vec2 curve;

${common.uniforms_view}
${common.uniforms_texture}

${common.funcs_view}

void main() {
    float t = uv.x;
    float center_dist = abs(uv.y - 0.5);
    float outer_strip = 1.0 - step(0.15, center_dist);
    float inner_strip = 1.0 - step(0.1, center_dist);
    
    vec4 value_color = texture2D(texture0, to_texture(curve));
    vec4 direction_color = vec4(t);
    
    vec4 image = vec4(0.0);
    image = mix(image, direction_color, outer_strip);
    image = mix(image, value_color, inner_strip);
    gl_FragColor = image;
}
`;

export class RosetteCurveShader extends SymmetryShader {
    constructor() {
        super();
        this._polyline_model = undefined;
    }

    preload(sketch) {
        this._polyline_model = sketch.loadModel('assets/polyline.obj');
    }

    init(sketch) {
        super.init(sketch, VERT_SHADER, FRAG_SHADER);
    }

    
    draw() {
        this.update_time();
        this._sketch.fill(0, 0, 0, 0);
        this._sketch.model(this._polyline_model);
        
        // Disable when done to get ready for the next shader
        this.disable();
    }
}
