const progressBtn = document.getElementById('video-progress');
const video = document.querySelector('video');

progressBtn.addEventListener('input', () => {
    video.currentTime = progressBtn.value;
});

video.addEventListener('timeupdate', () => {
    progressBtn.value = Math.round(video.currentTime);
});

video.addEventListener('ended', () => {
    progressBtn.value = 0;
});
