/**
 * Create texture from images in a cube map for the skybox
 */
 function createSkyboxTexture(gl){
    var skyboxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
  
    const faceInfos = [
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        url: 'src/assets/game/skybox/top.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        url: 'src/assets/game/skybox/bottom.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        url: 'src/assets/game/skybox/right.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        url: 'src/assets/game/skybox/left.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        url: 'src/assets/game/skybox/front.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        url: 'src/assets/game/skybox/back.png',
      },
    ];
    faceInfos.forEach((faceInfo) => {
      const {target, url} = faceInfo;
  
      // Upload the canvas to the cubemap face.
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1024;
      const height = 1024;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;
  
      // setup each face so it's immediately renderable
      gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
  
      // Asynchronously load an image
      const image = new Image();
      image.src = url;
      image.crossOrigin = "anonymous"
      image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
        gl.texImage2D(target, level, internalFormat, format, type, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      });
    });


    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    return skyboxTexture;
  }