let currentStream;
let facingMode = "user";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snap-btn');
const switchBtn = document.getElementById('switch-btn');
const countdownEl = document.getElementById('countdown');
const strip = document.getElementById('photo-strip');
const downloadBtn = document.getElementById('download-btn');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function initCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
        video.srcObject = currentStream;
        facingMode === 'user' ? video.classList.add('mirror') : video.classList.remove('mirror');
    } catch (err) {
        alert("Camera error: " + err.message);
    }
}

switchBtn.addEventListener('click', () => {
    facingMode = (facingMode === 'user') ? 'environment' : 'user';
    initCamera();
});

// Automatic 3-Shot Sequence
snapBtn.addEventListener('click', async () => {
    snapBtn.disabled = true;
    
    for (let i = 0; i < 3; i++) {
        let count = 3;
        
        while (count > 0) {
            countdownEl.innerText = count;
            await delay(1000);
            count--;
        }

        countdownEl.innerText = "📸";
        capturePhoto();
        await delay(800); 
        countdownEl.innerText = "";
    }

    snapBtn.disabled = false;
    downloadBtn.style.display = "inline-block";
});

function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (facingMode === 'user') {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const data = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = data;
    strip.prepend(img); // Newest photo at the top
}

async function downloadStrip() {
    const photos = strip.querySelectorAll('img');
    if (photos.length === 0) return;

    const stripCanvas = document.createElement('canvas');
    const ctx = stripCanvas.getContext('2d');

    const padding = 20;
    const photoWidth = photos[0].naturalWidth;
    const photoHeight = photos[0].naturalHeight;
    
    stripCanvas.width = photoWidth + (padding * 2);
    stripCanvas.height = (photoHeight * photos.length) + (padding * (photos.length + 1));

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

    photos.forEach((img, index) => {
        const yOffset = padding + (index * (photoHeight + padding));
        ctx.drawImage(img, padding, yOffset, photoWidth, photoHeight);

        // Vintage Orange Date Stamp
        ctx.fillStyle = "#ff8c00"; 
        ctx.font = `bold ${Math.floor(photoWidth/25)}px 'Courier New'`;
        const date = new Date().toLocaleDateString();
        ctx.fillText(date, stripCanvas.width - (photoWidth/3), yOffset + photoHeight - 20);
    });

    const link = document.createElement('a');
    link.download = `booth-strip-${Date.now()}.png`;
    link.href = stripCanvas.toDataURL('image/png');
    link.click();
}

downloadBtn.addEventListener('click', downloadStrip);
initCamera();