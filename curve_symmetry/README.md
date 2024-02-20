## Parameric Rosettes (2019)

By Peter Gagliardi

Based on math from _Creating Symmetry: The Artful Mathematics of Wallpaper Patterns_ 
by Frank A. Farris

### Theory

The function `f(t) = R e^(i(nt - d)) = (R cos(nt - d), R sin(nt - d))`
describes a particle moving in a circle of radius R with angular frequency n 
and initial phase d.

However, why stop there? we can add together circular motions of various
frequencies, amplitudes and phases:

```
f(t) = sum_k R_k e^(i(n_k t - d_k))
```

This is like a drawing machine with many spinning joints connected end-to-end.
(indeed, this is how I visualize this construction in this p5.js sketch).

### How to make rotational symmetry?

To make these rotationally symmetric patterns, the trick is to select the
frequencies in a deliberate pattern. _Creating Symmetry_ by Faris explains this
in depth, so I will only give a summary here. This is a mix of math from the
book and some tips I picked up through my own experiments:

1. Pick a positive integer `n` that is greater than or equal to 2. This will
    be used to produce `n`-fold symmetry. For example, if you choose `n=3`,
    the pattern will have symmetry under rotation by 360/3 = 120 degrees.
2. Pick a second positive integer `m`, coprime to `n` (i.e. `gcd(m, n) = 1`).
    This determines how many positions around the circle you move per rotation.
    For example, if `n=5, m=1`, the curve visits all 5 positions around the
    circle in turn, which is reminiscent of walking around a pentagon. However,
    if `n=5, m=2`, the curve moves 2 positions around the circle each time.
    This is similar to walking around a pentagram.
3. Generate a list of integers of the form `nk + m` where `k` is any integer.
    These are the only valid frequencies that produce `n`-fold symmetry of type
    `m`
4. Select a few of these integers to use as frequences. I find this works best
    if you choose at least 3 frequencies to use. Remember that you can use
    both positive and negative frequencies! 
5. Select an amplitude for each selected frequency. For best results, use
    larger amplitudes with low frequencies, and smaller amplitudes with high
    frequencies. Also, note that frequencies can be negative! this corresponds
    to subtracting a circular motion instead of adding it.
5. Select a phase shift for each selected frequency. There are some options
    here:
    1. The easiest option is to set all the phase shifts to 0.
    2. To rotate the curve, set all the phase shifts to the desired rotation
        angle
    3. To add some flair to the curve, tweak the phases one at a time to taste.
        I find that pi or pi/2 work well here

Originally, I performed experiments using [this Desmos graph](https://www.desmos.com/calculator/dtx3ssnald)
I made to try out this math. But now in this p5.js sketch, a custom curve
can be entered in the provided input box.
