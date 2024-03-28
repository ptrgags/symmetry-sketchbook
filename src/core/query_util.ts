import type { LocationQueryValue } from 'vue-router'
import { is_string } from './validation'

export function get_string_param(
  value: LocationQueryValue | LocationQueryValue[],
  label: string
): string | undefined {
  if (!value) {
    return undefined
  }

  if (is_string(value, label)) {
    return value
  }

  console.error(`${label} must have a single value`)
  return undefined
}
