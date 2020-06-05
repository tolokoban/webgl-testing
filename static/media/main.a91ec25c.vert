void main() {
    vec4 location = uniObjectTransfo * vec4(attLocation, 1);
    varNormal = worldVectorToScreen(attNormal);
    varReflexion = worldVectorToScreen(reflect(location.xyz, attNormal));
    varUV = attUV;
    gl_Position = worldPointToScreen(location.xyz);
}
