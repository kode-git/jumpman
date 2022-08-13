"use strict";

/**
 * This script manages interface to leverage actions on user interface buttons.
 */

// mouse movement 
var drag = false;
var lastX, lastY;
var dX = 0, dY = 0;

// camera controls
var theta = degToRad(90);
var phi = degToRad(10);
var D = 7;

var abs;

// Shadow flag
var isShadow = false;

// hidden flag
var hidden = false;

// play button
var play;

// objects decorators references
var objects;

// Logic button status trigger 
var gameStart; // check the status of the inner game 

// key to predict scrolls
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; } 
    }));
  } catch(e) {}
  
  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// control GUI
var gui = new dat.GUI();
var controls = {
    D : 7,
    Shadow : false,
    Image : false,
}
/**
 * Remove a default event action
 * @param {*} e is the event to trigger
 */
function preventDefault(e) {
  e.preventDefault();
}

/**
 * Remove a default event action related to a key
 * @param {*} e is the event of interest
 * @returns false if it trigger an interested key
 */
function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

/**
 * Disable windows scrolls
 */
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

/**
 * Remove external objects from the interface.
 */
function initPreviewController(){
    for (let object of objects) {
        if (controls.Image) {
            object.style.display = "none";
        }
        else {
            object.style.display = "block"
        }
    }
}

/**
 * Redirect to the index.html
 */
function linkInfo(){
    startGame = false;
    window.location.replace('./index.html');
}

/**
 * Remove shadows.
 */
function shadowToggle(){
    // 
}

/**
 * Toggle of audio file in background play.
 */
function audioToggle(){
    //
}

/**
 * Start game status
 */
function startGame(){
    gameStart = true;
}

/**
 * Remove the Start Buttons
 */
function toggleStartButtons(){
    if(gameStart){
        play.style.display = "none";
    }
}

/*
function loadingInterface(){
    var contents = document.getElementsByClassName('full');
    var loading = document.getElementById('loading');
    loading.style.display = "none";
    for(let i = 0; i < contents.length; i++){
        contents[i].style.display = "block";
    }
}

*/

/**
 * Main function.
 */
function initButtonControllers(){
    /*
    audio = document.getElementById('audio');
    preview = document.getElementById('preview');
    shadow = document.getElementById('shadow');
    info = document.getElementById('info');
    */
    objects = document.getElementsByClassName('object');
    play = document.getElementById('play-button');
    hidden = false;
    gameStart = false;
    
    /*
    preview.onclick = initPreviewController;
    audio.onclick = audioToggle;
    shadow.onclick = shadowToggle;
    info.onclick = linkInfo;
    */
    play.onclick = startGame;

}


function initInterfaceGUI(){
    gui.add(controls, "D").min(5).max(50).step(1).onChange(()=>{
        D = controls.D;
    })
    gui.add(controls, "Shadow")
    gui.add(controls, "Image").onChange(()=>{
        initPreviewController();
    });
}
/**
 * Init script on load
 */
initButtonControllers();
initInterfaceGUI();
disableScroll();