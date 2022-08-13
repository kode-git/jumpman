"use strict";

/**
 * This script manages interface to leverage actions on user interface buttons.
 */


var audio, preview, shadow, info, objects, hidden, iconPreview, play;

// Skin Switching 
var indexTexture = 0; // index of the wavefront object to load
var oldIndex; 

var isShadow = false;

// Logic button status trigger 
var gameStart; // check the status of the inner game 

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

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
        if (hidden) {
            object.style.display = "none";
        }
        else {
            object.style.display = "block"
        }
    }
    if (hidden) iconPreview.innerHTML = "visibility_off"
    else iconPreview.innerHTML = "visibility"
    hidden = !hidden;
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

function loadingInterface(){
    var contents = document.getElementsByClassName('full');
    var loading = document.getElementById('loading');
    loading.style.display = "none";
    for(let i = 0; i < contents.length; i++){
        contents[i].style.display = "block";
    }


}

/**
 * Main function.
 */
function initButtonControllers(){
    /*
    audio = document.getElementById('audio');
    preview = document.getElementById('preview');
    shadow = document.getElementById('shadow');
    info = document.getElementById('info');
    iconPreview = document.getElementById("inner-visibility-icon");
    objects = document.getElementsByClassName('object');
    */
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

/**
 * Init script on load
 */
initButtonControllers();
disableScroll();