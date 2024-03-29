const cubeLength = 0.2;
const WHITE_COLOUR_RGBA = [1.0, 1.0, 1.0, 1.0,];
const GRID_OFFSET = [-0.1,0.1,0.1];

let pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
let pointQ = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);
let pointR = glMatrix.vec4.fromValues(0.4, -1.2, -0.4, 1.0);
let pointS = glMatrix.vec4.fromValues(-0.4, 1.2, -0.4, 1.0);

let zValueOffset = glMatrix.vec4.fromValues(0.0, 0.0, cubeLength, 0);
let xValueOffset = glMatrix.vec4.fromValues(cubeLength, 0.0, 0.0, 0);
let yValueOffset = glMatrix.vec4.fromValues(0.0, cubeLength, 0.0, 0);

class ShapeCreator {

    constructor(cubeShape, cylinderShape){
        this.cubeShape = cubeShape;
        this.cylinderShape = cylinderShape;
        this.isCubeShapeSelected = true;
        this.currenShape = cubeShape;
    }

    createBoundingBoxGrid() {
        let vertices = [];

        //Base - add vertices for vertical lines 
        for (let i = 0; i < 5; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointQ[0], pointQ[1], pointQ[2], pointQ[3]]);
            glMatrix.vec4.add(pointP, pointP, xValueOffset);
            glMatrix.vec4.add(pointQ, pointQ, xValueOffset);
        }

        //Reset points to initial location
        this.resetPointsBoundingBoxGrid();

        //Base - add vertices for horizontal lines
        for (let i = 0; i < 5; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointR[0], pointR[1], pointR[2], pointR[3]]);
            glMatrix.vec4.add(pointP, pointP, zValueOffset);
            glMatrix.vec4.add(pointR, pointR, zValueOffset);
        }

        //Reset points to initial location
        this.resetPointsBoundingBoxGrid();

        //Left wall - add vertices for vertical lines
        for (let i = 0; i < 5; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointS[0], pointS[1], pointS[2], pointS[3]]);
            glMatrix.vec4.add(pointP, pointP, zValueOffset);
            glMatrix.vec4.add(pointS, pointS, zValueOffset);
        }

        //Reset points to initial location
        this.resetPointsBoundingBoxGrid();

        //Right wall - add vertices for vertical lines
        for (let i = 0; i < 5; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointS[0], pointS[1], pointS[2], pointS[3]]);
            glMatrix.vec4.add(pointP, pointP, xValueOffset);
            glMatrix.vec4.add(pointS, pointS, xValueOffset);
        }

        //Reset points to initial location
        this.resetPointsBoundingBoxGrid();

        //Add one cubeLength as offset, as the base has already the first line
        glMatrix.vec4.add(pointP, pointP, yValueOffset);
        glMatrix.vec4.add(pointQ, pointQ, yValueOffset);

        //Left wall - add vertices for vertical lines
        for (let i = 0; i < 12; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointQ[0], pointQ[1], pointQ[2], pointQ[3]]);
            glMatrix.vec4.add(pointP, pointP, yValueOffset);
            glMatrix.vec4.add(pointQ, pointQ, yValueOffset);
        }

        //Reset points to initial location
        this.resetPointsBoundingBoxGrid();

        //Add one cubeLength as offset, as the base has already the first line
        glMatrix.vec4.add(pointP, pointP, yValueOffset);
        glMatrix.vec4.add(pointR, pointR, yValueOffset);

        //Right wall - add vertices for horizontal lines
        for (let i = 0; i < 12; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointR[0], pointR[1], pointR[2], pointR[3]]);
            glMatrix.vec4.add(pointP, pointP, yValueOffset);
            glMatrix.vec4.add(pointR, pointR, yValueOffset);
        }

        //Reset points to initial location
        this.resetPointsBoundingBoxGrid();

        const colors = [];


        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const shape = new Shape();
        shape.initData(vertices, colors, null);
        return shape;
    }

    createWireGrid() {
        let vertices = [];


        // draw each horizontal layer
        for (let i = 0; i < 13; i++) {

            glMatrix.vec4.scale(yValueOffset, yValueOffset, i);

            glMatrix.vec4.add(pointP, pointP, yValueOffset);
            glMatrix.vec4.add(pointQ, pointQ, yValueOffset);

            for (let j = 0; j < 5; j++) {
                vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
                vertices.push([pointQ[0], pointQ[1], pointQ[2], pointQ[3]]);
                glMatrix.vec4.add(pointP, pointP, xValueOffset);
                glMatrix.vec4.add(pointQ, pointQ, xValueOffset);
            }

            //Reset points to initial location
            this.resetPointsBoundingBoxGrid();

            glMatrix.vec4.add(pointP, pointP, yValueOffset);
            glMatrix.vec4.add(pointR, pointR, yValueOffset);

            //Base - add vertices for horizontal lines
            for (let j = 0; j < 5; j++) {
                vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
                vertices.push([pointR[0], pointR[1], pointR[2], pointR[3]]);
                glMatrix.vec4.add(pointP, pointP, zValueOffset);
                glMatrix.vec4.add(pointR, pointR, zValueOffset);
            }

            //Reset points to initial location
            this.resetPointsBoundingBoxGrid();

            yValueOffset = glMatrix.vec4.fromValues(0.0, cubeLength, 0.0, 0);
        }

        // draw each vertical layer
        for(let i = 0; i < 5; i++){

            glMatrix.vec4.scale(zValueOffset, zValueOffset, i);

            glMatrix.vec4.add(pointP, pointP, zValueOffset);
            glMatrix.vec4.add(pointS, pointS, zValueOffset);

            for (let i = 0; i < 5; i++) {
                vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
                vertices.push([pointS[0], pointS[1], pointS[2], pointS[3]]);
                glMatrix.vec4.add(pointP, pointP, xValueOffset);
                glMatrix.vec4.add(pointS, pointS, xValueOffset);
            }

            //Reset points to initial location
            this.resetPointsBoundingBoxGrid();

            zValueOffset = glMatrix.vec4.fromValues(0.0, 0.0, cubeLength, 0);
        }

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const shape = new Shape();
        shape.initData(vertices, colors, null);
        return shape;
    }

    resetPointsBoundingBoxGrid() {
        pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        pointQ = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);
        pointR = glMatrix.vec4.fromValues(0.4, -1.2, -0.4, 1.0);
        pointS = glMatrix.vec4.fromValues(-0.4, 1.2, -0.4, 1.0);
    }

    

    createTetraCubeI(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([-1*cubeLength,0,0.0]);
        cubeList[1].global_translation([0.0,0,0.0]);
        cubeList[2].global_translation([1*cubeLength,0,0.0]);
        cubeList[3].global_translation([2*cubeLength,0,0.0]);

        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);

        return tetrisShape;
    }

    createTetraCubeO(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([0,0,0.0]);
        cubeList[1].global_translation([1*cubeLength,0,0.0]);
        cubeList[2].global_translation([0,1*cubeLength,0.0]);
        cubeList[3].global_translation([1*cubeLength,1*cubeLength,0.0]);


        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);
        
        return tetrisShape;
    }

    createTetraCubeL(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([0,0,0.0]);
        cubeList[1].global_translation([0,0,1*cubeLength]);
        cubeList[2].global_translation([0,1*cubeLength,0.0]);
        cubeList[3].global_translation([0,2*cubeLength,0.0]);

        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);
        
        return tetrisShape;
    }

    createTetraCubeT(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([0,0,0]);
        cubeList[1].global_translation([0,1*cubeLength,0]);
        cubeList[2].global_translation([0,1*cubeLength,1*cubeLength]);
        cubeList[3].global_translation([0,2*cubeLength,0.0]);


        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);
        
        return tetrisShape;
    }

    createTetraCubeN(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([0,0,0.0]);
        cubeList[1].global_translation([0,1*cubeLength,0]);
        cubeList[2].global_translation([-1*cubeLength,1*cubeLength,0]);
        cubeList[3].global_translation([-1*cubeLength,2*cubeLength,0.0]);

        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);
        
        return tetrisShape;
    }

    createTetraCubeTowerRight(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([0,0,0.0]);
        cubeList[1].global_translation([1*cubeLength,0,0]);
        cubeList[2].global_translation([1*cubeLength,0,-1*cubeLength]);
        cubeList[3].global_translation([1*cubeLength,1*cubeLength,-1*cubeLength]);

        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);
        
        return tetrisShape;
    }

    createTetraCubeTowerLeft(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([0,0,-1*cubeLength]);
        cubeList[1].global_translation([0,1*cubeLength,-1*cubeLength]);
        cubeList[2].global_translation([0,0,0]);
        cubeList[3].global_translation([1*cubeLength,0,0]);

        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);

        
        return tetrisShape;
    }

    createTetraCubeTripod(){
        let cubeList = [];
        this.initializeCubeList(cubeList);

        cubeList[0].global_translation([0,0,-1*cubeLength]);
        cubeList[1].global_translation([0,1*cubeLength,-1*cubeLength]);
        cubeList[2].global_translation([0,0,0]);
        cubeList[3].global_translation([1*cubeLength,0,-1*cubeLength]);

        let tetrisShape = new TetrisShape(cubeList);
        tetrisShape.translateTetrisShape([0,6*cubeLength,0])
        tetrisShape.translateTetrisShape(GRID_OFFSET);
        
        return tetrisShape;
    }

    /**
     * Each tetra cube consists out of 4 cubes
     */
    initializeCubeList(emptyCubeList){
        for(let i=0; i < 4; i++){
            emptyCubeList.push(this.currenShape.cloneObject());
        }
    }

    switchCurrentShape(){
        this.isCubeShapeSelected = !this.isCubeShapeSelected;
        if(this.isCubeShapeSelected){
            this.currenShape = this.cubeShape;
        }
        else{
            this.currenShape = this.cylinderShape;
        }
    }

    createTetraCubeSelection(){
        return [
            this.createTetraCubeI(),
            this.createTetraCubeL(),
            this.createTetraCubeN(),
            this.createTetraCubeO(),
            this.createTetraCubeT(),
            this.createTetraCubeTowerLeft(),
            this.createTetraCubeTowerRight(),
            this.createTetraCubeTripod()
        ];
    }
}