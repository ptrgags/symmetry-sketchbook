export const common = {};
common.defines = `
#define PI ${Math.PI}
`;

common.uniforms_view = `
// current canvas aspect ratio (width / height);
uniform float aspect;
// Scale factor for zooming
uniform float zoom;
`;

common.funcs_view = `
vec2 to_complex(vec2 uv) {
    return (uv - 0.5) * aspect * zoom;
}

vec2 to_uv(vec2 complex) {
    return complex / zoom / aspect + 0.5;
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

export const MAX_TERMS = 64;
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

export const uniforms_mouse = `
// Mouse position across the canvas. Might be outside
// [0, 1] if the mouse is outside the canvas.
uniform vec2 mouse_uv;
`;
