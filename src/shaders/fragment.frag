#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform int u_rgb;
uniform float u_diameter;
uniform float u_noisedetail;
uniform float u_fft[256]; // has to match whatever comes from jukegen's analyser

float noisedetail = u_noisedetail; // change me
float diameter = u_diameter; //change me

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

float plot (vec2 st, float pct){
    return  smoothstep( pct-0.001, pct, st.y) -
        smoothstep( pct, pct+0.001, st.y);
}

float plotX (vec2 st, float pct){
    return  smoothstep( pct-0.001, pct, st.x) -
        smoothstep( pct, pct+0.001, st.x);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.7);

    // Background random pattern
    vec2 pixSt = st * noisedetail; // Scale the coordinate system by 10
    vec2 ipos = floor(pixSt);  // get the integer coords
    float pct = distance(st,vec2(0.5));


    float circle_big = circle(st, abs(sin(u_time + 0.1) * diameter) + 0.2);
    //float circle_small = circle(st, abs(sin(u_time + 0.1) * diameter) + 0.15);
    //float circle = circle_big - circle_small;



    // Assign a random value based on the integer coord
    float freq = sin(abs(atan(u_time)*0.8));
    float rando_val = clamp((random( ipos * freq)), 0.5, 0.6);

    color.b = rando_val;
    color.r = rando_val;
    color.g = rando_val;

    color = pct / color * 0.9;

    float pct2;
    for (int i = 0; i < 256; i++) {
        float v = abs(u_fft[i]);
        pct2 = smoothstep(0.0, 256.0, v);

        if (u_rgb == 0) {
            color.r += plot(st, pct2) - plotX(st, pct2);
        } else if (u_rgb == 1) {
            color.b += plot(st, pct2) - plotX(st, pct2);
        } else if (u_rgb == 2) {
            color.g += plot(st, pct2) - plotX(st, pct2);
        } else if (u_rgb == 3) {
            color.rg += plot(st, pct2) - plotX(st, pct2);
        }
    }

    color *= circle_big;

    gl_FragColor = vec4(color,1.0);
}
