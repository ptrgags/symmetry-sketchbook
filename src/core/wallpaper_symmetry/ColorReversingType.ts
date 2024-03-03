/**
 * Whether the palette should be two horizontal halves
 * or two vertical halves. This is an enum since it
 * needs to be passed to the shader.
 */
export enum ColorReversingType {
  // Color flipped on the lower half-plane
  Horizontal = 0,
  // Color flipped on the left half-plane
  Vertical = 1
}
