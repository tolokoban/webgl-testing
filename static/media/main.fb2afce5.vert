void main() {
    vec4 location = uniObjectTransfo * vec4(attLocation, 1);
    mat3 transfo3 = mat3(uniObjectTransfo);
    vec3 normal = transfo3 * attNormal;
    varNormal = worldVectorToScreen(normal);
    varReflexion = worldVectorToScreen(reflect(location.xyz, normal));
    varUV = attUV;
    gl_Position = worldPointToScreen(location.xyz);
}
