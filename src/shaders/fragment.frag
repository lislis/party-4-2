#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_rgb;
uniform float u_diameter;
uniform float u_noisedetail;
uniform float u_fft; // has to match whatever comes from jukegen's analyser

float noisedetail = u_noisedetail; // change me
float diameter = u_diameter; //change me
float rgb = 0.;

#define PI 3.14159265359

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
                 43758.5453123);
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                         _size+vec2(0.001),
                         _st);
    uv *= smoothstep(_size,
                     _size+vec2(0.001),
                     vec2(1.0)-_st);
    return uv.x*uv.y;
}

float plot (vec2 st, float pct){
    return  smoothstep( pct-0.01, pct, st.y) -
        smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);

    vec2 pixSt = st * noisedetail; // Scale the coordinate system by 10
    vec2 ipos = floor(pixSt);  // get the integer coords
    //vec2 fpos = fract(pixSt);  // get the fractional coods
    float pct = distance(st,vec2(0.5));

    // Assign a random value based on the integer coord
    float freq = sin(abs(atan(u_time)*0.8));
    float circle_big = circle(st, abs(sin(u_time + 0.1) * diameter) + 0.2);
    float circle_small = circle(st, abs(sin(u_time + 0.1) * diameter) + 0.15);
    float circle = circle_big - circle_small;

    float rando_val = clamp((random( ipos * freq)), 0.4, 0.5);

    color.b = rando_val;
    color.r = rando_val;
    color.g = rando_val;
    //color.r = circle;
    //color.g = circle;

    color = pct / color * 0.9;

    float pct2;
    //for (int i = 0; i < u_fft.length; i++) {
        //float slice = 1. / 512.;
        float v = abs(u_fft); //fft
        //float val = slice + v; //(slice * float(i));
        //float y = v * st.y * 0.5;
        pct2 = smoothstep(0.0, 256.0, v);
        //}

    color.r += plot(st, pct2);
    //    color = vec3(circle(st, 0.8));
    //float slice = st.x / float(512.);

    gl_FragColor = vec4(color,1.0);
}
