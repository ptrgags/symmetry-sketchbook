import { Coefficients } from './Coefficients.js';

export class WallpaperSymmetry {
    constructor(options) {
        options = options || {};
        this._negate = options.negate || 0;
        this._negate_n = options.negate_n || 0;
        this._negate_m = options.negate_m || 0;    
        this._swap = options.swap || 0;    
        this._hex = options.hex || 0;    
    }

    * negate(terms) {
        if (this._negate === 0) {
            yield* terms;
            return;
        }

        for (const [n, m, amp, phase] of terms) {
            yield [n, m, amp, phase];
            yield [-n, -m, amp, phase];
        }
    }

    * negate_n(terms) {
        if (this._negate_n === 0) {
            yield* terms;
            return;
        }

        for (const [n, m, amp, phase] of terms) {
            yield [n, m, amp, phase];
            yield [-n, m, amp, phase];
        }
    }

    * negate_m(terms) {
        if (this._negate_m === 0) {
            yield* terms;
            return;
        }

        for (const [n, m, amp, phase] of terms) {
            yield [n, m, amp, phase];
            yield [n, -m, amp, phase];
        }
    }

    * swap(terms) {
        if (this._swap === 0) {
            yield* terms;
            return;
        }

        for (const [n, m, amp, phase] of terms) {
            yield [n, m, amp, phase];
            yield [m, n, amp, phase];
        }
    }

    * hex(terms) {
        if (this._hex === 0) {
            yield* terms;
            return;
        }

        for (const [n, m, amp, phase] of terms) {
            yield [n, m, amp, phase];

            const third_freq = -(n + m);
            yield [m, third_freq, amp, phase];
            yield [third_freq, n, amp, phase];
        }
    }

    apply_symmetry(coefficients) {
        // Pass the coefficients through filters that can be enabled/disabled
        let results = coefficients;
        results = this.negate(results);
        results = this.negate_n(results);
        results = this.negate_m(results);
        results = this.swap(results);
        results = this.hex(results);

        return new Coefficients([...results]);
    }

    to_string() {
        return `
            N=${this._negate},
            N_n=${this._negate_n},
            N_m=${this._negate_m},
            S=${this._swap},
            H=${this._hex}
        `;
    }
}
