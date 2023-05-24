const DESCREASE_FACTOR = 0.9;
const INCREASE_FACTOR = 1.1;
/*
const SINGLE_OBJECT_SELECTED_MODE = 1;
const ALL_OBJECTS_SELECTED_MODE = 2;
const CAMERA_MODE = 3;
const LIGHT_MODE = 4;*/

const TRANSLATE_BY_CUBE_LENGTH = 0.2;

const X_AXIS_VECTOR = [1, 0, 0];
const Y_AXIS_VECTOR = [0, 1, 0];
const Z_AXIS_VECTOR = [0, 0, 1];
const ROTATION_ANGLE = toRad(3);
const TETRIS_SHAPE_ROTATION = toRad(90);

let selectedObject = null;
//let currentMode = CAMERA_MODE;

class KeyboardControl {
    constructor(window) {
        this.window = window;
        this.isPhongActivated = true;

        this.window.addEventListener("keydown", (event) => {
            /* ----- this event contains all the information you will need to process user interaction ---- */
            console.log(event)

            /*if (event.key.match(/^[0-9]$/)) {
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
            } else if (event.key == "L") {
                currentMode = LIGHT_MODE;
                selectedObject = null;
                console.log("Light mode was activated");
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
                    // Translation
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
            else if (currentMode == LIGHT_MODE) {
                switch (event.key) {
                    // Rotation
                    case 'i':
                        lightSource.global_rotation(-ROTATION_ANGLE, X_AXIS_VECTOR);
                        break;
                    case 'k':
                        lightSource.global_rotation(ROTATION_ANGLE, X_AXIS_VECTOR);
                        break;
                    case 'o':
                        lightSource.global_rotation(-ROTATION_ANGLE, Y_AXIS_VECTOR);
                        break;
                    case 'u':
                        lightSource.global_rotation(ROTATION_ANGLE, Y_AXIS_VECTOR);
                        break;
                    case 'l':
                        lightSource.global_rotation(-ROTATION_ANGLE, Z_AXIS_VECTOR);
                        break;
                    case 'j':
                        lightSource.global_rotation(ROTATION_ANGLE, Z_AXIS_VECTOR);
                        break;
                    // Translation
                    case 'ArrowRight':
                        lightSource.translate([0.1, 0, 0, 0]);
                        break;
                    case 'ArrowLeft':
                        lightSource.translate([-0.1, 0, 0, 0]);
                        break;
                    case 'ArrowUp':
                        lightSource.translate([0, 0.1, 0, 0]);
                        break;
                    case 'ArrowDown':
                        lightSource.translate([0, -0.1, 0, 0]);
                        break;
                    case ',':
                        lightSource.translate([0, 0, 0.1, 0]);
                        break;
                    case '.':
                        lightSource.translate([0, 0, -0.1, 0]);
                        break;
                }
            }*/

            switch (event.key) {
                case 'ArrowRight':
                case 'd':
                    testCubes.translateTetrisShape([TRANSLATE_BY_CUBE_LENGTH, 0, 0]);
                    break;
                case 'ArrowLeft':
                case 'a':
                    testCubes.translateTetrisShape([-TRANSLATE_BY_CUBE_LENGTH, 0, 0]);
                    break;
                case 'ArrowUp':
                case 'w':
                    testCubes.translateTetrisShape([0, 0, -TRANSLATE_BY_CUBE_LENGTH]);
                    break;
                case 'ArrowDown':
                case 's':
                    testCubes.translateTetrisShape([0, 0, TRANSLATE_BY_CUBE_LENGTH]);
                    break;
                case 'x':
                    testCubes.rotateTetrisShape(TETRIS_SHAPE_ROTATION, X_AXIS_VECTOR);
                    break;
                case 'X':
                    testCubes.rotateTetrisShape(-TETRIS_SHAPE_ROTATION, X_AXIS_VECTOR);
                    break;
                case 'y':
                    testCubes.rotateTetrisShape(TETRIS_SHAPE_ROTATION, Y_AXIS_VECTOR);
                    break;
                case 'Y':
                    testCubes.rotateTetrisShape(-TETRIS_SHAPE_ROTATION, Y_AXIS_VECTOR);
                    break;
                case 'z':
                    testCubes.rotateTetrisShape(TETRIS_SHAPE_ROTATION, Z_AXIS_VECTOR);
                    break;
                case 'Z':
                    testCubes.rotateTetrisShape(-TETRIS_SHAPE_ROTATION, Z_AXIS_VECTOR);
                    break;
                case 'p':
                    console.log("these cubes mason, what do they mean?");
                    break;
                //Toggle shader selection phong/gouraud
                case 'f':
                    this.isPhongActivated = !this.isPhongActivated;
                    if (this.isPhongActivated) {
                        shaderPrograms.phongSpecular.enable();
                    }
                    else {
                        shaderPrograms.gouraudSpecular.enable();
                    }
                    break;
                // Toggle grid visibility
                case 'g':
                    isGridVisible = !isGridVisible;
                    break;
                //Camera controls
                case 'v':
                    camera.toggleOrthogonalProjectionSelected();
                    console.log("Projection matrix was changed...");
                    break;
                case 'j':
                    camera.rotateCamera(ROTATION_ANGLE, Y_AXIS_VECTOR);
                    break;
                case 'l':
                    camera.rotateCamera(-ROTATION_ANGLE, Y_AXIS_VECTOR);
                    break;
                case 'i':
                    camera.rotateCamera(ROTATION_ANGLE, X_AXIS_VECTOR);
                    break;
                case 'k':
                    camera.rotateCamera(-ROTATION_ANGLE, X_AXIS_VECTOR);
                    break;
                case 'u':
                    camera.rotateCamera(ROTATION_ANGLE, Z_AXIS_VECTOR);
                    break;
                case 'o':
                    camera.rotateCamera(-ROTATION_ANGLE, Z_AXIS_VECTOR);
                    break;
                case '+':
                    camera.zoomCamera([INCREASE_FACTOR, INCREASE_FACTOR, INCREASE_FACTOR]);
                    break;
                case '-':
                    camera.zoomCamera([DESCREASE_FACTOR, DESCREASE_FACTOR, DESCREASE_FACTOR]);
                    break;
            }
        })
    }

}
