import { common } from './common_glsl.js';
import { ROSETTE_FUNC } from './PolynomialShader.js';
import { SymmetryShader } from './Shader.js';

const VERT_SHADER = `
${common.defines}
attribute vec3 aPosition;
attribute vec2 aTexCoord;

${common.uniforms}

// Value from 0 to 1 indicating how much to "tie" the fabric
uniform float tie;

varying vec2 uv;
varying vec2 warped_pos;

${common.funcs_polar}
${common.funcs_view}
${common.funcs_animation}

${ROSETTE_FUNC}
${common.funcs_standing_waves}

void main() {
    uv = aTexCoord;
    uv.y = 1.0 - uv.y;
    
    vec2 grid_position = aPosition.xy;
    vec2 complex = to_complex(uv);
    vec2 z = standing_waves(complex);
    
    warped_pos = complex_to_clip(z);
    
    float t = clamp(tie, 0.0, 1.0);
    vec2 pos = mix(grid_position, warped_pos, t);
    
    gl_Position = vec4(pos, 0.0, 1.0); 
}
`;

const FRAG_SHADER = `
precision highp float;
${common.defines}
#define GRID_WIDTH 49.0

varying vec2 uv;
varying vec2 warped_pos;

${common.uniforms}

// Value from 0 to 1 indicating how much to color the fabric
uniform float dye;

${common.funcs_view}

void main() {
    vec4 tex_color = texture2D(texture0, to_texture(warped_pos));
    vec4 grid_lines = vec4(1.0);
    float t = clamp(dye, 0.0, 1.0);
    vec4 color = mix(grid_lines, tex_color, t); 
    
    vec2 cell_uv = fract(GRID_WIDTH * uv);
    vec2 from_center = 2.0 * abs(cell_uv - 0.5);
    float dist_from_center = max(from_center.x, from_center.y);
    float mask = 1.0 - step(dist_from_center, 0.8);
    
    gl_FragColor = mask * color;
}
`;

export class TieDyeShader extends SymmetryShader {
    constructor() {
        super()
        this._grid_model = undefined;
    }

    preload(sketch) {
        this._grid_model = sketch.loadModel('assets/grid.obj');
    }
    
    init(sketch) {
        super.init(sketch, VERT_SHADER, FRAG_SHADER);
    }
    
    draw() {
        this.update_time();
        this._sketch.fill(0, 0, 0, 0);
        this._sketch.model(this._grid_model);
        
        // Disable when done to get ready for the next shader
        this.disable();
    }
}
