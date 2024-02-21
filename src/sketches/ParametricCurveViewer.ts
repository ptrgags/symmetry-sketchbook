import p5 from "p5";
import { Sketch } from "@/core/Sketch";
import { type Pixel } from "@/core/Pixel"
import { FourierSeries } from "@/core/FourierSeries"

const MAX_X = 2.0;
const PERIOD = 800;
const THICKNESS = 3.0;

interface ParametricCurveState {
    start_frame: number,
    pattern?: FourierSeries,
    curve: Pixel[],
    show_arm: boolean,
}

function draw_polyline(p: p5, points: Pixel[], close: boolean) {
    p.beginShape();
    for (const {x, y} of points) {
        p.vertex(x, y);
    }

    if (close) {
        p.endShape(p.CLOSE);
    } else {
        p.endShape();
    }
}

export class ParametricCurveViewer extends Sketch<ParametricCurveState> {
    setup(p: p5) {
        const canvas = p.createCanvas(500, 700)
        Sketch.show_canvas(canvas.elt)
    };

    draw(p: p5) {
        p.background(0)

        p.background(0);
        const { start_frame, pattern, curve, show_arm } = this.state;

        if (!pattern) {
            return;
        }

        const frame = p.frameCount - start_frame;
        const t = (frame / PERIOD) * p.TWO_PI;

        p.push();
        p.translate(p.width / 2, p.height / 2);
        const scale_factor = p.width / (2 * MAX_X);
        p.scale(scale_factor, -scale_factor);
        p.strokeWeight(THICKNESS / scale_factor);

        const sums: Pixel[] = [...pattern.partial_sums(t)].map(z => {
            return {x: z.real, y: z.imag}
        })
        if (frame < PERIOD) {
            curve.push(sums[sums.length - 1]);
        }

        p.noFill();
        p.strokeJoin(p.ROUND);
        p.stroke(71, 142, 204);
        draw_polyline(p, curve, frame >= PERIOD);

        if (show_arm) {
            p.stroke(255);
            draw_polyline(p, sums, false);
        }

        p.pop();
    }
}
