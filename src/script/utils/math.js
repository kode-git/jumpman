
/**
 * Define if the value in input is a power of 2 or not
 * @param {number} value is the numerical parameter 
 * @returns {boolean} true if is power of 2, false otherwise
 */
function isPowerOf2(value){
    return Math.log2(value) % 1 === 0;
}

/**
 * Convert degree values in radiants
 * @param {number} deg is the current degree value
 * @returns {number} is the radiant converted value
 */
function degToRad(deg){
    return deg * Math.PI / 180;
}

/**
 * Convert radiant values in degrees
 * @param {number} rad is the current radiant value
 * @returns  {number} is the degree converted value
 */
function radToDeg(rad){
    return rad * 180 / Math.PI;
}