vec4 worldPointToScreen(vec3 point) {
    //return vec4(point.xy * 0.5, 1.0 - (2.5 - point.z) * 0.2, 1.0);
    return uniPerspectiveMatrix * uniCameraMatrix * vec4(point, 1.0);
}
