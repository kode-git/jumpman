"use strict";

//===================================================
//              Mouse Controller
//===================================================

// mouse movement 
var drag = false;
var lastX, lastY;
var dX = 0, dY = 0;

// camera controls
var theta = degToRad(90);
var phi = degToRad(10);
var D = 7;

var abs;

/**
 * Listener for the mouse down
 * @param {*} e
 * @returns {boolean}
 */
var mouseDown = function (e) {
    drag = true;
    lastX = e.pageX, lastY = e.pageY;
    e.preventDefault();
    return false;
};

/**
 * Listener for the Mouse Up
 * @param {*} e 
 */
var mouseUp = function (e) {
    drag = false;
};

/**
 * Listener for the mouse movement 
 * @param {*} e 
 * @returns 
 */
var mouseMove = function (e) {
    if (!drag) return false;
    dX = (e.pageX - lastX) * 2 * Math.PI / canvas.width,
        dY = (e.pageY - lastY) * 2 * Math.PI / canvas.height;
    theta += dX;
    phi += dY;
    lastX = e.pageX, lastY = e.pageY;
    e.preventDefault();
};
