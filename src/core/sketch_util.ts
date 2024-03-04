import p5 from 'p5'
import type { Pixel } from './Pixel'

export function draw_polyline(p: p5, points: Pixel[], close: boolean) {
  p.beginShape()
  for (const { x, y } of points) {
    p.vertex(x, y)
  }

  if (close) {
    p.endShape(p.CLOSE)
  } else {
    p.endShape()
  }
}
