import { common } from './common_glsl.js';
import { ROSETTE_FUNC, FRIEZE_FUNC } from './PolynomialShader.js';
import { SymmetryShader } from './Shader.js';

const VERT_SHADER = (symmetry_func) => `
${common.defines}
attribute vec3 aPosition;
attribute vec2 aTexCoord;

${common.uniforms_polynomial}
${common.uniforms_view}
${common.uniforms_animation}
${common.uniforms_mouse}

varying vec2 uv;
varying vec2 warped_pos;

${common.funcs_polar}
${common.funcs_view}
${symmetry_func}

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

const VERT_SHADERS = {
    rosette: VERT_SHADER(ROSETTE_FUNC),
    frieze: VERT_SHADER(FRIEZE_FUNC)
};

const FRAG_SHADER = `
#define GRID_WIDTH 49.0
precision highp float;

varying vec2 uv;
varying vec2 warped_pos;

${common.uniforms_texture}
${common.uniforms_animation}
${common.uniforms_view}
${common.uniforms_mouse}

${common.funcs_view}

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

export class DemoShader extends SymmetryShader {
    constructor(type) {
        super()
        this._vert_shader = VERT_SHADERS[type];
    }
    
    init_shader(sketch) {
        super.init_shader(sketch, this._vert_shader, FRAG_SHADER);
    }
    
   draw() {
        this.update_time();
        fill(0, 0, 0, 0);
        model(grid_model);
        
        // Disable when done to get ready for the next shader
        this.disable();
    }
}
