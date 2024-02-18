import { BUILT_IN_TEXTURES, ImageTexture, WebcamTexture } from "../Texture.js";
import { shadow_event } from "../core/ui_util.js";

const BUILT_IN_TEXTURE_OPTIONS = Object.keys(BUILT_IN_TEXTURES).map(key => {
    return {label: key, value: key};
});

async function make_data_url(file) {
    const reader = new FileReader();
    const promise = new Promise((resolve) => {
        reader.addEventListener('load', (e) => {
            resolve(e.target.result);
        });
    });
    reader.readAsDataURL(file);
    return await promise;
}

class TextureSettings extends HTMLElement {
    constructor() {
        super();

        this._sketch = undefined;
        this._webcam = new WebcamTexture;
        
        this._on_texture_changed = () => {};

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <h3>Texture Settings</h3>
            <sym-dropdown id="builtin-textures" label="Choose a built-in texture"></sym-dropdown>
            <br />
            <span class="or">OR</span>
            <label for="image-input">Choose a PNG or JPEG image texture:</label>
            <input id="image-input" type="file" accept="image/png, image/jpeg" />
            <br />
            <span class="or">OR</span>
            <button id="use-webcam">Use Webcam</button>
        `;
    }    

    async make_image_texture(url) {
        return await new Promise((resolve) => {
            this._sketch.loadImage(url, (img) => {
                const texture = new ImageTexture(img);
                resolve(texture);
            });
        });
    }

    async read_image(e) {
        const file = e.target.files[0];
        const url = await make_data_url(file);
        const texture = await this.make_image_texture(url);
        this._on_texture_changed(texture);
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#builtin-textures')
            .set_options(BUILT_IN_TEXTURE_OPTIONS)
            .on_change((value) => {
                this._on_texture_changed(BUILT_IN_TEXTURES[value]);
            });
        shadow_event(this.shadowRoot, '#image-input', 'change', (e) => {
            this.read_image(e);
        });
        shadow_event(this.shadowRoot, '#use-webcam', 'click', () => {
            this._on_texture_changed(this._webcam);
        });
    }

    set_sketch(sketch) {
        this._sketch = sketch;
        return this;
    }

    on_texture_changed(callback) {
        this._on_texture_changed = callback;
        return this;
    }
}

customElements.define('sym-texture-settings', TextureSettings);
