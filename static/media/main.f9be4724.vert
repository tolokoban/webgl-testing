void main() {
    varSegment = 0.5 * (1.0 - attSegment);
    float time = mod(uniTime + attShift, attCycle) * attCycleInv;
    float x = attLocation.x;
    float y = attLocation.y;
    float z = attLocation.z;
    y -= time * 8.0 - attSegment * 0.5;
    vec4 location = uniObjectTransfo * vec4(x, y, z, 1);
    location = worldPointToScreen(location.xyz);
    gl_Position = location;

}
