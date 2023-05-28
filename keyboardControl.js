const DESCREASE_FACTOR = 0.9;
const INCREASE_FACTOR = 1.1;

const TRANSLATE_BY_CUBE_LENGTH = 0.2;

const X_AXIS_VECTOR = [1, 0, 0];
const Y_AXIS_VECTOR = [0, 1, 0];
const Z_AXIS_VECTOR = [0, 0, 1];
const ROTATION_ANGLE = toRad(3);
const TETRIS_SHAPE_ROTATION = toRad(90);

let currentTetromino = null;

class KeyboardControl {
    constructor(window) {
        this.window = window;
        this.isPhongActivated = true;

        this.window.addEventListener("keydown", (event) => {
            /* ----- this event contains all the information you will need to process user interaction ---- */

            currentTetromino = gameLogic.getCurrentTetraCube();

            switch (event.key) {
                case 'ArrowRight':
                case 'd':
                    if (checkTranslationForTetromino([TRANSLATE_BY_CUBE_LENGTH, 0, 0])) {
                        currentTetromino.translateTetrisShape([TRANSLATE_BY_CUBE_LENGTH, 0, 0]);
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (checkTranslationForTetromino([-TRANSLATE_BY_CUBE_LENGTH, 0, 0])) {
                        gameLogic.getCurrentTetraCube().translateTetrisShape([-TRANSLATE_BY_CUBE_LENGTH, 0, 0]);
                    }
                    break;
                case 'ArrowUp':
                case 'w':
                    if (checkTranslationForTetromino([0, 0, -TRANSLATE_BY_CUBE_LENGTH])) {
                        gameLogic.getCurrentTetraCube().translateTetrisShape([0, 0, -TRANSLATE_BY_CUBE_LENGTH]);
                    }
                    break;
                case 'ArrowDown':
                case 's':
                    if (checkTranslationForTetromino([0, 0, TRANSLATE_BY_CUBE_LENGTH])) {
                        gameLogic.getCurrentTetraCube().translateTetrisShape([0, 0, TRANSLATE_BY_CUBE_LENGTH]);
                    }
                    break;
                case 'x':
                    if (checkRotationForTetromino(TETRIS_SHAPE_ROTATION, X_AXIS_VECTOR)) {
                        gameLogic.getCurrentTetraCube().rotateTetrisShape(TETRIS_SHAPE_ROTATION, X_AXIS_VECTOR);
                    }
                    break;
                case 'X':
                    if (checkRotationForTetromino(-TETRIS_SHAPE_ROTATION, X_AXIS_VECTOR)) {
                        gameLogic.getCurrentTetraCube().rotateTetrisShape(-TETRIS_SHAPE_ROTATION, X_AXIS_VECTOR);
                    }
                    break;
                case 'y':
                    if (checkRotationForTetromino(TETRIS_SHAPE_ROTATION, Y_AXIS_VECTOR)) {
                        gameLogic.getCurrentTetraCube().rotateTetrisShape(TETRIS_SHAPE_ROTATION, Y_AXIS_VECTOR);
                    }
                    break;
                case 'Y':
                    if (checkRotationForTetromino(-TETRIS_SHAPE_ROTATION, Y_AXIS_VECTOR)) {
                        gameLogic.getCurrentTetraCube().rotateTetrisShape(-TETRIS_SHAPE_ROTATION, Y_AXIS_VECTOR);
                    }
                    break;
                case 'z':
                    if (checkRotationForTetromino(TETRIS_SHAPE_ROTATION, Z_AXIS_VECTOR)) {
                        gameLogic.getCurrentTetraCube().rotateTetrisShape(TETRIS_SHAPE_ROTATION, Z_AXIS_VECTOR);
                    }
                    break;
                case 'Z':
                    if (checkRotationForTetromino(-TETRIS_SHAPE_ROTATION, Z_AXIS_VECTOR)) {
                        gameLogic.getCurrentTetraCube().rotateTetrisShape(-TETRIS_SHAPE_ROTATION, Z_AXIS_VECTOR);
                    }
                    break;
                case 'p':
                    gameLogic.switchGameIsRunning();
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
                case 'b':
                    shapeCreator.switchCurrentShape();
                    gameLogic.updateTetraCubeSelection();
                    break;
            }
        })
    }

}

function checkTranslationForTetromino(translationVector) {
    let clonedTetromino = currentTetromino.cloneObject();
    clonedTetromino.translateTetrisShape(translationVector);
    return gameLogic.checkIfTransformationPossible(clonedTetromino);
}

function checkRotationForTetromino(rotationAngle, axis) {
    let clonedTetromino = currentTetromino.cloneObject();
    clonedTetromino.rotateTetrisShape(rotationAngle, axis);
    return gameLogic.checkIfTransformationPossible(clonedTetromino);
}
