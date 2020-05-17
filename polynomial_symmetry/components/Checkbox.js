class Checkbox extends HTMLElement {
    constructor() {
        super();
        this._checked = false;
        this._on_click = undefined;
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
        this.attach_handlers();
    }

    attach_handlers() {
        this.shadowRoot.querySelector('#checkbox').addEventListener('click', (e) => {
            this._checked = e.target.checked;
            if (this._on_click) {
                this._on_click(this._checked);
            }
        });
    }

    click(callback) {
        this._on_click = callback;
        return this;
    }
}

customElements.define('bricks-checkbox', Checkbox);
