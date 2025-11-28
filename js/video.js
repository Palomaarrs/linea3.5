const imgContainer = document.querySelector('.fijo-img');
const progressBtn = document.getElementById('video-progress');
const video = document.querySelector('video');

function updateProgress(progress) {
    imgContainer.style.clipPath = `circle(${progress}% at 100% 0%)`;
}

progressBtn.addEventListener('input', () => {
    video.currentTime = progressBtn.value;
    updateProgress(progressBtn.value);
});

video.addEventListener('timeupdate', () => {
    const progress = parseInt(video.currentTime);
    progressBtn.value = parseInt(progress.toFixed(2));
    updateProgress(progress);
});

video.addEventListener('ended', () => {
    progressBtn.value = 0;
});
