// A list of (freq_n, freq_m, amp, phase) coefficients
// representing complex numbers a_nm in a complex polynomial
// f(z) = sum_nm a_nm z^n conj(z)^m
class Coefficients {
    constructor(tuples) {
        this._tuples = tuples;
    }
    
    get length() {
        return this._tuples.length;
    }
    
    get arrays() {
        const powers = [];
        const coeffs = [];
        for (const [n, m, amp, phase] of this._tuples) {
            powers.push(n, m);
            coeffs.push(amp, phase);
        }
        
        return {
            powers,
            coeffs
        };
    }
}