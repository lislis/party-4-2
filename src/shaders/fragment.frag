#define NUM_STEPS   50
#define ZOOM_FACTOR 2.0
#define X_OFFSET    0.5

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
precision mediump int;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    gl_FragColor = vec4(st.y,st.x,u_time / 10000.0, 1.0);

}
