#!/usr/bin/env python
# lightweight Python module for computing fourier coefficients of a
# given function f(x, y). I'm using Python just because it has complex numbers
# as first-class citizens. This assumes a square lattice with side lengths 1
import cmath
import random

def complex_dot(a, b):
    return (a * b.conjugate()).real

def fourier_coeff(func, nm, samples):
    area = 1.0
    result = complex(0)
    dx = 1.0 / samples
    dy = 1.0 / samples
    dA = dx * dy 
    for y in range(samples):
        for x in range(samples):
            position = complex(x * dx, y * dy)
            val = func(position) 
            wave = cmath.exp(-1j * complex_dot(nm, position))
            result += val * wave * dA

    return result / area

def nm_grid(radius):
    return [
        complex(i, j) 
        for i in range(-radius, radius + 1)
        for j in range(-radius, radius + 1)]

def fourier_grid(func, radius, samples):
    return {
        nm: fourier_coeff(func, nm, samples)
        for nm in nm_grid(radius)}

def to_str(results):
    tuples = [
        (nm.real, nm.imag, abs(z), cmath.phase(z) * 180.0 / cmath.pi) 
        for nm, z in results.items()]

    formatted = (
        "({:.3f}, {:.3f}, {:.3f}, {:.3f})".format(*x)
        for x in tuples)

    return ", ".join(formatted)

if __name__ == "__main__":
    # example:
    def f(z):
        return int(0.25 < z.real < 0.75 and 0.25 < z.imag < 0.75)

    results = fourier_grid(f, 1, 100)
    print(to_str(results))
