class Camera {
    constructor(aspectRatio) {
        this.aspectRatio = aspectRatio;
        this.orthogonalProjectionSelected = true;
        this.orthogonalProjectionMatrix = glMatrix.mat4.create();
        this.perspectiveProjectionMatrix = glMatrix.mat4.create();
        this.cameraPosition = glMatrix.vec3.fromValues(2, 1, 3);
        //this.transformationMatrix = mat4.create();
        //this.rotationMatrix = mat4.create();

        mat4.ortho(this.orthogonalProjectionMatrix, -this.aspectRatio * 1.3, this.aspectRatio * 1.3, -1 * 1.3, 1 * 1.3, 0.1, 100);
        mat4.perspective(this.perspectiveProjectionMatrix, toRad(45), aspectRatio, 0.1, 100);
        mat4.lookAt(matrices.viewMatrix, this.cameraPosition, [0, 0, 0], [0, 1, 0]);

        //default orthogonalProjectionMatrix
        matrices.projectionMatrix = this.orthogonalProjectionMatrix;
    }

    toggleOrthogonalProjectionSelected() {
        this.orthogonalProjectionSelected = !this.orthogonalProjectionSelected;
        this.setSelectedProjectionMatrix();

        gl.uniformMatrix4fv(currentShaderProgram.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
    }

    setSelectedProjectionMatrix() {
        if (this.orthogonalProjectionSelected) {
            matrices.projectionMatrix = this.orthogonalProjectionMatrix;
        }
        else {
            matrices.projectionMatrix = this.perspectiveProjectionMatrix;
        }
    }

    zoomCamera(scalingVector) {
        mat4.scale(matrices.viewMatrix, matrices.viewMatrix, scalingVector);
    }

    rotateCamera(angle, axis) {
        mat4.rotate(matrices.viewMatrix, matrices.viewMatrix, angle, axis);
    }

    mouseRotateCamera(angle){
        mat4.rotateY(matrices.viewMatrix, matrices.viewMatrix, angle);
    }
}