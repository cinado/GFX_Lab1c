const GRAVITY_CONSTANT = -0.002;

class GameLogic {
    constructor(tetraCubeSelection) {
        this.tetraCubeSelection = tetraCubeSelection;

        this.collisionMap = new Map();
        this.initializeMap();

        this.currentTetraCubeIndex = -1;
        this.tetraCubes = [];
    }

    generateKey(x, y, z) {
        return `(${x},${y},${z})`;
    }

    initializeMap() {
        for (let x = 0; x <= 3; x++) {
            for (let y = 0; y <= 11; y++) {
                for (let z = 0; z <= 3; z++) {
                    this.collisionMap.set(this.generateKey(x,y,z), false);
                }
            }
        }
    }

    getCurrentTetraCube(){
        return this.tetraCubes[this.currentTetraCubeIndex];
    }

    chooseNextCube(){
        let chosenTetraCube = this.tetraCubeSelection[Math.floor(Math.random() * this.tetraCubeSelection.length)];
        this.currentTetraCubeIndex++;
        this.tetraCubes.push(chosenTetraCube.cloneObject());
    }

    translateCurrentTetraCube(translationVector){
        this.getCurrentTetraCube().translateTetrisShape(translationVector);
    }

    executeGameplayCycle(){
        this.translateCurrentTetraCube([0, GRAVITY_CONSTANT ,0]);

    }

    

}