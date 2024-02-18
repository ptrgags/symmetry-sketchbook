import { Coefficients } from "../Coefficients.js";
import { shadow_event } from "../core/ui_util.js";
import { mod, radians, TWO_PI } from "../math_util.js";

function * parse_tuples(text) {
    const tuple_regex = /\(([^)]*)\)/g;
    const separator_regex = /,\s*/;
    
    var match = tuple_regex.exec(text);
    while(match) {
        const tuple = match[1];
        const fields = tuple.split(separator_regex);
        const values = fields.map(parseFloat);
        yield values;
        match = tuple_regex.exec(text);
    }
}

function parse_coefficients(text) {
    const tuples = [];
    for (const tuple of parse_tuples(text)) {
        if (tuple.length < 2 || 4 < tuple.length) {
            console.warn(`Coefficients should have 2-4 components, got ${tuple} instead`);
        }

        // Start with defaults and fill in what values are given
        const coeffs = [0, 0, 1, 0,];
        for (let i = 0; i < tuple.length; i++) {
            coeffs[i] = tuple[i];
        }
        
        const [n, m, amp, phase] = coeffs;
        const adjusted_phase = mod(radians(phase), TWO_PI);
        
        tuples.push([n, m, amp, adjusted_phase]);
    }
    
    return new Coefficients(tuples);
}

class CoefficientSettings extends HTMLElement {
    constructor() {
        super();

        this._coefficients = undefined;
        
        this._on_coefficients_changed = () => {};

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <h3>Coefficient Settings</h3>
            <div id="current-coefficients"></div>
            <label for="coeffs">Coefficients (n, m, amp=1, phase_deg=0)</label>
            <input id="coeffs" type="text" />
            <br />
            <button id="update-params">Update Coefficients</button>
            <button id="random-params">Random Coefficients</button>

            <!-- Wallpaper settings -->
            <button id="quasi-params-5">5-fold Quasicrystal Coefficients</button>
            <button id="quasi-params-7">7-fold Quasicrystal Coefficients</button>
        `;
    }   

    connectedCallback() {
        shadow_event(this.shadowRoot, '#coeffs', 'change', (e) => {
            this._coefficients = parse_coefficients(e.target.value);
        });
        shadow_event(this.shadowRoot, '#update-params', 'click', (e) => {
            this._on_coefficients_changed(this._coefficients);
        });
        shadow_event(this.shadowRoot, '#random-params', 'click', (e) => {
            this._on_coefficients_changed(Coefficients.from_random());
        });
        shadow_event(this.shadowRoot, '#quasi-params-5', 'click', (e) => {
            this._on_coefficients_changed(Coefficients.from_quasi_symmetry(5));
        });
        shadow_event(this.shadowRoot, '#quasi-params-7', 'click', (e) => {
            this._on_coefficients_changed(Coefficients.from_quasi_symmetry(7));
        });
    }

    on_coefficients_changed(callback) {
        this._on_coefficients_changed = callback;
    }
}

customElements.define('sym-coefficient-settings', CoefficientSettings);
