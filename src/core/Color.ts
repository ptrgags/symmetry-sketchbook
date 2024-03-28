export class Color {
  r: number
  g: number
  b: number

  constructor(r: number, g: number, b: number) {
    this.r = r
    this.g = g
    this.b = b
  }

  to_vec3(): number[] {
    return [this.r, this.g, this.b]
  }

  to_hex(): string {
    const rgb_f32 = this.to_vec3()
    const rgb_u8 = rgb_f32.map((val) => Math.floor(val * 255.0))
    const [r_hex, g_hex, b_hex] = rgb_u8.map((val) => val.toString(16).padStart(2, '0'))
    return `#${r_hex}${g_hex}${b_hex}`
  }

  static from_vec3(rgb_f32: number[]) {
    if (rgb_f32.length !== 3) {
      throw new Error('rgb_f32 length must be 3')
    }
    const [r, g, b] = rgb_f32
    return new Color(r, g, b)
  }

  static from_hex(hex_str: string): Color {
    // parse #rrggbb -> [0, 255]^3 -> [0.0, 1.0]^3
    const parts = [0, 1, 2].map((x) => hex_str.substring(1 + 2 * x, 1 + 2 * (x + 1)))
    const rgb_u8 = parts.map((str) => parseInt(str, 16))
    const [r, g, b] = rgb_u8.map((val) => val / 255.0)
    return new Color(r, g, b)
  }
}
