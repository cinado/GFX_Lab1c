class Shape {

    constructor() {
        this.vertices = [];
        this.colors = [];
        this.coordinateSystem = null;

        /* Optional index array for drawing shapes with indices */
        this.indexArray = null;

        this.buffers = {
            /* --------- initialize buffers --------- */
            vertexBuffer: gl.createBuffer(),
            colorBuffer: gl.createBuffer(),
            indexBuffer: gl.createBuffer(),
        }

        /* --------- initialize transformation matrix --------- */
        this.transformationMatrix = mat4.create();
    }

    initData(vertices, colors, indexArray = null) {
        /* --------- flatten & convert data to 32 bit float arrays --------- */

        console.log(vertices);
        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());

        console.log(this.vertices);

        /* --------- send data to buffers --------- */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        if (indexArray !== null) {
            this.indexArray = new Uint16Array(indexArray);
            console.log(this.indexArray);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);
        }
    }

    draw() {
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.buffers.vertexBuffer, locations.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, locations.attributes.colorLocation);

        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        //mat4.mul(modelViewMatrix, viewMatrix, this.scalingMatrix);

        mat4.mul(modelViewMatrix, viewMatrix, this.transformationMatrix);


        /* --------- send modelView matrix to GPU --------- */
        gl.uniformMatrix4fv(locations.uniforms.modelViewMatrix, gl.FALSE, modelViewMatrix);


        if (this.indexArray === null) {
            /* --------- draw the shape --------- */
            gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
        }
        else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.indexArray.length, gl.UNSIGNED_SHORT, 0);
        }

        if (this.coordinateSystem !== null) {
            this.coordinateSystem.transformationMatrix = this.transformationMatrix;
            this.coordinateSystem.drawLine();
        }
    }

    drawLine() {
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.buffers.vertexBuffer, locations.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, locations.attributes.colorLocation);

        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, viewMatrix, this.transformationMatrix);

        /* --------- send modelView matrix to GPU --------- */
        gl.uniformMatrix4fv(locations.uniforms.modelViewMatrix, gl.FALSE, modelViewMatrix);

        /* --------- draw the shape --------- */
        gl.drawArrays(gl.LINES, 0, 6);
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

    static setupAttribute(buffer, location) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            4, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            4 * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }
}
