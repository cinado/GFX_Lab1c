
window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    const mouseControl = new MouseControl(canvas);
    const keyboardControl = new KeyboardControl(window);
    const shapeCreator = new ShapeCreator();
    boundingBoxGrid = shapeCreator.createBoundingBoxGrid();
    wireGrid = shapeCreator.createWireGrid();

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1);

    await initShaderData();

    const program = createShaderProgram(shaderSource.noLight, shaderSource.fragment);
    gl.useProgram(program);

    /* --------- create & send projection matrix --------- */
    //mat4.perspective(matrices.projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);

    //mat4.ortho(matrices.projectionMatrix, -(canvas.clientWidth / canvas.clientHeight)*1.3, (canvas.clientWidth / canvas.clientHeight)*1.3, -1*1.3, 1*1.3, 0.1, 100);

    /* --------- create view matrix --------- */
    //mat4.lookAt(matrices.viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0]);
    //mat4.lookAt(matrices.viewMatrix, [8, 13, 8], [0, 0, 0], [0, 1, 0]);
    camera = new Camera(canvas.clientWidth / canvas.clientHeight);

    // create shader programs and enable one of them
    shaderPrograms.noLightProgram = new ShaderProgram(shaderSource.noLight, shaderSource.fragment, shaderInfo);
    shaderPrograms.gouraudDiffuse = new ShaderProgram(shaderSource.gouraudDiffuse, shaderSource.fragment, shaderInfo);
    shaderPrograms.gouraudSpecular = new ShaderProgram(shaderSource.gouraudSpecular, shaderSource.fragment, shaderInfo);
    shaderPrograms.phongDiffuse = new ShaderProgram(shaderSource.phongVert, shaderSource.phongDiffuseFrag, shaderInfo);
    shaderPrograms.phongSpecular = new ShaderProgram(shaderSource.phongVert, shaderSource.phongSpecularFrag, shaderInfo);

    shaderPrograms.noLightProgram.enable();

    /* Position for each shape */
   /* const positions = [
        [-0.95, 0.7, 0], [0, 0.7, 0], [0.95, 0.7, 0],
        [-0.95, 0, 0], [0, 0, 0], [0.95, 0, 0],
        [-0.95, -0.7, 0], [0, -0.7, 0], [0.95, -0.7, 0]
    ];*/

    /* --------- load obj files --------- */
    /*const teapotFile = await fetch("/sampleModels/teapot.obj").then(response => response.text());
    const bunnyFile = await fetch("/sampleModels/bunny.obj").then(response => response.text());
    const tetrahedronFile = await fetch("/sampleModels/tetrahedron.obj").then(response => response.text());*/

    /* --------- Create Shapes --------- */
    /*shapes.push(parseAndCreateShape(teapotFile));
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(parseAndCreateShape(tetrahedronFile));
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(parseAndCreateShape(bunnyFile));

    shapes.forEach((shape, index) => {
        shape.translate(positions[index]);
    });*/

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

    shapes.forEach(shape => {
        sendUniforms(gl);
        shape.draw();
    });

    boundingBoxGrid.drawLines();
    //wireGrid.drawLines();

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

