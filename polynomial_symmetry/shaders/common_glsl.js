import {MAX_TERMS} from '../math_util.js';

export const common = {};
common.defines = `
#define PI ${Math.PI}
`;

common.uniforms_view = `
// current canvas aspect ratio (width / height);
uniform float aspect;
// Scale factor for zooming
uniform float zoom;
// current pan in uv coordinates
uniform vec2 pan_uv;
`;

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
`;

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
`;

common.uniforms_polynomial = `
#define MAX_TERMS ${MAX_TERMS}

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
`;

common.uniforms_animation = `
// animation parameters. for each (n, m) term
// we have a phase delta, which turns the coefficient into:
// (r, theta + phase_delta * time))
uniform float animation[MAX_TERMS];
// Elapsed time since the page load in seconds.
uniform float time;
`;

common.uniforms_texture = `
// Texture from p5.js
uniform sampler2D texture0;
`;

common.uniforms_mouse = `
// Mouse position across the canvas. Might be outside
// [0, 1] if the mouse is outside the canvas.
uniform vec2 mouse_uv;
`;

common.uniforms_wallpaper = `
// inverse of the basis matrix for the wallpaper lattice
// This is used to convert to lattice coordinates
// p5.js seems to ignore mat2 matrices so I'll use a mat3 instead.
uniform mat3 inv_lattice;
`;
