"use strict";


const canvas = document.getElementById('game')
const gl = canvas.getContext('webgl')
const device = isMobile.any()

// ====== Check the support to WebGL ====
utils.checkWebGL(gl);

// ====== Initialization =========
gl.clearColor(1,1,1,1)

var program = webglUtils.createProgramFromScripts(gl, ['env-vs', 'env-fs'])

// ========= Get Attributes Locations ===========
var positionLocation = gl.getAttribLocation(program, "a_position");
var colorLocation = gl.getAttribLocation(program, "a_color");

// ========= Get Uniform Locations ===========
var matrixLocation = gl.getUniformLocation(program, "u_matrix"); 

// ======= Create Attributes Buffers ==========
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
geometry.setFloorGeometryBuffer(gl); // passing geometry positions and set in the buffeData

var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
geometry.setColorFloorBuffer();
const controls = {
    shadow: 5,
    shiness : 5,
}
// ========== Setting WebGL Graphic User Interface ===============
function settingInternalGUI(){
    const gui = new dat.GUI();
    gui.add(controls, "shadow").min(0).max(10).step(1).onChange(()=>{
        // 
    })
    gui.add(controls, "shiness").min(0).max(10).step(1).onChange(()=>{
        // 
    })
}
settingInternalGUI();

// ======= Initialize parameters =========
var fieldOfView, aspect, zMin, zMax;
var D, theta, phi, target, up;

aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
zMin = 1;
zMax = 100;
fieldOfView = utils.degreeToRadiant(40);

D = 7; // arbitrary distance
target = [0,0,0]; // center of the clip space
up = [0,1,0]; // we move camera up the floor level
theta = utils.degreeToRadiant(50);
phi = utils.degreeToRadiant(30);

// ======= Rendering =======
const render = ()=>{

    webglUtils.resizeCanvasToDisplaySize(gl.canvas); // adapt the canvas to the window
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // adapt the canvas to the clipped space for pixel drawing 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear canvas and depth buffer
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    gl.clearDepth(1.0);
    // automatic culling backtracking triangles
    gl.enable(gl.CULL_FACE)
    // enable the depth buffer for prospective triangles
    gl.enable(gl.DEPTH_TEST)

    // use the previous GLSL Program
    gl.useProgram(program);

    // ========= Define the matrix for the view transformation =========
    var cameraPosition = [D * Math.sin(phi) * Math.cos(theta),
        D * Math.sin(phi) * Math.sin(theta),
        D * Math.cos(phi)];

        var cameraTarget = [0, -100, 0];
        var cameraPosition = [500, 300, 500];
        var up = [0, 1, 0];
    
        // Compute the camera's matrix using look at.
        var cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up);
    
        // Make a view matrix from the camera matrix.
        var viewMatrix = m4.inverse(cameraMatrix);

    // var viewMatrix = m4.inverse(m4.lookAt(cameraPosition, up, target));
    var projectionMatrix = m4.perspective(fieldOfView, aspect, zMin, zMax);
    var matrix = m4.multiply(m4.identity(), m4.multiply(viewMatrix, projectionMatrix)); 

    // ==== Turn on and bind position attributes ======
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // ==== Turn on and bind colors attributes =====
    gl.enableVertexAttribArray(colorBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorBuffer, 3, gl.UNSIGNED_BYTE, true, 0,0);

    // ==== Set the Uniform Matrix =======
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // === Draw the floor =======
    gl.drawArrays(gl.TRIANGLES, 0, );

}

render();




