const imgContainer = document.querySelector('.fijo-img');
const progressBtn = document.getElementById('video-progress');
const inputPlace = document.getElementById('perspective');
const video = document.querySelector('video');
const title = document.querySelector('.fijo-exp');
const videoMessage = document.getElementById('video-message');

// Obtener el tiempo de inicio desde el atributo data-start
const dataStart = parseFloat(video.getAttribute('data-start')) || 0;

function updateProgress(progress) {
    const videoDuration = video.duration || progressBtn.max;
    const effectiveDuration = videoDuration - dataStart;
    
    // Calcular el progreso relativo desde data-start
    const relativeProgress = Math.max(0, progress - dataStart);
    const percent = effectiveDuration > 0 ? (relativeProgress / effectiveDuration) * 100 : 0;
    
    // Limitar el porcentaje entre 0 y 100
    const clampedPercent = Math.min(100, Math.max(0, percent));
    
    // Mostrar desde el borde derecho hacia la izquierda:
    // inset(top right bottom left) — dejamos fuera la parte izquierda equivalente a (100 - percent)%
    const leftInset = 100 - clampedPercent;
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
    
    // Mostrar mensaje cuando el video alcance el tiempo meta
    // El tiempo meta se calcula basándose en la duración efectiva desde data-start
    const videoDuration = video.duration || progressBtn.max;
    const effectiveDuration = videoDuration - dataStart;
    const tiempo_meta = dataStart + (effectiveDuration / 1.145); // tiempo meta relativo desde data-start
    
    if (video.currentTime >= tiempo_meta && videoMessage) {
        videoMessage.style.display = 'block';
    } else if (video.currentTime < tiempo_meta && videoMessage) {
        videoMessage.style.display = 'none';
    }
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

updateProgress(0);

// Ocultar el mensaje inicialmente
if (videoMessage) {
    videoMessage.style.display = 'none';
}