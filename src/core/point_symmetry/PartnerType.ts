import { type GridIndices2D, identity, flip_both, flip_col, flip_row } from '../GridIndices2D'

export type PartnerType = 'identity' | 'flip_col' | 'flip_row' | 'flip_both'
export type PartnerFunc = (indices: GridIndices2D, grid_size: number) => GridIndices2D

export const PARTNER_FUNCTIONS: { [key in PartnerType]: PartnerFunc } = {
  identity,
  flip_col,
  flip_row,
  flip_both
}
