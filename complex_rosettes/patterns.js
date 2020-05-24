const PI = Math.PI;
const ROSETTES = {
    // scaling symmetry
    // only include terms with n = -m
    "radial symmetry": new ComplexPolynomial([
        [0, 0, 1, 0,],
        [1, -1, 1/2, 0,],
        [2, -2, 1/3, 0,],
        [3, -3, 1/4, 0,],
    ]),
    // infinite-fold rotational symmetry!
    // only include terms with n = m
    "ring symmetry": new ComplexPolynomial([
        [0, 0, 1, 0,],
        [1, 1, 1/2, 0,],
        [2, 2, 1/3, 0,],
        [3, 3, 1/4, 0,],
    ]),
    // like double inversion but with some phase shifts
    "double inversion twist": new ComplexPolynomial([
        [1, 0, 1, 0,],
        [0, 1, 1, 0,],
        [-1, 0, 1, 0,],
        [0, -1, 1, 0,],
        [2, 1, 1/8, PI/2,],
        [1, 2, 1/8, PI/2,],
        [-2, -1, 1/8, PI/2,],
        [-1, -2, 1/8, PI/2,],
        [3, 1, 1/4, 0,],
        [1, 3, 1/4, 0,],
        [-3, -1, 1/4, 0,],
        [-1, -3, 1/4, 0,],
    ]),
    // reciprocal + circular inversion symmetry: f(1/z) = f(z)
    // a_nm = a_(-n)(-m) = a_(-m)(-n) = a_mn
    "double inversion symmetry": new ComplexPolynomial([
        [1, 0, 1, 0,],
        [0, 1, 1, 0,],
        [-1, 0, 1, 0,],
        [0, -1, 1, 0,],
        [2, 1, 1/8, 0,],
        [1, 2, 1/8, 0,],
        [-2, -1, 1/8, 0,],
        [-1, -2, 1/8, 0,],
        [3, 1, 1/4, 0,],
        [1, 3, 1/4, 0,],
        [-3, -1, 1/4, 0,],
        [-1, -3, 1/4, 0,],
    ]),
    // circle inversion symmetry: f(1/conj(z))) = f(z)
    // a_(-m)(-n) = a_nm
    "circle inversion symmetry": new ComplexPolynomial([
        [1, 1, 1, 0,],
        [-1, -1, 1, 0,],
        [2, 1, 1/2, 0,],
        [-1, -2, 1/2, 0,],
        [3, 1, 1/3, 0,],
        [-1, -3, 1/3, 0,],
    ]),
    // circle inversion symmetry with some phase shifts
    "circle inversion twist": new ComplexPolynomial([
        [1, 1, 1, 0,],
        [-1, -1, 1, 0,],
        [2, 1, 1/2, PI/3,],
        [-1, -2, 1/2, PI/3,],
        [3, 1, 1/3, 0,],
        [-1, -3, 1/3, 0,],
    ]),
    // reciprocal inversion symmetry: f(1/z) = f(z)
    // a_(-n)(-m) = a_nm
    "reciprocal symmetry": new ComplexPolynomial([
        [1, 1, 1, 0,],
        [-1, -1, 1, 0,],
        [2, 1, 1/2, 0,],
        [-2, -1, 1/2, 0,],
        [3, 1, 1/3, 0,],
        [-3, -1, 1/3, 0,],
    ]),
    // reflection symmetry: f(conj(z)) = f(z)
    // a_mn = a_nm
    "reflection symmetry": new ComplexPolynomial([
        [1, 0, 1/4, 0,],
        [0, 1, 1/4, 0,],
        [2, 0, 1/8, 0,],
        [0, 2, 1/8, 0,],
        [3, 0, 1, 0,],
        [0, 3, 1, 0,],
    ]),
    // color flipping: f(conj(z)) = conj(f(z))
    // a_nm real
    "reflection anti-symmetry": new ComplexPolynomial([
        [1, 0, 1, 0,],
        [2, 0, 1/2, 0,],
        [3, 0, 1/3, 0,],
        [4, 0, 1/4, 0,],
        [5, 0, 1/5, 0,],
        [6, 0, 1/6, 0,],
    ]),
    // 2-fold rotational symmetry: f(rotate(z, (2pi) / 2)) = f(z)
    // m = n (mod 2)
    //
    // in general, there will be p-fold rotational symmetry if
    // m = n (mod p)
    "2-fold symmetry take 1": new ComplexPolynomial([
        [1, 1, 1, 0,],
        [-1, 3, 1/2, 0,],
        [1, 3, 3/4, 0,],
        [-3, 5, 1/8, 0,],
    ]),
    "2-fold symmetry take 2": new ComplexPolynomial([
        [-1, 3, 1/2, 0,],
        [1, 3, 3/4, PI/6,],
        [-5, 7, 1/2, 0,],
        [-3, 5, 1/8, PI,],
        [-9, 3, 1/64, 0,],
    ]),
    "3-fold symmetry take 1": new ComplexPolynomial([
        [0, 0, 1, 0,],
        [0, 3, 1/3, 0,],
        [0, 6, 1/6, 0,],
        [1, 1, 1, 0,],
        [1, 4, 1/2, 0,],
        [1, 7, 1/3, 0,],
    ]),
    "3-fold symmetry take 2": new ComplexPolynomial([
        [0, 0, 1, 0,],
        [0, 3, 1/3, PI/2,],
        [0, 6, 1/6, 0,],
        [1, 1, 1, 0,],
        [1, 4, 1/2, 0,],
        [1, 7, 1/3, 0,],
    ]),
    "5-fold symmetry take 1": new ComplexPolynomial([
        [-9, 1, 1/4, 0,],
        [1, 1, 1, 0,],
        [6, 1, 1/4, 0,],
        [11, 1, 1/8, 0,],
    ]),
    "5-fold symmetry take 2": new ComplexPolynomial([
        [1, -9, 1/4, 0,],
        [1, 1, 1, 0,],
        [1, 6, 1/4, 0,],
        [1, 11, 1/8, 0,],
    ]),
    "7-fold symmetry take 1": new ComplexPolynomial([
        [0, 0, 1, 0,],
        [0, 7, 1/7, 0,],
        [0, -7, 1/7, 0,],
        [7, 0, 1/7, 0,],
        [-7, 0, 1/7, 0,],
    ]),
    "12-fold symmetry take 1": new ComplexPolynomial([
        [0, 12, 1, 0,],
        [12, 0, 1/2, 0,],
        [0, 24, 1/3, 0,],
        [0, 36, 1/4, 0,],
        [24, 0, 1/5, 0,],
        [-24, 0, 1/6, 0,],
    ]),
    "12-fold symmetry take 2": new ComplexPolynomial([
        [0, 12, 1, 0,],
        [12, 0, -1/2, PI/2,],
        [0, 24, 1/3, PI/2,],
        [0, 36, -1/4, 0,],
        [24, 0, 1/5, PI/2,],
        [-24, 0, -1/6, 0,],
    ]),
};
