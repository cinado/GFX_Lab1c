const BOUNDING_BOX_Y = 2.4;
const BOUNDING_BOX_X = 0.8;
const BOUNDING_BOX_Z = 0.8;

class BoundingBox {
    boundingBox = [];
    cubeLength = 0.2;
    pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
    pointQ = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);
    pointR = glMatrix.vec4.fromValues(0.4, -1.2, -0.4, 1.0);
    pointS = glMatrix.vec4.fromValues(-0.4, 1.2, -0.4, 1.0);

    zValueOffset = glMatrix.vec4.fromValues(0.0, 0.0, this.cubeLength, 0);
    xValueOffset = glMatrix.vec4.fromValues(this.cubeLength, 0.0, 0.0, 0);
    yValueOffset = glMatrix.vec4.fromValues(0.0, this.cubeLength, 0.0, 0);

    createBoundingBox() {
        this.boundingBox.push(this.createBottomBoundingBox());
        this.boundingBox.push(this.createTopBoundingBox());
        this.boundingBox.push(this.createBackLeftBoundingBox());
        this.boundingBox.push(this.createBackRightBoundingBox());
        this.boundingBox.push(this.createFrontLeftBoundingBox());
        this.boundingBox.push(this.createFrontRightBoundingBox());
        return this.boundingBox;
    }

    createBottomVertices() {
        let vertices = [];

        //Base - add vertices for vertical lines 
        for (let i = 0; i < 5; i++) {
            vertices.push([this.pointP[0], this.pointP[1], this.pointP[2], this.pointP[3]]);
            vertices.push([this.pointQ[0], this.pointQ[1], this.pointQ[2], this.pointQ[3]]);
            glMatrix.vec4.add(this.pointP, this.pointP, xValueOffset);
            glMatrix.vec4.add(this.pointQ, this.pointQ, xValueOffset);
        }

        //Reset this.pointS to initial location
        this.resetPointsBoundingBoxGrid();

        //Base - add vertices for horizontal lines
        for (let i = 0; i < 5; i++) {
            vertices.push([this.pointP[0], this.pointP[1], this.pointP[2], this.pointP[3]]);
            vertices.push([this.pointR[0], this.pointR[1], this.pointR[2], this.pointR[3]]);
            glMatrix.vec4.add(this.pointP, this.pointP, zValueOffset);
            glMatrix.vec4.add(this.pointR, this.pointR, zValueOffset);
        }

        //Reset this.pointS to initial location
        this.resetPointsBoundingBoxGrid();

        return vertices;
    }

    createBackLeftVertices() {
        let vertices = [];

        //Left wall - add vertices for vertical lines
        for (let i = 0; i < 5; i++) {
            vertices.push([this.pointP[0], this.pointP[1], this.pointP[2], this.pointP[3]]);
            vertices.push([this.pointS[0], this.pointS[1], this.pointS[2], this.pointS[3]]);
            glMatrix.vec4.add(this.pointP, this.pointP, zValueOffset);
            glMatrix.vec4.add(this.pointS, this.pointS, zValueOffset);
        }

        //Reset this.pointS to initial location
        this.resetPointsBoundingBoxGrid();

        //Left wall - add vertices for horizontal lines
        for (let i = 0; i < 13; i++) {
            vertices.push([this.pointP[0], this.pointP[1], this.pointP[2], this.pointP[3]]);
            vertices.push([this.pointQ[0], this.pointQ[1], this.pointQ[2], this.pointQ[3]]);
            glMatrix.vec4.add(this.pointP, this.pointP, yValueOffset);
            glMatrix.vec4.add(this.pointQ, this.pointQ, yValueOffset);
        }

        //Reset this.pointS to initial location
        this.resetPointsBoundingBoxGrid();

        return vertices;
    }

    createBackRightVertices() {
        let vertices = [];

        //Right wall - add vertices for vertical lines
        for (let i = 0; i < 5; i++) {
            vertices.push([this.pointP[0], this.pointP[1], this.pointP[2], this.pointP[3]]);
            vertices.push([this.pointS[0], this.pointS[1], this.pointS[2], this.pointS[3]]);
            glMatrix.vec4.add(this.pointP, this.pointP, xValueOffset);
            glMatrix.vec4.add(this.pointS, this.pointS, xValueOffset);
        }

        //Reset this.pointS to initial location
        this.resetPointsBoundingBoxGrid();

        //Right wall - add vertices for horizontal lines
        for (let i = 0; i < 13; i++) {
            vertices.push([this.pointP[0], this.pointP[1], this.pointP[2], this.pointP[3]]);
            vertices.push([this.pointR[0], this.pointR[1], this.pointR[2], this.pointR[3]]);
            glMatrix.vec4.add(this.pointP, this.pointP, yValueOffset);
            glMatrix.vec4.add(this.pointR, this.pointR, yValueOffset);
        }

        //Reset this.pointS to initial location
        this.resetPointsBoundingBoxGrid();

        return vertices;
    }

    createBottomBoundingBox() {
        let vertices = this.createBottomVertices();

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const normal = [0,-1,0];

        const shape = new Shape();
        shape.initData(vertices, colors, normal);
        return shape;
    }

    createTopBoundingBox() {
        let vertices = this.createBottomVertices();
        // Transform to top
        vertices.map(vertex => vertex[1] += BOUNDING_BOX_Y);

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const normal = [0,1,0];

        const shape = new Shape();
        shape.initData(vertices, colors, normal);
        return shape;
    }

    createBackLeftBoundingBox() {
        let vertices = this.createBackLeftVertices();

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const normal = [-1,0,0];

        const shape = new Shape();
        shape.initData(vertices, colors, normal);
        return shape;
    }

    createBackRightBoundingBox() {
        let vertices = this.createBackRightVertices();

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const normal = [0,0,-1];

        const shape = new Shape();
        shape.initData(vertices, colors, normal);
        return shape;
    }

    createFrontLeftBoundingBox() {
        let vertices = this.createBackRightVertices();
        // Transform to top
        vertices.map(vertex => vertex[2] += BOUNDING_BOX_Z);

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const normal = [0,0,1];

        const shape = new Shape();
        shape.initData(vertices, colors, normal);
        return shape;
    }

    createFrontRightBoundingBox() {
        let vertices = this.createBackLeftVertices();
        // Transform to top
        vertices.map(vertex => vertex[0] += BOUNDING_BOX_X);

        const colors = [];

        vertices.forEach(() => {
            colors.push(WHITE_COLOUR_RGBA);
        });

        const normal = [1,0,0];

        const shape = new Shape();
        shape.initData(vertices, colors, normal);
        return shape;
    }

    resetPointsBoundingBoxGrid() {
        this.pointP = glMatrix.vec4.fromValues(-0.4, -1.2, -0.4, 1.0);
        this.pointQ = glMatrix.vec4.fromValues(-0.4, -1.2, 0.4, 1.0);
        this.pointR = glMatrix.vec4.fromValues(0.4, -1.2, -0.4, 1.0);
        this.pointS = glMatrix.vec4.fromValues(-0.4, 1.2, -0.4, 1.0);
    }
}