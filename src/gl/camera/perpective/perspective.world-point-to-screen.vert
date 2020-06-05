vec4 worldPointToScreen(vec3 point) {
    return uniPerspectiveMatrix * uniCameraMatrix * vec4(point, 1.0);
}
