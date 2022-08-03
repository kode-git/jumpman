"use strict";

/**
 * This script manages interface to leverage actions on user interface buttons.
 */


var audio, preview, shadow, info, objects, hidden, iconPreview, play;

// Skin Switching 
var back, forward;
var indexTexture = 0; // index of the wavefront object to load
var oldIndex; 


// Logic button status trigger 
var gameStart; // check the status of the inner game 



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
 * Select the previous skin
 */
function backSkin(){
    indexTexture--;
}

/**
 * Select the next skin
 */
function forwardSkin(){
    indexTexture++;
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
        back.style.display = "none";
        forward.style.display = "none";
    }
}

/**
 * Main function.
 */
function initButtonControllers(){
    audio = document.getElementById('audio');
    preview = document.getElementById('preview');
    shadow = document.getElementById('shadow');
    info = document.getElementById('info');
    iconPreview = document.getElementById("inner-visibility-icon");
    objects = document.getElementsByClassName('object');
    back = document.getElementById('arrow-back');
    forward = document.getElementById('arrow-forward');
    play = document.getElementById('play-button');
    hidden = false;
    gameStart = false;
    
    preview.onclick = initPreviewController;
    audio.onclick = audioToggle;
    shadow.onclick = shadowToggle;
    info.onclick = linkInfo;
    back.onclick = backSkin;
    forward.onclick = forwardSkin;
    play.onclick = startGame;

}

function startInterface(){
    
}

/**
 * Init script on load
 */
initButtonControllers();