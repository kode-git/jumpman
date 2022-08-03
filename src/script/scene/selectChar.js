/*
====================================
        Variables of the 
        SelectChar Scene 
====================================
*/

// GLSL Programs
var startProgramInfo, skyboxProgramInfo;
// Buffers
var cubeBufferInfo, quadBufferInfo

var numVertices;
// ========= Environment Object ============
var parts;
var range;
var objOffset;

// Light 
var colorLight = [1.0, 1.0, 1.0]; // white light
var ambientLight = [0.2, 0.2, 0.2]; // ambient light
var ambient, diffuse, specular, emissive, shininess, opacity;

// ========================================


var fieldOfViewRadians = degToRad(80);
var time, then = 0;


/*
====================================
        Step Functions of the 
          SelectChar Scene 
====================================
*/

/**
 * Draw the skybox using the GLSL program with the buffer, projection of the view direction and texture for the scene orientation
 * @param {*} gl is the WebGL context
 * @param {*} skyboxProgramInfo is the GLSL program for the skybox 
 * @param {*} quadBufferInfo is the buffer with geometric data
 * @param {*} viewDirectionProjectionInverseMatrix  is the inverse of the multiply between projection matrix and view matrix
 * @param {*} texture is the texture of the skybox
 */
function drawSkybox(gl, skyboxProgramInfo, quadBufferInfo, viewDirectionProjectionInverseMatrix, texture){
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(skyboxProgramInfo.program);
    webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, quadBufferInfo);
    webglUtils.setUniforms(skyboxProgramInfo, {
        u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
        u_skybox: texture,
    });
    webglUtils.drawBufferInfo(gl, quadBufferInfo);
}


/*
====================================
        Main Function of the 
          SelectChar Scene 
====================================
*/

/**
 * Main function for the SelectChar Scene
 * @returns if WebGL is not supported
 */
async function runSelectCharScene() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("game");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL programs and lookup locations

    // =================================
    //          Start Program               
    // =================================
    startProgramInfo = webglUtils.createProgramInfo(
        gl, ["start-vs", "start-fs"]);


    var data = await loadObjParts(gl, 'src/models/jumpman/start_baseline.obj')
    parts = data.p;
    objOffset = data.offset;
    range = data.r;

    // =====================================
    //          SkyBox Program  
    // =====================================


    skyboxProgramInfo = webglUtils.createProgramInfo(
        gl, ["skybox-vs", "skybox-fs"]);

    // Skybox BufferInfo
    const quadBufferInfo = createXYQuadBufferInfo(gl);
    // Loading Texture
    const texture = createSkyboxTexture(gl);


    requestAnimationFrame(drawScene);

    // Draw the scene.
    function drawScene(time) {
        // convert to seconds
        time *= 0.001;
        // Subtract the previous time from the current time
        var deltaTime = time - then;
        // Remember the current time for the next frame.
        then = time;

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Compute the projection matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var projectionMatrix =
            m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

        // camera going in circle 2 units from origin looking at origin
        // var cameraPosition = [Math.cos(time * .1) * 2, 0, Math.sin(time * .1) * 2];
        var cameraPosition = [0, 0, 7]
        var target = [0, 0, 0];
        var up = [0, 1, 0];
        // Compute the camera's matrix using look at.
        var cameraMatrix = m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        var viewMatrix = m4.inverse(cameraMatrix);

        // Rotate the cube around the x axis
        var worldMatrix = m4.identity();

        // We only care about direciton so remove the translation
        var viewDirectionMatrix = m4.copy(viewMatrix);
        viewDirectionMatrix[12] = 0;
        viewDirectionMatrix[13] = 0;
        viewDirectionMatrix[14] = 0;

        var viewDirectionProjectionMatrix = m4.multiply(
            projectionMatrix, viewDirectionMatrix);
        var viewDirectionProjectionInverseMatrix =
            m4.inverse(viewDirectionProjectionMatrix);

        // draw jumpman
        gl.depthFunc(gl.LESS);  // use the default depth test
        gl.useProgram(startProgramInfo.program);


        // ======= Using the main shaders for the starting scene =========

        // ========= Set Ligh direction, view and projection matrix and camera position ===========
        const sharedUniforms = {
            u_lightDirection: m4.normalize([0.5, 1, 1]), // direction of the source light
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_viewWorldPosition: cameraPosition,
        };

        // ========= Set Uniforms for the Starting Program ===========
        webglUtils.setUniforms(startProgramInfo, sharedUniforms);

        // =========== Compute the world matrix once since all parts =========
        let u_world = m4.yRotation(time);
        u_world = m4.translate(u_world, ...objOffset);

        // ======== Setting buffer and uniforms for each part ==============
        for (const { bufferInfo, material } of parts) {
            // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
            webglUtils.setBuffersAndAttributes(gl, startProgramInfo, bufferInfo);
            // calls gl.uniform
            webglUtils.setUniforms(startProgramInfo, {
                u_world,
            }, material);
            // calls gl.drawArrays or gl.drawElements
            webglUtils.drawBufferInfo(gl, bufferInfo);
        }

        // draw the skybox
        drawSkybox(gl, skyboxProgramInfo, quadBufferInfo, viewDirectionProjectionInverseMatrix, texture);

        requestAnimationFrame(drawScene);
    }
}

// Load Scene on loading state
window.onload = runSelectCharScene;

