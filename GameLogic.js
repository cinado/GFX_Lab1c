const GRAVITY_CONSTANT = -0.002;
const GRID_BOTTOM_REFERENCE_POINT = glMatrix.vec3.fromValues(-0.4, -1.2, -0.4);
const GRID_CELL_SIZE = 0.2;
const HALF_CUBE_LENGTH = 0.1;
const xOffset = glMatrix.vec3.fromValues(HALF_CUBE_LENGTH, 0, 0);
const yOffset = glMatrix.vec3.fromValues(0, HALF_CUBE_LENGTH, 0);
const zOffset = glMatrix.vec3.fromValues(0, 0, HALF_CUBE_LENGTH);

class GameLogic {
    constructor(tetraCubeSelection) {
        this.tetraCubeSelection = tetraCubeSelection;

        this.collisionMap = new Map();
        this.initializeMap();

        this.currentTetraCubeIndex = -1;
        this.tetraCubes = [];
        this.gameIsRunning = true;
    }

    generateKey(x, y, z) {
        return `(${x},${y},${z})`;
    }

    initializeMap() {
        for (let x = 0; x <= 3; x++) {
            for (let y = 0; y <= 11; y++) {
                for (let z = 0; z <= 3; z++) {
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
    }

    translateCurrentTetraCube(translationVector) {
        this.getCurrentTetraCube().translateTetrisShape(translationVector);
    }

    switchGameIsRunning() {
        this.gameIsRunning = !this.gameIsRunning;
    }

    executeGameplayCycle() {
        if (!this.gameIsRunning) {
            return;
        }
        let gravityResults = this.preventGravityCollision();
        if (gravityResults.collisionOccured) {
            this.translateCurrentTetraCube([0, gravityResults.translateUpCorrection, 0]);

        } else {
            this.translateCurrentTetraCube([0, GRAVITY_CONSTANT, 0]);
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

    preventGravityCollision() {
        // If collision occured, translate tetris shape up by the amount of overlapping
        let translateUpCorrection = 0;
        let cubeCenterPositions = this.getCurrentTetraCube().getCubePositions();

        cubeCenterPositions.forEach(cubeCenterPosition => {
            //  translate cube center and get cube border coordinates
            let translatedCubeCenterPosition = glMatrix.vec3.create();
            glMatrix.vec3.add(translatedCubeCenterPosition, cubeCenterPosition, [0, GRAVITY_CONSTANT, 0]);
            let translatedCubeBorderCoordinates = this.getCubeBorderCoordinatesFromCenter(translatedCubeCenterPosition);

            // translate cube border coordinates to grid coordinates
            /*let relativeAndGridCoordinates = translatedCubeBorderCoordinates.forEach(borderCoordinate => {
                //borderCoordinate.map(coordinate => this.retrieveRelativeAndGridCoordinates(coor))
                this.rec
            });*/

            let relativeAndGridCoordinates = [];

            translatedCubeBorderCoordinates.flat().forEach(borderCoordinate => {
                const result = this.retrieveRelativeAndGridCoordinates(borderCoordinate);
                relativeAndGridCoordinates.push(result);
            });


            //translatedCubeBorderCoordinates.map(borderCoordinate => this.retrieveRelativeAndGridCoordinates(borderCoordinate));

            /**
             * If a tetris cube gets translated over a grid cell boundary then we need to translate it back by that amount
             */

            relativeAndGridCoordinates.forEach(coordinate => {
                if (coordinate.gridCoordinate[1] < 0) {
                    translateUpCorrection = coordinate.relativeCoordinate;
                }
            });

        });

        return {
            collisionOccured: (translateUpCorrection) ? true : false,
            translateUpCorrection: Math.abs(translateUpCorrection[1])
        }
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