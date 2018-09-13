/**
** Setup to initialize a canvas and webGL rendering
**
** let shader = new Shader()
** Where `shader` is not technically semantically correct, but oh well
**
** What happens? We'll create a canvas element and append it to the body.
** We get the GL context of that canvas which let's us do all the GL magic!
** Then we'll fetch the vertex and fragment shaders and initalize the program.
** The program is basically the two shaders running in the GL context.
** Then we start an internal update loop to re-render the shader.
** This is also where we pass uniforms into the fragment shader to make things
** move and stuff.
**
** I would be nothing without this blog tho
** https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
**/

export default class Shader{
  constructor() {
    let canvas = document.createElement('canvas');
    canvas.id = 'c';
    canvas.classList.add('canvas');
    canvas.width  = window.screen.availHeight;
    canvas.height = window.screen.availHeight;
    document.getElementsByTagName('body')[0].appendChild(canvas);
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.program = null;
    this.fft = [];
    this.type = 0;
    this.rgb = 1;
    this.noiseDetail = 40;
    this.initProgram();
  }

  initProgram() {
    let vertexShader;
    let fragmentShader;

    try {
      this.setupBuffer();
    } catch (e) {
      console.log('Could not setup Buffer', e);
    }

    let vertexPromise = fetch('shaders/vertex.vert')
        .then(resp => resp.text())
        .then(data => {
          let shaderSource = data;
          vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
          this.gl.shaderSource(vertexShader, shaderSource);
          this.gl.compileShader(vertexShader);
        });

    let fragmentPromise = fetch('shaders/fragment.frag')
        .then(resp => resp.text())
        .then(data => {
          let shaderSource = data;
          fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
          this.gl.shaderSource(fragmentShader, shaderSource);
          this.gl.compileShader(fragmentShader);
        });

    Promise.all([vertexPromise, fragmentPromise]).then(val => {
      this.program = this.gl.createProgram();
      this.gl.attachShader(this.program, vertexShader);
      this.gl.attachShader(this.program, fragmentShader);
      this.gl.linkProgram(this.program);
      this.gl.useProgram(this.program);

      this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
      this.resolutionLocation = this.gl.getUniformLocation(this.program, "u_resolution");
      this.timeLocation = this.gl.getUniformLocation(this.program, "u_time");
      this.rgbLocation = this.gl.getUniformLocation(this.program, "u_rgb");
      this.typeLocation = this.gl.getUniformLocation(this.program, "u_type");
      this.noiseLocation = this.gl.getUniformLocation(this.program, "u_noisedetail");
      this.fftLocation = this.gl.getUniformLocation(this.program, "u_fft");

      this.render();
    });
  }

  render(dt) {
    if (this.program && this.fft.length) {
      this.gl.clearColor(1.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      let resVal = [window.innerHeight, window.innerHeight];
      this.gl.uniform2fv(this.resolutionLocation, resVal);
      let timeVal = dt;
      this.gl.uniform1f(this.timeLocation, timeVal);
      this.gl.uniform1i(this.rgbLocation, this.rgb);
      this.gl.uniform1i(this.typeLocation, this.type);
      this.gl.uniform1f(this.noiseLocation, this.noiseDetail);
      this.gl.uniform1fv(this.fftLocation, this.fft);

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(this.render.bind(this));
  }

  setupBuffer(glContext) {
    let buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
        1.0, -1.0,
        1.0,  1.0]),
      this.gl.STATIC_DRAW
    );
  }

  get getNoiseDetail() {
    return this.noiseDetail;
  }

  setRgb(int) {
    this.rgb = int;
    return this.rgb;
  }

  setFft(array) {
    this.fft = new Float32Array(array);
    return true;
  }

  setType(int) {
    this.type = int;
    return this.type;
  }

  setNoiseDetail(int) {
    if (int >= 0 && int <= 200) {
      this.noiseDetail = int;
    }
    return this.noiseDetail;
  }
}
