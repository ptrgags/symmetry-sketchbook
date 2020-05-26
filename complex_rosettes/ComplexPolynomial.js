class ComplexPolynomial {
    constructor(terms) {
        this.terms = terms.sort();
    }
    
    /**
     * Compute the polynomial at a point z:
     *
     * f(z) = sum_nm a_nm z^(freq_n) conj(z)^(freq_m)
     *
     * But to avoid some memory allocations, the terms are rearranged a bit
     * using a_nm = amp_mn e^(i phase_nm) and z = r e^(i theta). Plugging these
     * in and siimplifying, we have:
     * 
     * f(z) = sum_nm amp_nm r^(n + m) e^(i(theta (n - m) + phase_nm))
     *
     * which helps to reduce how many times powers need to be computed.
     * That said, there are still some optimizations to reduce the amount
     * of objects that need to be computed.
     */
    compute(z) {
        let sum = new Complex(0, 0);
        
        const r = z.mod;
        const theta = z.arg;
        for (const [n_freq, m_freq, amp, phase] of this.terms) {
            const mod = amp * Math.pow(r, n_freq + m_freq);
            const arg = theta * (n_freq - m_freq) - phase;
            const term = Complex.from_polar(mod, arg);
            // Optimization note: if needed, add a function to
            // add the sum in place. Furthermore, the 
            // Complex.from_polar() object allocation could be 
            // removed if there was a method to add a complex
            // number from r and theta, or if the term used
            // a scratch variable.
            sum = sum.add(term);
        }
        
        return sum;
    }
    
    /**
     * Scale the polynomial by scaling all the amplitudes
     */
    scale(r) {
        return new ComplexPolynomial(this.terms.map(([n, m, amp, phase]) => {
            return [n, m, amp * r, phase,];
        }));
    }
}
