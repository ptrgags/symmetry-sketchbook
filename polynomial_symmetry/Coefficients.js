// A list of (freq_n, freq_m, amp, phase) coefficients
// representing complex numbers a_nm in a complex polynomial
// f(z) = sum_nm a_nm z^n conj(z)^m
export class Coefficients {
    constructor(tuples) {
        this._tuples = tuples;
    }
    
    // Fancy syntax that just defines for...of
    // behavior.
    // usage: for (const [n, m, amp phase] of coefficients) {} 
    *[Symbol.iterator]() {
        yield* this._tuples;
    }
    
    get size() {
        return this._tuples.length;
    }
    
    normalize() {
        let sum = 0;
        for (const [, , amp] of this) {
            sum += amp;
        }
        
        this._tuples = this._tuples.map(([n, m, amp, phase]) => [n, m, amp / sum, phase]); 
    }
    
    get arrays() {
        const powers = [];
        const coeffs = [];
        for (const [n, m, amp, phase] of this) {
            powers.push(n, m);
            coeffs.push(amp, phase);
        }
        
        return {
            powers,
            coeffs
        };
    }
    
    to_html() {
        const parts = [];
        for (const [n, m, amp, phase] of this) {
            const amp3 = amp.toPrecision(3);
            const phase_deg3 = degrees(phase).toPrecision(3);
            const tuple = `(${n}, ${m}, ${amp3}, ${phase_deg3}°)`;
            parts.push(tuple);
        }
        return parts.join('<br/>');
    }
}
