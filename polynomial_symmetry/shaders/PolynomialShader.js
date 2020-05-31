import { SymmetryShader } from './Shader.js';
import { common } from './common_glsl.js';

const VERT_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 uv;

void main() {
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = position;

    uv = aTexCoord;
}
`;

export const ROSETTE_FUNC = `
vec2 compute(vec2 z, float animation_direction) {
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
        
        // Animate the coefficients for a fun twist.
        // (sometimes literally)
        coeff.y += animation_direction * animation[i] * time;
        
        float r = coeff.x * pow(z_polar.x, n + m);
        float theta = z_polar.y * (n - m) + coeff.y;
        
        vec2 rect = to_rect(vec2(r, theta));
        sum += blend_pairwise(float(i)) * rect;
    }
    return sum;
}
`;

export const FRIEZE_FUNC = `
vec2 compute(vec2 z, float animation_direction) {    
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
        a_nm.y += animation_direction * animation[i] * time;
        
        float r =  a_nm.x * exp(-z.y * (n + m));
        float theta = z.x * (n - m) + a_nm.y;
        
        vec2 rect = to_rect(vec2(r, theta));
        sum += blend_pairwise(float(i)) * rect;
        
    }
    return sum;
}
`;

const FRAG_SHADER = (symmetry_func) => `
precision highp float;
${common.defines}
${common.uniforms}

varying vec2 uv;

${common.funcs_polar}
${common.funcs_view}
${common.funcs_animation}
${common.funcs_ref_geometry}

${symmetry_func}
${common.funcs_standing_waves}

void main() {
    vec2 complex = to_complex(uv);
    vec2 z = standing_waves(complex);

    vec4 tex_color = texture2D(texture0, to_texture(z));
    vec4 ref_layer = ref_geometry(z);
    
    vec4 image = tex_color;
    image = mix(image, ref_layer, ref_layer.a);
    gl_FragColor = image;
}
`;

const FRAG_SHADERS = {
    rosette: FRAG_SHADER(ROSETTE_FUNC),
    frieze: FRAG_SHADER(FRIEZE_FUNC)
};

// ====================================================================

export class PolynomialShader extends SymmetryShader {
    constructor(type) {
        super();
        this._frag_shader = FRAG_SHADERS[type];
    }
    
    init(sketch) {
        super.init(sketch, VERT_SHADER, this._frag_shader);
    }
    
    draw() {
        const sketch = this._sketch;
        this.update_time();
        sketch.noStroke();
        
        // This makes sure the alpha channel is enabled for
        // transparent images.
        sketch.fill(0, 0, 0, 0);
        
        // Draw a quad that spans the canvas. Since the vertex shader
        // ignores the model matrix, use clip coordinates
        const hw = 1;
        const hh = 1;
        sketch.quad(-hw, -hh, hw, -hh, hw, hh, -hw, hh);
        
        // Disable when done to get ready for the next shader
        this.disable();
    }    
}
