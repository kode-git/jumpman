"use strict";

//===================================================
//              General Keywords
//===================================================


// Zoom keys
var zoomKey = [false, false];
var moveKey = [false, false, false, false]; // a w s d 
var isMove = [false, false, false, false]


/**
 * Listener when a key is release
 * @param {*} e 
 */
var keyUp = function(e){
    isMove = false;
    if(e.keyCode == 38) zoomKey[0] = true; // arrow up
    if(e.keyCode == 40) zoomKey[1] = true; // arrow down
    if(e.keyCode == 65) moveKey[0] = false; // a key
    if(e.keyCode == 87) moveKey[1] = false; // w key
    if(e.keyCode == 83) moveKey[2] = false; // s key
    if(e.keyCode == 68) moveKey[3] = false; // d key
}



/**
 * Listener when a key is pressed
 * @param {*} e 
 */
var keyDown = function(e){
    isMove = true;    
    if(e.keyCode == 38) zoomKey[0] = false; // arrow up
    if(e.keyCode == 40) zoomKey[1] = false; // arrow down
    if(e.keyCode == 65) moveKey[0] = true; // a key
    if(e.keyCode == 87) moveKey[1] = true; // w key
    if(e.keyCode == 83) moveKey[2] = true; // s key
    if(e.keyCode == 68) moveKey[3] = true; // d key
}

//===================================================
//              Mobile Keywords
//===================================================

aKey.addEventListener('touchstart', function(e){
    moveKey[0] = true;    
})

aKey.addEventListener('touchend', function(e){
    moveKey[0] = false;
})

wKey.addEventListener('touchstart', function(e){
    moveKey[1] = true;    
})

wKey.addEventListener('touchend', function(e){
    moveKey[1] = false;
})


sKey.addEventListener('touchstart', function(e){
    moveKey[2] = true;    
})

sKey.addEventListener('touchend', function(e){
    moveKey[2] = false;
})

dKey.addEventListener('touchstart', function(e){
    moveKey[3] = true;    
})

dKey.addEventListener('touchend', function(e){
    moveKey[3] = false;
})

