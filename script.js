let currentStream;
let facingMode = "user"; // Start with selfie mode

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snap-btn');
const switchBtn = document.getElementById('switch-btn');
const countdownEl = document.getElementById('countdown');
const strip = document.getElementById('photo-strip');

// 1. Start Camera
async function initCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
        video.srcObject = currentStream;
        
        // Handle mirroring UI
        if (facingMode === 'user') {
            video.classList.add('mirror');
        } else {
            video.classList.remove('mirror');
        }
    } catch (err) {
        alert("Camera error: " + err.message);
    }
}

// 2. Switch Camera Logic
switchBtn.addEventListener('click', () => {
    facingMode = (facingMode === 'user') ? 'environment' : 'user';
    initCamera();
});

// 3. Take Photo with Countdown
snapBtn.addEventListener('click', () => {
    let count = 3;
    snapBtn.disabled = true;
    countdownEl.innerText = count;

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.innerText = count;
        } else {
            clearInterval(timer);
            countdownEl.innerText = "";
            capturePhoto();
            snapBtn.disabled = false;
        }
    }, 1000);
});

// 4. Capture and Add to Strip
function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // If mirrored, we need to mirror the canvas draw too
    if (facingMode === 'user') {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const data = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = data;
    
    // Add new photo to the top of the strip
    strip.prepend(img);
}

async function downloadStrip() {
    const photos = strip.querySelectorAll('img');
    if (photos.length === 0) {
        alert("Take some photos first!");
        return;
    }

    const stripCanvas = document.createElement('canvas');
    const ctx = stripCanvas.getContext('2d');

    // Set dimensions: Width of one photo, Height of all photos combined + padding
    const padding = 20;
    const photoWidth = photos[0].naturalWidth;
    const photoHeight = photos[0].naturalHeight;
    
    stripCanvas.width = photoWidth + (padding * 2);
    stripCanvas.height = (photoHeight * photos.length) + (padding * (photos.length + 1));

    // Fill background (White film strip look)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

    // Draw each photo onto the master canvas
    photos.forEach((img, index) => {
        const yOffset = padding + (index * (photoHeight + padding));
        ctx.drawImage(img, padding, yOffset, photoWidth, photoHeight);
    });

    // Create a download link
    const link = document.createElement('a');
    link.download = `vintage-strip-${Date.now()}.png`;
    link.href = stripCanvas.toDataURL('image/png');
    link.click();
}

// Attach to your download button
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', downloadStrip);

// Start on Load
initCamera();