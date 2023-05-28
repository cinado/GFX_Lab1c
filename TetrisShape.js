class TetrisShape {
    constructor(listOfCubes) {
        this.cubes = listOfCubes;
        this.tetrisShapeRotationMatrix = mat4.create();
        this.tetrisShapeTranslationMatrix = mat4.create();
        this.combinedTetrisShapeMatrix = mat4.create()
    }

    removeLayerAndTranslateByOne(yValue) {
        /*
        Should look like this

        let cubesToBeRemoved = this.cubes.filter(function(cube){
            return cube.getYPosition == yValue;
        });*/

        /*if(cubesToBeRemoved){
            this.cubes = this.cubes.filter(cube => !cubesToBeRemoved.include(cube));
            //Translate all cubes in list by one down
        }*/
    }

    // Should be called when removing a layer
    translateDownByOne() {
        /*this.cubes.forEach(cube => {
            cube.translate(0,-1,0);
        });*/
        const translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, [0, -1, 0]);
        mat4.mul(this.tetrisShapeTranslationMatrix, translationMatrix, this.tetrisShapeTranslationMatrix);
    }

    translateTetrisShape(translationVector) {
        const translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, translationVector);
        mat4.mul(this.tetrisShapeTranslationMatrix, translationMatrix, this.tetrisShapeTranslationMatrix);
    }

    rotateTetrisShape(angle, axis) {
        const rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
        mat4.mul(this.tetrisShapeRotationMatrix, rotationMatrix, this.tetrisShapeRotationMatrix);
    }

    draw() {
        mat4.mul(this.combinedTetrisShapeMatrix, this.tetrisShapeTranslationMatrix, this.tetrisShapeRotationMatrix);
        this.cubes.forEach(cube => {
            cube.draw(this.combinedTetrisShapeMatrix);
        })
    }

    cloneMatrices(clonedTetrisShape) {
        clonedTetrisShape.tetrisShapeRotationMatrix = mat4.clone(this.tetrisShapeRotationMatrix);
        clonedTetrisShape.tetrisShapeTranslationMatrix = mat4.clone(this.tetrisShapeTranslationMatrix);
        clonedTetrisShape.combinedTetrisShapeMatrix = mat4.clone(this.combinedTetrisShapeMatrix);
    }

    getCubePositions(){
        let cubePositions = [];
        this.cubes.forEach(cube => {
            //cubePositions.push(cube.getCubeCenterPosition(this.combinedTetrisShapeMatrix));
            cubePositions.push(cube.getCubeCenterPosition(mat4.mul(mat4.create(), this.tetrisShapeTranslationMatrix, this.tetrisShapeRotationMatrix)));
        })
        return cubePositions;
    }

    getCubePositionForIndex(index){
        return this.cubes[index].getCubeCenterPosition(mat4.mul(mat4.create(), this.tetrisShapeTranslationMatrix, this.tetrisShapeRotationMatrix));
    }

    cloneObject() {
        let clonedCubeList = [];
        this.cubes.forEach(cube => {
            clonedCubeList.push(cube.cloneObject());
        });

        let clonedTetrisShape = new TetrisShape(clonedCubeList);
        this.cloneMatrices(clonedTetrisShape);

        return clonedTetrisShape;
    }

    cloneObjectAfterSwitchingModel() {
        let clonedTetrisShape = this.cloneObject();
        let newCubesList = [];
        shapeCreator.initializeCubeList(newCubesList);
        clonedTetrisShape.cubes.forEach((cube, index) => {
            mat4.copy(newCubesList[index].transformationMatrix, cube.transformationMatrix);
        });

        clonedTetrisShape.cubes = newCubesList;
        return clonedTetrisShape;
    }

}