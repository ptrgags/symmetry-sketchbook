import { Coefficients } from './Coefficients.js';
const TWO_PI = 2.0 * Math.PI;

/**
 * Simulate symmetry rules of functions from Complex -> Complex.
 * These rules are of the form:
 *
 * f Rotate_k^l Invert^p Mirror^q == Rotate_k^u Mirror^v f
 *
 * where:
 *
 * - juxtaposition means function composition
 * - k is an integer that represents k-fold rotations
 * - p, q, v are either 0 or 1, they indicate if a transformation
 *   is applied or not. Though these could be booleans, representing
 *   them as integers is useful in the math.
 * - l, u are integers that indicate how many times to apply a k-fold
 *   rotation to either the input or the output.
 * - Rotate_k(z) is a k-fold rotation, e^(i * 2pi / k)
 * - Invert(z) is complex inversion, 1/z (circle inversion followed 
 *   by reflection over the x-axis)
 * - Mirror(z) is a reflection over the x-axis. By combining this with
 *   rotations, you can produce other mirror axes.
 *
 * That's 2^3 * k^2 = 8k^2 possible patterns! Actually, some of these
 * are impossible. I'm still exploring this part of the equations.
 *
 * GROUP THEORY TIME ========================================================
 * 
 * It just so happens that there are group isomorphisms between these
 * transformations of the complex plane and rewriting rules of the
 * coefficients:
 *
 * Iso_in(Rotate_k(z)) = rotate_k^(n-m)(a_nm) = e^(i * 2pi * (n - m) / k) * a_nm
 * Iso_in(Invert(z)) = negate(a_nm) = a_(-n)(-m) 
 * Iso_in(Mirror(z)) = swap(a_nm) = a_mn
 * Iso_in(AB(z)) = (Ison_in(A), Iso_in(B))(a_nm) = Iso_in(B) Iso_in(A)(a_nm)
 *
 * BEFORE YOU GET CONFUSED ================================================
 * 
 * Let me point out one potentially confusing thing: The composition order
 * of transformations is from right to left, but the composition order of
 * rewriting rules is from _left to right_. So I use a comma to represent
 * this as a "sequence" of transformations rather than a composition.
 *
 * You may ask, Why does the multiplication order reverse? Good question.
 * Consider the composition:
 *
 * F = f A B C
 * 
 * if I want to derive the new function F, I would do this by combing the 
 * formula for f with the transformations one-by-one from left
 * to right. Every time 
 *
 *          <- corresponds to ->
 * transformations <-> coefficient rewriting rules
 * f               <-> a_nm
 * f A             <-> Iso_in(A)(a_nm)
 * f A B           <-> Iso_in(B) Iso_in(A)(a_nm)
 *
 * The order reversed! So if function composition is used for the group
 * of rewriting rules, then this is an antiisomorphism. (isomorphism except
 * the multiplication order is opposite)
 *
 * To make a true isomorphism, we can just define a "backwards composition"
 * which is just a "sequence" of transformations. That is, define:
 * 
 * a, b := ba
 * that is,
 * (a, b)(x) := b(a(x))
 *
 * ...anyway, let's get back to the derivation.
 * 
 * BACK TO THE DERIVATION ==========================================================
 * 
 * Iso_out(Mirror(z)) = conj(swap(a_nm)) = conj(a_mn)
 * Iso_out(Rotate_k(z)) = rotate_k(a_nm) = e^(i * 2pi / k) * a_nm
 * Iso_out(AB(z)) = Iso_out(A) Iso_out(B)
 *
 * (note that unlike the input, no need to worry about swapping multiplication order!)
 *
 * Okay, now let's use these isomorphisms on each side of the original equation
 *
 * f Rotate_k^l Invert^p Mirror^q == Rotate_k^u Mirror^v f
 *
 * Iso_in(Rotate_k^(l(n-m)) Invert^p Mirror^q) = rotate_k^(l(n-m)), negate^p, swap^q 
 * Iso_out(Rotate_k^u Mirror^v) = rotate_k^u conj^v swap^v
 *
 * The term l(n-m) appears a lot in what follows, so let L = l(n-m)
 *
 * Applying these to the coefficients, we get a new equation:
 *
 * (rotate_k^L, negate^p, swap^q)(a_nm) === rotate_k^u conj^v swap^v(a_nm)
 * swap^q negate^p rotate_k^L(a_nm) === rotate_k^u conj^v swap^v(a_nm)
 *
 * Let's rearrange this a bit:
 *
 *          swap^(-v) conj^(-v) rotate_k^(-u) swap^q negate^p rotate_k^L(a_nm) === a_nm
 *                swap^v conj^v rotate_k^(-u) swap^q negate^p rotate_k^L(a_nm) === a_nm
 *        swap^v conj^v rotate_k^(-u) swap^q rotate_k^(L(-1)^p) negate^p(a_nm) === a_nm
 *  swap^v conj^v rotate_k^(-u) rotate_k^(L(-1)^(p + q)) swap^q negate^p(a_nm) === a_nm
 *            swap^v conj^v rotate_k^(L(-1)^(p + q) - u) swap^q negate^p(a_nm) === a_nm
 *  swap^v rotate_k^(L(-1)^(p + q + v) - u(-1)^v) conj^v swap^q negate^p(a_nm) === a_nm
 * rotate_k^(L(-1)^(p + q + 2v) - u(-1)^v) swap^v conj^v swap^q negate^p(a_nm) === a_nm
 *      rotate_k^(L(-1)^(p + q) - u(-1)^v) swap^v conj^v swap^q negate^p(a_nm) === a_nm
 *         rotate_k^(L(-1)^(p + q) - u(-1)^v) conj^v swap^(v+q) negate^p(a_nm) === a_nm
 *
 * Using many, many properties of these transformations:
 *
 * - swap^(-v) = swap^v
 * - conj^(-v) = conj^v
 * - swap conj = conj swap
 * - rotate_k^a rotate_k^b = rotate_k^(a + b)
 * - rotate_k^(a(n - m) + b) swap = swap rotate_k^(-a(n - m) + b)
 * - rotate_k negate = negate rotate_k^(-1)
 * - rotate_k conj = conj rotate_k^(-1)
 * - (-1)^(2k) = 1
 *
 * To simplify this alphabet soup, 
 * 
 * let P = L(-1)^(p + q) - u(-1)^v
 *       = l(n - m)(-1)^(p + q) - u(-1)^v
 *
 * rotate_k^P conj^v swap^(v+q) negate^p(a_nm) === a_nm
 *
 * WHAT WAS THE POINT OF ALL THAT? =================================================
 *
 * This form gives an easy way to validate if a polynomial's coefficients follow the
 * symmetry rule:
 * 
 * for every coefficient a_nm:
 *   find its partner b_nm = swap^(v + q) negate^p(a_nm)
 *   compute B_nm = rotate_k^P conj^v b_nm
 *   verify that B_nm == a_nm (approximately, these are floats after all)
 * 
 * But what if we want to take a set of coefficients and enforce a symmetry? 
 * Given a_nm We need to ensure that the partner coefficient exists and follows
 * the rules. We need to rearrange the equation again, but only a little bit:
 *
 * rotate_k^P conj^v swap^(v+q) negate^p(a_nm) === a_nm
 *            conj^v swap^(v+q) negate^p(a_nm) === rotate_k^(-P) a_nm
 *                   swap^(v+q) negate^p(a_nm) === conj^v rotate_k^(-P) a_nm
 *
 * Which suggests the algorithm:
 *
 * for every coefficient a_nm:
 *   locate the partner indices (i, j) = swap^(v + q) negate^p(n, m)
 *   if (i, j) === (n, m):
 *     ...This case needs special care. I'll return to this soon.
 *   otherwise:
 *     set a_pq = conj^v rotate_k^(-P) a_nm
 *
 * WOW YOU'RE STILL HERE? =================================================
 *
 * Congrats, you survived a crash course in Applied Group Theory.
 * Reward: source code to actually implement this!
 */
export class PointSymmetry {
    constructor(options) {
        options = options || {};
        // Mirror symmetry across the x-axis.
        this._input_mirror = options.input_mirror || 0;
        this._output_mirror = options.output_mirror || 0;
        
        // Rotational symmetry
        this._folds = options.folds || 1;
        this._input_rotation = options.input_rotation || 0;
        this._output_rotation = options.output_rotation || 0;
        
        // I'm only allowing input inversion symmetry since finding
        // 1/p(x) opens a whole new can of worms.
        this._input_inversion = options.input_inversion || 0;
    }
    
    /**
     * Algorithm explained in the long derivation at the top of this file
     *
     * for every coefficient a_nm:
     *   find its partner b_nm = swap^(v + q) negate^p(a_nm)
     *   compute B_nm = rotate_k^P conj^v b_nm
     *   verify that B_nm == a_nm (approximately, these are floats after all)
     */
    matches_symmetry(coefficients) {
        const terms = new TermMap(coefficients);
        for (const [n, m, amp, phase] of coefficients) {
            let [n2, m2] = this._find_partner(n, m);
            let [amp2, phase2] = terms.get_term(n2, m2);
            
            
            [amp2, phase2] = this._transform_coeff(n, m, amp2, phase2);
            
            if (!PointSymmetry.terms_approx_equal([amp, phase], [amp2, phase2])) {
                return false;
            }
        }
        return true;
    }
    
    // Compute rotate_k^P conj^v a_nm
    _transform_coeff(n, m, amp, phase) {
        let [amp2, phase2] = [amp, phase];
        
        if (this._output_mirror === 1) {
            [amp2, phase2] = PointSymmetry.conjugate(amp2, phase2);
        }
            
        const power = this._compute_rotation_power(n, m);
        [amp2, phase2] = PointSymmetry.rotate(amp2, phase2, this._folds, power);
        
        return [amp2, phase2];
    }
    
    /**
     * Algorithm explained in the long derivation at the top of the file.
     * 
     * TODO: Rewrite this doc!
     * 
     * for every coefficient a_nm:
     *   locate the partner indices (i, j) = swap^(v + q) negate^p(n, m)
     *   if (i, j) === (n, m):
     *     ...This case needs special care. I'll return to this soon.
     *   otherwise:
     *     set a_ij = conj^v rotate_k^(-P) a_nm
     *
     * Note that this may clobber some coefficients. A warning will be logged
     * but the most recent coefficient will be used.
     */
    apply_symmetry(coefficients) {
        const terms = new TermMap(coefficients);
        const output_terms = new TermMap([]);
        for (const [n, m, amp, phase] of coefficients) {
            let [i, j] = this._find_partner(n, m);
            let [amp2, phase2] = this._transform_coeff(n, m, amp, phase);
            if (i === n && j === m) {
                if (PointSymmetry.terms_approx_equal([amp, phase], [amp2, phase2])) {
                    output_terms.set_term(n, m, amp, phase);
                } else {
                    // Don't add the term to the output, implicitly setting it to 0 
                    continue;
                }
            }
            
            let [amp3, phase3] = this._transform_coeff(n, m, amp2, phase2);
            if (PointSymmetry.terms_approx_equal([amp3, phase3], [amp, phase])) {
                output_terms.set_term(n, m, amp, phase);
                output_terms.set_term(i, j, amp2, phase2);
            } else {
                // Symmetry can't be satisfied, output 0 to implicitly set a 0 term
                continue;
            }
        }
        
        const output = output_terms.to_coefficients();
        if (output.size === 0) {
            log.warn('No output terms. Try starting with more coefficients');
        }
        
        console.assert(this.matches_symmetry(output), 'sanity check failed. Now running in insane mode');
        return output;
    }
    
    /**
     * How many times to apply the k-fold rotation in the validation direction.
     * This is affected by a number of things. See the lengthy derivation at the
     * top of this file.
     *
     *   P = l(n - m)(-1)^(p + q) - u(-1)^v
     *
     * where l = input_rotation
     *       p = input_inversion
     *       q = input_mirror
     *       u = output_rotation
     *       v = output_mirror
     *       n, m = the indices of this coefficient
     */
    _compute_rotation_power(n, m) {
        // l(n - m)(-1)^(p + q)
        let term1 = this._input_rotation;
        term1 *= (n - m);
        term1 *= Math.pow(-1, this._input_inversion + this._input_mirror);
        
        // -u(-1)^v
        let term2 = - this._output_rotation;
        term2 *= Math.pow(-1, this._output_mirror);
        
        return term1 + term2;
    }
    
    /**
     * Given a_nm, apply any necessary swapping/negating
     * given the different mirror symmetries involved.
     * 
     * This involves:
     * - negate the indices if input_inversion = 1
     * - swap the indices if input_mirror = 1
     * - swap the indices if output_mirror = 1
     *
     * Note that a double swap is possible.
     */
    _find_partner(n, m) {
        let [p, q] = [n, m];
        
        if (this._input_inversion === 1) {
            [p, q] = PointSymmetry.negate(p, q);
        }
        
        // Only need to swap if one of the mirror symmetry options is chosen.
        const reflect_count = this._input_mirror + this._output_mirror;
        if (reflect_count === 1) {
            [p, q] = PointSymmetry.swap(p, q);
        }
        
        return [p, q];
    }
    
    to_string() {
        const in_tuple = `(l=${this._input_rotation}, p=${this._input_inversion}, q=${this._input_mirror})`;
        const out_tuple = `(u=${this._output_rotation}, v=${this._output_mirror})`;
        return `PointSymmetry: k=${this._folds}, ${in_tuple}, ${out_tuple}`; 
    }
    
    static conjugate(amp, phase) {
        return [amp, -phase];
    }
    
    static negate(n, m) {
        return [-n, -m];
    }
    
    static swap(n, m) {
        return [m, n];
    }
    
    /**
     * Since coefficients are represented in polar
     * form, rotation is easy, just add the rotation
     * angle to the phase.
     *
     * the angle is given as 2pi / k * l where
     * k represents a k-fold rotation and l is the
     * multiples of this basic rotation
     */
    static rotate(amp, phase, folds, power) {
        const theta = TWO_PI / folds * power;
        return [amp, mod(theta + phase, TWO_PI)];
    }
    
    static terms_approx_equal(a, b) {
        const EPSILON = 1e-8;
        const [amp1, phase1] = a;
        const [amp2, phase2] = b;
        if (Math.abs(amp1 - amp2) >= EPSILON) {
            return false;
        }
        
        const phase1_mod_pi = mod(phase1, TWO_PI);
        const phase2_mod_pi = mod(phase2, TWO_PI);
        
        if (Math.abs(phase1_mod_pi - phase2_mod_pi) >= EPSILON) {
            return false;
        }
        
        return true;
    }
}

function mod(x, n) {
    return ((x % n) + n) % n;
}

class TermMap {
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

/**
 * Frieze symmetry is created by plugging Phi(z) = e^iz
 * into the same polynomial f(z) = sum_nm a_nm z^n conj(z)^m
 *
 * This limits 
 */
export class FriezeSymmetry extends PointSymmetry {
}
