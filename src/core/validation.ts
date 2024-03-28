export function is_number(value: any, label: string): value is number {
  if (typeof value === 'number') {
    return true
  }

  console.error(`${label ?? 'value'} must be a number`)
  return false
}

export function is_string(value: any, label: string): value is string {
  if (typeof value === 'string') {
    return true
  }

  console.error(`${label ?? 'value'} must be a string`)
  return false
}

export function is_object(value: any, label: string): value is object {
  if (typeof value === 'object') {
    return true
  }

  console.error(`${label ?? 'value'} must be an object`)
  return false
}

export function is_hex_string(value: any, label: string): boolean {
  if (typeof value === 'string' && /#[0-9A-Fa-f]{6}/.test(value)) {
    return true
  }

  console.error(`${label ?? 'value'} must be a hex string #RRGGBB`)
  return false
}
