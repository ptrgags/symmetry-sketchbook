import p5 from 'p5'
import { common } from './common_glsl.js'
import { ROSETTE_FUNC } from './PolynomialShader.js'
import { SymmetryShader } from './SymmetryShader.js'

const VERT_SHADER = `
${common.defines}
attribute vec3 aPosition;
attribute vec2 aTexCoord;

${common.uniforms}
${common.uniforms_coefficients}

// Value from 0 to 1 indicating how much to "tie" the fabric
uniform float tie;

varying vec2 uv;
varying vec2 warped_pos;

${common.funcs_polar}
${common.funcs_view}

${ROSETTE_FUNC}

void main() {
    uv = aTexCoord;
    uv.y = 1.0 - uv.y;
    
    vec2 grid_position = aPosition.xy;
    vec2 z = to_complex(uv);
    
    warped_pos = complex_to_clip(z);
    
    float t = clamp(tie, 0.0, 1.0);
    vec2 pos = mix(grid_position, warped_pos, t);
    
    gl_Position = vec4(pos, 0.0, 1.0); 
}
`

const FRAG_SHADER = `
precision highp float;
${common.defines}
#define GRID_WIDTH 49.0

varying vec2 uv;
varying vec2 warped_pos;

${common.uniforms}
${common.uniforms_coefficients}
${common.uniforms_palette}

// Value from 0 to 1 indicating how much to color the fabric
uniform float dye;

${common.funcs_view}
${common.funcs_polar}
${common.funcs_geom}
${common.funcs_palette}

void main() {
    vec3 color = palette(warped_pos);

    vec3 grid_lines = vec3(1.0);
    float t = clamp(dye, 0.0, 1.0);
    color = mix(grid_lines, color, t); 
    
    vec2 cell_uv = fract(GRID_WIDTH * uv);
    vec2 from_center = 2.0 * abs(cell_uv - 0.5);
    float dist_from_center = max(from_center.x, from_center.y);
    float mask = 1.0 - step(dist_from_center, 0.8);
    
    gl_FragColor = vec4(mask * color, 1.0);
}
`

export class TieDyeShader extends SymmetryShader {
  grid_model?: p5.Geometry

  preload(sketch: p5) {
    this.grid_model = sketch.loadModel('./assets/grid.obj')
  }

  init(sketch: p5) {
    super.init(sketch, VERT_SHADER, FRAG_SHADER)
  }

  draw() {
    const sketch = this.sketch
    if (!sketch || !this.grid_model) {
      return
    }

    this.update_time()
    sketch.fill(0, 0, 0, 0)
    sketch.model(this.grid_model)

    // Disable when done to get ready for the next shader
    this.disable()
  }
}
