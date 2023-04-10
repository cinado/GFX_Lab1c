class OBJParser {
    constructor() {
        this.vecNormals = [];
        this.vertices = [];

        //Counter variable for new index
        this.currentIndex = 0;
        //Sorted arrays
        this.sortedVertices = [];
        this.sortedNormals = [];
        //Create a new index array to avoid duplicates
        this.newIndexArray = [];
        /**
         * This dictionary is used to map the f-line triple with it's index,
         * thus allowing us to check if it was already mapped to an index.
         * By following this approach, we can just append the index to the newIndexArray,
         * instead of pushing the values again into the sorted arrays and assigning a new index for them.
         */
        this.alreadyMappedTriples = {};
    }

    extractData(data) {
        const lines = data.split("\n");
        for (const line of lines) {
            const elements = line.split(/\s+/);
            switch (elements[0]) {
                case "vn":
                    this.addNormal(this.vecNormals, elements[1], elements[2], elements[3])
                    break;
                case "v":
                    this.addVertex(this.vertices, elements[1], elements[2], elements[3])
                    break;
                case "f":
                    this.processIndices(elements);
                    break;
            }
        }

        return {
            vertices: this.sortedVertices,
            normals: this.sortedNormals,
            indices: this.newIndexArray,
        };
    }

    addVertex(container, xComponent, yComponent, zComponent) {
        //last entry is 1 --> homogeneous coordinates
        container.push([parseFloat(xComponent), parseFloat(yComponent), parseFloat(zComponent), 1]);
    }

    addNormal(container, xComponent, yComponent, zComponent) {
        //Normals are just vectors - therefore we are not adding 1 in order to homogenise them
        container.push([parseFloat(xComponent), parseFloat(yComponent), parseFloat(zComponent)]);
    }

    processIndices(elements) {
        const elementsWithoutKeyword = elements.slice(1);
        for (let i = 0; i < elementsWithoutKeyword.length; i++) {
            //Split triple - As we are not interested into texture indices we can skip the second element 
            const index = elementsWithoutKeyword[i].split("/");
            //Check if triple was already mapped to an index
            if (index in this.alreadyMappedTriples) {
                //If it was already mapped to an index then just append the mapped index to the index array
                this.newIndexArray.push(this.alreadyMappedTriples[index])
            }
            else {
                //Inidices begin in WebGL begin with 0 --> OBJ-files use a 1-based index
                const vertexIndex = parseInt(index[0]) - 1;
                const normalIndex = parseInt(index[2]) - 1;
                this.sortedVertices.push(...this.vertices[vertexIndex]);
                this.sortedNormals.push(...this.vecNormals[normalIndex]);

                //Create new index entry and mark it as already mapped for the specified triple
                this.newIndexArray.push(this.currentIndex);
                this.alreadyMappedTriples[index] = this.currentIndex;
                this.currentIndex++;
            }
        }
    }

}