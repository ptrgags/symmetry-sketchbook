export function mod(x: number, n: number): number {
  return ((x % n) + n) % n
}

export function radians(degrees: number): number {
  return (degrees * Math.PI) / 180.0
}

export function rand_int(a: number, b: number): number {
  // map the range [0, 1) -> [a, b]
  // the +1 is to include b in the result.
  const range = b + 1 - a
  const scaled = range * Math.random() + a
  return Math.floor(scaled)
}
