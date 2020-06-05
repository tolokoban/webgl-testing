vec3 worldVectorToScreen(vec3 vector) {
    return uniCameraMatrix3 * vector;
}
