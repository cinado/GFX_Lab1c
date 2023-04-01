class OBJParser {
    constructor() {
        this.vecNormals = [];
        this.vertices = [];
        this.vertexIndices = [];
        this.vecNormalIndices = [];
    }

    extractData(data) {
        const lines = data.split("\n");
        for (const line of lines) {
            const elements = line.split(/\s+/);
            switch (elements[0]) {
                case "vn":
                    this.addElement(this.vecNormals, elements[1], elements[2], elements[3])
                    break;
                case "v":
                    this.addElement(this.vertices, elements[1], elements[2], elements[3])
                    break;
                case "f":
                    this.processIndices(elements);
                    break;
            }
        }

        console.log(this.vertices);
        console.log(this.vertexIndices);

        return {
            vertices: this.vertices,
            normals: this.normals,
            indices: this.vertexIndices,
        };
    }

    addElement(container, xComponent, yComponent, zComponent) {
        //last entry is 1 --> homogeneous coordinates
        container.push(parseFloat(xComponent), parseFloat(yComponent), parseFloat(zComponent), 1);
    }

    processIndices(elements) {
        for (let i = 1; i < elements.length; i++) {
            //Assuming, that we do not have texture vertices
            const index = elements[i].split("//");
            //Inidices begin in WebGL begin with 0 --> OBJ-files use a 1-based index
            this.vertexIndices.push(parseInt(index[0]) - 1);
            this.vecNormalIndices.push(parseInt(index[1]) - 1);
        }
    }

}