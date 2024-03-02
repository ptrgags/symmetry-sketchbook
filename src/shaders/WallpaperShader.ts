import type p5 from 'p5'
import { SymmetryShader } from './SymmetryShader'
import { common } from './common_glsl'

const VERT_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 uv;



void main() {
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = position;

    uv = aTexCoord;
}
`

const FRAG_SHADER = `
${common.defines}
precision highp float;

varying vec2 uv;

${common.uniforms}
${common.uniforms_coefficients}

// inverse of the basis matrix for the wallpaper lattice
// This is used to convert to lattice coordinates
// p5.js seems to ignore mat2 matrices so I'll use a mat3 instead.
uniform mat3 inv_lattice;

${common.funcs_view}
${common.funcs_polar}

vec2 compute(vec2 z) {
    vec2 sum = vec2(0.0);
    vec2 lattice_coords = mat2(inv_lattice) * z;
    for (int i = 0; i < MAX_TERMS; i++) {
        // a_nm expi(2pi * i * dot(nm, A^(-1) z))
        vec2 nm = powers[i];
        vec2 a_nm = coeffs[i];
        float angle = 2.0 * PI * dot(nm, lattice_coords) + a_nm.y;
        sum += to_rect(vec2(a_nm.x, angle));
    }
    return sum;
}

void main() {
    vec2 complex = to_complex(uv);
    vec2 z = compute(complex);

    vec3 color = vec3(z, 0.0);
    
    /*
    const vec4 WHITE = vec4(1.0);
    vec2 cell_uv = fract(mat2(inv_lattice) * complex);
    vec2 grid = step(0.99, cell_uv);
    float grid_mask = max(grid.x, grid.y);
    
    vec4 image = tex_color;
    image = mix(image, ref_layer, ref_layer.a);
    image = mix(image, WHITE, grid_mask * show_ref_geometry);
    */
    gl_FragColor = vec4(color, 1.0);
}
`

export class WallpaperShader extends SymmetryShader {
  init(sketch: p5) {
    super.init(sketch, VERT_SHADER, FRAG_SHADER)
    this.set_uniform('inv_lattice', [1, 0, 0, 0, 1, 0, 0, 0, 1])
  }

  draw() {
    const sketch = this.sketch
    if (!sketch) {
      return
    }

    this.update_time()
    sketch.noStroke()

    // This makes sure the alpha channel is enabled for
    // transparent images.
    sketch.fill(0, 0, 0, 0)

    // Draw a quad that spans the canvas. Since the vertex shader
    // ignores the model matrix, use clip coordinates
    const hw = 1
    const hh = 1
    sketch.quad(-hw, -hh, hw, -hh, hw, hh, -hw, hh)

    // Disable when done to get ready for the next shader
    this.disable()
  }

  set_lattice(e1: [number, number], e2: [number, number]) {
    // These are the columns of the original matrix
    // [e1 e2] = [a b]
    //           [c d]
    const [a, c] = e1
    const [b, d] = e2
    const det = a * d - b * c
    const inv_det = 1.0 / det

    // Compute the inverse, but WebGL expects column-major format
    // and it's a mat3 just because p5.js only allows mat3 and mat4
    const mat = [inv_det * d, inv_det * -c, 0.0, inv_det * -b, inv_det * a, 0.0, 0.0, 0.0, 1.0]
    this.set_uniform('inv_lattice', mat)
  }
}