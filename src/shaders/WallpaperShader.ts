import type p5 from 'p5'
import { SymmetryShader } from './SymmetryShader'
import { common } from './common_glsl'

export const MAX_COLORS = 12

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
precision highp float;

${common.defines}
#define MAX_COLORS ${MAX_COLORS}

varying vec2 uv;

${common.uniforms}
${common.uniforms_coefficients}
${common.uniforms_ref_geom}

uniform bool show_palette;
uniform float color_reversing_type;

// inverse of the basis matrix for the wallpaper lattice
// This is used to convert to lattice coordinates
// p5.js seems to ignore mat2 matrices so I'll use a mat3 instead.
uniform mat3 inv_lattice;

uniform vec3 palette_colors[MAX_COLORS];
uniform int color_count;

// Enum to select between stripes and plaid
uniform float palette_type;

// Density = 1 / diagonal thickness.
uniform float diagonal_density;

${common.funcs_view}
${common.funcs_polar}
${common.funcs_geom}

vec3 palette_1d(float t) {
    vec3 color = vec3(0.0);
    for (int i = 0; i < MAX_COLORS; i++) {
        if (i >= color_count) {
            break;
        }

        float mask = step(float(i) / float(color_count), t);
        color = mix(color, palette_colors[i], mask);
    }
    return color;
}

vec3 palette_polar(vec2 z_rect) {
    vec2 z_polar = to_polar(z_rect);

    // get a normalized angle in [0, 1] starting from the +x axis
    float angle_normalized = 0.5 + 0.5 * z_polar.y / PI;
    angle_normalized = fract(angle_normalized - 0.5);

    float t = angle_normalized;

    return palette_1d(fract(2.0 * t));
}

vec3 palette(vec2 z_rect) {
    // Compute stripes in the x and y direction. The 0.5 factor is
    // so a single repeat of the palette goes from 0 to 2 in the respective
    // direction of the complex plane
    vec3 color_x = palette_1d(fract(0.5 * z_rect.x));
    vec3 color_y = palette_1d(fract(0.5 * z_rect.y));

    const float HORIZONTAL_STRIPES = 0.0;
    const float VERTICAL_STRIPES = 1.0;
    const float PLAID = 2.0;

    // For simple stripes, just return one of the above colors
    if (palette_type == HORIZONTAL_STRIPES) {
        return color_y;
    } else if (palette_type == VERTICAL_STRIPES) {
        return color_x;
    }

    // To make plaid, we want to interleave the horizontal and vertical
    // stripes. Looking at actual plaid fabric, you'll see this interleaving
    // happen on diagonal stripes.

    // A covector that measures a "stripe distance", i.e. how many stripes
    // we are from the origin along a 45 angle in pixel space. To vary the
    // thickness, we need to multiply by the density parameter.
    vec2 stripe_covector_px = diagonal_density * vec2(1, 1);
    // Convert the covector to UV space. covector components are covariant
    // so we scale up by the canvas size.
    vec2 stripes_covector_uv = vec2(500.0, 700.0) * stripe_covector_px;
    //vec2 stripes_covector_uv = vec2(500.0diagonal_density * vec2(1.0, 1.0);

    // Use the covector to measure the distance from the origin in stripes.
    float stripe_distance = dot(stripes_covector_uv, uv);
    // 0 and 1 alternating on each stripe
    float stripe_mask = mod(floor(stripe_distance), 2.0);

    return mix(color_x, color_y, stripe_mask);
}

vec3 invert_palette(vec2 z_rect) {
    const float NONE = 0.0;
    const float HORIZONTAL = 1.0;
    const float VERTICAL = 2.0;

    if (color_reversing_type == HORIZONTAL) {
        // if we're in the bottom half-plane, invert the coordinates and colors
        float top_half = float(z_rect.y > 0.0);
        vec2 z_in = mix(-z_rect, z_rect, top_half);
        vec3 color = palette(z_in);
        return mix(1.0 - color, color, top_half);
    }

    if (color_reversing_type == VERTICAL) {
        // if we're in the left half-plane, invert the coordinates and colors
        float right_half = float(z_rect.x > 0.0);
        vec2 z_in = mix(-z_rect, z_rect, right_half);
        vec3 color = palette(z_in);
        return mix(1.0 - color, color, right_half);
    }

    return palette(z_rect);
}

vec3 apply_ref_geom(inout vec3 color, vec2 z_rect) {
    vec2 z_polar = to_polar(z_rect);

    // get a normalized angle in [0, 1] starting from the +x axis
    float angle_normalized = 0.5 + 0.5 * z_polar.y / PI;
    angle_normalized = fract(angle_normalized - 0.5);

    vec2 polar_repacked = vec2(z_polar.x, angle_normalized);

    draw_grid(
        color,
        z_rect,
        polar_repacked
    );
    
    // Axes
    draw_axes(
        color,
        z_rect,
        output_axes_color,
        output_axes_xyrt,
        output_axes_thickness
    );

    // Pulses
    draw_pulses(
        color,
        z_rect,
        polar_repacked
    );

    return vec3(color);
}

vec2 compute(vec2 z) {
    vec2 sum = vec2(0.0);
    vec2 lattice_coords = /*mat2(inv_lattice) * */ z;
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
    vec2 z_in = mat2(inv_lattice) * to_complex(uv);

    vec3 color;
    if (show_palette) {
        color = invert_palette(z_in);
        apply_ref_geom(color, z_in);
    } else {
        vec2 z_out = compute(z_in);
        color = invert_palette(z_out);
        apply_ref_geom(color, z_out);
    }

    // Draw axes in the input space
    draw_axes(
        color,
        z_in,
        input_axes_color,
        input_axes_xyrt,
        input_axes_thickness
    );

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
