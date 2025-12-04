const video=document.querySelector('#video video');
const inputProgress=document.querySelector('#video-progress');

video.addEventListener('loadedmetadata',()=>{
    inputProgress.max=Math.floor(video.duration);
});

inputProgress.addEventListener('input',()=>{
    video.currentTime=inputProgress.value;
});

video.addEventListener('timeupdate',()=>{
    inputProgress.value=Math.floor(video.currentTime);
});