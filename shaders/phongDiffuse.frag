precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec4 u_lightCoords;
uniform vec4 u_ambientProduct;
uniform vec4 u_diffuseProduct;

varying vec3 v_normal;
varying vec4 v_vertexColor;
varying vec4 v_viewPosition;

void main() {

    // Transform light position to view space
    vec4 lightPosition = viewMatrix * u_lightCoords;

    // Calculate and normalize light vector - L
    vec3 lightVector = normalize(lightPosition.xyz - v_viewPosition.xyz);
    // Transform and normalize the normal - N
    vec3 transformedNormal = normalize(normalMatrix * v_normal);

    // Calculate light intensity
    // This can be negative, so just make negative values 0
    float lightIntensity = max(dot(lightVector, transformedNormal), 0.0);
    
    // Calculate fragment color
    gl_FragColor = v_vertexColor * (lightIntensity * u_diffuseProduct + u_ambientProduct);

    // set alpha value to 1 again
    gl_FragColor.a = 1.0;
}
