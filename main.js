

const { mat4 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
const lines = [];
let gl = null;
const DESCREASE_FACTOR = 0.9;
const INCREASE_FACTOR = 1.1;

const SINGLE_OBJECT_SELECTED_MODE = 1;
const ALL_OBJECTS_SELECTED_MODE = 2;
const CAMERA_MODE = 3;

const X_AXIS_VECTOR = [1, 0, 0];
const Y_AXIS_VECTOR = [0, 1, 0];
const Z_AXIS_VECTOR = [0, 0, 1];
const ROTATION_ANGLE = toRad(3);

let moveCamera;

let selectedObject = null;
let currentMode = CAMERA_MODE;

const locations = {
    attributes: {
        vertexLocation: null,
        colorLocation: null
    }, uniforms: {
        modelViewMatrix: null,
        projectionMatrix: null,
    }
}

const viewMatrix = mat4.create();

window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    const mouseControl = new MouseControl(canvas);

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram("v-shader", "f-shader");
    gl.useProgram(program);

    /* --------- save attribute & uniform locations --------- */
    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");
    locations.uniforms.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    locations.uniforms.scalingMatrix = gl.getUniformLocation(program, "scalingMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");

    /* --------- create & send projection matrix --------- */
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);

    /* --------- create view matrix --------- */
    mat4.lookAt(viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0]);

    /* --------- translate view matrix --------- */
    //mat4.translate(viewMatrix, viewMatrix, [-0.5, 0, 0])

    /* Position for each shape */
    const positions = [
        [-0.95, 0.7, 0], [0, 0.7, 0], [0.95, 0.7, 0],
        [-0.95, 0, 0], [0, 0, 0], [0.95, 0, 0],
        [-0.95, -0.7, 0], [0, -0.7, 0], [0.95, -0.7, 0]
    ];

    /* --------- create 2 cubes and translate them away from each other --------- */
    shapes.push(createShape());
    //shapes[0].translate([0.5, 0, 0]);

    shapes.push(createShape());
    //shapes[1].translate([-0.5, 0, 0]);

    /* Placeholder Shapes */
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());

    shapes.forEach((shape, index) => {
        shape.translate(positions[index]);
    });

    lines.push(createGlobalCoordinateSystem());

    /* --------- Attach event listener for keyboard events to the window --------- */
    window.addEventListener("keydown", (event) => {
        /* ----- this event contains all the information you will need to process user interaction ---- */
        console.log(event)

        if (event.key.match(/[0-9]/)) {
            if (event.key == 0) {
                currentMode = ALL_OBJECTS_SELECTED_MODE;
                selectedObject = null;
                console.log("All objects selected");
            } else {
                currentMode = SINGLE_OBJECT_SELECTED_MODE;
                selectedObject = event.key - 1;
                console.log("Single object selection was activated");
            }
        } else if (event.key == " ") {
            currentMode = CAMERA_MODE;
            selectedObject = null;
            console.log("Camera mode was activated");
        }

        if (currentMode === SINGLE_OBJECT_SELECTED_MODE) {
            console.log("Selected object: ", selectedObject);
            switch (event.key) {
                // Scaling
                case 'a':
                    shapes[selectedObject].scale([DESCREASE_FACTOR, 1, 1]);
                    break;
                case 'A':
                    shapes[selectedObject].scale([INCREASE_FACTOR, 1, 1]);
                    break;
                case 'b':
                    shapes[selectedObject].scale([1, DESCREASE_FACTOR, 1]);
                    break;
                case 'B':
                    shapes[selectedObject].scale([1, INCREASE_FACTOR, 1]);
                    break;
                case 'c':
                    shapes[selectedObject].scale([1, 1, DESCREASE_FACTOR]);
                    break;
                case 'C':
                    shapes[selectedObject].scale([1, 1, INCREASE_FACTOR]);
                    break;
                // Rotation
                case 'i':
                    shapes[selectedObject].rotate(-ROTATION_ANGLE, X_AXIS_VECTOR);
                    break;
                case 'k':
                    shapes[selectedObject].rotate(ROTATION_ANGLE, X_AXIS_VECTOR);
                    break;
                case 'o':
                    shapes[selectedObject].rotate(-ROTATION_ANGLE, Y_AXIS_VECTOR);
                    break;
                case 'u':
                    shapes[selectedObject].rotate(ROTATION_ANGLE, Y_AXIS_VECTOR);
                    break;
                case 'l':
                    shapes[selectedObject].rotate(-ROTATION_ANGLE, Z_AXIS_VECTOR);
                    break;
                case 'j':
                    shapes[selectedObject].rotate(ROTATION_ANGLE, Z_AXIS_VECTOR);
                    break;
                case 'ArrowRight':
                    shapes[selectedObject].translate([0.1, 0, 0]);
                    break;
                case 'ArrowLeft':
                    shapes[selectedObject].translate([-0.1, 0, 0]);
                    break;
                case 'ArrowUp':
                    shapes[selectedObject].translate([0, 0.1, 0]);
                    break;
                case 'ArrowDown':
                    shapes[selectedObject].translate([0, -0.1, 0]);
                    break;
                case ',':
                    shapes[selectedObject].translate([0, 0, 0.1]);
                    break;
                case '.':
                    shapes[selectedObject].translate([0, 0, -0.1]);
                    break;
            }
        }
        else if (currentMode == ALL_OBJECTS_SELECTED_MODE) {
            switch (event.key) {
                // Scaling
                case 'a':
                    shapes.forEach(shape => shape.global_scaling([DESCREASE_FACTOR, 1, 1]));
                    break;
                case 'A':
                    shapes.forEach(shape => shape.global_scaling([INCREASE_FACTOR, 1, 1]));
                    break;
                case 'b':
                    shapes.forEach(shape => shape.global_scaling([1, DESCREASE_FACTOR, 1]));
                    break;
                case 'B':
                    shapes.forEach(shape => shape.global_scaling([1, INCREASE_FACTOR, 1]));
                    break;
                case 'c':
                    shapes.forEach(shape => shape.global_scaling([1, 1, DESCREASE_FACTOR]));
                    break;
                case 'C':
                    shapes.forEach(shape => shape.global_scaling([1, 1, INCREASE_FACTOR]));
                    break;
                // Rotation
                case 'i':
                    shapes.forEach(shape => shape.global_rotation(-ROTATION_ANGLE, X_AXIS_VECTOR));
                    break;
                case 'k':
                    shapes.forEach(shape => shape.global_rotation(ROTATION_ANGLE, X_AXIS_VECTOR));
                    break;
                case 'o':
                    shapes.forEach(shape => shape.global_rotation(-ROTATION_ANGLE, Y_AXIS_VECTOR));
                    break;
                case 'u':
                    shapes.forEach(shape => shape.global_rotation(ROTATION_ANGLE, Y_AXIS_VECTOR));
                    break;
                case 'l':
                    shapes.forEach(shape => shape.global_rotation(-ROTATION_ANGLE, Z_AXIS_VECTOR));
                    break;
                case 'j':
                    shapes.forEach(shape => shape.global_rotation(ROTATION_ANGLE, Z_AXIS_VECTOR));
                    break;
                // Translation
                case 'ArrowRight':
                    shapes.forEach(shape => shape.global_translation([0.1, 0, 0]));
                    break;
                case 'ArrowLeft':
                    shapes.forEach(shape => shape.global_translation([-0.1, 0, 0]));
                    break;
                case 'ArrowUp':
                    shapes.forEach(shape => shape.global_translation([0, 0.1, 0]));
                    break;
                case 'ArrowDown':
                    shapes.forEach(shape => shape.global_translation([0, -0.1, 0]));
                    break;
                case ',':
                    shapes.forEach(shape => shape.global_translation([0, 0, 0.1]));
                    break;
                case '.':
                    shapes.forEach(shape => shape.global_translation([0, 0, -0.1]));
                    break;
            }
        }
        else if (currentMode == CAMERA_MODE) {
            switch (event.key) {
                // Translation
                case 'ArrowRight':
                    moveCamera([-0.1, 0, 0]);
                    break;
                case 'ArrowLeft':
                    moveCamera([0.1, 0, 0]);
                    break;
                case 'ArrowUp':
                    moveCamera([0, -0.1, 0]);
                    break;
                case 'ArrowDown':
                    moveCamera([0, 0.1, 0]);
                    break;
            }
        }

    })

    /* --------- Load some data from external files - only works with an http server --------- */
    //  await loadSomething();

    /* --------- start render loop --------- */
    requestAnimationFrame(render);
}

/* To be refactored */
moveCamera = function translateCamera(vector) {
    mat4.translate(viewMatrix, viewMatrix, vector);
}

/* --------- simple example of loading external files --------- */
async function loadSomething() {
    const data = await fetch('helpers.js').then(result => result.text());
    console.log(data);
}

let then = 0;

function render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {
        /* --------- scale rotation amount by time difference --------- */
        //shape.rotate(1 * delta, [0, 1, 1]);
        shape.draw();
    });

    lines.forEach(lines => {
        lines.drawLine();
    });

    requestAnimationFrame(render)
}


function createShape() {
    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */
    const vertices = [
        // X, Y, Z, W
        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,

        -0.2, 0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        -0.2, -0.2, -0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,

        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1, // left face end

        0.2, 0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1, // back face end

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1, // bottom face end

        0.2, 0.2, 0.2, 1,
        0.2, -0.2, -0.2, 1,
        0.2, 0.2, -0.2, 1,

        0.2, -0.2, -0.2, 1,
        0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        0.2, 0.2, 0.2, 1,
        0.2, 0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1, // Top face end
    ];

    const colorData = [
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    /* --------- add one color per face, so 6 times for each color --------- */
    colorData.forEach(color => {
        for (let i = 0; i < 6; ++i) {
            colors.push(color);
        }
    });

    /* --------- create shape object and initialize data --------- */
    const cube = new Shape();
    cube.initData(vertices, colors)

    return cube;
}

function createGlobalCoordinateSystem() {
    /* --------- define vertex positions & colors --------- */
    /* -------------- 2 vertices per line ------------- */
    const vertices = [
        // X, Y, Z, W
        -20.0, 0.0, 0.0, 1.0,   // X-Start
        20.0, 0.0, 0.0, 1.0,    // X-End
        0.0, 20.0, 0.0, 1.0,    // Y-Start
        0.0, -20.0, 0.0, 1.0,   // Y-End
        0.0, 0.0, 20.0, 1.0,    // Z-Start
        0.0, -0.0, -20.0, 1.0,  // Z-End
    ];

    const colorData = [
        [1.0, 0.0, 0.0, 1.0],    // X-Start
        //[1.0, 0.0, 0.0, 1.0],    // X-End
        [0.0, 1.0, 0.0, 1.0],    // Y-Start
        //[0.0, 1.0, 0.0, 1.0],    // Y-End
        [0.0, 0.0, 1.0, 1.0],    // Z-Start
        //[0.0, 0.0, 1.0, 1.0],    // Z-End
    ];

    const colors = [];

    /* --------- add one color per point, so 2 times for each line --------- */
    colorData.forEach(color => {
        for (let i = 0; i < 2; ++i) {
            colors.push(color);
        }
    });

    /* --------- create shape object and initialize data --------- */
    const globalCoordinateSystemLines = new Shape();
    globalCoordinateSystemLines.initData(vertices, colors)

    return globalCoordinateSystemLines;
}

