import { DEFAULT_ANIMATION } from "../polynomial_symmetry/core/Animation.js";
import { DEFAULT_COEFFICIENTS } from "../polynomial_symmetry/core/Coefficients.js";
import { DEFAULT_SYMMETRY } from "../polynomial_symmetry/core/PointSymmetry.js";
import { Checkerboard } from "../polynomial_symmetry/core/Texture.js";
import { PolynomialShader } from "../polynomial_symmetry/shaders/PolynomialShader.js";

const shader = new PolynomialShader("rosette");
const texture = new Checkerboard();

export const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(500, 700, p.WEBGL);
        p.textureMode(p.NORMAL);

        shader.init(p);
        shader.set_uniform("zoom", 3);
        shader.set_uniform("aspect", 5 / 7);
        shader.symmetries = [DEFAULT_SYMMETRY];
        shader.set_coefficients(DEFAULT_COEFFICIENTS);
        shader.set_animation(DEFAULT_ANIMATION);
        shader.disable();

        texture.init(p, 256, 256);
        shader.set_texture(texture);
    };

    p.draw = () => {
        p.background(0, 40, 45);
        shader.draw();
    };
};
