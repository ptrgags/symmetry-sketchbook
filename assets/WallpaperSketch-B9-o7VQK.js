var z=Object.defineProperty;var y=(a,t,e)=>t in a?z(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var d=(a,t,e)=>(y(a,typeof t!="symbol"?t+"":t,e),e);import{C as _,F as b}from"./ReferenceGeometryEditor.vue_vue_type_script_setup_true_lang-DFkX-q_s.js";import{i as S,a as V}from"./validation-Cv0neZFQ.js";import{S as k,c as s}from"./common_glsl-CF-Ah18z.js";import{S as v}from"./Sketch-v-RCqe1c.js";var w=(a=>(a[a.HorizontalStripes=0]="HorizontalStripes",a[a.VerticalStripes=1]="VerticalStripes",a[a.Plaid=2]="Plaid",a))(w||{});const N={palette_type:0,diagonal_thickness:4,colors:[new _(1,0,0),new _(0,1,0),new _(0,0,1)]};class ${serialize(t){return{palette_type:t.palette_type,diagonal_thickness:t.diagonal_thickness,colors:t.colors.map(e=>e.to_hex())}}validate(t){const e=Object.values(w);if(!e.includes(t.palette_type))return console.error(`palette_type must be one of ${e}`),!1;if(!S(t.diagonal_thickness,"diagonal_thickness"))return!1;if(!Array.isArray(t.colors))return console.error("colors must be an array of hex strings"),!1;for(let n=0;n<t.colors.length;n++)if(!V(t.colors[n],`colors[${n}]`))return!1;return!0}deserialize(t){return{palette_type:t.palette_type,diagonal_thickness:t.diagonal_thickness,colors:t.colors.map(_.from_hex)}}}var r=(a=>(a[a.None=0]="None",a[a.Horizontal=1]="Horizontal",a[a.Vertical=2]="Vertical",a))(r||{});const m={p1:{lattice:"parallelogram"},p2:{lattice:"parallelogram",rules:[{partner:"negate"}]},cm:{lattice:"rhombus",rules:[{partner:"swap"}]},cmm:{lattice:"rhombus",rules:[{partner:"negate"},{partner:"swap"}]},pm:{lattice:"rectangle",rules:[{partner:"negate_m"}]},pg:{lattice:"rectangle",rules:[{partner:"negate_m",negate:"negate_n"}]},pmm:{lattice:"rectangle",rules:[{partner:"negate"},{partner:"negate_n"}]},pmg:{lattice:"rectangle",rules:[{partner:"negate"},{partner:"negate_m",negate:"negate_n"}]},pgg:{lattice:"rectangle",rules:[{partner:"negate"},{partner:"negate_m",negate:"negate_nm"}]},p4:{lattice:"square",base_rule:"square"},p4m:{lattice:"square",base_rule:"square",rules:[{partner:"swap"}]},p4g:{lattice:"square",base_rule:"square",rules:[{partner:"swap",negate:"negate_nm"}]},p3:{lattice:"hexagon",base_rule:"hexagon"},p31m:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"swap"}]},p3m1:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"negate_swap"}]},p6:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"negate"}]},p6m:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"negate"},{partner:"swap"}]}},u={p1_p1:{lattice:"parallelogram",parity:"odd_nm",color_reversing:r.Vertical},p2_p1:{lattice:"parallelogram",rules:[{partner:"negate",negate:"negate"}],color_reversing:r.Vertical},p2_p2:{lattice:"parallelogram",rules:[{partner:"negate"}],parity:"odd_nm",color_reversing:r.Vertical},pg_p1:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m1"}],color_reversing:r.Vertical},pm_p1:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate"}],color_reversing:r.Horizontal},pg_pg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m"}],parity:"odd_n",color_reversing:r.Vertical},pm_pg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m"}],parity:"odd_m",color_reversing:r.Vertical},cm_pg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m"}],parity:"odd_nm",color_reversing:r.Vertical},pmg_pg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m"},{partner:"negate",negate:"negate"}],color_reversing:r.Horizontal},pgg_pg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_nm"},{partner:"negate",negate:"negate"}],color_reversing:r.Horizontal},pm_pm_1:{lattice:"rectangle",parity:"odd_n",rules:[{partner:"negate_n"}],color_reversing:r.Horizontal},pm_pm_2:{lattice:"rectangle",parity:"odd_m",rules:[{partner:"negate_n"}],color_reversing:r.Horizontal},cm_pm:{lattice:"rectangle",parity:"odd_nm",rules:[{partner:"negate_n"}],color_reversing:r.Horizontal},pmm_pm:{lattice:"rectangle",rules:[{partner:"negate_n"},{partner:"negate",negate:"negate"}],color_reversing:r.Vertical},pmg_pm:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m1"},{partner:"negate",negate:"negate"}],color_reversing:r.Vertical},cm_p1:{lattice:"rhombus",rules:[{partner:"swap",negate:"negate"}],color_reversing:r.Horizontal},cmm_p2:{lattice:"rhombus",rules:[{partner:"swap",negate:"negate"},{partner:"negate"}],color_reversing:r.Horizontal},pm_cm:{lattice:"rhombus",rules:[{partner:"swap"}],parity:"odd_nm",color_reversing:r.Horizontal},cmm_cm:{lattice:"rhombus",rules:[{partner:"swap",negate:"negate"},{partner:"negate",negate:"negate"}],color_reversing:r.Vertical},pmm_cmm:{lattice:"rhombus",rules:[{partner:"swap"},{partner:"negate"}],parity:"odd_nm",color_reversing:r.Vertical},pmm_p2:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate"},{partner:"negate"}],color_reversing:r.Horizontal},pmg_p2:{lattice:"rectangle",rules:[{partner:"swap",negate:"negate_m1"},{partner:"negate"}],color_reversing:r.Horizontal},pgg_p2:{lattice:"rectangle",rules:[{partner:"swap",negate:"negate_nm1"},{partner:"negate"}],color_reversing:r.Horizontal},pmm_pmm:{lattice:"rectangle",rules:[{partner:"negate_n"},{partner:"negate"}],parity:"odd_n",color_reversing:r.Vertical},cmm_pmm:{lattice:"rectangle",rules:[{partner:"negate_n"},{partner:"negate"}],parity:"odd_nm",color_reversing:r.Horizontal},pmm_pmg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m"},{partner:"negate"}],parity:"odd_m",color_reversing:r.Horizontal},pmg_pmg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m"},{partner:"negate"}],parity:"odd_n",color_reversing:r.Horizontal},cmm_pmg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_m"},{partner:"negate"}],parity:"odd_nm",color_reversing:r.Vertical},pmg_pgg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_nm"},{partner:"negate"}],parity:"odd_n",color_reversing:r.Vertical},cmm_pgg:{lattice:"rectangle",rules:[{partner:"negate_n",negate:"negate_nm"},{partner:"negate"}],parity:"odd_nm",color_reversing:r.Horizontal},p4_p2:{lattice:"square",rules:[{partner:"negate"},{partner:"negate_m_swap",negate:"negate"}],color_reversing:r.Horizontal},p4m_pmm:{lattice:"square",rules:[{partner:"negate"},{partner:"negate_m_swap",negate:"negate"},{partner:"swap",negate:"negate"}],color_reversing:r.Horizontal},p4g_pgg:{lattice:"square",rules:[{partner:"negate"},{partner:"negate_m_swap",negate:"negate"},{partner:"swap",negate:"negate_nm1"}],color_reversing:r.Vertical},p4m_cmm:{lattice:"square",rules:[{partner:"negate"},{partner:"negate_m_swap",negate:"negate"},{partner:"swap"}],color_reversing:r.Vertical},p4g_cmm:{lattice:"square",rules:[{partner:"negate"},{partner:"negate_m_swap",negate:"negate"},{partner:"swap",negate:"negate_nm"}],color_reversing:r.Vertical},p4_p4:{lattice:"square",base_rule:"square",rules:[{partner:"negate_m_swap"}],parity:"odd_nm",color_reversing:r.Vertical},p4m_p4:{lattice:"square",base_rule:"square",rules:[{partner:"negate_m_swap"},{partner:"swap",negate:"negate"}],color_reversing:r.Vertical},p4g_p4:{lattice:"square",base_rule:"square",rules:[{partner:"negate_m_swap"},{partner:"swap",negate:"negate_nm1"}],color_reversing:r.Horizontal},p4m_p4m:{lattice:"square",base_rule:"square",rules:[{partner:"negate_m_swap"},{partner:"swap"}],parity:"odd_nm",color_reversing:r.Vertical},p4m_p4g:{lattice:"square",base_rule:"square",rules:[{partner:"negate_m_swap"},{partner:"swap",negate:"negate_nm"}],parity:"odd_nm",color_reversing:r.Vertical},p31m_p3:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"swap",negate:"negate"}],color_reversing:r.Horizontal},p3m1_p3:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"negate_swap",negate:"negate"}],color_reversing:r.Horizontal},p6_p3:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"negate",negate:"negate"}],color_reversing:r.Horizontal},p6m_p31m:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"swap"},{partner:"negate",negate:"negate"}],color_reversing:r.Vertical},p6m_p3m1:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"negate_swap"},{partner:"negate",negate:"negate"}],color_reversing:r.Vertical},p6m_p6:{lattice:"hexagon",base_rule:"hexagon",rules:[{partner:"negate"},{partner:"swap",negate:"negate"}],color_reversing:r.Vertical}};function H(a){const t=m[a];if(t)return t;const e=u[a];if(e)return e;throw new Error("group_id must be a valid wallpaper group ID")}function A(a){for(const[t,e]of Object.entries(m))if(e===a)return t;for(const[t,e]of Object.entries(u))if(e===a)return t;throw new Error("group must be one of the WallpaperSymmetryGroup constants")}const p=new b;class D{serialize(t){return{series:p.serialize(t.series),group:A(t.group)}}validate(t){if(!p.validate(t.series))return!1;const e=t.group in m,n=t.group in u;return!e&&!n?(console.error("group must be a valid group ID"),!1):!0}deserialize(t){return{series:p.deserialize(t.series),group:H(t.group)}}}const f=2*Math.PI/3,E={square:[[1,0],[0,1]],rectangle:[[2,0],[0,1]],rhombus:[[1,2],[1,-2]],hexagon:[[1,0],[Math.cos(f),Math.sin(f)]],parallelogram:[[1,0],[1,2]]};function R(a){return E[a]}const g=12,O=`
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 uv;

void main() {
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = position;

    uv = aTexCoord;
}
`,I=`
precision highp float;

${s.defines}
#define MAX_COLORS ${g}

varying vec2 uv;

${s.uniforms}
${s.uniforms_coefficients}
${s.uniforms_ref_geom}

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

${s.funcs_view}
${s.funcs_polar}
${s.funcs_geom}

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
`;class q extends k{init(t){super.init(t,O,I),this.set_uniform("inv_lattice",[1,0,0,0,1,0,0,0,1])}draw(){const t=this.sketch;if(!t)return;this.update_time(),t.noStroke(),t.fill(0,0,0,0);const e=1,n=1;t.quad(-e,-n,e,-n,e,n,-e,n),this.disable()}set_lattice(t,e){const[n,o]=t,[l,c]=e,i=1/(n*c-l*o),x=[i*c,i*-o,0,i*-l,i*n,0,0,0,1];this.set_uniform("inv_lattice",x)}}class j extends v{constructor(e){super(e);d(this,"shader");this.shader=new q}setup(e){const n=e.createCanvas(500,700,e.WEBGL);v.show_canvas(n.elt),e.textureMode(e.NORMAL),this.shader.init(e),this.pattern=this.state.pattern,this.palette=this.state.palette,this.shader.disable()}draw(e){e.background(0),this.shader.draw()}set pattern(e){this.state.pattern=e,this.shader.set_coefficients(e.series);const n=R(e.group.lattice);this.shader.set_lattice(...n);const o=e.group.color_reversing??r.None;this.shader.set_uniform("color_reversing_type",o)}set show_palette(e){this.shader.set_uniform("show_palette",e)}set palette(e){if(this.state.palette=e,!this.sketch)return;const n=e.colors.slice(0,g),o=n.flatMap(i=>i.to_vec3()),l=Math.max(3*g-o.length,0),c=new Array(l).fill(0),h=[...o,...c];this.shader.set_uniform("palette_colors",h),this.shader.set_uniform("color_count",n.length),this.shader.set_uniform("diagonal_density",1/e.diagonal_thickness),this.shader.set_uniform("palette_type",e.palette_type)}set_color(e,n){this.shader.set_uniform(`${e}_color`,n.to_vec3())}set_xyrt_flags(e,n){this.shader.set_uniform(`${e}_xyrt`,n.map(Number))}set_thickness(e,n){this.shader.set_uniform(`${e}_thickness`,n)}set ref_geom(e){for(const[n,o]of Object.entries(e))this.set_xyrt_flags(n,o.xyrt_flags),this.set_color(n,o.color),this.set_thickness(n,o.thickness)}}export{u as C,N as D,$ as W,D as a,m as b,j as c,w as d};
