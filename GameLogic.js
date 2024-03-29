const GRID_BOTTOM_REFERENCE_POINT = glMatrix.vec3.fromValues(-0.4, -1.2, -0.4);
const GRID_CELL_SIZE = 0.2;
const HALF_CUBE_LENGTH = 0.1;
const CORRECTION_FACTOR = 0.0001;
const xOffset = glMatrix.vec3.fromValues(HALF_CUBE_LENGTH - CORRECTION_FACTOR, 0, 0);
const yOffset = glMatrix.vec3.fromValues(0, HALF_CUBE_LENGTH - CORRECTION_FACTOR, 0);
const zOffset = glMatrix.vec3.fromValues(0, 0, HALF_CUBE_LENGTH - CORRECTION_FACTOR);

class GameLogic {
    GRAVITY_CONSTANT = -0.004;

    constructor(tetraCubeSelection, textures) {
        this.tetraCubeSelection = tetraCubeSelection;

        this.collisionMap = new Map();
        this.initializeMap();

        this.currentTetraCubeIndex = -1;
        this.tetraCubes = [];
        this.gameIsRunning = true;
        this.gameOver = false;
        this.textures = textures;
    }

    generateKey(x, y, z) {
        return `(${x},${y},${z})`;
    }

    initializeMap() {
        for (let x = 0; x <= 4; x++) {
            for (let y = 0; y <= 12; y++) {
                for (let z = 0; z <= 4; z++) {
                    this.collisionMap.set(this.generateKey(x, y, z), false);
                }
            }
        }
    }

    getCurrentTetraCube() {
        return this.tetraCubes[this.currentTetraCubeIndex];
    }

    chooseNextCube() {
        let chosenTetraCube = this.tetraCubeSelection[Math.floor(Math.random() * this.tetraCubeSelection.length)];
        this.currentTetraCubeIndex++;
        this.tetraCubes.push(chosenTetraCube.cloneObject());
        if(this.currentTetraCubeIndex%5 == 0){
            this.getCurrentTetraCube().setTexture(this.getRandomTexture());
        }
        this.GRAVITY_CONSTANT = -0.004;
    }

    getRandomTexture(){
        return this.textures[Math.floor(Math.random() * this.textures.length)];
    }

    translateCurrentTetraCube(translationVector) {
        this.getCurrentTetraCube().translateTetrisShape(translationVector);
    }

    switchGameIsRunning() {
        this.gameIsRunning = !this.gameIsRunning;
    }

    executeGameplayCycle() {
        if (!this.gameIsRunning || this.gameOver) {
            return;
        }
        let gravityResults = this.preventGravityCollision();
        if (gravityResults.collisionOccured) {
            gravityResults.translateUpCorrection = gravityResults.translateUpCorrection + this.GRAVITY_CONSTANT;
            this.translateCurrentTetraCube([0, gravityResults.translateUpCorrection, 0]);
            this.registerTetrominoInCollisionMap(this.getCurrentTetraCube());
            let layerOrFailed = this.checkIfPlaneIsCovered();
            if (layerOrFailed != -1) {
                this.deleteAllCubesInLayer(layerOrFailed);
                for (let i = 0; i < 12; i++) {
                    layerOrFailed = this.checkIfPlaneIsCovered();
                    if (layerOrFailed != -1) {
                        this.deleteAllCubesInLayer(layerOrFailed);
                    }
                }
            }
            if(!this.gameOver){
                this.chooseNextCube();
            }
        } else {
            this.translateCurrentTetraCube([0, this.GRAVITY_CONSTANT, 0]);
        }
    }

    updateTetraCubeSelection() {
        this.tetraCubeSelection = shapeCreator.createTetraCubeSelection();
        let updatedTetraCubes = [];
        this.tetraCubes.forEach(tetraCube => {
            updatedTetraCubes.push(tetraCube.cloneObjectAfterSwitchingModel());
        });
        this.tetraCubes = updatedTetraCubes;
    }

    calculateCoordinateRelativeToReferencePoint(position) {
        const coordinateRelativeToReferencePoint = glMatrix.vec3.create();
        glMatrix.vec3.sub(coordinateRelativeToReferencePoint, position, GRID_BOTTOM_REFERENCE_POINT);
        return coordinateRelativeToReferencePoint;
    }

    /**
     * If we divide the relative position with the size of a grid cell (which is equal to cubeLength),
     * we can obtain the coordinates for the map
     */
    transformToGridCoordinates(relativePosition) {
        const gridCoordinatesNotRounded = glMatrix.vec3.create();
        glMatrix.vec3.scale(gridCoordinatesNotRounded, relativePosition, 1 / GRID_CELL_SIZE);
        return gridCoordinatesNotRounded.map(coordinateComponent => Math.floor(coordinateComponent));
    }

    retrieveRelativeAndGridCoordinates(position) {
        return {
            relativeCoordinate: this.calculateCoordinateRelativeToReferencePoint(position),
            gridCoordinate: this.transformToGridCoordinates(this.calculateCoordinateRelativeToReferencePoint(position))
        }
    }

    restartGame(){
        this.tetraCubes = [];
        this.collisionMap = new Map();
        this.initializeMap();
        this.currentTetraCubeIndex = -1;
        this.gameOver = false;
        this.chooseNextCube();
    }

    deleteAllCubesInLayer(layer) {
        for (let tetromino of this.tetraCubes) {
            let indicesToBeRemoved = [];
            for (let i = 0; i < tetromino.cubes.length; i++) {
                let gridCoordinate = this.retrieveRelativeAndGridCoordinates(tetromino.getCubePositionForIndex(i)).gridCoordinate;
                if (gridCoordinate[1] == layer) {
                    indicesToBeRemoved.push(i);
                    this.updateCollisionMapCoordinate(this.generateKey(gridCoordinate[0], gridCoordinate[1], gridCoordinate[2]), false);
                }
            }
            const indicesToBeFiltered = new Set(indicesToBeRemoved);
            const filteredArray = tetromino.cubes.filter((_, index) => !indicesToBeFiltered.has(index));
            tetromino.cubes = filteredArray;
        }
        this.translateAllCubesAfterLayerRemoval(layer);
    }

    translateAllCubesAfterLayerRemoval(layer) {
        for (let tetromino of this.tetraCubes) {
            let indicesToBeTranslated = [];
            for (let i = 0; i < tetromino.cubes.length; i++) {
                let gridCoordinate = this.retrieveRelativeAndGridCoordinates(tetromino.getCubePositionForIndex(i)).gridCoordinate;
                if (gridCoordinate[1] > layer) {
                    indicesToBeTranslated.push(i);
                    this.updateCollisionMapCoordinate(this.generateKey(gridCoordinate[0], gridCoordinate[1], gridCoordinate[2]), false);
                }
            }

            if(indicesToBeTranslated.length){
                tetromino.translateTetrisShape([0,-0.2,0])
            }

            for(let i = 0; i < tetromino.cubes.length; i++){
                let gridCoordinate = this.retrieveRelativeAndGridCoordinates(tetromino.getCubePositionForIndex(i)).gridCoordinate;
                this.updateCollisionMapCoordinate(this.generateKey(gridCoordinate[0], gridCoordinate[1], gridCoordinate[2]), true);
            }
        }
    }

    updateCollisionMapCoordinate(key, value) {
        this.collisionMap.set(key, value);
    }

    preventGravityCollision() {
        // If collision occured, translate tetris shape up by the amount of overlapping
        let translateUpCorrection = 0;
        let cubeCenterPositions = this.getCurrentTetraCube().getCubePositions();

        cubeCenterPositions.forEach(cubeCenterPosition => {
            //  translate cube center and get cube border coordinates
            let translatedCubeCenterPosition = glMatrix.vec3.create();
            glMatrix.vec3.add(translatedCubeCenterPosition, cubeCenterPosition, [0, this.GRAVITY_CONSTANT, 0]);
            let translatedCubeBorderCoordinates = this.getCubeBorderCoordinatesFromCenter(translatedCubeCenterPosition);

            let relativeAndGridCoordinates = [];

            translatedCubeBorderCoordinates.flat().forEach(borderCoordinate => {
                const result = this.retrieveRelativeAndGridCoordinates(borderCoordinate);
                relativeAndGridCoordinates.push(result);
            });

            // Base collision check
            relativeAndGridCoordinates.forEach(coordinate => {
                if (coordinate.gridCoordinate[1] < 0) {
                    let correctionResult = glMatrix.vec3.clone(coordinate.relativeCoordinate);
                    glMatrix.vec3.scale(correctionResult, correctionResult, -1);
                    translateUpCorrection = correctionResult;
                }
                //Check for collision with other tetrominos
                if (this.collisionMap.get(this.generateKey(coordinate.gridCoordinate[0], coordinate.gridCoordinate[1], coordinate.gridCoordinate[2]))) {
                    let gridCellBeforeCollsion = glMatrix.vec3.create();
                    let correctionResult = glMatrix.vec3.create();

                    glMatrix.vec3.add(gridCellBeforeCollsion, glMatrix.vec3.fromValues(1, 1, 1), coordinate.gridCoordinate);
                    glMatrix.vec3.scale(gridCellBeforeCollsion, gridCellBeforeCollsion, GRID_CELL_SIZE);
                    glMatrix.vec3.sub(correctionResult, gridCellBeforeCollsion, coordinate.relativeCoordinate);

                    translateUpCorrection = correctionResult;
                    if(coordinate.gridCoordinate[1] >= 12 && !this.gameOver){
                        this.gameOverScreen();
                    }
                }
            });
        });

        return {
            collisionOccured: (translateUpCorrection) ? true : false,
            translateUpCorrection: translateUpCorrection[1]
        }
    }

    gameOverScreen(){
        this.gameOver = true;
        restartButton.style.display = "inline-block";
        alert("Game over!");
    }

    getRelativeAndGridCoordsForBorderCoordinatesFromCubeCenter(cubeCenterCoordinates) {
        let relativeAndGridCoordinates = [];
        cubeCenterCoordinates.forEach(cubeCenterCoordinate => {
            this.getCubeBorderCoordinatesFromCenter(cubeCenterCoordinate).flat().forEach(borderCoordinate => {
                const result = this.retrieveRelativeAndGridCoordinates(borderCoordinate);
                relativeAndGridCoordinates.push(result);
            });
        });
        return relativeAndGridCoordinates;
    }

    updateGravity() {
        this.GRAVITY_CONSTANT = -0.09;
    }

    checkIfTransformationPossible(clonedTetromino) {
        let relativeAndGridCoordinates = this.getRelativeAndGridCoordsForBorderCoordinatesFromCubeCenter(clonedTetromino.getCubePositions());

        for (const coordinate of relativeAndGridCoordinates) {
            //Check if transformation causes collision with any tetromino
            if (this.collisionMap.get(this.generateKey(coordinate.gridCoordinate[0], coordinate.gridCoordinate[1], coordinate.gridCoordinate[2]))) {
                return false;
            }
            //Check if transformation would result in leaving the grid
            for (let i = 0; i < 3; i++) {
                if (coordinate.gridCoordinate[i] < 0) {
                    return false;
                }
            }
            //Check if transformation would result in leaving the grid
            if (coordinate.gridCoordinate[0] > 3 || coordinate.gridCoordinate[2] > 3) {
                return false;
            }
        }
        return true;
    }

    registerTetrominoInCollisionMap(tetromino) {
        const cubePositions = tetromino.getCubePositions();
        cubePositions.forEach(cubePosition => {
            let gridCoordinate = this.retrieveRelativeAndGridCoordinates(cubePosition).gridCoordinate;
            const key = this.generateKey(gridCoordinate[0], gridCoordinate[1], gridCoordinate[2]);
            this.collisionMap.set(key, true);
        })
    }

    checkIfPlaneIsCovered() {
        let mapEachLayer = Array.from({ length: 12 }, () => []);
        for (let y = 0; y < 12; y++) {
            for (let x = 0; x < 4; x++) {
                for (let z = 0; z < 4; z++) {
                    mapEachLayer[y].push(this.collisionMap.get(this.generateKey(x, y, z)))
                }
            }
        }

        for (let i = 0; i < 12; i++) {
            if (mapEachLayer[i].every(value => value === true)) {
                return i;
            }
        }

        return -1;
    }

    getCubeBorderCoordinatesFromCenter(cubeCenter) {
        return new Array([
            glMatrix.vec3.add(glMatrix.vec3.create(), cubeCenter, xOffset),
            glMatrix.vec3.sub(glMatrix.vec3.create(), cubeCenter, xOffset),
            glMatrix.vec3.add(glMatrix.vec3.create(), cubeCenter, yOffset),
            glMatrix.vec3.sub(glMatrix.vec3.create(), cubeCenter, yOffset),
            glMatrix.vec3.add(glMatrix.vec3.create(), cubeCenter, zOffset),
            glMatrix.vec3.sub(glMatrix.vec3.create(), cubeCenter, zOffset)
        ]);
    }



}