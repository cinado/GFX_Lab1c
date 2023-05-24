
function loadShader(shaderId, shaderType) {
    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderId);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error while compiling shader", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createShaderProgram(vShaderId, fShaderId) {
    const vShader = loadShader(vShaderId, gl.VERTEX_SHADER);
    const fShader = loadShader(fShaderId, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error while linking program", gl.getProgramInfoLog(program));
        return false;
    }

    return program;
}

async function fetchShader(fileName) {
    const data = await fetch(`shaders/${fileName}`).then(result => result.text());
    return data;
}

async function initShaderData() {
    for (const key in shaders) {
        const shaderData = await fetchShader(shaders[key]);
        shaderSource[key] = shaderData;
    }
}

function sendUniforms(gl) {
    gl.uniform4fv(currentShaderProgram.uniforms.ambientProduct, ambientProduct);
    gl.uniform4fv(currentShaderProgram.uniforms.diffuseProduct, diffuseProduct);
    gl.uniform4fv(currentShaderProgram.uniforms.specularProduct, specularProduct);
    gl.uniform1f(currentShaderProgram.uniforms.shininess, shininess);
    gl.uniformMatrix4fv(currentShaderProgram.uniforms.viewMatrix, gl.FALSE, matrices.viewMatrix);
    gl.uniformMatrix4fv(currentShaderProgram.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
}