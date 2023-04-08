const { mat4, mat3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

const lines = [];

let localCoordinateSystem = null;
let moveCamera = null;

const shaders = {
    noLight: "v-shader-nolight",
    withLight: "v-shader",
    fragment: "f-shader"
}

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
    withLightProgram: null

}

const matrices = {

    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),

}

let flag = true;