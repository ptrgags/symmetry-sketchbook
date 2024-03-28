/**
 * Simple struct to wrap an option
 */
export interface DropdownOption<T> {
  // Unique ID needed for the key attribute of a v-for loop in Vue
  id: string
  // Human readable label to display to the suer
  label: string
  // The value to return from the dropdown menu
  value: T
}
