#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform int u_rgb;
uniform int u_type;
uniform float u_noisedetail;
uniform float u_fft[256]; // has to match whatever comes from jukegen's analyser

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
                 43758.5453123);
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.7),
                         _radius+(_radius*0.7),
                         dot(dist,dist)*4.0);
}

float plotX (vec2 st, float pct, float thickness){
    return  smoothstep( pct-thickness, pct, st.y) -
        smoothstep( pct, pct+thickness, st.y);
}

float plotY (vec2 st, float pct, float thickness){
    return  smoothstep( pct-thickness, pct, st.x) -
        smoothstep( pct, pct+thickness, st.x);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.7);

    //
    // Background random pattern
    //
    vec2 pixSt = st * u_noisedetail; // Scale the coordinate system by 10
    vec2 ipos = floor(pixSt);  // get the integer coords
    float pct = distance(st,vec2(0.5));

    float freq = sin(abs(atan(u_time)*0.8));
    float rando_val = clamp((random( ipos * freq)), 0.6, 0.7);

//    color.b = rando_val;
//    color.r = rando_val;
//    color.g = rando_val;

    //color = pct / color * 0.9; // creates little shadow

    //
    // FFT viz
    //
    float pct2;
    for (int i = 0; i < 256; i++) {
        float v = abs(u_fft[i]);
        pct2 = smoothstep(0.0, 256.0, v);

        float value;
        if (u_type == 0) {
            value = plotX(st, pct2, 0.01) * plotY(st, pct2, 0.01);
        } else if (u_type == 1) {
            value = plotX(st, pct2, 0.004);
        } else if (u_type == 2) {
            value = plotY(st, pct2, 0.004);
        } else if (u_type == 3) {
            value = plotX(st, pct2, 0.002) - plotY(st, pct2, 0.002);
        }

        if (u_rgb == 0) {
            color.b = rando_val;
            color.r += value;
        } else if (u_rgb == 1) {
            color.g = rando_val;
            color.b += value;
        } else if (u_rgb == 2) {
            color.r = rando_val;
            color.g += value;
        } else if (u_rgb == 3) {
            color.b = rando_val;
            color.rg += value;
        }
    }

    //
    // Circle reacting to first value in fft
    //
    float circle_big = circle(st, (abs(1.5 * u_fft[0] / 256.)));
    color *= circle_big;

    gl_FragColor = vec4(color,1.0);
}
