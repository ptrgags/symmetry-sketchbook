/**
 * Whether the palette should be two horizontal halves
 * or two vertical halves. This is an enum since it
 * needs to be passed to the shader.
 */
export enum ColorReversingType {
  None = 0,
  // Color flipped on the lower half-plane
  Horizontal = 1,
  // Color flipped on the left half-plane
  Vertical = 2
}
