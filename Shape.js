class Shape {

    constructor() {
        this.vertices = [];
        this.colors = [];
        this.normals = [];
        this.textures = [];

        /* Optional index array for drawing shapes with indices */
        this.indexArray = null;

        this.buffers = {
            /* --------- initialize buffers --------- */
            vertexBuffer: gl.createBuffer(),
            colorBuffer: gl.createBuffer(),
            normalBuffer: gl.createBuffer(),
            indexBuffer: gl.createBuffer(),
            textureBuffer: gl.createBuffer(),
        }

        // initialize transformation and normal matrix
        this.transformationMatrix = mat4.create();
        this.normalMatrix = mat3.create();
    }

    initData(vertices, colors, normals, indexArray = null, textureVertices = null) {
        /* --------- flatten & convert data to 32 bit float arrays --------- */

        console.log(vertices);
        this.vertices = new Float32Array((vertices.constructor === Float32Array) ? vertices : vertices.flat());
        this.colors = new Float32Array((colors.constructor === Float32Array) ? colors : colors.flat());

        console.log(this.vertices);

        /* --------- send data to buffers --------- */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        if (normals !== null) {
            this.normals = new Float32Array((normals.constructor === Float32Array) ? normals : normals.flat());
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
        }

        if (indexArray !== null) {
            this.indexArray = new Uint16Array(indexArray);
            console.log(this.indexArray);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);
        }

        if(textureVertices !== null){
            this.textures = new Float32Array((textureVertices.constructor === Float32Array) ? textureVertices : textureVertices.flat());

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.textures, gl.STATIC_DRAW);
        }
    }

    draw(combinedTetrisShapeMatrix) {
        // set up attribute arrays
        Shape.setupAttribute(this.buffers.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, currentShaderProgram.attributes.colorLocation);
        Shape.setupAttribute(this.buffers.normalBuffer, currentShaderProgram.attributes.normalLocation, true);

        if(this.textures !== null){
            Shape.setupTextures(this.buffers.textureBuffer, currentShaderProgram.attributes.textureLocation);
        }

        /* --------- combine view and model matrix into modelView matrix --------- */

        const modelViewMatrix = mat4.create();
        //mat4.mul(modelViewMatrix, matrices.viewMatrix, this.transformationMatrix);

        let intermediateMatrix = mat4.create();
        mat4.mul(intermediateMatrix, combinedTetrisShapeMatrix, this.transformationMatrix);
        mat4.mul(modelViewMatrix, matrices.viewMatrix, intermediateMatrix);

        // construct normal matrix as inverse transpose of modelView matrix
        mat3.normalFromMat4(this.normalMatrix, modelViewMatrix);

        // send modelView and normal matrix to GPU
        gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, gl.FALSE, modelViewMatrix);
        gl.uniformMatrix3fv(currentShaderProgram.uniforms.normalMatrix, gl.FALSE, this.normalMatrix);


        if (this.indexArray === null) {
            /* --------- draw the shape --------- */
            //gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
        }
        else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.indexArray.length, gl.UNSIGNED_SHORT, 0);
        }

    }

    drawLines() {
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.buffers.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, currentShaderProgram.attributes.colorLocation);

        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, matrices.viewMatrix, this.transformationMatrix);

        /* --------- send modelView matrix to GPU --------- */
        gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, gl.FALSE, modelViewMatrix);

        /* --------- draw the shape --------- */
        gl.drawArrays(gl.LINES, 0, this.vertices.length);
    }

    drawLinesIfVisible() {
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.buffers.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, currentShaderProgram.attributes.colorLocation);

        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, matrices.viewMatrix, this.transformationMatrix);

        mat3.normalFromMat4(this.normalMatrix, modelViewMatrix);
        // maybe not necessary
        gl.uniformMatrix3fv(currentShaderProgram.uniforms.normalMatrix, gl.FALSE, this.normalMatrix);

        /* --------- send modelView matrix to GPU --------- */
        gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, gl.FALSE, modelViewMatrix);

        /* --- Check if visible ---- */

        let viewDirection = glMatrix.vec3.create();
        glMatrix.vec3.transformMat4(viewDirection, viewDirection, matrices.viewMatrix);

        let transformedNormal = glMatrix.vec3.create();
        glMatrix.vec3.transformMat3(transformedNormal, glMatrix.vec3.fromValues(this.normals[0], this.normals[1], this.normals[2]), this.normalMatrix);
        
        if(Math.sign(glMatrix.vec3.dot(viewDirection, transformedNormal)) == -1){
            return;
        }


        /* --------- draw the shape --------- */
        gl.drawArrays(gl.LINES, 0, this.vertices.length);
    }

    rotate(angle, axis) {
        /**
         * The transformation functions that glMatrix provides apply the new transformation as the right hand operand,
         * which means the new transformation will be the first one to be applied (this will result in a local transformation)
         *
         * The function call below would look like this if you write down the matrices directly:
         * transformationMatrix * rotationMatrix
         * 
         */
        mat4.rotate(this.transformationMatrix, this.transformationMatrix, angle, axis);

        /**
         * To get global transformations, you need to apply the new transformation after all the other transformations, i.e. as the left-most operand:
         * rotationMatrix * transformationMatrix
         * 
         * You can do this manually by construction the transformation matrix and then using mat4.multiply(out, leftOperand, rightOperand).
         * Uncomment the code below (and comment out the code above) to do global rotations instead of local ones.
         * 
         */
        /*
            const rotationMatrix = mat4.create();
            mat4.rotate(rotationMatrix, rotationMatrix, angle, axes);
            mat4.mul(this.transformationMatrix, rotationMatrix, this.transformationMatrix)
        */
    }

    global_rotation(angle, axis) {
        const rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
        mat4.mul(this.transformationMatrix, rotationMatrix, this.transformationMatrix)
    }

    scale(vector) {
        mat4.scale(this.transformationMatrix, this.transformationMatrix, vector);
    }

    global_scaling(vector) {
        const scalingMatrix = mat4.create();
        mat4.scale(scalingMatrix, scalingMatrix, vector);
        mat4.mul(this.transformationMatrix, scalingMatrix, this.transformationMatrix)
    }

    translate(vector) {
        mat4.translate(this.transformationMatrix, this.transformationMatrix, vector);
    }

    global_translation(vector) {
        const translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, vector);
        mat4.mul(this.transformationMatrix, translationMatrix, this.transformationMatrix);
    }

    cloneObject(){
        let clonedShape = new Shape();
        clonedShape.initData(this.vertices, this.colors, this.normals, this.indexArray, this.textures);
        mat4.copy(clonedShape.transformationMatrix, this.transformationMatrix);
        return clonedShape;
    }

    getCubeCenterPosition(combinedTetrisShapeMatrix){
        let intermediateMatrix = mat4.create();
        mat4.mul(intermediateMatrix, combinedTetrisShapeMatrix, this.transformationMatrix);

        const cubeCenterPosition = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(cubeCenterPosition, glMatrix.vec4.fromValues(0,0,0,1), intermediateMatrix);
        return glMatrix.vec3.fromValues(cubeCenterPosition[0], cubeCenterPosition[1], cubeCenterPosition[2]);
    }

    static setupAttribute(buffer, location, isNormal = false) {

        if (location === -1 || location === undefined) { return; }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            isNormal ? 3 : 4, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            (isNormal ? 3 : 4) * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }

    static setupTextures(buffer, location) {

        if (location === -1 || location === undefined) { return; }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            2, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            0, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }
}
