
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

async function fetchTexture(textureName) {
    return new Promise((resolve, reject) => {
        const textureImage = new Image();
        textureImage.onload = () => {
            resolve(textureImage);
        };
        textureImage.onerror = (error) => {
            console.log(error);
            reject(error);
        };
        textureImage.src = `textures/${textureName}`;
    });
}


async function initTexture() {
    for (const key in textures) {
        const textureImage = await fetchTexture(textures[key]);
        const texture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0) 

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);

        //gl.generateMipmap(gl.TEXTURE_2D);

        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        textureSource[key] = texture;
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