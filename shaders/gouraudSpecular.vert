precision mediump float;

attribute vec4 vertexPosition;
attribute vec4 vertexColor;
attribute vec3 vertexNormal;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec4 u_ambientProduct;
uniform vec4 u_diffuseProduct;
uniform vec4 u_specularProduct;
uniform float u_shininess;

varying vec4 fragmentColor;

void main() {
    // Transform vertex position to view space
    vec4 viewPosition = modelViewMatrix * vertexPosition;

    // Set light vector to (-1,-1,-1) and normalize it
    vec3 lightVector = normalize(vec3(1.0, 1.0, 1.0));
    // Transform and normalize the normal - N
    vec3 transformedNormal = normalize(normalMatrix * vertexNormal);
    //The direction from the current fragment to the camera
    vec3 v_CamerDirection = normalize(-viewPosition.xyz);  
    //The R vector is the direction in which light is reflected off a surface
    vec3 r_reflectionVector = reflect(-lightVector, transformedNormal);

    // Calculate light intensity
    // This can be negative, so just make negative values 0
    float lightIntensity = max(dot(lightVector, transformedNormal), 0.0);
    //Calculate light intensity for spec
    float specularIntensity = pow(max(dot(r_reflectionVector, v_CamerDirection), 0.0), u_shininess);

    vec4 spec = u_specularProduct * specularIntensity;

    gl_Position = projectionMatrix * viewPosition; 
    // Multiply vertex color with lightIntensity
    fragmentColor = vertexColor * (lightIntensity * u_diffuseProduct + u_ambientProduct) + spec;
    // set alpha value to 1 again
    fragmentColor.a = 1.0;
}
