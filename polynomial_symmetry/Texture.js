export class Texture {
    constructor() {
        this._graphics = undefined;
        this._sketch = undefined;
    }
    
    init(sketch, width, height) {
        this._sketch = sketch;
        if (this._graphics !== undefined) {
            return;
        }
        this._graphics = sketch.createGraphics(width, height);
        this._draw_texture();
    }
    
    get texture() {
        return this._graphics;
    }
    
    set_wrapping() {
        this._sketch.textureWrap(this._sketch.REPEAT);
    }
    
    _draw_texture() {
        throw new Error('implement in subclass!');
    }
}

export class HalfPlanes extends Texture {
    _draw_texture() {
        const gfx = this._graphics;
        gfx.background(255, 0, 0);
        gfx.noStroke();
        gfx.fill(0, 0, 255);
        gfx.rect(0, 0, gfx.width, gfx.height / 2);
    }
    
    set_wrapping() {
        const sketch = this._sketch;
        // If we wrap in the y-direction, you'll get
        // alternating colors even when the y-value is
        // positive
        sketch.textureWrap(sketch.REPEAT, sketch.CLAMP);
    }
}

export class Checkerboard extends Texture {
    _draw_texture() {
        const gfx = this._graphics;
        gfx.background(255, 0, 0);
        gfx.noStroke();
        gfx.fill(0, 0, 0);
        gfx.rect(0, 0, gfx.width/2, gfx.height/2);
        gfx.rect(gfx.width/2, gfx.height/2, gfx.width/2, gfx.height/2);
    }
}

export class ImageTexture extends Texture {
    constructor(img) {
        super();
        this._img = img;
    }
    
    init(sketch) {
        this._sketch = sketch;
        // Nothing to be done here
    }
    
    get texture() {
        return this._img;
    }
    
    set_wrapping() { 
        this._sketch.textureWrap(this._sketch.CLAMP);
    }
}

export class WebcamTexture extends Texture {
    constructor() {
        super();
        this._camera = undefined;
    }
    
    init(sketch) {
        this._sketch = sketch;
        if (this._camera !== undefined) {
            return;
        }
        this._camera = sketch.createCapture(this._sketch.VIDEO);
        this._camera.hide();
    }
    
    get texture() {
        return this._camera;
    }
    
    set_wrapping() {
        this._sketch.textureWrap(this._sketch.CLAMP);
    }
}
