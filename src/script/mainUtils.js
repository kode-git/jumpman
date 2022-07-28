"use strict";

// ============ DOM Utility Class ===========

class UtilityDOM{
    
    hidden;
    objects;
    icon;
    
    constructor(){
        this.hidden = false
        this.objects = document.getElementsByClassName('object')
        this.icon = document.getElementById("inner-visibility-icon");
    }

    toggleAnimation(){

        for (let object of this.objects) {
            console.log(object)
            if (this.hidden) {
                object.style.display = "none";
            }
            else {
                object.style.display = "block"
            }
        }
        if (this.hidden) this.icon.innerHTML = "visibility_off"
        else this.icon.innerHTML = "visibility"
        this.hidden = !this.hidden;
    }

}

// ========== WebGL Utility Class ==============

class UtilityGL{
    constructor(){
        //
    }

    isMobile(){
        return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini/i) ? true : false;
    }

    isSupported(gl){
        if(!gl){
            console.warn('WebGL is not supported, current web browser can run the application.')
            return false;
        } else {
            return true;
        }
    }

    radiantToDegree(radiant){
        return radiant * 180 / Math.PI;
    }

    degreeToRRadiant(degree){
        return degree * Math.PI / 180;
    }

    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
      }

}


// ========= Javascript Utilities Instances ==========

const utilityDOM = new UtilityDOM();
const utilityGL = new UtilityGL();

// ===================================================