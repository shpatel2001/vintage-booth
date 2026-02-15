# vintage-booth
Vintage camera booth 
Retro-Snap: A Vintage Photo Booth for the Web
Retro-Snap is a browser-based photo booth that brings the nostalgic feel of 90s analog film strips to your modern device. Built with the WebRTC API, this project mimics the physical photo booth experience—complete with timed sequences and that iconic orange date stamp.

Why I Built This
I wanted to explore how to manipulate real-time media streams without relying on heavy libraries or third-party filters. This project served as a deep dive into the Canvas API and asynchronous JavaScript, specifically focusing on:

Coordinating timed events (the 3-shot sequence).

Managing hardware permissions across mobile and desktop.

Dynamically stitching multiple images into a single downloadable asset.

Key Features
Automated 3-Shot Sequence: A single click triggers three separate captures with a 3-second countdown between each. No manual clicking required.

Smart Mirroring: Uses CSS logic to mirror the front-facing camera (selfie mode) so the experience feels like a real mirror, while keeping the rear camera view standard.

The "Date Stamp": Every downloaded strip features an orange digital date stamp, inspired by old-school disposable cameras.

Mobile-First Design: Fully responsive UI with a dedicated camera-flip button for smartphones.

The Tech Behind the Lens
WebRTC (getUserMedia): To access and stream the camera feed directly in the browser.

Canvas API: Used to "print" each video frame and eventually stitch them into a vertical strip.

JavaScript (Async/Await): To handle the timing of the photo sequence and ensure the camera switches smoothly.

GitHub Pages: For fast, secure, and free hosting.


git commit -m "added a human-centered README"

git push
