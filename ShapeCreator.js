const cubeLength = 0.2;
const WHITE_COLOUR_RGBA = [1.0, 1.0, 1.0, 1.0,];

let pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
let pointQ = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);
let pointR = glMatrix.vec4.fromValues(0.4, -1.2, -0.4, 1.0);
let pointS = glMatrix.vec4.fromValues(-0.4, 1.2, -0.4, 1.0);

const zValueOffset = glMatrix.vec4.fromValues(0.0, 0.0, cubeLength, 0);
const xValueOffset = glMatrix.vec4.fromValues(cubeLength, 0.0, 0.0, 0);
const yValueOffset = glMatrix.vec4.fromValues(0.0, cubeLength, 0.0, 0);

class ShapeCreator {


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
        pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        pointQ = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);

        //Base - add vertices for horizontal lines
        for (let i = 0; i < 5; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointR[0], pointR[1], pointR[2], pointR[3]]);
            glMatrix.vec4.add(pointP, pointP, zValueOffset);
            glMatrix.vec4.add(pointR, pointR, zValueOffset);
        }

        //Reset points to initial location
        pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        pointR = glMatrix.vec4.fromValues(0.4, -1.2, -0.4, 1.0);

        //Left wall - add vertices for vertical lines
        for (let i = 0; i < 5; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointS[0], pointS[1], pointS[2], pointS[3]]);
            glMatrix.vec4.add(pointP, pointP, zValueOffset);
            glMatrix.vec4.add(pointS, pointS, zValueOffset);
        }

        //Reset points to initial location
        pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        pointS = glMatrix.vec4.fromValues(-0.4, 1.2, -0.4, 1.0);

        //Right wall - add vertices for vertical lines
        for (let i = 0; i < 5; i++) {
            vertices.push([pointP[0], pointP[1], pointP[2], pointP[3]]);
            vertices.push([pointS[0], pointS[1], pointS[2], pointS[3]]);
            glMatrix.vec4.add(pointP, pointP, xValueOffset);
            glMatrix.vec4.add(pointS, pointS, xValueOffset);
        }

        //Reset points to initial location
        pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        pointS = glMatrix.vec4.fromValues(-0.4, 1.2, -0.4, 1.0);

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
        pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        pointQ = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);

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
        pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        pointR = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);

        const colors = [];
        /*vertices = vertices.map(a => [...a]).flat();*/

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const shape = new Shape();
        shape.initData(vertices, colors, null);
        return shape;
    }

    createWireGrid() {
        

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const shape = new Shape();
        shape.initData(vertices, colors, null);
        return shape;
    }
}