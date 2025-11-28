const imgContainer = document.querySelector('.fijo-img');
const progressBtn = document.getElementById('video-progress');
const video = document.querySelector('video');

function updateProgress(progress) {
    console.log("progress", progress);
    imgContainer.style.clipPath = `circle(${progress}% at 50% 50%)`;
}

progressBtn.addEventListener('input', () => {
    video.currentTime = progressBtn.value;
    console.log("progressBtn.value", progressBtn.value);
    updateProgress(progressBtn.value);
});

video.addEventListener('timeupdate', () => {
    progressBtn.value = parseInt(progress.toFixed(2));
    const duration = video.duration;
    const progress = (video.currentTime / duration) * 100;
    console.log("progress", progress);
    updateProgress(progress);
});

video.addEventListener('ended', () => {
    progressBtn.value = 0;
});
