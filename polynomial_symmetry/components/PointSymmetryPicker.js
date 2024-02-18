import { shadow_event, value_or_default} from "../core/ui_util.js";
import { PointSymmetry } from "../PointSymmetry.js";

import "./Checkbox.js";

class PointSymmetryPicker extends HTMLElement {
    constructor() {
        super();

        this._folds = 1;
        this._input_rotation = 0;
        this._input_mirror = 0;
        this._input_inversion = 0;
        this._output_rotation = 0;
        this._output_mirror = 0;
        
        this._on_submit = () => {};

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <h4>Add Point Symmetry</h4>
            <label for="folds">k-fold rotations (k)</label>
            <input id="folds" type="text" />
            <label for="in-rotation">Input Rotation (l)</label>
            <input id="in-rotation" type="text" />
            <br />
            <sym-checkbox id="in-inversion">Input inversion (p)</sym-checkbox>
            <sym-checkbox id="in-reflection">Input Reflection(q)</sym-checkbox>
            <br />
            <label for="out-rotation">Output Rotation (u)</label>
            <input id="out-rotation" type="text" />
            <sym-checkbox id="out-reflection">Output Reflection (v)</sym-checkbox>
            <br />
            <button id="add-point-symmetry">Add Symmetry</button>
        `
    }

    connectedCallback() {
        shadow_event(this.shadowRoot, '#folds', 'change', (e) => {
            this._folds = value_or_default(e.target, 1);
        });
        shadow_event(this.shadowRoot, '#in-rotation', 'change', (e) => {
            this._input_rotation = value_or_default(e.target, 0);
        });

        this.shadowRoot.querySelector('#in-reflection')
            .on_change((checked) => {
                this._input_mirror = Number(checked);
            });
        this.shadowRoot.querySelector('#in-inversion')
            .on_change((checked) => {
                this._input_inversion = Number(checked);
            });
        shadow_event(this.shadowRoot, '#out-rotation', 'change', (e) => {
            this._output_rotation = value_or_default(e.target, 0);
        });
        this.shadowRoot.querySelector('#out-reflection')
            .on_change((checked) => {
                this._output_mirror = Number(checked);
            });

        shadow_event(this.shadowRoot, '#add-point-symmetry', 'click', (e) => {
            const symmetry = new PointSymmetry({
                folds: this._folds,
                input_rotation: this._input_rotation,
                input_inversion: this._input_inversion,
                input_mirror: this._input_mirror,
                output_rotation: this._output_rotation,
                output_mirror: this._output_mirror,
            });
            this._submit(symmetry);
        });
    }

    on_submit(callback) {
        this._submit = callback;
        return this;
    }
}

customElements.define('sym-point-symmetry-picker', PointSymmetryPicker);
