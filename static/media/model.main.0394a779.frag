void main() {
    vec3 light = normalize(vec3(0.5, 1.0, 0.2));
    float power = dot(light, normalize(varNormal));
    float lightEffect = (power + 1.1) * 0.5;
    vec3 baseColor = texture2D(uniTexture, varUV).xyz * lightEffect;

    float weight = min(
        min(varWeight.x, varWeight.y),
        varWeight.z
    );
    vec3 nearestEdge = vec3(
        weight == varWeight.x ? 1.0 : 0.0,
        weight == varWeight.y ? 1.0 : 0.0,
        weight == varWeight.z ? 1.0 : 0.0
        );
    vec3 valleyVector = nearestEdge * varValley;
    float valley = valleyVector.x + valleyVector.y + valleyVector.z;
    vec3 edgeColor = valley > 0.0 ?
        mix(baseColor, vec3(0,0,0), valley) :
        mix(baseColor, vec3(1,1,1), -valley);
    float darkness = 0.5;
    float thickness = uniThickness;
    float blur = uniSmoothness;
    float factor = smoothstep(thickness, thickness + blur, weight) * darkness;
    vec3 color = mix(edgeColor, baseColor, (1.0 - darkness) + factor);
    gl_FragColor = vec4(color, 1.0);
}
