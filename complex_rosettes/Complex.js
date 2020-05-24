class Complex {
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }
    
    /**
     * Complex modulus (length)
     *
     * |z| = sqrt(x^2 + y^2)
     */
    get mod() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
    
    /**
     * Argument of the complex number (angle around the circle)
     *
     * I choose the branch point at 0 so the angle is measured from
     * [0, 2pi] instead of the [-pi, pi] returned by atan2(). This
     * will make defining color wheels easier.
     */
    get arg() {
        const original = Math.atan2(this.imag, this.real);
        if (original >= 0) {
            return original;
        }
        
        // I want the results from [0, 2pi], not [-pi, pi]
        return 2.0 * Math.PI + original; 
    }
    
    /**
     * Complex conjugate:
     * conj(a + bi) = a - bi
     */
    get conj() {
        return new Complex(this.real, -this.imag);
    }
    
    /**
     * Complex numbers add component-wise
     *
     * (a + bi) + (c + di) = (a + c) + (b + d)i
     */
    add(other) {
        const x = this.real + other.real;
        const y = this.imag + other.imag;
        return new Complex(x, y); 
    }
    
    /**
     * Complex numbers multiply with the foil method, but
     * i^2 = -1 so one of the signs is flipped.
     *
     * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
     */
    mult(other) {
        const x = this.real * other.real - this.imag * other.imag;
        const y = this.imag * other.real + this.real * other.imag;
        return new Complex(x, y);
    }
    
    /**
     * To raise a complex number to a power, raise the modulus
     * to the power, but multiply the angle instead.
     */
    pow(n) {
        const r = this.mod;
        const theta = this.arg;
        const new_r = Math.pow(r, n);
        const new_theta = theta * n;
        return Complex.from_polar(new_r, new_theta);
    }
    
    static from_polar(r, theta) {
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        return new Complex(x, y);
    }
}
