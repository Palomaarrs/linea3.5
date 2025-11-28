const imgContainer = document.querySelector('.fijo-img');
const progressBtn = document.getElementById('video-progress');
const video = document.querySelector('video');

function updateProgress(progress) {
    const percent = (progress / progressBtn.max) * 100;
    // Mostrar desde el borde derecho hacia la izquierda:
    // inset(top right bottom left) — dejamos fuera la parte izquierda equivalente a (100 - percent)%
    const leftInset = 100 - percent;
    imgContainer.style.clipPath = `inset(0 0 0 ${leftInset}%)`;
}

progressBtn.addEventListener('input', () => {
    video.currentTime = progressBtn.value;
    updateProgress(progressBtn.value);
});

video.addEventListener('timeupdate', () => {
    const progress = parseInt(video.currentTime);
    progressBtn.value = parseInt(progress);
    updateProgress(progress);
});

video.addEventListener('ended', () => {
    progressBtn.value = 0;
});
