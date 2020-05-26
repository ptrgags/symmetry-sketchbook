const MAX_X = 2.0;
const PERIOD = 800;
const THICKNESS = 3.0;
let pattern = ROSETTES["2k + 1"];
let curve = [];
let start_frame = 0;
let display_arm = true;

function make_select() {
    const sel = createSelect();
    sel.position(10, 10);
    for (const x of Object.keys(ROSETTES)) {
        sel.option(x);
    }
    sel.changed(change_rosette);
}

function change_rosette(e) {
    const selected = e.target.value;
    set_pattern(ROSETTES[selected]);
}

function make_input_box() {
    const input = createInput();
    input.position(100, 10);
    input.attribute('placeholder', 'freq1,amp1,phase1:freq2,amp2,phase2:...');
    input.style('width: 300');
    input.changed(custom_string_changed);
}

function set_pattern(series) {
    pattern = series;
    curve = [];
    start_frame = frameCount;
    clear_error();
    display_params();
}

function display_params() {
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

function custom_string_changed(e) {
    try {
        const new_pattern = FourierSeries.from_string(e.target.value);
        set_pattern(new_pattern);
    } catch(error) {
        console.error(error);
        display_error(error.message);
    }
}

function setup() {
    createCanvas(500, 750);
    make_select();
    make_input_box();
    display_params();
    
    background(0);
    console.log(width);
}

function draw_polyline(points, close) {
    beginShape();
    for (const [x, y] of points) {
        vertex(x, y);
    }
    if (close) {
        endShape(CLOSE);
    } else {
        endShape();
    }
}

function draw() {
    const frame = frameCount - start_frame;
    const t = (frame / PERIOD) * TWO_PI;
    background(0);
    
    push();
    translate(width / 2, height / 2);
    const scale_factor = width / 2 / MAX_X;
    scale(scale_factor, -scale_factor);
    strokeWeight(THICKNESS / scale_factor);
    
    const sums = [...pattern.partial_sums(t),];
    if (frame < PERIOD) {
        curve.push(sums[sums.length - 1]);
    }
    
    noFill();
    strokeJoin(ROUND);
    stroke(71, 142, 204);
    draw_polyline(curve, frame >= PERIOD);
    
    if (display_arm) {
        stroke(255);
        draw_polyline(sums, false);
    }
    
    pop();
}

function keyReleased() {
    if (key === ' ') {
        display_arm = !display_arm;
    }
}
