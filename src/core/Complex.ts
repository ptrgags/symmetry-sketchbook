/**
 * The complex number a + bi in Cartesian form
 *
 * @see ComplexPolar below for the polar form equivalent
 */
export class ComplexRect {
  real: number
  imag: number

  constructor(real: number, imag: number) {
    this.real = real
    this.imag = imag
  }

  /**
   * Complex modulus (length)
   *
   * |z| = sqrt(x^2 + y^2)
   */
  get r(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag)
  }

  /**
   * Argument of the complex number (angle around the circle)
   *
   * I choose the branch point at 0 so the angle is measured from
   * [0, 2pi] instead of the [-pi, pi] returned by atan2(). This
   * will make defining color wheels easier.
   */
  get theta(): number {
    const original = Math.atan2(this.imag, this.real)
    if (original >= 0) {
      return original
    }

    // I want the results from [0, 2pi], not [-pi, pi]
    return 2.0 * Math.PI + original
  }

  /**
   * Complex conjugate:
   * conj(a + bi) = a - bi
   */
  get conj(): ComplexRect {
    return new ComplexRect(this.real, -this.imag)
  }

  /**
   * Complex numbers add component-wise
   *
   * (a + bi) + (c + di) = (a + c) + (b + d)i
   */
  add(other: ComplexRect): ComplexRect {
    const x = this.real + other.real
    const y = this.imag + other.imag
    return new ComplexRect(x, y)
  }

  /**
   * Complex numbers multiply with the foil method, but
   * i^2 = -1 so one of the signs is flipped.
   *
   * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
   */
  mult(other: ComplexRect): ComplexRect {
    const x = this.real * other.real - this.imag * other.imag
    const y = this.imag * other.real + this.real * other.imag
    return new ComplexRect(x, y)
  }

  to_polar(): ComplexPolar {
    return new ComplexPolar(this.r, this.theta)
  }

  static readonly ZERO: ComplexRect = new ComplexRect(0, 0)
  static readonly ONE: ComplexRect = new ComplexRect(1, 0)
}

/**
 * Complex number in polar form, i.e.
 *
 * z = r e^(i * theta)
 *
 * This class has more limited functionality compared
 * to {@link ComplexRect} since most calculations are
 * easier in rectangular coordinates, but for complex
 * polynomials, the coefficients are more easily expressed
 * in polar form.
 */
export class ComplexPolar {
  r: number
  theta: number

  constructor(r: number, theta: number) {
    this.r = r
    this.theta = theta
  }

  scale(factor: number): ComplexPolar {
    return new ComplexPolar(factor * this.r, this.theta)
  }

  rotate(angle: number): ComplexPolar {
    return new ComplexPolar(this.r, this.theta + angle)
  }

  /**
   * To raise a complex number to a power, raise the rulus
   * to the power, but multiply the angle instead.
   */
  pow(n: number): ComplexPolar {
    const raised = Math.pow(this.r, n)
    const multiplied = this.theta * n
    return new ComplexPolar(raised, multiplied)
  }

  to_rect(): ComplexRect {
    const { r, theta } = this
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    return new ComplexRect(x, y)
  }

  static readonly ZERO: ComplexPolar = new ComplexPolar(0, 0)
  static readonly ONE: ComplexPolar = new ComplexPolar(1, 0)
}
