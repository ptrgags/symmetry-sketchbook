/*
import type { FourierTerm2D } from '../FourierSeries2D'

function random_vec() {
  const x = 2.0 * Math.random() - 1.0
  const y = 2.0 * Math.random() - 1.0
  return [x, y]
}



type BaseRuleType = 'square' | 'hexagon'
type WallpaperOperation =
  | 'noop'
  | 'negate'
  | 'negate_n'
  | 'negate_m'
  | 'rot2_n'
  | 'rot2_nm'
  | 'swap'
  | 'hex'
type SymmetryRule = WallpaperOperation[]

const BASE_RULES: { [key in BaseRuleType]: SymmetryRule[] } = {
  square: [
    ['negate_n', 'swap'],
    // (negate_n, swap)^2 = negate
    ['negate']
  ],
  hexagon: [['hex']]
}

interface WallpaperPreset {
  lattice: LatticeType
  base_rules?: BaseRuleType
  rules: SymmetryRule[]
}

const SYMMETRY_PRESETS: { [key: string]: WallpaperPreset } = {
  p1: {
    lattice: 'parallelogram',
    rules: []
  },
  p2: {
    lattice: 'parallelogram',
    rules: [['negate']]
  },

  cm: {
    lattice: 'rhombus',
    rules: [['swap']]
  },
  cmm: {
    lattice: 'rhombus',
    rules: [['negate'], ['swap']]
  },

  pm: {
    lattice: 'rectangle',
    rules: [['negate_m']]
  },
  pg: {
    lattice: 'rectangle',
    rules: [['negate_m', 'rot2_n']]
  },
  pmm: {
    lattice: 'rectangle',
    rules: [['negate'], ['negate_n']]
  },
  pmg: {
    lattice: 'rectangle',
    rules: [['negate'], ['negate_m', 'rot2_n']]
  },
  pgg: {
    lattice: 'rectangle',
    rules: [['negate'], ['negate_m', 'rot2_nm'], ['negate_n', 'rot2_nm']]
  },

  p4: {
    lattice: 'square',
    base_rules: 'square',
    rules: []
  },
  p4m: {
    lattice: 'square',
    base_rules: 'square',
    rules: [['swap']]
  },
  p4g: {
    lattice: 'square',
    base_rules: 'square',
    rules: [['swap', 'rot2_nm']]
  },

  p3: {
    lattice: 'hexagon',
    base_rules: 'hexagon',
    rules: []
  },
  p31m: {
    lattice: 'hexagon',
    base_rules: 'hexagon',
    rules: [['swap']]
  },
  p3m1: {
    lattice: 'hexagon',
    base_rules: 'hexagon',
    rules: [['negate', 'swap']]
  },
  p6: {
    lattice: 'hexagon',
    base_rules: 'hexagon',
    rules: [['negate']]
  },
  p6m: {
    lattice: 'hexagon',
    base_rules: 'hexagon',
    rules: [['negate'], ['swap']]
  }
}

type SymmetryFunc = (term: FourierTerm2D) => FourierTerm2D[]

const SYMMETRY_OPS = {
  noop: (x) => [x],
  negate: ([n, m, amp, phase]) => [[-n, -m, amp, phase]],
  negate_n: ([n, m, amp, phase]) => [[-n, m, amp, phase]],
  negate_m: ([n, m, amp, phase]) => [[n, -m, amp, phase]],
  rot2_n: ([n, m, amp, phase]) => {
    const sign = Math.pow(-1, n)
    return [[n, m, sign * amp, phase]]
  },
  rot2_nm: ([n, m, amp, phase]) => {
    const sign = Math.pow(-1, n + m)
    return [[n, m, sign * amp, phase]]
  },
  swap: ([n, m, amp, phase]) => [[m, n, amp, phase]],
  hex: ([n, m, amp, phase]) => [
    [m, -(n + m), amp, phase],
    [-(n + m), n, amp, phase]
  ]
}

export class WallpaperSymmetry {
  static get preset_options() {
    return Object.keys(SYMMETRY_PRESETS).map((preset_name) => {
      return {
        label: preset_name,
        value: preset_name
      }
    })
  }

  static from_preset(preset_name: string) {
    const preset = SYMMETRY_PRESETS[preset_name]
    if (preset === undefined) {
      throw new Error(`Unknown preset ${preset_name}`)
    }

    return new WallpaperSymmetry({
      ...preset,
      name: preset_name
    })
  }

  static get_lattice(lattice) {
    if (Array.isArray(lattice)) {
      return lattice
    }

    if (lattice === 'random') {
      return [random_vec(), random_vec()]
    }

    const preset = LATTICE_BASIS_VECTORS[lattice]
    if (preset === undefined) {
      throw new Error(`Unknown lattice: ${lattice}`)
    }

    return preset
  }

  static get_base_rules(base_rules) {
    if (base_rules === undefined) {
      return []
    }

    const preset = BASE_RULES[base_rules]
    if (preset === undefined) {
      throw new Error(`Unknown base rules: ${base_rules}`)
    }

    return preset
  }

  static lookup_op(step) {
    const op = SYMMETRY_OPS[step]
    if (op === undefined) {
      throw new Error(`Unknown symmetry operation: ${step}`)
    }

    return op
  }

  static bake_rule(ops) {
    return (terms) => {
      let results = terms
      for (const op of ops) {
        results = results.flatMap(op)
      }
      return results
    }
  }

  static bake_rules(rules) {
    const rule_list = []
    for (const rule of rules) {
      const ops = rule.map((step) => this.lookup_op(step))
      const baked_rule = this.bake_rule(ops)
      rule_list.push(baked_rule)
    }
    return rule_list
  }

  constructor(options) {
    // Save this since it's better to serialize to json
    this._options = options

    this._lattice = WallpaperSymmetry.get_lattice(options.lattice)
    this._name = options.name

    // Turn the rule descriptions into a list of functions.
    const base_rules = WallpaperSymmetry.get_base_rules(options.base_rules)
    const rules = options.rules
    this.rules = WallpaperSymmetry.bake_rules([...base_rules, ...rules])
  }

  apply_symmetry(coefficients) {
    // Apply the baked rule functions. The number of terms grows
    // exponentially, but typically there are 0-2 rules
    let terms = [...coefficients]
    for (const rule of this.rules) {
      const new_terms = rule(terms)
      terms = terms.concat(new_terms)
    }

    return new Coefficients(terms)
  }

  get lattice() {
    return this.lattice
  }

  to_json() {
    return this.options
  }
}
*/
