class Checkbox extends HTMLElement {
    constructor() {
        super();
        this._checked = false;
        this._on_change = undefined;
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <label id="label" for="checkbox">${this.innerHTML}</label>
            <input id="checkbox" type="checkbox" />
        `;
    }

    get checked() {
        return this._checked;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#checkbox').addEventListener('change', (e) => {
            this._checked = e.target.checked;
            if (this._on_change) {
                this._on_change(this._checked);
            }
        });
    }

    on_change(callback) {
        this._on_change = callback;
        return this;
    }
}

customElements.define('sym-checkbox', Checkbox);
