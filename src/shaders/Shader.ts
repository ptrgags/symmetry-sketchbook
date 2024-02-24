import p5 from 'p5'

// Because p5.js swallows compilation errors in minified form :(
export function check_shader(vert: string, frag: string) {
  const canvas = new OffscreenCanvas(100, 100)
  const gl = canvas.getContext('webgl2') as WebGL2RenderingContext

  const vert_shader = gl.createShader(gl.VERTEX_SHADER)
  if (!vert_shader) {
    throw new Error('Could not create WebGL 2 shader!')
  }

  gl.shaderSource(vert_shader, vert)
  gl.compileShader(vert_shader)
  if (!gl.getShaderParameter(vert_shader, gl.COMPILE_STATUS)) {
    console.error('Vertex shader failed to compile:')
    console.error(gl.getShaderInfoLog(vert_shader))
    console.info(vert)
  }

  const frag_shader = gl.createShader(gl.FRAGMENT_SHADER)
  if (!frag_shader) {
    throw new Error('Could not create test shader!')
  }

  gl.shaderSource(frag_shader, frag)
  gl.compileShader(frag_shader)
  if (!gl.getShaderParameter(frag_shader, gl.COMPILE_STATUS)) {
    console.error('Fragment shader failed to compile:')
    console.error(gl.getShaderInfoLog(frag_shader))
    console.info(frag)
  }

  const program = gl.createProgram()
  if (!program) {
    throw new Error('could not create WebGL 2 program!')
  }
  gl.attachShader(program, vert_shader)
  gl.attachShader(program, frag_shader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('program failed to link:')
    console.error(gl.getProgramInfoLog(program))
  }
}

export class Shader {
  protected sketch?: p5
  protected shader?: p5.Shader
  private enabled: boolean = false
  private initialized: boolean = false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preload(p: p5) {}

  init(p: p5, vert: string, frag: string) {
    this.sketch = p
    // Trim whitespace because the #version 300 es directive must
    // not have whitespace before it
    check_shader(vert.trim(), frag.trim())

    this.shader = p.createShader(vert, frag)
    this.set_uniform('show_palette', false)
    this.set_uniform('aspect', p.width / p.height)
    this.set_uniform('time', 0.0)
    this.set_uniform('zoom', 8.0)
    this.set_pan_uv([0, 0])
    this.initialized = true
  }

  enable() {
    if (this.enabled || !this.sketch) {
      return
    }

    if (this.shader) {
      this.sketch.shader(this.shader)
    }
    this.enabled = true
  }

  disable() {
    if (!this.enabled || !this.sketch) {
      return
    }

    this.sketch.resetShader()
    this.enabled = false
  }

  set_uniform(name: string, value: boolean | number | number[] | p5.MediaElement | p5.Graphics) {
    if (!this.sketch || !this.shader) {
      return
    }

    this.enable()

    this.shader.setUniform(name, value)
  }

  update_time() {
    this.enable()

    if (this.shader && this.sketch) {
      this.shader.setUniform('time', this.sketch.millis() / 1000.0)
    }
  }

  /*
  set_texture(texture) {
    this.enable()
    texture.set_wrapping()
    this.shader.setUniform('texture0', texture.texture)
  }
  */

  set_mouse_uv(mouse_uv: [number, number]) {
    // Sometimes mouse events are triggered too early
    if (!this.initialized) {
      return
    }
    this.enable()
    if (this.shader) {
      this.shader.setUniform('mouse_uv', mouse_uv)
    }
  }

  set_pan_uv(pan_uv: [number, number]) {
    // Sometimes mouse events are triggered too early
    if (!this.initialized) {
      return
    }
    this.enable()
    if (this.shader) {
      this.shader.setUniform('pan_uv', pan_uv)
    }
  }

  // Temporary?
  draw() {
    const sketch = this.sketch
    if (!sketch) {
      return
    }

    this.update_time()
    sketch.noStroke()

    // This makes sure the alpha channel is enabled for
    // transparent images.
    sketch.fill(0, 0, 0, 0)

    // Draw a quad that spans the canvas. Since the vertex shader
    // ignores the model matrix, use clip coordinates
    const hw = 1
    const hh = 1
    sketch.quad(-hw, -hh, hw, -hh, hw, hh, -hw, hh)

    // Disable when done to get ready for the next shader
    this.disable()
  }
}
