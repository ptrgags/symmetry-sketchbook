import { Color } from '../Color'

export enum WallpaperPaletteType {
  // Each stripe is a horizontal line. The distance fields are YY
  HorizontalStripes = 0,
  // Each stripe is a vertical line. The distance fields are XX
  VerticalStripes = 1,
  // Both horizontal and vertical stripes interleaved on diagonals
  // The distance fields are XY
  Plaid = 2
}

export interface WallpaperPalette {
  palette_type: WallpaperPaletteType
  diagonal_thickness: number
  // List of colors
  colors: Color[]
}

export const DEFAULT_PALETTE: WallpaperPalette = {
  palette_type: WallpaperPaletteType.HorizontalStripes,
  diagonal_thickness: 4,
  colors: [new Color(1, 0, 0), new Color(0, 1, 0), new Color(0, 0, 1)]
} as const
