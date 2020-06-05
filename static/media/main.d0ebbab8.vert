void main() {
    vec4 location = uniObjectTransfo * vec4(attLocation, 1);
    vec4 worldLocation = worldPointToScreen(attLocation);
    float thickness = worldLocation.w * uniThickness;
    gl_Position = worldPointToScreen(location.xyz + attNormal * thickness);
}
