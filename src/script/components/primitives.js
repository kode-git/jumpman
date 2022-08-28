
function createBufferInfoFunc(fn) {
    return function (gl) {
        const arrays = fn.apply(null, Array.prototype.slice.call(arguments, 1));
        return webglUtils.createBufferInfoFromArrays(gl, arrays);
    };
}

function createCubeVertices() {
    const k = 1 / 2;

    const cornerVertices = [
        [-k, -k, -k],
        [+k, -k, -k],
        [-k, +k, -k],
        [+k, +k, -k],
        [-k, -k, +k],
        [+k, -k, +k],
        [-k, +k, +k],
        [+k, +k, +k],
    ];

    const faceNormals = [
        [+1, +0, +0],
        [-1, +0, +0],
        [+0, +1, +0],
        [+0, -1, +0],
        [+0, +0, +1],
        [+0, +0, -1],
    ];

    const uvCoords = [
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
    ];

    const numVertices = 6 * 4;
    const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
    const normals = webglUtils.createAugmentedTypedArray(3, numVertices);
    const texCoords = webglUtils.createAugmentedTypedArray(2, numVertices);
    const indices = webglUtils.createAugmentedTypedArray(3, 6 * 2, Uint16Array);

    for (let f = 0; f < 6; ++f) {
        const faceIndices = CUBE_FACE_INDICES[f];
        for (let v = 0; v < 4; ++v) {
            const position = cornerVertices[faceIndices[v]];
            const normal = faceNormals[f];
            const uv = uvCoords[v];

            // Each face needs all four vertices because the normals and texture
            // coordinates are not all the same.
            positions.push(position);
            normals.push(normal);
            texCoords.push(uv);

        }
        // Two triangles make a square face.
        const offset = 4 * f;
        indices.push(offset + 0, offset + 1, offset + 2);
        indices.push(offset + 0, offset + 2, offset + 3);
    }

    return {
        position: positions,
        normal: normals,
        texcoord: texCoords,
        indices: indices,
    };
}

const CUBE_FACE_INDICES = [
    [3, 7, 5, 1], // right
    [6, 2, 0, 4], // left
    [6, 7, 3, 2], // up
    [0, 1, 5, 4], // down
    [7, 6, 4, 5], // front
    [2, 3, 1, 0], // back
];

// function createXYQuadVertices(size, xOffset, yOffset) {
//   size = size || 2;
//   xOffset = xOffset || 0;
//   yOffset = yOffset || 0;
//   size *= 0.5;
function createXYQuadVertices() {
    var xOffset = 0;
    var yOffset = 0;
    var size = 1;
    return {
        position: {
            numComponents: 2,
            data: [
                xOffset + -1 * size, yOffset + -1 * size,
                xOffset + 1 * size, yOffset + -1 * size,
                xOffset + -1 * size, yOffset + 1 * size,
                xOffset + 1 * size, yOffset + 1 * size,
            ],
        },
        normal: [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ],
        texcoord: [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ],
        indices: [0, 1, 2, 2, 1, 3],
    };
}




function createCubeVertices(size) {
    const k = size / 2;

    const cornerVertices = [
        [-k, -k, -k],
        [+k, -k, -k],
        [-k, +k, -k],
        [+k, +k, -k],
        [-k, -k, +k],
        [+k, -k, +k],
        [-k, +k, +k],
        [+k, +k, +k],
    ];

    const faceNormals = [
        [+1, +0, +0],
        [-1, +0, +0],
        [+0, +1, +0],
        [+0, -1, +0],
        [+0, +0, +1],
        [+0, +0, -1],
    ];

    const uvCoords = [
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
    ];

    const numVertices = 6 * 4;
    const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
    const normals = webglUtils.createAugmentedTypedArray(3, numVertices);
    const texCoords = webglUtils.createAugmentedTypedArray(2, numVertices);
    const indices = webglUtils.createAugmentedTypedArray(3, 6 * 2, Uint16Array);

    for (let f = 0; f < 6; ++f) {
        const faceIndices = CUBE_FACE_INDICES[f];
        for (let v = 0; v < 4; ++v) {
            const position = cornerVertices[faceIndices[v]];
            const normal = faceNormals[f];
            const uv = uvCoords[v];

            // Each face needs all four vertices because the normals and texture
            // coordinates are not all the same.
            positions.push(position);
            normals.push(normal);
            texCoords.push(uv);

        }
        // Two triangles make a square face.
        const offset = 4 * f;
        indices.push(offset + 0, offset + 1, offset + 2);
        indices.push(offset + 0, offset + 2, offset + 3);
    }

    return {
        position: positions,
        normal: normals,
        texcoord: texCoords,
        indices: indices,
    };
}

const createCubeBufferInfo = createBufferInfoFunc(createCubeVertices)
const createXYQuadBufferInfo = createBufferInfoFunc(createXYQuadVertices)