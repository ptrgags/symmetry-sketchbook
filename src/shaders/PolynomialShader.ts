import p5 from 'p5'
import { SymmetryShader } from './SymmetryShader'
import { common } from './common_glsl'

const VERT_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 uv;

void main() {
    gl_Position = vec4(aPosition, 1.0);

    uv = aTexCoord;
}
`

export const ROSETTE_FUNC = `
vec2 compute(vec2 z) {
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
        
        sum += to_rect(vec2(r, theta));
    }
    return sum;
}
`

export const FRIEZE_FUNC = `
vec2 compute(vec2 z) {    
    vec2 sum = vec2(0.0);
    for (int i = 0; i < MAX_TERMS; i++) {
        // Frieze symmetry is taken by composing the
        // rosette symmetry polynomial f(z) with Phi(z) = e^z
        // to form f(Phi(z)) which expands to
        // a_nm.r * exp(z.x * (n + m)) * exp(i * z.y * (n - m) + a_nm.theta)
        
        vec2 nm = powers[i];
        float n = nm.x;
        float m = nm.y;
        
        // amplitude, phase
        vec2 a_nm = coeffs[i];
        
        float r =  a_nm.x * exp(z.x * (n + m));
        float theta = z.y * (n - m) + a_nm.y;
        
        sum += to_rect(vec2(r, theta));
    }
    return sum;
}
`

const FRAG_SHADER = (symmetry_func: string) => `
precision highp float;
${common.defines}

${common.uniforms}
${common.uniforms_coefficients}
${common.uniforms_palette}

${common.funcs_polar}
${common.funcs_view}
${common.funcs_geom}
${common.funcs_palette}
${symmetry_func}

varying vec2 uv;

void main() {
    vec2 complex = to_complex(uv);
    
    vec3 color;
    if (show_palette) {
        color = palette(complex);
    } else {
        vec2 z = compute(complex);
        color = palette(z);    
    }

    // Draw input axes
    draw_axes(
        color,
        complex,
        input_axes_color,
        input_axes_xyrt, 
        input_axes_thickness
    );

    gl_FragColor = vec4(color, 1.0);
}
`

const FRAG_SHADERS = {
  rosette: FRAG_SHADER(ROSETTE_FUNC),
  frieze: FRAG_SHADER(FRIEZE_FUNC)
}

// ====================================================================

export class PolynomialShader extends SymmetryShader {
  frag_shader: string
  constructor(type: 'rosette' | 'frieze') {
    super()
    this.frag_shader = FRAG_SHADERS[type]
  }

  init(sketch: p5) {
    super.init(sketch, VERT_SHADER, this.frag_shader)
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
}
