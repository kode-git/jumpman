"use strict";

async function main() {

  // ======== Retrieve WebGL Context ===========
  const canvas = document.getElementById('game')
  const gl = canvas.getContext("webgl");

  gl.clearColor(0, 0, 0, 0)
  // ======= Check Supportability ==========
  if (!utilityGL.isSupported(gl)) return;

  // =========== GLSL Skybox Program from Script==============
  var skyboxProgram = webglUtils.createProgramFromScripts(gl, ["skybox-vs", "skybox-fs"]);
  const skyboxUtils = new SkyBoxUtils(gl);
  // ========= Retrieves Skybox Attribute =========
  var skyboxPositionLocation = gl.getAttribLocation(skyboxProgram, "a_position");

  // ====== Skybox Uniform Locations ========
  var skyboxLocation = gl.getUniformLocation(skyboxProgram, "u_skybox");
  var viewDirectionProjectionInverseLocation = gl.getUniformLocation(skyboxProgram, "u_viewDirectionProjectionInverse");

  // ======= Create Buffer for the Position =========
  var skyboxPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxPositionBuffer);
  // XY Geometry with Z set in the shader
  skyboxUtils.setSkyBoxGeometry(gl);

  // ======== Loading texture from images specified in the skyboxUtils faces ======

  var skyboxTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
  skyboxUtils.faces.forEach((face) => {
    const { target, url } = face;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.crossOrigin = "anonymous";
    image.addEventListener('load', function () {
      // copy the loaded image of the face in the texture
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);


  // ========== GLSL Start Object Program Info ===========
  const startProgramInfo = webglUtils.createProgramInfo(gl, ["start-vs", "start-fs"]);

  // ========== Loading Baseline Starting Jumpman Wavefront .obj ================
  const objHref = '../models/jumpman/start_baseline.obj';
  const response = await fetch(objHref);
  if (!response) console.warn('Error during the texture loading...');

  // =========== Parsing Object to load the mesh and materials ==========
  const text = await response.text();
  const obj = parseOBJ(text);
  if (!obj) console.warn('Error during the object parsing');
  const baseHref = new URL(objHref, window.location.href);

  // ========= Loading materials from filenames specified inside the Wavefront ============
  const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
    const matHref = new URL(filename, baseHref).href;
    const response = await fetch(matHref);
    return await response.text();
  }));

  // ========= Parsing MTL files =============
  const materials = parseMTL(matTexts.join('\n'));

  // ============= Create default texture (full white) ===============
  const textures = {
    defaultWhite: create1PixelTexture(gl, [255, 255, 255, 255]),
  };

  // ============= Load Texture from Materials =============
  for (const material of Object.values(materials)) {
    Object.entries(material)
      .filter(([key]) => key.endsWith('Map'))
      .forEach(([key, filename]) => {
        let texture = textures[filename];
        if (!texture) {
          const textureHref = new URL(filename, baseHref).href;
          texture = createTexture(gl, textureHref);
          textures[filename] = texture;
        }
        material[key] = texture;
      });
  }

  // ============== Default material with ambient default values ===========
  const defaultMaterial = {
    diffuse: [1, 1, 1],
    diffuseMap: textures.defaultWhite,
    ambient: [0, 0, 0],
    specular: [1, 1, 1],
    shininess: 400,
    opacity: 1,
  };

  // 
  const parts = obj.geometries.map(({ material, data }) => {

    if (data.color) {
      if (data.position.length === data.color.length) {
        // it's 3. The our helper library assumes 4 so we need
        // to tell it there are only 3.
        data.color = { numComponents: 3, data: data.color };
      }
    } else {
      // there are no vertex colors so just use constant white
      data.color = { value: [1, 1, 1, 1] };
    }

    // create a buffer for each array by calling
    // gl.createBuffer, gl.bindBuffer, gl.bufferData
    const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
    return {
      material: {
        ...defaultMaterial,
        ...materials[material],
      },
      bufferInfo,
    };
  });


  const extents = getGeometriesExtents(obj.geometries);
  const range = m4.subtractVectors(extents.max, extents.min);
  // amount to move the object so its center is at the origin
  const objOffset = m4.scaleVector(
    m4.addVectors(
      extents.min,
      m4.scaleVector(range, 0.5)),
    -1);

  // ====== Target to the center of the clipped space =======
  const cameraTarget = [0, 0, 0];
  // ========= Camera Orientation ===============
  const radius = m4.length(range) * 1.2;
  const cameraPosition = m4.addVectors(cameraTarget, [
    0,
    0,
    radius,
  ]);

  // ============ Appropriate zNear and zFar values ==========
  const zNear = radius / 100;
  const zFar = radius * 3;

  function render(time) {
    time *= 0.001;  // convert to seconds

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // ======== Projection and View Matrix ==============
    const fieldOfViewRadians = utilityGL.degreeToRRadiant(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
    const up = [0, 1, 0];
    // ======= Compute the camera's matrix using look at. ==========
    const camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // ======= Make a view matrix from the camera matrix. =========
    const view = m4.inverse(camera);

    // ========= Set Ligh direction, view and projection matrix and camera position ===========
    const sharedUniforms = {
      u_lightDirection: m4.normalize([0.5, 1, 1]), // direction of the source light
      u_view: view,
      u_projection: projection,
      u_viewWorldPosition: cameraPosition,
    };

    // ======= Using the main shaders for the starting scene =========
    
    gl.useProgram(startProgramInfo.program);

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


    // ========= Skybox Settings =============
    gl.depthFunc(gl.LEQUAL)
    gl.useProgram(skyboxProgram);

    // ====== Turn on Skybox Positions ======
    gl.enableVertexAttribArray(skyboxPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, skyboxPositionBuffer);
    gl.vertexAttribPointer(skyboxPositionBuffer, 2, gl.FLOAT, false, 0, 0);

    const viewDirectionProjection = m4.multiply(projection, view);
    const viewDirectionProjectionInverse = m4.inverse(viewDirectionProjection);

    // ===== Setting Skybox uniforms =========
    gl.uniformMatrix4fv(viewDirectionProjectionInverseLocation, false, viewDirectionProjectionInverse);
    // Tell the shader to use texture unit 0 for u_skybox
    gl.uniform1i(skyboxLocation, skyboxTexture);


    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);


    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// ==== Execute WebGL Script =======
main();
