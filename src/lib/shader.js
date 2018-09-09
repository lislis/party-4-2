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

// https://gist.github.com/addyosmani/5434533
var limitLoop = function (fn, fps) {

  // Use var then = Date.now(); if you
  // don't care about targetting < IE9
  var then = new Date().getTime();

  // custom fps, otherwise fallback to 60
  fps = fps || 60;
  var interval = 1000 / fps;

  return (function loop(time){
    requestAnimationFrame(loop);

    // again, Date.now() if it's available
    var now = new Date().getTime();
    var delta = now - then;

    if (delta > interval) {
      // Update time
      // now - (delta % interval) is an improvement over just
      // using then = now, which can end up lowering overall fps
      then = now - (delta % interval);

      // call the fn
      fn();
    }
  }(0));
};

export default class Shader{
  constructor() {
    let canvas = document.createElement('canvas');
    canvas.id = 'c';
    canvas.width  = window.screen.availWidth / 2;
    canvas.height = window.screen.availWidth / 2;
    document.getElementsByTagName('body')[0].appendChild(canvas);
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.program = null;
    this.fft = new Array(512);
    this.diameter = 5;
    this.rgb = [30, 100, 120];
    this.noiseDetail = 4;
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
      this.render();
    });
  }

  render(dt) {
    if (this.program) {
      this.gl.clearColor(1.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      let positionLocation = this.gl.getAttribLocation(this.program, "a_position");
      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

      let resLoc = this.gl.getUniformLocation(this.program, "u_resolution");
      //let resVal = [window.screen.availWidth, window.screen.availHeight];
      let resVal = [window.innerWidth / 2, window.innerWidth / 2];
      this.gl.uniform2fv(resLoc, resVal);

      let timeLoc = this.gl.getUniformLocation(this.program, "u_time");
      let timeVal = dt;
      this.gl.uniform1f(timeLoc, timeVal);

      let rgbLoc = this.gl.getUniformLocation(this.program, "u_rgb");
      this.gl.uniform3iv(rgbLoc, this.rgb);

      let diaLoc = this.gl.getUniformLocation(this.program, "u_diameter");
      this.gl.uniform1i(diaLoc, this.diameter);

      let noiseLoc = this.gl.getUniformLocation(this.program, "u_noisedetail");
      this.gl.uniform1i(noiseLoc, this.noiseDetail);

      let fftLoc = this.gl.getUniformLocation(this.program, "u_fft");
      this.gl.uniform1fv(fftLoc, this.fft);

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    limitLoop(this.render.bind(this), 30);
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

  setRgb(array) {
    this.rgb = array;
    return this.rgb;
  }

  setFft(array) {
    this.fft = array;
    return true;
  }

  setDiameter(int) {
    this.diameter = int;
    return this.diameter;
  }

  setNoiseDetail(int) {
    this.noiseDetail = int;
    return this.noiseDetail;
  }
}
