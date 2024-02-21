/**
 * This class represents a finite sum of circular motions of the form
 *
 * f(t) = sum_k a_k e^(i n_k t)
 *
 * where a_k = amplitude * e^(i phase) is a complex number
 *       n_k is an integer
 *       t is a real number, typically in the range [0, 2 pi]
 */
export class FourierSeries {
    /**
     * terms - an array of triples [frequency, amplitude, phase]
     * the terms must be specified in ascending order so the
     * partial sums are predictable.
     */
    constructor(terms) {
        this.terms = terms;
    }

    /**
     * To plot the drawing arm, we need not just the total sum,
     * but all the partial sums.
     */
    *partial_sums(t) {
        let x = 0.0;
        let y = 0.0;
        yield [0, 0];
        for (const [frequency, amplitude, phase] of this.terms) {
            let term_x = amplitude * Math.cos(frequency * t - phase);
            let term_y = amplitude * Math.sin(frequency * t - phase);
            x += term_x;
            y += term_y;
            yield [x, y];
        }
    }

    /**
     * For convenience, this gets the final sum from this.partial_sums()
     */
    position(t) {
        const sums = this.partial_sums(t);
        return sums[sums.length - 1];
    }

    /**
     * Return a new curve scaled by a real number.
     * this is done by scaling the amplitudes
     */
    scale(amount) {
        return new FourierSeries(
            this.terms.map(([freq, amp, phase]) => [freq, amp * amount, phase]),
        );
    }

    /**
     * Rotate a curve by an angle in radians
     * This is done by adding the angle to the phase of all terms.
     */
    rotate(angle) {
        return new FourierSeries(
            this.terms.map(([freq, amp, phase]) => [freq, amp, phase - angle]),
        );
    }

    /**
     * Shorthand string for representing a curve in the form
     * freq,amp,phase:freq,amp,phase:...
     * note that phase is scaled so it is a multiple of pi
     */
    to_string() {
        let terms = [];
        for (const [frequency, amplitude, phase] of this.terms) {
            const term_str = `${frequency},${amplitude},${phase / Math.PI}`;
            terms.push(term_str);
        }
        return terms.join(":");
    }

    /**
     * Load a pattern from a string in the same format as
     * to_string()
     */
    static from_string(str) {
        const terms = str
            .trim()
            .split(":")
            .map((term_str) => {
                const [freq_str, amp_str, phase_str] = term_str.split(",");
                const freq = parseInt(freq_str);
                const amp = parseFloat(amp_str);
                const phase = parseFloat(phase_str) * Math.PI;

                if (!isFinite(freq)) {
                    throw new Error("frequency must be an integer");
                }

                if (!isFinite(amp)) {
                    throw new Error("amplitude must be a real number");
                }

                if (!isFinite(phase)) {
                    throw new Error("phase must be a real number");
                }

                return [freq, amp, phase];
            })
            .sort();

        return new FourierSeries(terms);
    }
}
