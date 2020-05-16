export class TextureManager {
    constructor(dims) {
        this._dims = dims;
        this._texture = undefined;
        this._shaders = [];
    }
    
    get shaders() {
        return this._shaders;
    }
    
    set shaders(shaders) {
        this._shaders = shaders;
    }
    
    get texture() {
        return this._texture;
    }
    
    set texture(tex) {
        const [w, h] = this._dims;
        tex.make_graphics(w, h);
        this._texture = tex;
        this._update_shaders();
    }
    
    _update_shaders() {
        for (const shader of this._shaders) {
            shader.set_texture(this._texture);
        }
    }
}

export class SymmetryManager {
    constructor() {
        this._symmetries = [];
        this._shaders = [];
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
    
    get shaders() {
        return this._shaders;
    }
    
    set shaders(shaders) {
        this._shaders = shaders;
    }
    
    _update_shaders() {
        for (const shader of this._shaders) {
            shader.symmetries = this._symmetries;
            shader.set_coefficients();
        }
    }
    
    update_panel() {
        const panel = document.getElementById('current-symmetries');
        const lines = this._symmetries.map(x => x.to_string()).join('<br/>');
        panel.innerHTML = `Current Symmetries:<br/>${lines}`;
    }
}
