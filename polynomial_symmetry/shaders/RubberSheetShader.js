import { common } from './common_glsl.js';
import { SymmetryShader } from './Shader.js';
import { WALLPAPER_FUNC } from './WallpaperShader.js';

const VERT_SHADER = `
${common.defines}
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

${common.uniforms_view}
${common.uniforms_polynomial}
${common.uniforms_wallpaper}
${common.uniforms_animation}

${common.funcs_view}
${common.funcs_polar}
${common.funcs_animation}
${WALLPAPER_FUNC}

varying vec2 uv;
varying vec2 warped_pos;

uniform vec2 polarization;

void main() {
    uv = aTexCoord;
    uv.y = 1.0 - uv.y;

    vec2 complex = to_complex(uv);
    vec2 z = compute_wallpaper(complex, -1.0);

    if (enable_standing_waves) {
        z += compute_wallpaper(complex, 1.0);
    }

    // Since the other shaders assumed clip coordinates, we'll need to use
    // this as well for the effective UV
    warped_pos = complex_to_clip(z);

    // The result is a complex number. Let's extract out a single direction.
    // This is similar to sending light through a linear polarizer, hence
    // the name.
    float height = dot(normalize(z), polarization);

    // for complex numbers,
    // |sum a_i| <= sum |a_i|
    // so we can use the RHS of the inequality to normalize the values
    // between [-1, 1]
    float height_bound = 0.0;
    for (int i = 0; i < MAX_TERMS; i++) {
        height_bound += abs(coeffs[i].x);
    }

    vec3 computed_pos = vec3(aPosition.xy, height / height_bound);
    vec4 position = vec4(computed_pos.xzy, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}
`;

const FRAG_SHADER = `
precision highp float;
varying vec2 uv;
varying vec2 warped_pos;

${common.uniforms_texture}
${common.uniforms_view}

${common.funcs_view}

void main() {
    vec4 tex_color = texture2D(texture0, to_texture(warped_pos));
    gl_FragColor = tex_color;
}
`;

const CAMERA_HEIGHT = -2.0;
const CAMERA_RADIUS = 1.1;
const CAMERA_SPEED = 0.0;
export class RubberSheetShader extends SymmetryShader {
    constructor() {
        super()
        this._grid_model = undefined;
    }

    preload(sketch) {
        this._grid_model = sketch.loadModel('assets/grid.obj');
    }
    
    init(sketch) {
        super.init(sketch, VERT_SHADER, FRAG_SHADER);
        sketch.frustum(-0.1, 0.1, -0.1, 0.1, 0.1, 200);
        window.sketch = this._sketch;
        this.set_uniform('inv_lattice', [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }

    _update_camera() {
        const sketch = this._sketch;
        const time = sketch.millis() / 1000.0;

        // Rotate around the model, a little bit above horizontal
        const azimuth = sketch.TWO_PI * 0.25;
        const cx = CAMERA_RADIUS * sketch.cos(azimuth);
        const cy = CAMERA_HEIGHT;// * sketch.sin(0.5 * sketch.PI * CAMERA_SPEED * time);
        const cz = CAMERA_RADIUS * sketch.sin(azimuth);

        const elevation = sketch.atan2(CAMERA_HEIGHT, CAMERA_RADIUS);
        const complement = sketch.HALF_PI - elevation; 
        const ux = sketch.cos(complement) * sketch.cos(azimuth);
        const uy = sketch.sin(complement);
        const uz = sketch.cos(complement) * sketch.sin(azimuth);

        sketch.camera(cx, cy, cz, 0, 0, 0, ux, uy, uz);
    }

    draw() {
        this.update_time();
        this._update_camera();

        this._sketch.model(this._grid_model);

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
