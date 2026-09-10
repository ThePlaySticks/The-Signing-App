/**
 * Real MediaPipe Hands Tracker
 * Integrates Google MediaPipe Hands for on-device, client-side 21-point hand tracking.
 * Performs zero simulated gestures; only emits genuine classified signs.
 */
export class MediaPipeHandTracker {
  constructor(options = {}) {
    this.video = options.video;
    this.canvas = options.canvas;
    this.ctx = options.canvas ? options.canvas.getContext('2d') : null;
    this.onResults = options.onResults || null;
    this.onError = options.onError || null;

    this.hands = null;
    this.cameraUtils = null;
    this.isInitialized = false;
    this.isLoading = false;
    this.isProcessing = false;
  }

  async loadMediaPipe() {
    if (this.isInitialized) return true;
    if (this.isLoading) return false;

    this.isLoading = true;

    try {
      // 1. Load MediaPipe Hands script dynamically if not present
      if (!window.Hands) {
        await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
      }

      if (!window.Hands) {
        throw new Error('MediaPipe Hands library could not be loaded.');
      }

      this.hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      this.hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65
      });

      this.hands.onResults((results) => {
        this.isProcessing = false;
        if (this.onResults) {
          this.onResults(results);
        }
      });

      this.isInitialized = true;
      this.isLoading = false;
      return true;
    } catch (err) {
      this.isLoading = false;
      console.warn('MediaPipe Hands setup note:', err);
      if (this.onError) this.onError(err);
      return false;
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  /**
   * Send a video frame to MediaPipe for real 21-landmark computation
   */
  async processFrame(videoElement) {
    if (!this.isInitialized || !this.hands || this.isProcessing) return;
    if (videoElement.readyState < 2) return;

    this.isProcessing = true;
    try {
      await this.hands.send({ image: videoElement });
    } catch (e) {
      this.isProcessing = false;
    }
  }
}
