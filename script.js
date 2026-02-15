let currentStream;
let facingMode = "user"; // Start with selfie mode

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snap-btn');
const switchBtn = document.getElementById('switch-btn');
const countdownEl = document.getElementById('countdown');
const strip = document.getElementById('photo-strip');
const downloadBtn = document.getElementById('download-btn');

// 1. Start Camera
async function initCamera() {
    // Stop any existing camera tracks to free up the hardware
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
        video.srcObject = currentStream;
        
        // Handle mirroring UI (mirrored for selfie, normal for back camera)
        if (facingMode === 'user') {
            video.classList.add('mirror');
        } else {
            video.classList.remove('mirror');
        }
    } catch (err) {
        alert("Camera error: " + err.message);
    }
}

// 2. Switch Camera Logic (Toggle between front and back)
switchBtn.addEventListener('click', () => {
    facingMode = (facingMode === 'user') ? 'environment' : 'user';
    initCamera();
});

// 3. Take Photo with 3-Second Countdown
snapBtn.addEventListener('click', () => {
    let count = 3;
    snapBtn.disabled = true; // Prevent multiple clicks
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
            // Show download button once at least one photo is taken
            downloadBtn.style.display = "inline-block";
        }
    }, 1000);
});

// 4. Capture individual photo and add to the UI
function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // If mirrored for selfie, we need to flip the canvas drawing too
    if (facingMode === 'user') {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const data = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = data;
    
    // Add new photo to the top of the strip container
    strip.prepend(img);
}

// 5. Download the entire strip as one vertical image with Date Stamp
async function downloadStrip() {
    const photos = strip.querySelectorAll('img');
    if (photos.length === 0) {
        alert("Take some photos first!");
        return;
    }

    const stripCanvas = document.createElement('canvas');
    const ctx = stripCanvas.getContext('2d');

    const padding = 20;
    const photoWidth = photos[0].naturalWidth;
    const photoHeight = photos[0].naturalHeight;
    
    // Calculate total height: (height of photos) + padding between them
    stripCanvas.width = photoWidth + (padding * 2);
    stripCanvas.height = (photoHeight * photos.length) + (padding * (photos.length + 1));

    // Fill background (White film strip border)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

    // Draw each photo onto the master canvas with the orange date stamp
    photos.forEach((img, index) => {
        const yOffset = padding + (index * (photoHeight + padding));
        ctx.drawImage(img, padding, yOffset, photoWidth, photoHeight);

        // --- VINTAGE ORANGE DATE STAMP ---
        ctx.fillStyle = "#ff8c00"; // Iconic digital date orange
        ctx.font = "bold 25px 'Courier New'"; // Typewriter font
        const date = new Date().toLocaleDateString();
        
        // Positioned at the bottom-right of each photo frame
        const xPos = stripCanvas.width - 180;
        const yPos = yOffset + photoHeight - 20;
        ctx.fillText(date, xPos, yPos);
    });

    // Create a virtual download link and click it
    const link = document.createElement('a');
    link.download = `vintage-strip-${Date.now()}.png`;
    link.href = stripCanvas.toDataURL('image/png');
    link.click();
}

// Attach the download function to the button
downloadBtn.addEventListener('click', downloadStrip);

// Initialize camera when the page loads
initCamera();