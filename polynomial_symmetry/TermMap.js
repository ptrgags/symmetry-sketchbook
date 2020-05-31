import { Coefficients } from './Coefficients.js';

export class TermMap {
    constructor(coefficients) {
        this._terms = new Map();
        for (const [n, m, amp, phase] of coefficients) {
            this.set_term(n, m, amp, phase);
        }
    }
    
    get size() {
        return this._terms.size;
    }
    
    get_term(n, m) {
        const key = `${n}, ${m}`;
        let coeff = this._terms.get(key);
        if (coeff === undefined) {
            coeff = [0, 0];
        }
        
        return coeff;
    }
    
    set_term(n, m, amp, phase) {
        const key = `${n}, ${m}`;
        const value = [amp, phase];
        // Still need to deal with this, but it's kinda noisy right now
        /*
        if (this._terms.has(key)) {
            console.warn('Duplicate coefficient detected! clobbering');
            console.warn('old:', `a[${key}] = ${this._terms.get(key)}`);
            console.warn('new:', `a[${key}] = ${value}`);
        }
        */
        this._terms.set(key, value);
    }
    
    to_coefficients() {
        const terms = [];
        for (const [key, [amp, phase]] of this._terms.entries()) {
            const [n, m] = key.split(', ');
            terms.push([n, m, amp, phase]);
        }
        return new Coefficients(terms);
    }
}
