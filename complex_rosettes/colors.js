function enable_hsb(palette) {
    if (!palette.uses_hsb) {
        return;
    }
    
    colorMode(HSB, 1, 1, 1, 1);
}

function disable_hsb(palette) {
    if (!palette.uses_hsb) {
        return;
    }
    
    colorMode(RGB, 255, 255, 255, 255);
}

let foo = false;

class Palette {
    constructor(params) {
        this.params = {
            zero_threshold: 0.2,
            max_threshold: 1e9,
            zero_color: [0.75, 1.0, 0.3,],
            max_color: [0.5, 1.0, 0.3,],
            ...params,
        };
    }
    
    get uses_hsb() {
        return true;
    }
    
    /**
     * Color small and large values with special colors
     * to make it more obvious.
     */
    check_radius(z) {
        const r = z.mod;
        if (r < this.params.zero_threshold) {
            return color(...this.params.zero_color);
        } else if (r > this.params.max_threshold) {
            return color(...this.params.max_color);
        }
        
        return undefined;
    }
    
    get_color(z) {
        const extreme_color = this.check_radius(z);
        if (extreme_color !== undefined) {
            return extreme_color;
        }
        
        return this.color_impl(z);
    }
}

class ColorWheel extends Palette {
    constructor(params) {
        super({
            saturation: 0.8,
            brightness: 0.8,
            ...params,
        });
    }
    
    color_impl(z) {
        const n = this.params.num_sectors;
        const theta_normalized = z.arg / TWO_PI;
        const bucket = Math.floor(theta_normalized * n);
        const hue = bucket / n;
        
        return color(hue, this.params.saturation, this.params.brightness);
    }
}

class AngleBrightness extends Palette {
    constructor(params) {
        super({
            hue: 0.1,
            saturation: 0.5,
            ...params,
        });
    }
    
    color_impl(z) {
        const n = this.params.num_sectors;
        const theta_normalized = z.arg / TWO_PI;
        const bucket = Math.floor(theta_normalized * n);
        const brightness = bucket / n;
        
        return color(this.params.hue, this.params.saturation, brightness);
    }
}

class RadiusBrightness extends Palette {
    constructor(params) {
        super({
            hue: 0.3,
            saturation: 0.5,
            max_value: 0.5,
            ...params,
        });
    }
    
    color_impl(z) {
        const n = this.params.num_sectors;
        const r_normalized = z.mod / this.params.max_value;
        const bucket = Math.floor(r_normalized * n);
        const brightness = bucket / n;
        
        return color(this.params.hue, this.params.saturation, brightness);
    }
}

class Checkerboard extends Palette {
    constructor(params) {
        super({
            hue: 0.0,
            saturation: 0.5,
            ...params,
        });
    }
    
    color_impl(z) {
        const x = Math.floor(z.real);
        const y = Math.floor(z.imag);
        const parity = (Math.abs(x) + Math.abs(y)) % 2;
        
        return color(this.params.hue, this.params.saturation, parity);
    }
}

class Texture extends Palette {
    constructor(params) {
        super({
            image_id: undefined,
            max_x: 1.0,
            max_y: 1.0,
            ...params,
        });
    }
    
    get uses_hsb() {
        return false;
    }
    
    color_impl(z) {
        const img = images[this.params.image_id];
        const cx = 0.5 * img.width;
        const cy = 0.5 * img.height;
        const x = z.real / this.params.max_x * cx;
        const y = z.imag / this.params.max_y * -cy;
        
        try {
            return img.get(cx + x, cy + y);
        } catch(e) {
            return color(255, 0, 255, 255);
        }
    }
}

const PALETTES = {
    "abstract texture": new Texture({
        image_id: "abstract",
        max_x: 5.0,
        max_y: 5.0,
    }),
    "2-shade yellow sectors": new AngleBrightness({
        hue: 1/6,
        num_sectors: 2, 
    }),
    "3-color rainbow sectors": new ColorWheel({
        num_sectors: 3,
    }),
    "4-color rainbow sectors": new ColorWheel({
        num_sectors: 4,
    }),
    "5-color rainbow sectors": new ColorWheel({
        num_sectors: 5,
    }),
    "5-shade tan sectors": new AngleBrightness({
        num_sectors: 5,
    }),
    "7-shade green rings": new RadiusBrightness({
        num_sectors: 7,
        max_value: 3.0,
    }),
    "10-shade blue sectors": new AngleBrightness({
        hue: 0.6,
        num_sectors: 10,
    }),
    "6-shade purple sectors": new AngleBrightness({
        hue: 2/3,
        num_sectors: 6,
    }),
    "20-shade red rings": new RadiusBrightness({
        num_sectors: 20,
        hue: 0.01,
        saturation: 0.5,
        max_value: 3.0,
        zero_threshold: 0.01,
    }),
    "checkerboard": new Checkerboard({
        hue: 0.0,
        max_threshold: 10.0,
    }),
    "lime checkerboard": new Checkerboard({
        hue: 0.2333,
        max_threshold: 10.0,
    }),
};
