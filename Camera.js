class Camera {
    constructor(aspectRatio) {
        this.aspectRatio = aspectRatio;
        this.orthogonalProjectionSelected = true;
        this.orthogonalProjectionMatrix = glMatrix.mat4.create();
        this.perspectiveProjectionMatrix = glMatrix.mat4.create();
        this.cameraPosition = glMatrix.vec3.fromValues(8, 13, 8);
        //this.cameraPosition = glMatrix.vec3.fromValues(0.0, -0.5, -8);
        this.transformationMatrix = mat4.create();
        //this.translationMatrix = mat4.create();

        mat4.ortho(this.orthogonalProjectionMatrix, -this.aspectRatio * 1.3, this.aspectRatio * 1.3, -1 * 1.3, 1 * 1.3, 0.1, 100);
        mat4.perspective(this.perspectiveProjectionMatrix, toRad(45), aspectRatio, 0.1, 100);
        mat4.lookAt(matrices.viewMatrix, this.cameraPosition, [0, 0, 0], [0, 1, 0]);

        ///mat4.translate(this.translationMatrix, this.translationMatrix, this.cameraPosition);
        //mat4.mul(matrices.viewMatrix, matrices.viewMatrix, this.translationMatrix);

        //default orthogonalProjectionMatrix
        matrices.projectionMatrix = this.orthogonalProjectionMatrix;
        //this.rotateCamera(-toRad(25), [0,1,0]);
    }

    toggleOrthogonalProjectionSelected() {
        this.orthogonalProjectionSelected = !this.orthogonalProjectionSelected;
        this.setSelectedProjectionMatrix();

        gl.uniformMatrix4fv(currentShaderProgram.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
    }

    setSelectedProjectionMatrix() {
        if (this.orthogonalProjectionSelected) {
            matrices.projectionMatrix = this.orthogonalProjectionMatrix;
            this.zoomCamera([1/4,1/4,1/4]);
        }
        else {
            matrices.projectionMatrix = this.perspectiveProjectionMatrix;
            this.zoomCamera([4,4,4]);
        }
    }

    rotateCamera(angle, axis) {
        const rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
        mat4.mul(this.transformationMatrix, rotationMatrix, this.transformationMatrix)
        mat4.mul(matrices.viewMatrix, matrices.viewMatrix, this.transformationMatrix);
        this.transformationMatrix = mat4.create();
    }

    /*rotateCamera(angle, axis) {
        const rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
        mat4.mul(this.transformationMatrix, rotationMatrix, this.transformationMatrix);
        glMatrix.vec3.transformMat4(this.cameraPosition, this.cameraPosition, this.transformationMatrix);
        mat4.lookAt(matrices.viewMatrix, this.cameraPosition, [0, 0, 0], [0, 1, 0]);
    }*/

    /*rotateCamera(angle, axis) {
        mat4.rotate(matrices.viewMatrix, matrices.viewMatrix, angle, axis);

    }*/

    /*zoomCamera(scalingVector){
        const scalingMatrix = mat4.create();
        mat4.scale(scalingMatrix, scalingMatrix, scalingVector);
        mat4.mul(this.transformationMatrix, scalingMatrix, this.transformationMatrix);
        mat4.mul(matrices.viewMatrix, matrices.viewMatrix, this.transformationMatrix);
        this.transformationMatrix = mat4.create();
    }*/

    zoomCamera(scalingVector){
        mat4.scale(matrices.viewMatrix, matrices.viewMatrix, scalingVector);
    }
}