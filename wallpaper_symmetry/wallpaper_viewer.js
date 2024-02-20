import { NO_ANIMATION } from "../polynomial_symmetry/core/Animation.js";
import { DEFAULT_COEFFICIENTS } from "../polynomial_symmetry/core/Coefficients.js";
import { Checkerboard } from "../polynomial_symmetry/core/Texture.js";
import { WallpaperSymmetry } from "../polynomial_symmetry/core/WallpaperSymmetry.js";
import { WallpaperShader } from "../polynomial_symmetry/shaders/WallpaperShader.js";

const shader = new WallpaperShader();
const texture = new Checkerboard();
const symmetry = WallpaperSymmetry.from_preset("pm");

export const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(500, 700, p.WEBGL);
        p.textureMode(p.NORMAL);

        shader.init(p);
        shader.set_uniform("zoom", 3);
        shader.set_uniform("aspect", 5 / 7);
        shader.symmetries = [symmetry];
        shader.set_lattice(...symmetry.lattice);
        shader.set_coefficients(DEFAULT_COEFFICIENTS);
        shader.set_animation(NO_ANIMATION);
        //shader.set_uniform("show_ref_geometry", true);
        shader.disable();

        texture.init(p, 256, 256);
        shader.set_texture(texture);
    };

    p.draw = () => {
        p.background(0, 40, 45);
        shader.draw();
    };
};
