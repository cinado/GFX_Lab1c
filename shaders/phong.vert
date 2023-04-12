precision mediump float;

attribute vec4 vertexPosition;
attribute vec4 vertexColor;
attribute vec3 vertexNormal;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 v_normal;
varying vec4 v_vertexColor;
varying vec4 v_viewPosition;

void main() {
    // Transform vertex position to view space
    vec4 viewPosition = modelViewMatrix * vertexPosition;

    // Pass it to the fragment shader and use it there to calculate the colour for each individual fragment
    v_normal = vertexNormal;
    v_vertexColor = vertexColor;
    v_viewPosition = viewPosition;

    gl_Position = projectionMatrix * viewPosition; 
}
