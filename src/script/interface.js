// ============= Audio Icon ==============

var audio = document.getElementById('audio')
var innerAudio = document.getElementById('inner-audio-icon')

audio.addEventListener('click', (e)=>{
    changeAudioIcon()
})

function changeAudioIcon(){
    console.log('Enter')
    if(innerAudio.innerHTML == "volume_up"){
        innerAudio.innerHTML = "volume_off"
    } else {
        innerAudio.innerHTML = "volume_up"
    }
}

// =========== Info Icon ===========

var info = document.getElementById('info')
info.addEventListener('click', (e)=>{
    this.location.href = "index.html"
})