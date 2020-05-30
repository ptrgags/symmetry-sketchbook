import { common } from './common_glsl.js';
import { SymmetryShader } from './Shader.js';

const VERT_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float time;

varying vec2 uv;

void main() {
    vec3 computed_pos = vec3(aPosition.xy, sin(4.0 * aPosition.x - 0.0 * time));
    vec4 position = vec4(computed_pos.xzy, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * position;
    uv = aTexCoord;
}
`;

const FRAG_SHADER = `
precision highp float;
varying vec2 uv;

void main() {
    gl_FragColor = vec4(uv, 0.0, 1.0);
}
`;

const CAMERA_HEIGHT = 1.0;
const CAMERA_RADIUS = 3.0;
const CAMERA_SPEED = 0.1;
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
    }

    _update_camera() {
        const sketch = this._sketch;
        const time = sketch.millis() / 1000.0;

        // Rotate around the model, a little bit above horizontal
        const azimuth = 2.0 * sketch.PI * CAMERA_SPEED * time;
        const cx = CAMERA_RADIUS * sketch.cos(azimuth);
        const cy = CAMERA_HEIGHT;
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
}
