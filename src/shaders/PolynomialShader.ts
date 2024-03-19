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

varying vec2 uv;

${common.uniforms}
${common.uniforms_coefficients}
${common.uniforms_ref_geom}

uniform bool show_palette;

uniform vec3 primary_color;
uniform vec3 secondary_color;
uniform vec3 far_color;
uniform float far_power;

uniform bool invert_palette;
uniform float secondary_color_mode;

${common.funcs_polar}
${common.funcs_view}
${common.funcs_geom}
${symmetry_func}

vec3 palette(vec2 complex_rect) {
    vec2 z = to_polar(complex_rect);

    // get a normalized angle in [0, 1] starting from the +x axis
    float angle_normalized = 0.5 + 0.5 * z.y / PI;
    angle_normalized = fract(angle_normalized - 0.5);

    float sector = floor(rotation_order * angle_normalized);
    float sector_brightness = mix(0.25, 0.75, sector / (rotation_order - 1.0));

    const float NONE = 0.0;
    const float HALVES = 1.0;
    const float ALTERNATING = 2.0;
    const float INSIDE_CIRCLE = 3.0;

    vec3 sector_color = primary_color;
    if (secondary_color_mode == HALVES) {
        sector_color = mix(primary_color, secondary_color, float(complex_rect.y < 0.0));
    } else if (secondary_color_mode == ALTERNATING) {
        sector_color = mix(primary_color, secondary_color, mod(sector, 2.0));
    } else if (secondary_color_mode == INSIDE_CIRCLE) {
        float inside_circle = 1.0 - step(1.0, z.x);
        sector_color = mix(primary_color, secondary_color, inside_circle);
    }

    if (invert_palette) {
        sector_color = mix(sector_color, 1.0 - sector_color, float(complex_rect.y > 0.0));
    }

    sector_color *= sector_brightness;

    vec3 color = sector_color;

    vec2 polar_repacked = vec2(z.x, angle_normalized);

    draw_grid(
        color,
        complex_rect,
        polar_repacked
    );
    
    // Axes
    draw_axes(
        color,
        complex_rect,
        output_axes_color,
        output_axes_xyrt,
        output_axes_thickness
    );

    // Pulses
    draw_pulses(
        color,
        complex_rect,
        polar_repacked
    );

    // Gradient away from the unit circle
    float dist = dist_from_pole(z.x);
    color = mix(color, far_color, pow(1.0 - dist, far_power));

    return vec3(color);
}



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
