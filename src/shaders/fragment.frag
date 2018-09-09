#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_rgb;
uniform int u_diameter;
uniform int u_noisedetail;
uniform float u_fft[512]; // has to match whatever comes from jukegen's analyser

#define PI 3.14159265359

float plot(vec2 st, float pct){
    return  smoothstep( pct-0.02, pct, st.y) -
        smoothstep( pct, pct+0.02, st.y);
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
                 43758.5453123);
}

float circle(vec2 st, float radius, float border, float color) {
    float pct = distance(st, vec2(0.5)); // 0.5 is center
    float circle= (color -smoothstep(radius, radius + border, pct));
    return circle;
}

void main() {
    //vec2 st = gl_FragCoord.xy/u_resolution;
    //gl_FragColor = vec4(st.y,st.x,u_time / 10000.0, 1.0);

    vec2 st = gl_FragCoord.xy/u_resolution;


    vec3 yellow, magenta, green;

    // Making Yellow
    yellow.rg = vec2(1.0);  // Assigning 1. to red and green channels
    yellow[2] = 0.0;        // Assigning 0. to blue channel

    // Making Magenta
    magenta = yellow.rbg;   // Assign the channels with green and blue swapped

    // Making Green
    green.rgb = yellow.bgb;

    // st = tile(st, 2.);
    //float y = sin(st.x);
    //vec3 color = vec3(0.0);

    //float pct = abs(sin(u_time));

    //vec3 color = mix(magenta, yellow, smoothstep(0.3, 0.35, pct));
    //vec3 color = smoothstep(0.3, 0.35, pct);

    vec3 color = vec3(0.1);
    color = (color) * magenta;

    color.r = circle(st, 0.5, 0.1, 0.4);
    color.b = circle(st, sin(u_time), 0.0, 0.7);


    vec2 pos = vec2(0.5)-st;
    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);

    float f = cos(a*3.);

    //f = smoothstep(-.5,1., cos(a*10. + (u_time)))*0.2+0.5; // gear

    //float pct = plot(st,pos.y);
    //color = (1.0-pct)*color+pct*vec3( 1.-smoothstep(f,f+0.02,r) );


    //    color = vec3( 1.-smoothstep(f,f+0.02,r) );

    gl_FragColor = vec4(color, 1.0);
}
