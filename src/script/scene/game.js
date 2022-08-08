


/*
====================================
        Common Variables List
====================================
*/

var gl, canvas;

// GLSL Programs
var envProgramInfo, skyboxProgramInfo;

var numVertices;

// ========= Environment Object ============
var parts;
var range;
var objOffset;
var sharedUniforms;

// ======== Skybox Object ===========

var quadBufferInfo; // SkyBox buffer
var texture; // Skybox texture

// Light 
var colorLight = [1.0, 1.0, 1.0]; // white light
var ambientLight = [0.2, 0.2, 0.2]; // ambient light
var ambient, diffuse, specular, emissive, shininess, opacity;

// ========================================

// ============= Prospective  =============
var fieldOfViewRadians = degToRad(80);
var aspect;
var deltaTime, then = 0;
// Camera 
var cameraPosition, cameraAngle, target, up;

// Matrices
var viewDirectionProjectionInverseMatrix, viewDirectionProjectionMatrix, worldMatrix, cameraMatrix, viewMatrix, projectionMatrix, viewDirectionMatrix;

// ========================================

// ======== Resource Urls ===========

// Jumpmans objects
const references = [
    'src/models/jumpman/purple_baseline.obj',
    'src/models/jumpman/orange_baseline.obj',
    'src/models/jumpman/start_baseline.obj',
    'src/models/jumpman/turquoise_baseline.obj',
    'src/models/jumpman/green_baseline.obj',
];

// Colors of jumpman
const colors = ['purple', 'orange', 'red', 'turquoise', 'green'] 

// Platform
const platformUrl = 'src/models/platform/plartform.obj';

// Coins
const coinUrl = 'src/models/coin/coin.obj';

// Obstacles
const obstacleUrl = 'src/models/obstacle/obstacle.obj';

// ======= Object variables ========
var jumpmans = [];
var coin;
var platform;
var obstacle;

// initialize the coin positions
const coinPosition = [[0,1.5,0], [-5,1.5,-3], [4, 1.5, -9], [10, 1.5, -7], [4, 1.5, 4]]


// =========== Obstacles Variables ============
// initialize the starting 
var obstaclePosition = [
    // movement on z 
    [-10,2.7, -24],     
    [-3, 2.7, -24],
    [4, 2.7, -24],
    [11, 2.7, -24],
]
var obstacleAppearance = [true, true, true, false];
var initialAppearance = [true, true, true, true];
var obstacleSpeed = 0.0014;
// =================================

// Event management
var mouseToggle = true;

// index and oldIndex are in the buttonsControllers.js
// var indexTexture = 0; // index of the wavefront object to load
// var oldIndex; 

/*
====================================
        Step Functions of the 
          SelectChar Scene 
====================================
*/

/**
 * Draw the skybox using its embdedded GLSL program with the buffer, projection of the view direction and texture for the scene orientation
 * @param {*} gl is the WebGL context
 * @param {*} skyboxProgramInfo is the GLSL program for the skybox 
 * @param {*} quadBufferInfo is the buffer with geometric data
 * @param {*} viewDirectionProjectionInverseMatrix  is the inverse of the multiply between projection matrix and view matrix
 * @param {*} texture is the texture of the skybox
 */
function drawSkybox(gl, skyboxProgramInfo, quadBufferInfo, viewDirectionProjectionInverseMatrix, texture) {
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(skyboxProgramInfo.program);
    webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, quadBufferInfo);
    webglUtils.setUniforms(skyboxProgramInfo, {
        u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
        u_skybox: texture,
    });
    webglUtils.drawBufferInfo(gl, quadBufferInfo);
}

/**
 * Draw the jumpman, platforms, money or other object waveform using its embedded GLSL program with the buffer, uniforms, parts, objectOffests and time for the rotation
 * @param {*} gl is the WebGL context
 * @param {*} envProgramInfo is the program for the environment object
 * @param {*} sharedUniforms container of the uniforms variables values 
 * @param {*} parts is the parts of the object wavefront
 * @param {*} objOffset is the object offset
 * @param {*} time is the time animation strictly related to the rotation
 */
function drawJumpman(gl, envProgramInfo, sharedUniforms, parts, objOffset, time) {
    gl.depthFunc(gl.LESS);  // use the default depth test
    gl.useProgram(envProgramInfo.program);
    webglUtils.setUniforms(envProgramInfo, sharedUniforms);

    // =========== Compute the world matrix once since all parts =========
    let u_world = m4.yRotation(time);
    u_world = m4.translate(u_world, ...objOffset);
    for (const { bufferInfo, material } of parts) {
        webglUtils.setBuffersAndAttributes(gl, envProgramInfo, bufferInfo);
        webglUtils.setUniforms(envProgramInfo, {
            u_world,
        }, material);
        webglUtils.drawBufferInfo(gl, bufferInfo);
    }
}


/**
 * Draw the platform 
 * @param {*} gl is the WebGL context
 * @param {*} envProgramInfo is the GLSL program
 * @param {*} sharedUniforms is uniforms values
 * @param {*} parts is parts of the object
 * @param {*} objOffset is the offset of the object
 */
function drawPlatform(gl, envProgramInfo, sharedUniforms, parts, objOffset) {
    gl.depthFunc(gl.LESS);  // use the default depth test
    gl.useProgram(envProgramInfo.program);
    webglUtils.setUniforms(envProgramInfo, sharedUniforms);

    // =========== Compute the world matrix once since all parts =========
    let u_world = m4.identity();
    u_world = m4.translate(u_world, ...objOffset);
    for (const { bufferInfo, material } of parts) {
        webglUtils.setBuffersAndAttributes(gl, envProgramInfo, bufferInfo);
        webglUtils.setUniforms(envProgramInfo, {
            u_world,
        }, material);
        webglUtils.drawBufferInfo(gl, bufferInfo);
    }
}

/**
 * Draw a coin element
 * @param {*} gl is the WebGL context
 * @param {*} envProgramInfo is the GLSL program
 * @param {*} sharedUniforms is uniforms values
 * @param {*} parts is parts of object
 * @param {*} objOffset is the offset of the object
 * @param {*} y is the rotation on y axe
 */
function drawCoin(gl, envProgramInfo, sharedUniforms, parts, objOffset, y, tx, ty, tz) {

    gl.depthFunc(gl.LESS);  // use the default depth test
    gl.useProgram(envProgramInfo.program);
    webglUtils.setUniforms(envProgramInfo, sharedUniforms);


    // =========== Compute the world matrix once since all parts =========
    let u_world = m4.identity();
    u_world =  m4.translate(u_world, tx, ty, tz)
    u_world = m4.translate(u_world, ...objOffset);
    u_world = m4.multiply(u_world, m4.yRotation(y));
    for (const { bufferInfo, material } of parts) {
        webglUtils.setBuffersAndAttributes(gl, envProgramInfo, bufferInfo);
        webglUtils.setUniforms(envProgramInfo, {
            u_world,
        }, material);
        webglUtils.drawBufferInfo(gl, bufferInfo);
    }
}

/**
 * Draw an obstacle in the scene
 * @param {*} gl is the WebGL context
 * @param {*} envProgramInfo is the GLSL program to draw obstacle
 * @param {*} sharedUniforms uniforms variables for the GLSL program
 * @param {*} parts set of parts of the mesh for the light and other effects
 * @param {*} objOffset is the offset of the position for the object 
 * @param {*} y is the rotation degree
 * @param {*} tx is the x translation
 * @param {*} ty is the y translation
 * @param {*} tz is the z translation
 */
function drawObstacle(gl, envProgramInfo, sharedUniforms, parts, objOffset, y, tx, ty, tz){
    gl.depthFunc(gl.LESS);  // use the default depth test
    gl.useProgram(envProgramInfo.program);
    webglUtils.setUniforms(envProgramInfo, sharedUniforms);

    // =========== Compute the world matrix once since all parts =========
    let u_world = m4.identity();
    u_world =  m4.translate(u_world, tx, ty, tz)
    u_world = m4.translate(u_world, ...objOffset);
    u_world = m4.multiply(u_world, m4.yRotation(y));


    for (const { bufferInfo, material } of parts) {
        webglUtils.setBuffersAndAttributes(gl, envProgramInfo, bufferInfo);
        webglUtils.setUniforms(envProgramInfo, {
            u_world,
        }, material);
        webglUtils.drawBufferInfo(gl, bufferInfo);
    }
}


/**
 * Pre-loading of resources for faster game
 * @param {*} gl 
 */
async function initResource(gl) {
    // Loading of jumpmans models
    for (let i = 0; i < references.length; i++) {
        let data = await loadObjParts(gl, references[i]);
        jumpmans.push({
            p: data.p,
            offset: data.offset,
            r: data.r,
        })
        console.log('Jumpman ' + i)
        console.log(jumpmans[i])
    }

    // Loading platform model
    let data = await loadObjParts(gl, platformUrl)
    platform = {
        p: data.p,
        offset: data.offset,
        r: data.r,
    }
    console.log('Platform:')
    console.log(platform)

    let dataCoin = await loadObjParts(gl, coinUrl)
    coin = {
        p: dataCoin.p,
        offset: dataCoin.offset,
        r: dataCoin.r,
    }
    console.log('Coin:')
    console.log(coin)

    let dataObstacle = await loadObjParts(gl, obstacleUrl);
    obstacle = {
        p : dataObstacle.p,
        offset: dataObstacle.offset,
        r : dataObstacle.r,
    }
    console.log('Obstacle:')
    console.log(obstacle)
}

/**
 * Select a different color for the jumpman
 * @param {*} gl is the WebGL context
 * @param {*} i is the index of the colored object wavefront
 */
async function selectColoredJumpman(gl, i) {
    i = Math.abs(i) % references.length;
    var data = jumpmans[i]
    parts = data.p;
    objOffset = data.offset;
    range = data.r;
}


/**
 * Reinitialize a new set of obstacles
 */
function newObstacleDisposition(){

    let position = getRandomInteger(0,4);
    for(let j = 0; j < obstacleAppearance.length; j++){
        obstacleAppearance[j] = true;
    }
    obstacleAppearance[position] = false; 
    // reset position
    for(let i = 0; i<obstaclePosition.length; i++){
        obstaclePosition[i][2] = (-1) * 24;
    }    
}

/**
 * Update the z position on the world space for obstacles, simulating the movement in the player PoV. 
 * @param {*} time is the time frame used for the movement animation
 */
function updateObstacles(time){
    for(let i = 0; i < obstaclePosition.length; i++){
        if(obstaclePosition[0][2] >= 24){
            // last spot for the session movement
            console.log('Update obstacle Position')
            newObstacleDisposition();
        } else obstaclePosition[i][2] += 0.1 // z update for obstacle i
    }
    console.log(obstaclePosition[0][2])
}

/**
 * Add or remove Mouse listener
 * @param {*} canvas is the canvas where apply or cancel listeners 
 */
function toggleListener(canvas) {
    if (mouseToggle) {
        canvas.onmousedown = mouseDown;
        canvas.onmouseup = mouseUp;
        canvas.mouseout = mouseUp;
        canvas.onmousemove = mouseMove;
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
    } else {
        canvas.onmousedown = (e) => { };
        canvas.onmouseup = (e) => { };
        canvas.onmouseout = (e) => { };
        canvas.onmousemove = (e) => { };
        window.addEventListener('keydown', (e)=>{});
        window.addEventListener('keyup', (e)=>{});
    }
    mouseToggle = !mouseToggle;
}

/*
====================================
        Main Function of the 
          SelectChar Scene 
====================================
*/


function loadAndRun() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    canvas = document.getElementById("game");
    gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // loading jumpmans 
    initResource(gl).then(() => {
        loadingInterface(); // Starting the interface with the loading phase
        runSelectCharScene();
    })
}

/**
 * Clear the WebGL previous frame
 * @param {*} gl 
 */
function clearFrame(gl) {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

}

/**
 * Main function for the SelectChar Scene
 * @returns if WebGL is not supported
 */
async function runSelectCharScene() {


    // setup GLSL programs and lookup locations

    // =================================
    //          Start Program               
    // =================================
    envProgramInfo = webglUtils.createProgramInfo(
        gl, ["env-vs", "env-fs"]);


    // =====================================
    //          SkyBox Program  
    // =====================================


    skyboxProgramInfo = webglUtils.createProgramInfo(
        gl, ["skybox-vs", "skybox-fs"]);

    // Skybox BufferInfo
    quadBufferInfo = createXYQuadBufferInfo(gl);
    // Loading Texture
    if(!texture) texture = createSkyboxTexture(gl);


    requestAnimationFrame(drawScene);

    // Draw the scene.
    async function drawScene(time) {

        // load object only if it changes
        if (oldIndex != indexTexture) {
            await selectColoredJumpman(gl, indexTexture)
            oldIndex = indexTexture;
        }


        // convert to seconds
        time *= 0.001;
        // Subtract the previous time from the current time
        deltaTime = time - then;
        // Remember the current time for the next frame.
        then = time;

        clearFrame(gl);
        // Compute the projection matrix
        aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        projectionMatrix =
            m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

        // camera going in circle 2 units from origin looking at origin
        // var cameraPosition = [Math.cos(time * .1) * 2, 0, Math.sin(time * .1) * 2];
        cameraPosition = [D * Math.sin(phi) * Math.cos(theta),
        D * Math.sin(phi) * Math.sin(phi),
        D * Math.cos(phi)];
        target = [0, 0, 0];
        up = [0, 1, 0];
        // Compute the camera's matrix using look at.
        cameraMatrix = m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        viewMatrix = m4.inverse(cameraMatrix);

        // Rotate the cube around the x axis
        worldMatrix = m4.identity();

        // We only care about direciton so remove the translation
        viewDirectionMatrix = m4.copy(viewMatrix);
        viewDirectionMatrix[12] = 0;
        viewDirectionMatrix[13] = 0;
        viewDirectionMatrix[14] = 0;

        viewDirectionProjectionMatrix = m4.multiply(
            projectionMatrix, viewDirectionMatrix);
        viewDirectionProjectionInverseMatrix =
            m4.inverse(viewDirectionProjectionMatrix);


        // ========= Set Ligh direction, view and projection matrix and camera position for the Jumpman ===========
        sharedUniforms = {
            u_lightDirection: m4.normalize([0.5, 1, 1]), // direction of the source light
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_viewWorldPosition: cameraPosition,
        };

        // draw Jumpman  
        drawJumpman(gl, envProgramInfo, sharedUniforms, parts, objOffset, time);

        // draw Skybox
        drawSkybox(gl, skyboxProgramInfo, quadBufferInfo, viewDirectionProjectionInverseMatrix, texture);


        if (gameStart) startGameScene();
        else requestAnimationFrame(drawScene);

    }
}

// ==========================
//      Game Variables
//          List
// ==========================



/**
 * It manages the initial Game metadata
 * @param {*} gl 
 */
function initGameScene(gl) {
    if (canvas) toggleListener(canvas)
    D = 20;
    theta = degToRad(90);
    phi = degToRad(45);
    cameraAngle = degToRad(0)
    deltaTime, then = 0;
}


/**
 * Frame Drawing 
 */
function drawGameScene(time) {

    // convert to seconds
    time *= 0.001;

    // Subtract the previous time from the current time
    deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    clearFrame(gl);

    // Update zoom and angle of camera 
    if(zoomKey[0]) D += 1;
    if(zoomKey[1]) D-= 1;

    // redefine matrices 
    projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // camera going in circle 2 units from origin looking at origin
    // var cameraPosition = [Math.cos(time * .1) * 2, 0, Math.sin(time * .1) * 2];
    cameraPosition = [D * Math.sin(phi) * Math.cos(theta),
    D * Math.sin(phi) * Math.sin(phi),
    D * Math.cos(phi)];

    target = [0, 0, 0];
    up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    viewMatrix = m4.inverse(cameraMatrix);

    // Rotate the cube around the x axis
    worldMatrix = m4.identity();

    // We only care about direciton so remove the translation
    viewDirectionMatrix = m4.copy(viewMatrix);
    viewDirectionMatrix[12] = 0;
    viewDirectionMatrix[13] = 0;
    viewDirectionMatrix[14] = 0;

    viewDirectionProjectionMatrix = m4.multiply(
        projectionMatrix, viewDirectionMatrix);
    viewDirectionProjectionInverseMatrix =
        m4.inverse(viewDirectionProjectionMatrix);


    // update sharedUniforms for the platform
    sharedUniforms = {
        u_lightDirection: m4.normalize([0, 0.2, 0]), // direction of the source light
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_viewWorldPosition: cameraPosition,
    };




    //draw platform 
    drawPlatform(gl, envProgramInfo, sharedUniforms, platform.p, platform.offset);
    for(let i = 0; i < coinPosition.length; i++){
        drawCoin(gl, envProgramInfo, sharedUniforms, coin.p, coin.offset, time, coinPosition[i][0], coinPosition[i][1], coinPosition[i][2]);
    }

    // update the obstales positions and appearances
    updateObstacles(time); 

    // draw obstacles
    for(let i = 0; i < obstaclePosition.length; i++){
        if(obstacleAppearance[i])
        drawObstacle(gl, envProgramInfo, sharedUniforms, obstacle.p, obstacle.offset, 0, obstaclePosition[i][0], obstaclePosition[i][1], obstaclePosition[i][2] );
    }

    // draw Skybox
    drawSkybox(gl, skyboxProgramInfo, quadBufferInfo, viewDirectionProjectionInverseMatrix, texture);

    // animation frame iteration
    requestAnimationFrame(drawGameScene)
}



/**
 * Start Game Scene 
 */

function startGameScene() {
    // Remove Starting Scene Buttons
    toggleStartButtons();
    // starting resize and viewport reference space

    // modify metadata
    initGameScene(gl);
    // draw Game Scene
    requestAnimationFrame(drawGameScene);
}
// Load Scene on loading state
window.onload = loadAndRun;

