import { MAX_TERMS } from '../math_util.js';
export class Shader {
    constructor() {
        this._shader = undefined;
        this._enabled = false;
        this._sketch = undefined;
        this._initialized = false;
    } 

    // preload(sketch). Sometimes helpful for loading 3D models
    preload() {}

    init(sketch, frag, vert) {
        this._sketch = sketch
        this._shader = sketch.createShader(frag, vert); 
        this.set_uniform('aspect', sketch.width / sketch.height);
        this.set_uniform('time', 0.0);
        this.set_uniform('zoom', 1.0);
        this._initialized = true;
    }

    get shader() {
        return this._shader;
    }

    enable() {
        if (!this._enabled) {
            this._sketch.shader(this._shader);
            this._enabled = true;
        }
    }

    disable() {
        if (this._enabled) {
            this._sketch.resetShader();
            this._enabled = false;
        }
    }

    set_uniform(name, value) {
        this.enable();
        this._shader.setUniform(name, value);
    }

    update_time() {
        this.enable();
        this._shader.setUniform('time', this._sketch.millis() / 1000.0);
    }

    set_texture(texture) {
        this.enable();
        texture.set_wrapping();
        this._shader.setUniform('texture0', texture.texture);
    }

    set_mouse_uv(mouse_uv) {
        // Sometimes mouse events are triggered too early
        if (!this._initialized) {
            return;
        }
        this.enable();
        this._shader.setUniform('mouse_uv', mouse_uv);
    }

    set_pan_uv(pan_uv) {
        // Sometimes mouse events are triggered too early
        if (!this._initialized) {
            return;
        }
        this.enable();
        this._shader.setUniform('pan_uv', pan_uv);
    }
}

function pad_zeros(values, desired_length) {
    const len = values.length;
    if (len > desired_length) {
        const len_str = `(${len / 2}, max=${desired_length / 2})`;
        throw new Error(
            `Too many terms ${len_str}. Try again with fewer terms`);
    }
    
    const pad_length = desired_length - len;
    if (pad_length > 0) {
        const padding = Array(pad_length).fill(0);
        return values.concat(padding);
    } else {
        return values;
    }
}

export class SymmetryShader extends Shader {
    constructor() {
        super();
        this._coeffs = undefined;
        this._symmetries = [];
    }

    init(sketch, frag, vert) {
        super.init(sketch, frag, vert);
        this.set_uniform('show_ref_geometry', 0.0); 
    }

    get symmetries() {
        return this._symmetries;
    }
    
    set symmetries(symmetries) {
        this._symmetries = symmetries;
    }

    _apply_symmetries(original_coefficients) {
        let coefficients = original_coefficients;
        for (const symmetry of this._symmetries) {
            coefficients = symmetry.apply_symmetry(coefficients);
        }
        return coefficients;
    }
    
    set_coefficients(original_coefficients) {
        this._coeffs = original_coefficients || this._coeffs;
        
        this.enable();
        const program = this._shader;
        
        // Apply symmetries, which often adds more terms to the polynomial
        const actual_coefficients = this._apply_symmetries(this._coeffs);

        program.setUniform('num_terms', actual_coefficients.size);

        //actual_coefficients.normalize();
        const {powers, coeffs} = actual_coefficients.arrays;
        
        // Since we always need to exactly fill the buffer,
        // add on some terms that are all equal to 0 to make sure
        // the calculation is performed correctly
        const powers_buffer = pad_zeros(powers, MAX_TERMS * 2);
        const coeffs_buffer = pad_zeros(coeffs, MAX_TERMS * 2); 
        
        program.setUniform('powers', powers_buffer);
        program.setUniform('coeffs', coeffs_buffer);
    }
    
    set_animation(animation_params) {
        this.enable();
        const animation_buffer = pad_zeros(animation_params, MAX_TERMS);
        this._shader.setUniform('animation', animation_buffer);
    }
}
