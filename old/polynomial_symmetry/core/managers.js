import { ImageTexture } from './Texture.js';
export class TextureManager {
    constructor(shaders, dims) {
        this._dims = dims;
        this._texture = undefined;
        this._shaders = shaders;
        this._sketch = undefined;
    }

    init(sketch) {
        this._sketch = sketch;
    }

    load_image(url) {
        this._sketch.loadImage(url, img => {
            const tex = new ImageTexture(img);
            this.texture = tex;
        });
    }
    
    get texture() {
        return this._texture;
    }

    set texture(tex) {
        const [w, h] = this._dims;
        tex.init(this._sketch, w, h);
        this._texture = tex;
        this._shaders.set_texture(this._texture);
    }
}

export class SymmetryManager {
    constructor(shaders) {
        this._shaders = shaders;
        this._symmetries = [];
    }
    
    get symmetries() {
        return this._symmetries();
    }
    
    add_symmetry(symmetry) {
        this._symmetries.push(symmetry);
        this._update_shaders();
        this.update_panel();
    }
    
    clear_symmetries() {
        this._symmetries = [];
        this._update_shaders();
        this.update_panel();
    }
    
    _update_shaders() {
        this._shaders.set_symmetries(this._symmetries);
    }
    
    update_panel() {
        const panel = document.getElementById('current-symmetries');
        const lines = this._symmetries.map(x => x.to_string()).join('<br/>');
        panel.innerHTML = `Current Symmetries:<br/>${lines}`;
    }
}

export class ShaderManager {
    constructor() {
        this._shaders = new Map();
        this._sketch = undefined;
    }

    add_shader(name, shader, transparent) {
        transparent = transparent || false;
        this._shaders.set(name, {
            shader: shader,
            show: false,
            transparent
        });
    }

    preload(sketch) {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.preload(sketch);
        }
    }

    init(sketch) {
        this._sketch = sketch;
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.init(sketch);
        }
    }

    set_uniform(name, value) {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.set_uniform(name, value);
        }
    }

    set_symmetries(symmetries) {
        for (const shaderInfo of this._shaders.values()) {
            const shader = shaderInfo.shader;
            shader.symmetries = symmetries;
        }

        this.set_coefficients();
    }

    set_coefficients(coeffs) {
        try {
            for (const shaderInfo of this._shaders.values()) {
                shaderInfo.shader.set_coefficients(coeffs);

            }
        } catch (e) {
            if (e.message.startsWith("Too many terms")) {
                log.warn(e.message);
            } else {
                throw e;
            }
        }
    }

    set_animation(animation) {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.set_animation(animation);
        }
    }

    set_texture(tex) {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.set_texture(tex);
        }
    }

    set_mouse_uv(mouse_uv) {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.set_mouse_uv(mouse_uv);
        }
    }

    set_pan_uv(mouse_uv) {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.set_pan_uv(mouse_uv);
        }
    }

    set_lattice(e1, e2) {
        this._shaders.get('wallpaper').shader.set_lattice(e1, e2);
    }

    disable_all() {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.shader.disable();
        }
    }

    hide_all() {
        for (const shaderInfo of this._shaders.values()) {
            shaderInfo.show = false;
        }
    }

    set_show(name, value) {
        this._shaders.get(name).show = value;
    }


    draw() {
        const opaque = [];
        const transparent = [];
        for (const shaderInfo of this._shaders.values()) {
            if (!shaderInfo.show) {
                continue;
            }

            if (shaderInfo.transparent) {
                transparent.push(shaderInfo.shader);
            } else {
                opaque.push(shaderInfo.shader);
            }
        }

        for (const shader of opaque.concat(transparent)) {
            shader.draw();
        }
    }
}
