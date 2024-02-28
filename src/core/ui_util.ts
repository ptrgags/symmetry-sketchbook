import { type Ref } from 'vue'

export function toggle(ref: Ref<boolean>): (e: Event) => void {
  return (e: Event) => {
    const checkbox = e.target as HTMLInputElement
    ref.value = checkbox.checked
  }
}
