
window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    /* --- initialise listener --- */
    ambientProductSlider = document.getElementById("ambientProductSlider");
    diffuseProductSlider = document.getElementById("diffuseProductSlider");
    specularProductSlider = document.getElementById("specularProductSlider");

    ambientProductSlider.addEventListener("input", onSliderValueChanged);
    diffuseProductSlider.addEventListener("input", onSliderValueChanged);
    specularProductSlider.addEventListener("input", onSliderValueChanged);

    restartButton =  document.getElementById("restartButton");


    /* --------- load obj files --------- */
    const cube = await fetch("/sampleModels/cube.obj").then(response => response.text());
    const cylinder = await fetch("/sampleModels/cylinder.obj").then(response => response.text());
    const parsedCubeShape = parseAndCreateShape(cube);
    const parsedCylinderShape = parseAndCreateShape(cylinder);

    const mouseControl = new MouseControl(canvas);
    const keyboardControl = new KeyboardControl(window);
    shapeCreator = new ShapeCreator(parsedCubeShape, parsedCylinderShape);

    const boundingBoxCreator = new BoundingBox();
    boundingBoxGrid = boundingBoxCreator.createBoundingBox();//shapeCreator.createBoundingBoxGrid();
    wireGrid = shapeCreator.createWireGrid();

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1);

    await initShaderData();
    await initTexture();

    const program = createShaderProgram(shaderSource.noLight, shaderSource.fragment);
    gl.useProgram(program);

    // Set up projection matrices and view matrix
    camera = new Camera(canvas.clientWidth / canvas.clientHeight);

    restartButton.onclick = function () {
        gameLogic.restartGame()
        restartButton.style.display = "none";
    }

    // create shader programs and enable one of them
    shaderPrograms.noLightProgram = new ShaderProgram(shaderSource.noLight, shaderSource.fragment, shaderInfo);
    shaderPrograms.gouraudSpecular = new ShaderProgram(shaderSource.gouraudSpecular, shaderSource.fragment, shaderInfo);
    shaderPrograms.phongSpecular = new ShaderProgram(shaderSource.phongVert, shaderSource.phongSpecularFrag, shaderInfo);

    shaderPrograms.phongSpecular.enable();

    tetraCubeSelection = shapeCreator.createTetraCubeSelection();

    gameLogic = new GameLogic(tetraCubeSelection);

    gameLogic.chooseNextCube();

    /* --------- start render loop --------- */
    requestAnimationFrame(render);
}

moveCamera = function translateCamera(vector) {
    mat4.translate(matrices.viewMatrix, matrices.viewMatrix, vector);
}

let then = 0;

function render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Save previously used shader and switch to flat shading for the grid

    let previousSelection = currentShaderProgram;

    shaderPrograms.noLightProgram.enable();
    sendUniforms(gl);

    //boundingBoxGrid.drawLines();
    boundingBoxGrid.forEach(boundingBoxSide => {
        boundingBoxSide.drawLinesIfVisible();
    });

    if (isGridVisible) {
        wireGrid.drawLines();
    }

    //coordSys.drawLines();

    // Switch back to phong/gouraud

    previousSelection.enable();
    sendUniforms(gl);

    gameLogic.tetraCubes.forEach(tetraCube => {
        tetraCube.draw();
    })

    gameLogic.executeGameplayCycle();

    requestAnimationFrame(render)
}

function createShape() {
    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */
    const vertices = [
        // X, Y, Z, W
        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,

        -0.2, 0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        -0.2, -0.2, -0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,

        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1, // left face end

        0.2, 0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1, // back face end

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1, // bottom face end

        0.2, 0.2, 0.2, 1,
        0.2, -0.2, -0.2, 1,
        0.2, 0.2, -0.2, 1,

        0.2, -0.2, -0.2, 1,
        0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        0.2, 0.2, 0.2, 1,
        0.2, 0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1, // Top face end
    ];

    const colorData = [
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    const normalData = [
        [0, 0, 1], // front
        [-1, 0, 0], // left
        [0, 0, -1], // back
        [0, -1, 0], // bottom
        [1, 0, 0], // right
        [0, 1, 0], // top
    ];

    // add one color and normal per vertex
    const normals = [];

    for (let i = 0; i < 6; ++i) {
        for (let j = 0; j < 6; ++j) {
            normals.push(normalData[i]);
            colors.push(colorData[i]);
        }
    }

    /* --------- create shape object and initialize data --------- */
    const cube = new Shape();
    cube.initData(vertices, colors, normals)

    return cube;
}

function parseAndCreateShape(objFile) {
    const objParser = new OBJParser();
    const parsedShape = objParser.extractData(objFile);

    const color = [Math.random(), Math.random(), Math.random(), 1];
    const colors = [];

    for (let i = 0; i < parsedShape.vertices.length; i++) {
        colors.push(color);
    }

    /* --------- create shape object and initialize data --------- */
    const shape = new Shape();
    shape.initData(parsedShape.vertices, colors, parsedShape.normals, parsedShape.indices);

    return shape;
}

function createShape() {
    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */
    const vertices = [
        // X, Y, Z, W
        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,

        -0.2, 0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        -0.2, -0.2, -0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,

        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1, // left face end

        0.2, 0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1, // back face end

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1, // bottom face end

        0.2, 0.2, 0.2, 1,
        0.2, -0.2, -0.2, 1,
        0.2, 0.2, -0.2, 1,

        0.2, -0.2, -0.2, 1,
        0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        0.2, 0.2, 0.2, 1,
        0.2, 0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1, // Top face end
    ];

    const colorData = [
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    /* --------- add one color per face, so 6 times for each color --------- */
    colorData.forEach(color => {
        for (let i = 0; i < 6; ++i) {
            colors.push(color);
        }
    });

    /* --------- create shape object and initialize data --------- */
    const cube = new Shape();
    cube.initData(vertices, colors)

    return cube;
}

function createCoordinateSystem() {
    /* --------- define vertex positions & colors --------- */
    /* -------------- 2 vertices per line ------------- */
    const vertices = [
        // X, Y, Z, W
        -0.5, 0.0, 0.0, 1.0,   // X-Start
        0.5, 0.0, 0.0, 1.0,    // X-End
        0.0, 0.5, 0.0, 1.0,    // Y-Start
        0.0, -0.5, 0.0, 1.0,   // Y-End
        0.0, 0.0, 0.5, 1.0,    // Z-Start
        0.0, -0.0, -0.5, 1.0,  // Z-End
    ];

    const colorData = [
        [1.0, 0.0, 0.0, 1.0],    // X
        [0.0, 1.0, 0.0, 1.0],    // Y
        [0.0, 0.0, 1.0, 1.0],    // Z
    ];

    const colors = [];

    /* --------- add one color for each point --> 2 for each line --------- */
    colorData.forEach(color => {
        for (let i = 0; i < 2; ++i) {
            colors.push(color);
        }
    });

    /* --------- create shape object and initialize data --------- */
    const globalCoordinateSystemLines = new Shape();
    globalCoordinateSystemLines.initData(vertices, colors, null);

    return globalCoordinateSystemLines;
}