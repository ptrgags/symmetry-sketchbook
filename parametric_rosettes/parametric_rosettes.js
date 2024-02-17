import { ROSETTES } from "./patterns.js";

const MAX_X = 2.0;
const PERIOD = 800;
const THICKNESS = 3.0;

const state = {
    display_arm: true,
    pattern: ROSETTES["2k + 1"],
    curve: [],
    start_frame: 0
};

// Console on the page -------------------------

function display_params(pattern) {
    const triples = pattern.to_string().replace(/:/g, "<br/>");
    const value = `Current parameters (frequency, amplitude, phase):<br/>${triples}`;
    document.getElementById('params').innerHTML = value; 
}

function clear_error() {
    document.getElementById('error').innerHTML = '';
}

function display_error(message) {
    document.getElementById('error').innerHTML = message;
}

// UI controls ----------------------------------

function change_rosette(p, e) {
    const selected = e.target.value;
    set_pattern(p, ROSETTES[selected]);
}

function make_select(p) {
    const sel = p.createSelect();
    sel.position(10, 10);
    for (const x of Object.keys(ROSETTES)) {
        sel.option(x);
    }
    sel.changed((e) => {
        change_rosette(p, e);
    });
}

function custom_string_changed(e) {
    try {
        const new_pattern = FourierSeries.from_string(e.target.value);
        set_pattern(new_pattern);
    } catch(error) {
        console.error(error);
        display_error(error.message);
    }
}

function make_input_box(p) {
    const input = p.createInput();
    input.position(100, 10);
    input.attribute('placeholder', 'freq1,amp1,phase1:freq2,amp2,phase2:...');
    input.style('width: 300');
    input.changed(custom_string_changed);
}

function set_pattern(p, series) {
    state.pattern = series;
    state.curve.length = 0;
    state.start_frame = p.frameCount;
    clear_error();
    display_params(series);
}

function init_ui(p) {
    make_select(p);
    make_input_box(p);
}

function draw_polyline(p, points, close) {
    p.beginShape();
    for (const [x, y] of points) {
        p.vertex(x, y);
    }

    if (close) {
        p.endShape(CLOSE);
    } else {
        p.endShape();
    }
}

export const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(500, 750);

        init_ui(p);
        display_params(state.pattern);
        
        p.background(0);
    }

    p.draw = () => {
        const {start_frame, pattern, curve, display_arm} = state;

        const frame = p.frameCount - start_frame;
        const t = (frame / PERIOD) * p.TWO_PI;
        p.background(0);
        
        p.push();
        p.translate(p.width / 2, p.height / 2);
        const scale_factor = p.width / (2 * MAX_X);
        p.scale(scale_factor, -scale_factor);
        p.strokeWeight(THICKNESS / scale_factor);
        
        const sums = [...pattern.partial_sums(t),];
        if (frame < PERIOD) {
            curve.push(sums[sums.length - 1]);
        }
        
        p.noFill();
        p.strokeJoin(p.ROUND);
        p.stroke(71, 142, 204);
        draw_polyline(p, curve, frame >= PERIOD);
        
        if (display_arm) {
            p.stroke(255);
            draw_polyline(p, sums, false);
        }
        
        p.pop();
    }

    p.keyReleased = () => {
        // Toggle showing the arm that draws the curve
        if (p.key === ' ') {
            state.display_arm = !state.display_arm;
        }   
    }
};
