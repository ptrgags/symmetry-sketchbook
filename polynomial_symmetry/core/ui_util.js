export function find(query) {
    return document.querySelector(query);
}

export function shadow_event(shadowRoot, id, event, callback) {
    shadowRoot.querySelector(id).addEventListener(event, callback);
}


export function value_or_default(element, default_value) {
    const value = parseInt(element.value);
    
    if (isFinite(value)) {
        return value;
    }

    return default_value;
}

export function checkbox_int(element) {
    return element.checked ? 1 : 0;
}
