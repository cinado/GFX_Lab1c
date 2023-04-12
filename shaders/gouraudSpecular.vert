precision mediump float;

attribute vec4 vertexPosition;
attribute vec4 vertexColor;
attribute vec3 vertexNormal;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec4 fragmentColor;

void main() {

    // Transform light position to view space
    vec4 lightPosition = viewMatrix * vec4(0.0, 10.0, 0.0, 1.0);
    // Transform vertex position to view space
    vec4 viewPosition = modelViewMatrix * vertexPosition;

    // Calculate and normalize light vector - L
    vec3 lightVector = normalize(lightPosition.xyz - viewPosition.xyz);
    // Transform and normalize the normal - N
    vec3 transformedNormal = normalize(normalMatrix * vertexNormal);
    //The direction from the current fragment to the camera
    vec3 v_CamerDirection = normalize(-viewPosition.xyz);  
    //The R vector is the direction in which light is reflected off a surface
    vec3 r_reflectionVector = reflect(-lightVector, transformedNormal);

    //let's assume this is the product of L_a times materialAmb.
    vec4 ambientProduct = vec4(0.5, 0.5, 0.5, 1);
    //let's assume this is the product of L_d times materialDiff.
    vec4 diffuseProduct = vec4(0.8, 0.8, 0.8, 1);
    //let's assume this is the product of L_s times materialSpec.
    vec4 specularProduct = vec4(0.9, 0.9, 0.9, 1);

    //Assume shininess is 30
    float shininess = 30.0;

    // Calculate light intensity
    // This can be negative, so just make negative values 0
    float lightIntensity = max(dot(lightVector, transformedNormal), 0.0);
    //Calculate light intensity for spec
    float specularIntensity = pow(max(dot(r_reflectionVector, v_CamerDirection), 0.0), shininess);

    vec4 spec = specularProduct * specularIntensity;

    gl_Position = projectionMatrix * viewPosition; 
    // Multiply vertex color with lightIntensity
    fragmentColor = vertexColor * (lightIntensity * diffuseProduct + ambientProduct) + spec;
    // set alpha value to 1 again
    fragmentColor.a = 1.0;
}
