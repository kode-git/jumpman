"use strict";

/**
 * This script manages interface to leverage actions on user interface buttons.
 */
var audio, preview, shadow, info, objects, hidden, iconPreview;

// Skin Switching 
var back, forward;
var indexTexture = 0; // index of the wavefront object to load
var oldIndex; 

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

function backSkin(){
    indexTexture--;
}

function forwardSkin(){
    indexTexture++;
}
/**
 * Main function.
 */
function initButtonControllers(){
    audio = document.getElementById('audio');
    preview = document.getElementById('preview');
    shadow = document.getElementById('shadow');
    info = document.getElementById('info')
    iconPreview = document.getElementById("inner-visibility-icon");
    objects = document.getElementsByClassName('object')
    back = document.getElementById('arrow-back')
    forward = document.getElementById('arrow-forward')
    hidden = false
    
    preview.onclick = initPreviewController;
    audio.onclick = audioToggle;
    shadow.onclick = shadowToggle;
    info.onclick = linkInfo;
    back.onclick = backSkin;
    forward.onclick = forwardSkin;

}

/**
 * Init script on load
 */
initButtonControllers();