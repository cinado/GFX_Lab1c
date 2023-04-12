precision mediump float;

attribute vec4 vertexPosition; 
attribute vec4 vertexColor;    

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 fragmentColor;    

void main() {
    gl_Position = projectionMatrix *  modelViewMatrix * vertexPosition; 
    fragmentColor = vertexColor; 
}