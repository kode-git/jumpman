// ======== Skybox Utils for WebGL Skybox Management =======
class SkyBoxUtils {
    faces = [];
    gl;
    constructor(gl) {
        this.gl = gl;
        this.faces = [
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: 'src/assets/game/skybox/left.png',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: 'src/assets/game/skybox/right.png',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: 'src/assets/game/skybox/top.png',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url:'src/assets/game/skybox/bottom.png',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: 'src/assets/game/skybox/front.png',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: 'src/assets/game/skybox/back.png',
            },
        ];
    }

    /**
     * Skybox geometry on X and Y, z is the maximum one.
     * @param {*} gl is the WebGL context
     */
    setSkyBoxGeometry() {
        var positions = new Float32Array(
            [
                -1, -1,
                1, -1,
                -1, 1,
                -1, 1,
                1, -1,
                1, 1,
            ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    }

}



