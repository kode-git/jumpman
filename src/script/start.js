"use strict";

async function main() {

  // ======== Retrieve WebGL Context ===========
  const canvas = document.getElementById('game')
  const gl = canvas.getContext("webgl");


  // ======= Check Supportability ==========
  if(!utilityGL.isSupported(gl)) return;

  // =========== GLSL Program Initialization ==============
  const startProgramInfo = webglUtils.createProgramInfo(gl, ["start-vs", "start-fs"]);

  
  // ========== Loading Baseline Starting Jumpman Wavefront .obj ================
  const objHref = '../models/jumpman/start_baseline.obj';  
  const response = await fetch(objHref);
  if(!response) console.warn('Error during the texture loading...');

  // =========== Parsing Object to load the mesh and materials ==========
  const text = await response.text();
  const obj = parseOBJ(text);
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

  // ============= Load Texture for Materials =============
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
  const parts = obj.geometries.map(({material, data}) => {
    // Because data is just named arrays like this
    //
    // {
    //   position: [...],
    //   texcoord: [...],
    //   normal: [...],
    // }
    //
    // and because those names match the attributes in our vertex
    // shader we can pass it directly into `createBufferInfoFromArrays`
    // from the article "less code more fun".

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

  /**
   * Given positions of vertices, retrieves the extension coordinates 
   * @param {*} positions is the list of positions of vertices
   * @returns  minimum and maximum values to define the object space
   */
  function getExtents(positions) {
    const min = positions.slice(0, 3);
    const max = positions.slice(0, 3);
    for (let i = 3; i < positions.length; i += 3) {
      for (let j = 0; j < 3; ++j) {
        const v = positions[i + j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }
    return {min, max};
  }

  /**
   * Given the geometry related to an object, retrieves the object spa e
   * @param {*} geometries is the 
   * @returns 
   */
  function getGeometriesExtents(geometries) {
    return geometries.reduce(({min, max}, {data}) => {
      const minMax = getExtents(data.position);
      return {
        min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
        max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
      };
    }, {
      min: Array(3).fill(Number.POSITIVE_INFINITY),
      max: Array(3).fill(Number.NEGATIVE_INFINITY),
    });
  }

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

    const fieldOfViewRadians = utilityGL.degreeToRRadiant(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    const up = [0, 1, 0];
    // ======= Compute the camera's matrix using look at. ==========
    const camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // ======= Make a view matrix from the camera matrix. =========
    const view = m4.inverse(camera);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([-1, 3, 5]),
      u_view: view,
      u_projection: projection,
      u_viewWorldPosition: cameraPosition,
    };

    gl.useProgram(startProgramInfo.program);

    // ========= Set Uniforms for the Starting Program ===========
    webglUtils.setUniforms(startProgramInfo, sharedUniforms);

    // =========== Compute the world matrix once since all parts =========
    let u_world = m4.yRotation(time);
    u_world = m4.translate(u_world, ...objOffset);

    // ======== Setting buffer and uniforms for each part ==============
    for (const {bufferInfo, material} of parts) {
      // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
      webglUtils.setBuffersAndAttributes(gl, startProgramInfo, bufferInfo);
      // calls gl.uniform
      webglUtils.setUniforms(startProgramInfo, {
        u_world,
      }, material);
      // calls gl.drawArrays or gl.drawElements
      webglUtils.drawBufferInfo(gl, bufferInfo);
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// ==== Execute WebGL Script =======
main();
