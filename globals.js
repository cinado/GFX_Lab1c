const { mat4, mat3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

let moveCamera = null;

const shaders = {
    noLight: "v-shader-nolight.vert",
    gouraudDiffuse: "gouraudDiffuse.vert",
    gouraudSpecular: "gouraudSpecular.vert",
    fragment: "f-shader.frag",
    phongVert: "phong.vert",
    phongDiffuseFrag: "phongDiffuse.frag",
    phongSpecularFrag: "phongSpecular.frag",
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
        normalMatrix: "normalMatrix",
        lightCoords: "u_lightCoords",
        ambientProduct: "u_ambientProduct",
        diffuseProduct: "u_diffuseProduct",
        specularProduct: "u_specularProduct",
        shininess: "u_shininess",

    }
}

const shaderPrograms = {
    noLightProgram: null,
    gouraudDiffuse: null,
    gouraudSpecular: null,
    phongDiffuse: null,
    phongSpecular: null,
}

const matrices = {

    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),

}

/* --------- shader values --------- */
const lightCoords = glMatrix.vec4.fromValues(0.0, 10.0, 0.0, 1.0);
const ambientProduct = glMatrix.vec4.fromValues(0.5, 0.5, 0.5, 1.0);
const diffuseProduct = glMatrix.vec4.fromValues(0.8, 0.8, 0.8, 1.0);
const specularProduct = glMatrix.vec4.fromValues(0.9, 0.9, 0.9, 1.0);
const shininess = 30.0;