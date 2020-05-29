void main() {
    varNormal = reflect(attLocation, attNormal);
    varWeight = attWeight;
    varValley = attValley;
    varUV = attUV;
    gl_Position = worldPointToScreen(attLocation);
    /* gl_Position = vec4(
        attLocation.xy * 0.5,
        1.0 - attLocation.z * 0.4,
        1.0
    ); */
}
