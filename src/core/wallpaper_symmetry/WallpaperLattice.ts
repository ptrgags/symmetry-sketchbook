export type LatticeType = 'square' | 'rectangle' | 'rhombus' | 'hexagon' | 'parallelogram'
type LatticeVector = [number, number]
type LatticeBasis = [LatticeVector, LatticeVector]

const THIRD_TURN = (2.0 * Math.PI) / 3.0
const LATTICE_BASIS_VECTORS: { [key in LatticeType]: LatticeBasis } = {
  square: [
    [1, 0],
    [0, 1]
  ],
  rectangle: [
    [2, 0],
    [0, 1]
  ],
  rhombus: [
    [1, 2],
    [1, -2]
  ],
  hexagon: [
    [1, 0],
    [Math.cos(THIRD_TURN), Math.sin(THIRD_TURN)]
  ],
  parallelogram: [
    [1, 0],
    [1, 2]
  ]
}

export function get_lattice(lattice_type: LatticeType): LatticeBasis {
  return LATTICE_BASIS_VECTORS[lattice_type]
}
