const { mat4, mat3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

let moveCamera = null;
let camera=null;

let boundingBoxGrid = null;
let wireGrid = null;
let isGridVisible = false;

let gameLogic = null;
let shapeCreator = null;
let tetraCubeSelection = null;

let coordSys = null;

const shaders = {
    noLight: "v-shader-nolight.vert",
    gouraudSpecular: "gouraudSpecular.vert",
    fragment: "f-shader.frag",
    phongVert: "phong.vert",
    phongSpecularFrag: "phongSpecular.frag",
    gouraudFragment: "gouraudFragment.frag"
}

const textures = {
    brick: "Brick.png",
}

let textureSource = {};
let shaderSource = {};

let currentShaderProgram = null;

const shaderInfo = {

    attributes: {

        vertexLocation: "vertexPosition",
        colorLocation: "vertexColor",
        normalLocation: "vertexNormal",
        textureLocation: "vertexTexture"

    }, uniforms: {

        modelViewMatrix: "modelViewMatrix",
        projectionMatrix: "projectionMatrix",
        viewMatrix: "viewMatrix",
        normalMatrix: "normalMatrix",
        ambientProduct: "u_ambientProduct",
        diffuseProduct: "u_diffuseProduct",
        specularProduct: "u_specularProduct",
        shininess: "u_shininess",

    }
}

const shaderPrograms = {
    noLightProgram: null,
    gouraudSpecular: null,
    phongSpecular: null,
}

const matrices = {

    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),

}

// Restart button
let restartButton = null;

// Sliders for ambient/diffuse/specularProduct
let ambientProductSlider = null;
let diffuseProductSlider = null;
let specularProductSlider = null;

function onSliderValueChanged(event){
    if(event.target.id == "ambientProductSlider"){
        ambientProduct = glMatrix.vec4.fromValues(event.target.value/100, event.target.value/100, event.target.value/100, 1.0);
    }
    else if(event.target.id == "diffuseProductSlider"){
        diffuseProduct = glMatrix.vec4.fromValues(event.target.value/100, event.target.value/100, event.target.value/100, 1.0);
    }
    else if(event.target.id == "specularProductSlider"){
        specularProduct = glMatrix.vec4.fromValues(event.target.value/100, event.target.value/100, event.target.value/100, 1.0);
    }
}

//Create light source
const lightSource = new Light(glMatrix.vec4.fromValues(0.0, 10.0, 0.0, 1.0));

/* --------- shader values --------- */
const lightCoords = lightSource.lightPosition;//glMatrix.vec4.fromValues(0.0, 10.0, 0.0, 1.0);
let ambientProduct = glMatrix.vec4.fromValues(0.5, 0.5, 0.5, 1.0);
let diffuseProduct = glMatrix.vec4.fromValues(0.8, 0.8, 0.8, 1.0);
let specularProduct = glMatrix.vec4.fromValues(0.9, 0.9, 0.9, 1.0);
const shininess = 30.0;