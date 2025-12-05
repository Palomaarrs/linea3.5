const imgContainer = document.querySelector('.fijo-img');
const progressBtn = document.getElementById('video-progress');
const inputPlace = document.getElementById('perspective');
const video = document.querySelector('video');
const title = document.querySelector('.fijo-exp');
function updateProgress(progress) {
    const percent = (progress / progressBtn.max) * 100;
    // Mostrar desde el borde derecho hacia la izquierda:
    // inset(top right bottom left) — dejamos fuera la parte izquierda equivalente a (100 - percent)%
    const leftInset = 70 - percent;
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

inputPlace.addEventListener('change', () => {
    const perspectiveValue = Number(inputPlace.value);
    if (perspectiveValue === 0) {
        window.location.href = 'indiosverdes.html';
    } else if (perspectiveValue === 100) {
        window.location.href = 'lomas.html';
    }
})


inputPlace.addEventListener('input', () => {
    const perspectiveValue = Number(inputPlace.value);
    title.style.fontVariationSettings = `'wght' ${100 + perspectiveValue * 7}`;
})