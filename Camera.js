class Camera{
    constructor(aspectRatio){
        this.aspectRatio = aspectRatio;
        this.orthogonalProjectionSelected = true;
        this.orthogonalProjectionMatrix = glMatrix.mat4.create();
        this.perspectiveProjectionMatrix = glMatrix.mat4.create();

        mat4.ortho(this.orthogonalProjectionMatrix, -this.aspectRatio*1.3, this.aspectRatio*1.3, -1*1.3, 1*1.3, 0.1, 100);
        mat4.perspective(this.perspectiveProjectionMatrix, toRad(45), aspectRatio, 0.1, 100);
        mat4.lookAt(matrices.viewMatrix, [8, 13, 8], [0, 0, 0], [0, 1, 0]);

        //default orthogonalProjectionMatrix
        matrices.projectionMatrix = this.orthogonalProjectionMatrix;    
    }

    toggleOrthogonalProjectionSelected(){
        this.orthogonalProjectionSelected = !this.orthogonalProjectionSelected;
        this.setSelectedProjectionMatrix();

        gl.uniformMatrix4fv(currentShaderProgram.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
    }

    setSelectedProjectionMatrix(){
        if(this.orthogonalProjectionSelected){
            matrices.projectionMatrix = this.orthogonalProjectionMatrix;
        }
        else{
            matrices.projectionMatrix = this.perspectiveProjectionMatrix;
        }
    }
    

}