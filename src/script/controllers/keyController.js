"use strict";

// Zoom keys
var zoomKey = [false, false];

/**
 * Listener when a key is release
 * @param {*} e 
 */
var keyUp = function(e){
    console.log('Key Up')
    if(e.keyCode == 38) zoomKey[0] = true;
    if(e.keyCode == 40) zoomKey[1] = true;
}

/**
 * Listener when a key is pressed
 * @param {*} e 
 */
var keyDown = function(e){
    console.log('Key Down')
    if(e.keyCode == 38) zoomKey[0] = false;
    if(e.keyCode == 40) zoomKey[1] = false;
}