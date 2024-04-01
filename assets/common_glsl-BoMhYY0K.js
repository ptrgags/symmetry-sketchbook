var p=Object.defineProperty;var d=(i,t,r)=>t in i?p(i,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[t]=r;var a=(i,t,r)=>(d(i,typeof t!="symbol"?t+"":t,r),r);import{C as _}from"./Sketch-Ywa2RNtX.js";class l{constructor(t){a(this,"terms");this.terms=t}*[Symbol.iterator](){yield*this.terms}get length(){return this.terms.length}normalize(){let t=0;for(const{coefficient:r}of this.terms)t+=r.r;this.terms=this.terms.map(({frequencies:r,coefficient:e})=>{const{r:o,theta:s}=e;return{frequencies:r,coefficient:new _(o/t,s)}})}get frequencies_array(){return this.terms.flatMap(t=>{const{n:r,m:e}=t.frequencies;return[r,e]})}get coefficients_array(){return this.terms.flatMap(t=>{const{r,theta:e}=t.coefficient;return[r,e]})}static from_quasi_symmetry(t){const r=[];for(let e=0;e<t;e++){const o=e*2*Math.PI/t,s=Math.cos(o),c=Math.sin(o),f=1/t,m=0;r.push({frequencies:{n:s,m:c},coefficient:new _(f,m)})}return new l(r)}static from_tuples(t){const r=t.map(e=>{const[o,s,c,f]=e;return{frequencies:{n:o,m:s},coefficient:new _(c,f)}});return new l(r)}}l.from_tuples([[1,1,1,0],[4,1,1/3,0],[7,1,1/5,0],[9,0,1/6,0]]);function v(i,t){const e=new OffscreenCanvas(100,100).getContext("webgl2"),o=e.createShader(e.VERTEX_SHADER);if(!o)throw new Error("Could not create WebGL 2 shader!");e.shaderSource(o,i),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)||(console.error("Vertex shader failed to compile:"),console.error(e.getShaderInfoLog(o)));const s=e.createShader(e.FRAGMENT_SHADER);if(!s)throw new Error("Could not create test shader!");e.shaderSource(s,t),e.compileShader(s),e.getShaderParameter(s,e.COMPILE_STATUS)||(console.error("Fragment shader failed to compile:"),console.error(e.getShaderInfoLog(s)));const c=e.createProgram();if(!c)throw new Error("could not create WebGL 2 program!");e.attachShader(c,o),e.attachShader(c,s),e.linkProgram(c),e.getProgramParameter(c,e.LINK_STATUS)||(console.error("program failed to link:"),console.error(e.getProgramInfoLog(c)))}class x{constructor(){a(this,"sketch");a(this,"shader");a(this,"enabled",!1);a(this,"initialized",!1)}preload(t){}init(t,r,e){this.sketch=t,v(r.trim(),e.trim()),this.shader=t.createShader(r,e),this.set_uniform("aspect",t.width/t.height),this.set_uniform("time",0),this.set_uniform("zoom",8),this.set_pan_uv([0,0]),this.initialized=!0}enable(){this.enabled||!this.sketch||(this.shader&&this.sketch.shader(this.shader),this.enabled=!0)}disable(){!this.enabled||!this.sketch||(this.sketch.resetShader(),this.enabled=!1)}set_uniform(t,r){!this.sketch||!this.shader||(this.enable(),this.shader.setUniform(t,r))}update_time(){this.enable(),this.shader&&this.sketch&&this.shader.setUniform("time",this.sketch.millis()/1e3)}set_mouse_uv(t){this.initialized&&(this.enable(),this.shader&&this.shader.setUniform("mouse_uv",t))}set_pan_uv(t){this.initialized&&(this.enable(),this.shader&&this.shader.setUniform("pan_uv",t))}draw(){const t=this.sketch;if(!t)return;this.update_time(),t.noStroke(),t.fill(0,0,0,0);const r=1,e=1;t.quad(-r,-e,r,-e,r,e,-r,e),this.disable()}}const h=64;function u(i,t){const r=i.length;if(r>t){const o=`(${r/2}, max=${t/2})`;throw new Error(`Too many terms ${o}. Try again with fewer terms`)}const e=t-r;if(e>0){const o=Array(e).fill(0);return i.concat(o)}else return i}class k extends x{constructor(){super();a(this,"powers_buffer");a(this,"coefficients_buffer");this.powers_buffer=[],this.coefficients_buffer=[]}init(r,e,o){super.init(r,e,o),this.set_uniform("show_ref_geometry",0),this.set_uniform("show_palette",!1)}set_coefficients(r){const e=r.frequencies_array,o=r.coefficients_array;this.powers_buffer=u(e,2*h),this.coefficients_buffer=u(o,2*h),this.enable();const s=this.shader;s&&(s.setUniform("num_terms",r.length),s.setUniform("powers",this.powers_buffer),s.setUniform("coeffs",this.coefficients_buffer))}}const n={};n.defines=`
#define PI ${Math.PI}
#define MAX_TERMS ${h}
`;n.uniforms=`
// current canvas aspect ratio (width / height);
uniform float aspect;
// Scale factor for zooming
uniform float zoom;
// current pan in uv coordinates
uniform vec2 pan_uv;

// Mouse position across the canvas. Might be outside
// [0, 1] if the mouse is outside the canvas.
uniform vec2 mouse_uv;

// Elapsed time since the page load in seconds.
uniform float time;
`;n.uniforms_coefficients=`
// n = powers[i].x = exponent of z
// m = powers[i].y = exponent of conj(z)
uniform vec2 powers[MAX_TERMS];
// a_nm corresponding to the (n, m) in powers
// this represents the coefficient of z^n conj(z)^m
// These are stored as (amplitude, phase). phase is
// in radians.
uniform vec2 coeffs[MAX_TERMS];
// Even though MAX_TERMS terms are always provided, in practice only
// the first N are used. This is helpful to know for blending through
// the coefficients.
uniform float num_terms;

// the k in k-fold rotations. Needed for the palette
uniform float rotation_order;
`;n.uniforms_ref_geom=`
uniform vec4 grid_xyrt;
uniform vec3 grid_color;
uniform float grid_thickness;

uniform vec4 pulse_xyrt;
uniform vec3 pulse_color;
uniform float pulse_thickness;

uniform vec4 input_axes_xyrt;
uniform vec3 input_axes_color;
uniform float input_axes_thickness;

uniform vec4 output_axes_xyrt;
uniform vec3 output_axes_color;
uniform float output_axes_thickness;
`;n.funcs_view=`
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
`;n.funcs_geom=`
float circle(float r, float radius, float half_thickness) {
    float dist = abs(r - radius);
    return smoothstep(half_thickness + 0.01, half_thickness, dist);
}

float dist_from_pole(float r) {
    return min(r, 1.0 / r);
}

float unit_circle(float r, float half_thickness) {
    float dist = dist_from_pole(r);
    return smoothstep(1.0 - half_thickness, 1.0 - half_thickness + 0.01, dist);
}

float line(vec2 z_rect, vec2 normal, float half_thickness) {
    float dist = abs(dot(z_rect, normal));
    return smoothstep(half_thickness + 0.01, half_thickness, dist);
}

float grid_lines(float x, float half_thickness) {
    float from_center = 2.0 * abs(fract(x) - 0.5);
    return smoothstep(1.0 - half_thickness, 1.0 - half_thickness + 0.01, from_center);
}

void draw_grid(inout vec3 color, vec2 z_rect, vec2 z_polar) {
    float x_grid = grid_lines(z_rect.x, grid_thickness);
    float y_grid = grid_lines(z_rect.y, grid_thickness);
    float r_grid = grid_lines(z_polar.x, grid_thickness);
    float theta_grid = grid_lines(2.0 * rotation_order * z_polar.y, grid_thickness / z_polar.x);

    color = mix(color, grid_color, grid_xyrt.x * x_grid);
    color = mix(color, grid_color, grid_xyrt.y * y_grid);
    color = mix(color, grid_color, grid_xyrt.z * r_grid);
    color = mix(color, grid_color, grid_xyrt.w * theta_grid);
}

void draw_pulses(inout vec3 color, vec2 z_rect, vec2 z_polar) {
    float unsigned_pulse = mod(2.0 * time, 10.0);
    float signed_pulse = 2.0 * unsigned_pulse - 10.0;

    float x_pulse = line(z_rect - vec2(signed_pulse, 0.0), vec2(1.0, 0.0), pulse_thickness);
    float y_pulse = line(z_rect - vec2(0.0, signed_pulse), vec2(0.0, 1.0), pulse_thickness);
    float r_pulse = circle(z_polar.x, unsigned_pulse, pulse_thickness);
    float theta_pulse = line(
        vec2(z_polar.y - fract(0.5 * time), 0.0), 
        vec2(1.0, 0.0), 
        pulse_thickness * 0.1 / z_polar.x
    );


    color = mix(color, pulse_color, pulse_xyrt.x * x_pulse);
    color = mix(color, pulse_color, pulse_xyrt.y * y_pulse);
    color = mix(color, pulse_color, pulse_xyrt.z * r_pulse);
    color = mix(color, pulse_color, pulse_xyrt.w * theta_pulse);
}

void draw_axes(inout vec3 color, vec2 z_rect, vec3 axis_color, vec4 axis_xyrt, float axis_thickness) {
    float x_axis = line(z_rect, vec2(0.0, 1.0), axis_thickness);
    float y_axis = line(z_rect, vec2(1.0, 0.0), axis_thickness);
    float r_axis = x_axis * step(0.0, z_rect.x);
    float theta_axis = unit_circle(length(z_rect), axis_thickness);

    color = mix(color, axis_color, axis_xyrt.x * x_axis);
    color = mix(color, axis_color, axis_xyrt.y * y_axis);
    color = mix(color, axis_color, axis_xyrt.z * r_axis);
    color = mix(color, axis_color, axis_xyrt.w * theta_axis);
}
`;n.funcs_polar=`
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
`;export{l as F,k as S,n as c};
