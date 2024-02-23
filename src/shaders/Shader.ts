import p5 from 'p5'

export class Shader {
  protected sketch?: p5
  protected shader?: p5.Shader
  private enabled: boolean = false
  private initialized: boolean = false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preload(p: p5) {}

  init(p: p5, frag: string, vert: string) {
    this.sketch = p
    this.shader = p.createShader(frag, vert)
    this.set_uniform('aspect', p.width / p.height)
    this.set_uniform('time', 0.0)
    this.set_uniform('zoom', 1.0)
    this.initialized = true
  }

  enable() {
    if (!this.sketch) {
      return
    }

    if (!this.enabled) {
      this.sketch.shader(this.shader)
      this.enabled = true
    }
  }

  disable() {
    if (!this.sketch) {
      return
    }

    if (this.enabled) {
      this.sketch.resetShader()
      this.enabled = false
    }
  }

  set_uniform(name, value) {
    if (!this.sketch || !this.shader) {
      return
    }

    this.enable()
    this.shader.setUniform(name, value)
  }

  update_time() {
    this.enable()
    this.shader.setUniform('time', this.sketch.millis() / 1000.0)
  }

  set_texture(texture) {
    this.enable()
    texture.set_wrapping()
    this.shader.setUniform('texture0', texture.texture)
  }

  set_mouse_uv(mouse_uv) {
    // Sometimes mouse events are triggered too early
    if (!this.initialized) {
      return
    }
    this.enable()
    this.shader.setUniform('mouse_uv', mouse_uv)
  }

  set_pan_uv(pan_uv) {
    // Sometimes mouse events are triggered too early
    if (!this.initialized) {
      return
    }
    this.enable()
    this.shader.setUniform('pan_uv', pan_uv)
  }
}
