void main() {
    float x = 2.0 * (gl_PointCoord.x - 0.5);
    float y = 2.0 * (gl_PointCoord.y - 0.5);
    float r = x*x + y*y;
    if (r > 1.0) discard;

    float light = (1.0 - r) * varTime;
    vec3 color = vec3(light * 0.07);
    gl_FragColor = vec4(color.rgb, 1.0);
}
