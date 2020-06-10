void main() {
    float time = mod(uniTime + attShift, attCycle) * attCycleInv;
    float x = attLocation.x;
    float y = attLocation.y;
    float z = attLocation.z;
    y -= time * 8.0;
    vec4 location = worldPointToScreen(vec3(x, y, z));

    gl_PointSize = uniDropSize / location.w;
    gl_Position = location;

}
