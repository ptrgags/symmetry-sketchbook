class Texture {
    constructor() {
        this._graphics = undefined;
    }
    
    make_graphics(width, height) {
        if (this._graphics !== undefined) {
            return;
        }
        this._graphics = createGraphics(width, height);
        this._draw_texture();
    }
    
    get texture() {
        return this._graphics;
    }
    
    set_wrapping() {
        textureWrap(REPEAT);
    }
    
    _draw_texture() {
        throw new Error('implement in subclass!');
    }
}

class HalfPlanes extends Texture {
    _draw_texture() {
        const gfx = this._graphics;
        gfx.background(255, 0, 0);
        gfx.noStroke();
        gfx.fill(0, 0, 255);
        gfx.rect(0, 0, gfx.width, gfx.height / 2);
    }
    
    set_wrapping() {
        // If we wrap in the y-direction, you'll get
        // alternating colors even when the y-value is
        // positive
        textureWrap(REPEAT, CLAMP);
    }
}

class Checkerboard extends Texture {
    _draw_texture() {
        const gfx = this._graphics;
        gfx.background(255, 0, 0);
        gfx.noStroke();
        gfx.fill(0, 0, 0);
        gfx.rect(0, 0, gfx.width/2, gfx.height/2);
        gfx.rect(gfx.width/2, gfx.height/2, gfx.width/2, gfx.height/2);
    }
}

class ImageTexture extends Texture {
    constructor(img) {
        super();
        this._img = img;
    }
    
    make_graphics(width, height) {
        console.warn("No need to call make_graphics with an ImageTexture :)");
    }
    
    get texture() {
        return this._img;
    }
    
    set_wrapping() {
        // Since most images don't have powers of 2, 
        textureWrap(CLAMP);
    }
}
