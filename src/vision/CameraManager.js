export class CameraManager {
  constructor(videoElement, canvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.stream = null;
    this.isActive = false;
    this.facingMode = 'user'; // 'user' (front camera) or 'environment'
    this.onFrame = null;
    this.animationId = null;
  }

  async start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera access not supported on this device/browser.');
    }

    try {
      if (this.stream) {
        this.stop();
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      this.video.srcObject = this.stream;
      await this.video.play();
      this.isActive = true;

      if (this.canvas) {
        this.canvas.width = this.video.videoWidth || 640;
        this.canvas.height = this.video.videoHeight || 480;
      }

      this.loop();
      return true;
    } catch (err) {
      this.isActive = false;
      throw err;
    }
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  flipCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    if (this.isActive) {
      this.start();
    }
  }

  loop() {
    if (!this.isActive) return;

    if (this.onFrame && this.video.readyState >= 2) {
      this.onFrame(this.video, this.ctx, this.canvas);
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}
