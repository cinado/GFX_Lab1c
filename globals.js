const { mat4, mat3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

//const lines = [];

//let localCoordinateSystem = null;
let moveCamera = null;

const shaders = {
    noLight: "v-shader-nolight.vert",
    gouraudDiffuse: "gouraudDiffuse.vert",
    gouraudSpecular: "gouraudSpecular.vert",
    fragment: "f-shader.frag"
}

let shaderSource = {};

let currentShaderProgram = null;

const shaderInfo = {

    attributes: {

        vertexLocation: "vertexPosition",
        colorLocation: "vertexColor",
        normalLocation: "vertexNormal"

    }, uniforms: {

        modelViewMatrix: "modelViewMatrix",
        projectionMatrix: "projectionMatrix",
        viewMatrix: "viewMatrix",
        normalMatrix: "normalMatrix"

    }
}

const shaderPrograms = {
    noLightProgram: null,
    gouraudDiffuse: null,
    gouraudSpecular: null,
}

const matrices = {

    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),

}