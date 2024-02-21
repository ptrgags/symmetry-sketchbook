export const MAX_TERMS = 64;
export const TWO_PI = 2.0 * Math.PI;

export function mod(x, n) {
    return ((x % n) + n) % n;
}

export function radians(degrees) {
    return degrees * Math.PI / 180.0;
}


export function rand_int(a, b) {
    // map the range [0, 1) -> [a, b]
    // the +1 is to include b in the result.
    const range = (b + 1) - a;
    const scaled = range * Math.random() + a;
    return Math.floor(scaled);
}
