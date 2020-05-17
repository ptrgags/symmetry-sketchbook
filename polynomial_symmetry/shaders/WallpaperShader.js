import { SymmetryShader } from './Shader.js';
import { common } from './common_glsl.js';

const VERT_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 uv;

void main() {
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = position;

    uv = aTexCoord;
}
`;

const FRAG_SHADER = `
${common.defines}
precision highp float;

varying vec2 uv;

${common.uniforms_texture}
${common.uniforms_polynomial}
${common.uniforms_animation}
${common.uniforms_wallpaper}
${common.uniforms_view}
${common.funcs_view}
${common.funcs_polar}

vec2 compute_wallpaper(vec2 z) {
    vec2 sum = vec2(0.0);
    vec2 lattice_coords = mat2(inv_lattice) * z;
    for (int i = 0; i < MAX_TERMS; i++) {
        // a_nm expi(2pi * i * dot(nm, A^(-1) z))
        vec2 nm = powers[i];
        vec2 a_nm = coeffs[i];
        a_nm.y += animation[i] * time;
        float angle = 2.0 * PI * dot(nm, lattice_coords) + a_nm.y;
        sum += to_rect(vec2(a_nm.x, angle));
    }
    return sum;
}

void main() {
    vec2 complex = to_complex(uv);
    vec2 z = compute_wallpaper(complex);
    vec4 output_color = texture2D(texture0, to_texture(z));
    
    float unit_circle_dist = abs(length(z) - 1.0);
    float unit_circle_mask = smoothstep(0.02, 0.01, unit_circle_dist);
    
    float modulus = length(z);
    float far_away = smoothstep(100.0, 200.0, modulus);
    float near_zero = smoothstep(0.011, 0.01, modulus);
    
    const vec4 CYAN = vec4(0.0, 1.0, 1.0, 1.0);
    const vec4 YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
    const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);

    vec2 cell_uv = fract(mat2(inv_lattice) * complex);
    vec2 grid = step(0.99, cell_uv);
    float grid_mask = max(grid.x, grid.y);
    
    vec4 image = output_color;
    image = mix(image, CYAN, unit_circle_mask * show_ref_geometry);
    image = mix(image, YELLOW, near_zero * show_ref_geometry);
    image = mix(image, BLACK, far_away);
    image = mix(image, YELLOW, grid_mask * show_ref_geometry);
    gl_FragColor = image;
}
`;

export class WallpaperShader extends SymmetryShader {
    init(sketch) {
        super.init(sketch, VERT_SHADER, FRAG_SHADER);
        this.set_uniform('inv_lattice', [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }
    
    draw() {
        const sketch = this._sketch;
        this.update_time();
        sketch.noStroke();
        
        // This makes sure the alpha channel is enabled for
        // transparent images.
        sketch.fill(0, 0, 0, 0);
        
        // Draw a quad that spans the canvas. Since the vertex shader
        // ignores the model matrix, use clip coordinates
        const hw = 1;
        const hh = 1;
        sketch.quad(-hw, -hh, hw, -hh, hw, hh, -hw, hh);
        
        // Disable when done to get ready for the next shader
        this.disable();
    }

    set_lattice(e1, e2) {
        // These are the columns of the original matrix
        // [e1 e2] = [a b]
        //           [c d]
        const [a, c] = e1;
        const [b, d] = e2;
        const det = a * d - b * c;
        const inv_det = 1.0 / det;

        // Compute the inverse, but WebGL expects column-major format
        // and it's a mat3 just because p5.js only allows mat3 and mat4
        const mat = [
            inv_det * d, inv_det * -c, 0.0, 
            inv_det * -b, inv_det *a, 0.0,
            0.0, 0.0, 1.0
        ];
        this.set_uniform('inv_lattice', mat);
    }
}
