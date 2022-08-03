"use strict";

/**
 * This script manages interface to leverage actions on user interface buttons.
 */
var audio, preview, shadow, info, objects, hidden, iconPreview;


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

/**
 * Main function.
 */
function main(){
    audio = document.getElementById('audio');
    preview = document.getElementById('preview');
    shadow = document.getElementById('shadow');
    info = document.getElementById('info')
    iconPreview = document.getElementById("inner-visibility-icon");
    objects = document.getElementsByClassName('object')
    hidden = false
    
    preview.onclick = initPreviewController;
    audio.onclick = audioToggle;
    shadow.onclick = shadowToggle;
    info.onclick = linkInfo;
}

/**
 * Init script on load
 */

window.onload = main;