void main() {
    float time = mod(uniTime + attShift, attCycle) * attCycleInv;
    varTime = 1.0 - time;
    float spread = time * time * 4.0;

    float x = attLocation.x;
    float y = attLocation.y;
    float z = attLocation.z;
    x += (x - 1.0) * spread;
    y += time * 20.0;
    z += (z + 1.0) * spread;
    vec4 location = uniObjectTransfo * vec4(x - 1.903, y + 1.5, z + 3.438, 1);
    location = worldPointToScreen(location.xyz);

    gl_Position = location;
    gl_PointSize = (1.0 + spread * 2.0) * uniDropSize / location.w;
}
