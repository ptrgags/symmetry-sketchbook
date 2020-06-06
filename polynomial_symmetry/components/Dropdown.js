class Dropdown extends HTMLElement {
    constructor() {
        super();
        this._value = undefined;
        this._on_change = undefined;
        const shadow = this.attachShadow({mode: 'open'});
        const label = this.getAttribute('label');
        shadow.innerHTML = `
            <style>
                select {
                    background-color: #000000;
                    color: #BBBBBB;
                    border: 2px solid #888888;
                    border-radius: 4px;
                }
            </style>
            <label for="dropdown">${label}</label>
            <select id="dropdown"></select>
        `;
    }

    get value() {
        return this._value;
    }
    get checked() {
        return this._checked;
    }

    connectedCallback() {
        this.attach_handlers();
    }

    find_shadow(query) {
        return this.shadowRoot.querySelector(query);
    }

    attach_handlers() {
        this.find_shadow('#dropdown').addEventListener('change', (e) => {
            this._value = e.target.value;
            if (this._on_change) {
                this._on_change(this._value);
            }
        });
    }

    set_options(options) {
        const dropdown = this.find_shadow('#dropdown');
        for (const option of options) {
            const value = option.value;

            // If we don't already have a value, set it.
            this._value = this._value || value;

            const label = (option.label !== undefined) ? option.label : value; 
            const option_tag = document.createElement('option');
            option_tag.value = value;
            option_tag.innerHTML = label;
            dropdown.appendChild(option_tag);
        }
        return this;
    }

    change(callback) {
        this._on_change = callback;
        return this;
    }
}

customElements.define('bricks-dropdown', Dropdown);
