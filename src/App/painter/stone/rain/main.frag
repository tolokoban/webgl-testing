void main() {
    float x = 2.0 * (gl_PointCoord.x - 0.5);
    float y = 2.0 * (gl_PointCoord.y - 0.5);
    float r = x*x + y*y;
    if (r > 1.0) discard;

    vec3 color = mix(vec3(1,1,1), vec3(0.6,0.8,1), r);
    gl_FragColor = vec4(color.rgb, 1);
}
