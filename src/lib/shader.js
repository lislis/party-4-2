export default class Shader{
  constructor() {
    let canvas = document.createElement('canvas');
    canvas.id = 'c';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementsByTagName('body')[0].appendChild(canvas);
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    //return gl;
    this.program = null;
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
      let resVal = [window.screen.availWidth, window.screen.availHeight];
      this.gl.uniform2fv(resLoc, resVal);

      let timeLoc = this.gl.getUniformLocation(this.program, "u_time");
      let timeVal = dt;
      this.gl.uniform1f(timeLoc, timeVal);

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
}
