import { DEFAULT_COEFFICIENTS } from "../core/Coefficients.js";
import { DEFAULT_SYMMETRY } from "../core/PointSymmetry.js";
import { Checkerboard } from "../core/Texture.js";
import { TieDyeShader } from "../shaders/TieDyeShader.js";
import { NO_ANIMATION } from "../core/Animation.js";

const shader = new TieDyeShader();
const texture = new Checkerboard();

const TieDyeState = {
    // Initial grid, no coloring
    INITIAL: 0,
    // Warp the grid using the polynomial
    TYING: 1,
    // Dye the grid while still warped
    DYING: 2,
    // Unwarp the grid, to see the
    UNTYING: 3,
}

const AnimationState = {
    // Animation pauses for a moment at each state
    PAUSING: 0,
    // Transitioning from the current state to state + 1
    ANIMATING: 1,
};

const ANIMATING_FRAMES = 120;
const PAUSING_FRAMES = 60;

const state = {
    tie_dye_state: TieDyeState.INITIAL,
    animation_state: AnimationState.PAUSING,
    reference_frame: 0,
    // Percentage between the current and next tie dye states.
    transition_percent: 0.0,
}

function update_animation(frame, state) {
    const elapsed_frames = frame - state.reference_frame;

    if (state.animation_state === AnimationState.PAUSING) {
        state.transition_percent = 0.0;

        if (elapsed_frames >= PAUSING_FRAMES) {
            console.log("Done pausing!");
            state.animation_state = AnimationState.ANIMATING;
            state.reference_frame = frame;
        }
    } else if (state.animation_state === AnimationState.ANIMATING) {
        // Create an interpolation factor based on the frame count.
        state.transition_percent = elapsed_frames / (ANIMATING_FRAMES - 1);
        console.log("animating:", state.transition_percent);

        if (elapsed_frames >= ANIMATING_FRAMES) {
            console.log("Transition!");
            state.tie_dye_state = (state.tie_dye_state + 1) % 4;
            state.animation_state = AnimationState.PAUSING;
            state.reference_frame = frame;
        }
    }
}

function get_tie_amount(state) {
    switch (state.tie_dye_state) {
        case TieDyeState.INITIAL:
            return state.transition_percent;
        case TieDyeState.TYING:
            return 1;
        case TieDyeState.DYING:
            return 1.0 - state.transition_percent;
        case TieDyeState.UNTYING:
            return 0;
    }
}

function get_dye_amount(state) {
    switch (state.tie_dye_state) {
        case TieDyeState.INITIAL:
            return 0;
        case TieDyeState.TYING:
            return state.transition_percent;
        case TieDyeState.DYING:
            return 1.0;
        case TieDyeState.UNTYING:
            return 1.0 - state.transition_percent;
    }
}


function update_uniforms(shader, state) {
    shader.set_uniform('tie', get_tie_amount(state));
    shader.set_uniform('dye', get_dye_amount(state));
}

export const sketch = (p) => {
    p.preload = () => {
        shader.preload(p);
    }

    p.setup = () => {
        p.createCanvas(500, 700, p.WEBGL);
        p.textureMode(p.NORMAL);

        texture.init(p, 256, 256);

        shader.init(p);
        shader.symmetries = [DEFAULT_SYMMETRY];
        shader.set_texture(texture);
        shader.set_coefficients(DEFAULT_COEFFICIENTS);
        shader.set_animation(NO_ANIMATION);
        shader.disable();
    }

    p.draw = () => {
        update_animation(p.frameCount, state);
        update_uniforms(shader, state);

        p.background(0, 40, 45);
        //p.image(texture.texture, 0, 0, 256, 256);
        shader.draw();
    }
};
