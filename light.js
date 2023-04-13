class Light{
    constructor(lightPosition){
        this.lightPosition = lightPosition
    }

    translate(vector) {
        glMatrix.vec4.add(this.lightPosition, this.lightPosition, vector);
    }

    global_rotation(angle, axis) {
        const rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
        glMatrix.vec4.transformMat4(this.lightPosition, this.lightPosition, rotationMatrix);
    }
}