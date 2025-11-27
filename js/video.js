const progressBtn = document.getElementById('video-progress');
const video = document.querySelector('video');
const duration = video.duration;

progressBtn.addEventListener('input', () => {
    video.currentTime = progressBtn.value;
    console.log("progressBtn.value", progressBtn.value);
});

video.addEventListener('timeupdate', () => {
    const progress = (video.currentTime / duration) * 100;
    progressBtn.value = parseInt(progress.toFixed(2));
    console.log("progress", progress);
});

video.addEventListener('ended', () => {
    progressBtn.value = 0;
});
