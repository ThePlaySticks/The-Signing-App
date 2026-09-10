/**
 * Sign Video Player Component
 * Renders verified native sign language demonstration videos
 * with full playback control, slow-motion review, and linguistic captions.
 */
export class SignVideoPlayer {
  constructor(containerElement) {
    this.container = containerElement;
    this.videoElement = null;
    this.currentSign = null;
    this.playbackSpeed = 1.0;
    this.isPlaying = false;

    this.renderShell();
  }

  renderShell() {
    this.container.innerHTML = `
      <div class="sign-video-wrapper" style="position: relative; width: 100%; height: 100%; background: #070a12; border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <video class="native-sign-video" playsinline preload="metadata" style="width: 100%; height: 100%; object-fit: cover;"></video>
        
        <!-- Video HUD Overlay -->
        <div class="video-hud-overlay" style="position: absolute; top: 1rem; left: 1rem; right: 1rem; display: flex; justify-content: space-between; align-items: flex-start; pointer-events: none;">
          <div class="current-sign-pill" style="pointer-events: auto;">
            <span class="sign-indicator-dot" style="background: var(--accent-cyan);"></span>
            <div>
              <div class="current-sign-text" id="video-sign-title">Ready</div>
              <div class="current-sign-type" id="video-sign-gloss">AUTHENTIC NSL RECORDING</div>
            </div>
          </div>
          <span class="badge-nsl" id="video-verified-badge">Verified Sign</span>
        </div>

        <!-- Linguistic Non-manual cues banner -->
        <div id="video-nonmanual-banner" style="position: absolute; bottom: 4.2rem; left: 1rem; right: 1rem; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.78rem; color: var(--text-muted); pointer-events: none; display: none;">
          <span style="color: var(--accent-amber); font-weight: 600;">Non-Manual Facial Cue:</span> <span id="video-cue-text">-</span>
        </div>

        <!-- Player Controls Bar -->
        <div class="avatar-controls-bar">
          <button class="avatar-ctrl-btn" id="btn-video-playpause" title="Play / Pause">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="icon-video-playpause"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
          <button class="avatar-ctrl-btn" id="btn-video-replay" title="Replay Video">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
          </button>
          <span style="height: 16px; width: 1px; background: var(--border-subtle);"></span>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">SPEED:</span>
          <select class="speed-select" id="video-speed-select">
            <option value="0.5">0.5x (Slow)</option>
            <option value="0.75">0.75x</option>
            <option value="1.0" selected>1.0x (Normal)</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>
    `;

    this.videoElement = this.container.querySelector('.native-sign-video');
    this.setupEvents();
  }

  setupEvents() {
    const playPauseBtn = this.container.querySelector('#btn-video-playpause');
    const replayBtn = this.container.querySelector('#btn-video-replay');
    const speedSelect = this.container.querySelector('#video-speed-select');

    if (playPauseBtn && this.videoElement) {
      playPauseBtn.addEventListener('click', () => {
        if (this.videoElement.paused) {
          this.play();
        } else {
          this.pause();
        }
      });
    }

    if (replayBtn && this.videoElement) {
      replayBtn.addEventListener('click', () => {
        this.videoElement.currentTime = 0;
        this.play();
      });
    }

    if (speedSelect && this.videoElement) {
      speedSelect.addEventListener('change', (e) => {
        this.playbackSpeed = parseFloat(e.target.value);
        this.videoElement.playbackRate = this.playbackSpeed;
      });
    }

    this.videoElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.updatePlayPauseIcon(false);
    });
  }

  loadSign(sign) {
    if (!sign || !this.videoElement) return;
    this.currentSign = sign;

    const titleEl = this.container.querySelector('#video-sign-title');
    const glossEl = this.container.querySelector('#video-sign-gloss');
    const bannerEl = this.container.querySelector('#video-nonmanual-banner');
    const cueTextEl = this.container.querySelector('#video-cue-text');

    if (titleEl) titleEl.textContent = sign.signName || sign.gloss;
    if (glossEl) glossEl.textContent = `GLOSS: ${sign.gloss} (NSL)`;

    if (sign.nonManualMarkers && sign.nonManualMarkers.facialExpression) {
      if (bannerEl) bannerEl.style.display = 'block';
      if (cueTextEl) cueTextEl.textContent = sign.nonManualMarkers.facialExpression;
    } else {
      if (bannerEl) bannerEl.style.display = 'none';
    }

    if (sign.media && sign.media.videoUrl) {
      this.videoElement.src = sign.media.videoUrl;
      this.videoElement.playbackRate = this.playbackSpeed;
      this.videoElement.load();
      this.play();
    }
  }

  play() {
    if (this.videoElement) {
      this.videoElement.play().then(() => {
        this.isPlaying = true;
        this.updatePlayPauseIcon(true);
      }).catch((e) => {
        console.log('Video autoplay prevented:', e);
      });
    }
  }

  pause() {
    if (this.videoElement) {
      this.videoElement.pause();
      this.isPlaying = false;
      this.updatePlayPauseIcon(false);
    }
  }

  updatePlayPauseIcon(isPlaying) {
    const playPauseBtn = this.container.querySelector('#btn-video-playpause');
    if (playPauseBtn) {
      playPauseBtn.innerHTML = isPlaying
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
  }
}
