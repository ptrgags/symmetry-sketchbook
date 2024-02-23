import { MAX_TERMS } from './SymmetryShader'

export const common: { [key: string]: string } = {}

common.defines = `
#define PI ${Math.PI}
#define MAX_TERMS ${MAX_TERMS}
`

// I'm tired of keeping track of uniforms. The unused ones are optimized out
// anyway, so I'm just going to list them in one big block.

common.uniforms = `
// current canvas aspect ratio (width / height);
uniform float aspect;
// Scale factor for zooming
uniform float zoom;
// current pan in uv coordinates
uniform vec2 pan_uv;

// n = powers[i].x = exponent of z
// m = powers[i].y = exponent of conj(z)
uniform vec2 powers[MAX_TERMS];
// a_nm corresponding to the (n, m) in powers
// this represents the coefficient of z^n conj(z)^m
// These are stored as (amplitude, phase). phase is
// in radians.
uniform vec2 coeffs[MAX_TERMS];
// 1.0 to enable, 0.0 to disable
uniform float show_ref_geometry;

// animation parameters. for each (n, m) term
// we have a phase delta, which turns the coefficient into:
// (r, theta + phase_delta * time))
uniform float animation[MAX_TERMS];
// Elapsed time since the page load in seconds.
uniform float time;
// If true, the polynomial will be run a second time with the
// animation direction reversed. For waves, this produces
// a standing wave effect.
uniform bool enable_standing_waves;
// Even though MAX_TERMS terms are always provided, in practice only
// the first N are used. This is helpful to know for blending through
// the coefficients.
uniform float num_terms;
// If true, instead of showing the sum of terms, show them one by one,
// blending between each pair.
uniform bool show_wave_components;

// inverse of the basis matrix for the wallpaper lattice
// This is used to convert to lattice coordinates
// p5.js seems to ignore mat2 matrices so I'll use a mat3 instead.
uniform mat3 inv_lattice;

// Texture from p5.js
uniform sampler2D texture0;

// Mouse position across the canvas. Might be outside
// [0, 1] if the mouse is outside the canvas.
uniform vec2 mouse_uv;
`

common.funcs_view = `
vec2 apply_aspect_fix(vec2 uv) {
    return uv * vec2(aspect, 1.0);
}

vec2 unapply_aspect_fix(vec2 uv) {
    return uv / vec2(aspect, 1.0);
}

vec2 to_centered(vec2 uv) {
    return uv - 0.5;
}

vec2 to_corner(vec2 uv) {
    return uv + 0.5;
}

vec2 apply_zoom(vec2 uv) {
    return zoom * uv;
}

vec2 unapply_zoom(vec2 uv) {
    return uv / zoom;
}

vec2 to_complex(vec2 uv) {
    vec2 position_uv = to_centered(uv) - pan_uv;
    return apply_zoom(apply_aspect_fix(position_uv));
}

// Convert back to uv space for use in vertex shaders like the demo shader
vec2 to_uv(vec2 complex) {
    vec2 position_uv = unapply_zoom(complex);
    return to_corner(position_uv);
}

// Convert to texture space. This wraps the texture coordinates and flips y
vec2 to_texture(vec2 complex) {
    vec2 uv = fract(to_corner(complex));
    uv.y = 1.0 - uv.y;
    return uv;
}

vec2 complex_to_clip(vec2 complex) {
    vec2 uv = to_uv(complex);
    return 2.0 * uv - 1.0;
}
`

common.funcs_polar = `
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
`

common.funcs_animation = `
// Triangle wave whose range is [0, num_terms]. This way we can animate
// back and forth through the terms.
float back_and_forth(float t) {
    float n = num_terms - 1.0;
    return abs(mod(t - n, 2.0 * n) - n);
}

// Create a set of blending coefficients for N terms with the following
// animation:
// ---------------------------------------------
//     time    | what's shown
// ------------+--------------------------------
//      0      | term 0 only
// 0.25 - 0.75 | blend between terms 0 and 1
//      1      | term 1 only
// 1.25 - 0.75 | blend between terms 1 and 2
//      2      | term 2 only
//     ...     | ...and so on
//      N      | term N only
// N.25 - N.75 | blend between terms N and N-1
//   (N + 1)   | term N - 1 only 
//     ...     | ...progressing backwards
//     2N      | term 0 only
//     ...     | ...keep blending back and forth
float blend_pairwise(float term) {
    if (!show_wave_components) {
        return 1.0;
    }

    // The blending function moves back and forth across the N terms
    float t = back_and_forth(time);

    // clamp a v-shaped function and flip to create a trapezoid shape.
    // This allows a pause before each transition
    float valley = 2.0 * abs(term - t) - 0.5;
    return 1.0 - clamp(valley, 0.0, 1.0);
}
`

common.funcs_standing_waves = `
vec2 standing_waves(vec2 complex) {
    vec2 z = compute(complex, -1.0);

    if (enable_standing_waves) {
        // To compute standing waves, simply add a wave that's propagating
        // in the opposite direction
        z += compute(complex, 1.0);
        z *= 0.5;
    }

    return z;
}
`

common.funcs_ref_geometry = `
vec4 ref_geometry(vec2 z) {
    float unit_circle_dist = abs(length(z) - 1.0);
    float unit_circle_mask = smoothstep(0.02, 0.01, unit_circle_dist);
    
    float modulus = length(z);
    float far_away = smoothstep(100.0, 200.0, modulus);
    float near_zero = smoothstep(0.011, 0.01, modulus);
    
    const vec4 CYAN = vec4(0.0, 1.0, 1.0, 1.0);
    const vec4 YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
    const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 image = vec4(0.0);
    image = mix(image, CYAN, unit_circle_mask * show_ref_geometry);
    image = mix(image, YELLOW, near_zero * show_ref_geometry);
    image = mix(image, BLACK, far_away);
    return image;
}
`
