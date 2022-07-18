const average = document.getElementById('fps-value')
console.log(average)
const frameTimes = [];
let   frameCursor = 0;
let   numFrames = 0;   
const maxFrames = 20;
let   totalFps = 0;
let then = 0;
let interval = 0
async function render(now) {
  now *= 0.001;                          // convert to seconds
  const deltaTime = now - then;          // compute time since last frame
  then = now;                            // remember time for next frame
  const fps = 1 / deltaTime;             // compute frames per second
  
  // add the current fps and remove the oldest fps
  totalFps += fps - (frameTimes[frameCursor] || 0);
  
  // record the newest fps
  frameTimes[frameCursor++] = fps;
  
  // needed so the first N frames, before we have maxFrames, is correct.
  numFrames = Math.max(numFrames, frameCursor);
  
  // wrap the cursor
  frameCursor %= maxFrames;
  const averageFps = totalFps / numFrames;
  if(interval < 50){
    interval += 1
  } else {
    average.textContent = averageFps.toFixed(1);
    interval = 0;
  }
  setTimeout(requestAnimationFrame(render), 2000);
}
setTimeout(requestAnimationFrame(render), 2000);