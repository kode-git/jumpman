
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

/**
 * Return a float number between min and max
 * @param {number} min is the minimum value
 * @param {number} max is the maximum value
 * @returns a random value between min and max
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


  /**
   * Return an integer random value between min and max
   * @param {number} min is the minimum value
   * @param {number} max is the maximum value
   * @returns a random vsalue between min and max
   */
function getRandomInteger(min, max){
    return Math.floor(getRandomArbitrary(min, max));
}

/**
 * Check if the value is between min and max
 * @param {*} value is the value to check
 * @param {*} min is the minimum value
 * @param {*} max is the maximum value
 * @returns 
 */
function isBetween(value, min, max){
    return value >= min && value <= max;
}

/**
 * Calculate th distance between a point and a rectangle (from its minimum and maximum point)
 * @param {*} rect is the rectangle
 * @param {*} p is the point
 * @returns the distance between p and rect
 */
function distance(rect, p) {
    var dx = Math.max(rect.min.x - p.x, 0, p.x - rect.max.x);
    var dy = Math.max(rect.min.y - p.y, 0, p.y - rect.max.y);
    return Math.sqrt(dx*dx + dy*dy);
  }