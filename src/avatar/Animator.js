import { NSL_ALPHABET, NSL_WORD_SIGNS, translateToSignGrammar } from '../data/nsl_vocabulary.js';

export class AvatarAnimator {
  constructor(avatarRenderer) {
    this.renderer = avatarRenderer;
    this.speed = 1.0;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentQueue = [];
    this.currentIndex = 0;
    this.currentProgress = 0;
    this.onWordChange = null;
    this.onComplete = null;
    this.onStateChange = null;
    this.lastTimestamp = null;
    this.currentAnimationItem = null;

    // Store rest poses
    this.restPose = {
      rightArm: { shoulderZ: -0.15, shoulderX: 0.1, elbowX: 0.35, wristZ: 0 },
      leftArm: { shoulderZ: 0.15, shoulderX: 0.1, elbowX: 0.35, wristZ: 0 },
      head: { x: 0, y: 0 },
      fingers: { thumb: 0.1, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 }
    };
  }

  setSpeed(multiplier) {
    this.speed = Math.max(0.25, Math.min(3.0, multiplier));
  }

  pause() {
    this.isPaused = true;
    if (this.onStateChange) this.onStateChange({ isPlaying: this.isPlaying, isPaused: this.isPaused });
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.lastTimestamp = performance.now();
      if (this.onStateChange) this.onStateChange({ isPlaying: this.isPlaying, isPaused: this.isPaused });
      this.tick(this.lastTimestamp);
    }
  }

  replay() {
    if (this.lastSentence) {
      this.playSentence(this.lastSentence);
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentQueue = [];
    this.currentIndex = 0;
    this.currentProgress = 0;
    this.applyPose(this.restPose);
    if (this.onStateChange) this.onStateChange({ isPlaying: false, isPaused: false });
  }

  /**
   * Translates English/speech into Sign Grammar and plays the animation sequence
   */
  playSentence(sentence) {
    this.lastSentence = sentence;
    const signGlossList = translateToSignGrammar(sentence);
    this.currentQueue = [];

    for (const token of signGlossList) {
      const upper = token.toUpperCase();
      if (NSL_WORD_SIGNS[upper]) {
        this.currentQueue.push({
          type: 'word',
          text: upper,
          data: NSL_WORD_SIGNS[upper]
        });
      } else {
        // Fallback: Fingerspell the word
        for (const char of upper) {
          if (NSL_ALPHABET[char]) {
            this.currentQueue.push({
              type: 'letter',
              text: char,
              data: NSL_ALPHABET[char],
              duration: 0.75
            });
          }
        }
      }
    }

    if (this.currentQueue.length === 0) return;

    this.currentIndex = 0;
    this.currentProgress = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.lastTimestamp = performance.now();

    if (this.onStateChange) this.onStateChange({ isPlaying: true, isPaused: false });
    this.startCurrentItem();
    requestAnimationFrame((t) => this.tick(t));
  }

  startCurrentItem() {
    if (this.currentIndex >= this.currentQueue.length) {
      this.isPlaying = false;
      this.applyPose(this.restPose);
      if (this.onComplete) this.onComplete();
      if (this.onStateChange) this.onStateChange({ isPlaying: false, isPaused: false });
      return;
    }

    this.currentAnimationItem = this.currentQueue[this.currentIndex];
    this.currentProgress = 0;

    if (this.onWordChange) {
      this.onWordChange({
        word: this.currentAnimationItem.text,
        type: this.currentAnimationItem.type,
        index: this.currentIndex,
        total: this.currentQueue.length
      });
    }
  }

  tick(timestamp) {
    if (!this.isPlaying || this.isPaused) return;

    const delta = (timestamp - (this.lastTimestamp || timestamp)) / 1000;
    this.lastTimestamp = timestamp;

    const item = this.currentAnimationItem;
    if (!item) return;

    const duration = item.type === 'word' ? (item.data.duration || 1.2) : (item.duration || 0.75);
    const step = (delta * this.speed) / duration;
    this.currentProgress += step;

    if (this.currentProgress >= 1.0) {
      this.currentIndex++;
      this.startCurrentItem();
    } else {
      this.renderProgress(item, this.currentProgress);
    }

    if (this.isPlaying && !this.isPaused) {
      requestAnimationFrame((t) => this.tick(t));
    }
  }

  renderProgress(item, progress) {
    if (item.type === 'word') {
      const kfs = item.data.keyframes;
      // find interval
      let startKf = kfs[0];
      let endKf = kfs[kfs.length - 1];
      for (let i = 0; i < kfs.length - 1; i++) {
        if (progress >= kfs[i].t && progress <= kfs[i + 1].t) {
          startKf = kfs[i];
          endKf = kfs[i + 1];
          break;
        }
      }
      const range = endKf.t - startKf.t || 1;
      const subT = Math.sin(((progress - startKf.t) / range) * (Math.PI / 2)); // smooth ease
      this.interpolateKeyframes(startKf, endKf, subT);
    } else if (item.type === 'letter') {
      // smooth hold
      const letterData = item.data;
      const tNorm = Math.min(1, progress * 1.5);
      this.applyLetterPose(letterData, tNorm);
    }
  }

  interpolateKeyframes(kfA, kfB, factor) {
    const lerp = (a, b, t) => (a !== undefined && b !== undefined ? a + (b - a) * t : a || 0);

    const bones = this.renderer.bones;
    if (!bones) return;

    // Right Arm
    if (kfA.rightArm && kfB.rightArm && bones.rightArm) {
      bones.rightArm.shoulder.rotation.z = lerp(kfA.rightArm.shoulderZ, kfB.rightArm.shoulderZ, factor);
      bones.rightArm.elbow.rotation.x = lerp(kfA.rightArm.elbowX, kfB.rightArm.elbowX, factor);
      bones.rightArm.wrist.rotation.z = lerp(kfA.rightArm.wristZ, kfB.rightArm.wristZ, factor);
    }

    // Left Arm
    if (kfA.leftArm && kfB.leftArm && bones.leftArm) {
      bones.leftArm.shoulder.rotation.z = lerp(kfA.leftArm.shoulderZ, kfB.leftArm.shoulderZ, factor);
      bones.leftArm.elbow.rotation.x = lerp(kfA.leftArm.elbowX, kfB.leftArm.elbowX, factor);
      bones.leftArm.wrist.rotation.z = lerp(kfA.leftArm.wristZ, kfB.leftArm.wristZ, factor);
    }

    // Head
    if (kfA.head && kfB.head && bones.head) {
      bones.head.rotation.y = lerp(kfA.head.y, kfB.head.y, factor);
      bones.head.rotation.x = lerp(kfA.head.x, kfB.head.x, factor);
    }

    // Fingers
    const fA = kfA.fingers || {};
    const fB = kfB.fingers || {};
    ['thumb', 'index', 'middle', 'ring', 'pinky'].forEach((f) => {
      const curl = lerp(fA[f] !== undefined ? fA[f] : 0, fB[f] !== undefined ? fB[f] : 0, factor);
      if (bones.rightArm && bones.rightArm.fingers[f]) {
        bones.rightArm.fingers[f].rotation.x = -curl * 1.5;
      }
    });
  }

  applyLetterPose(letterData, factor) {
    const bones = this.renderer.bones;
    if (!bones || !bones.rightArm) return;

    const arm = letterData.rightArm;
    const fingers = letterData.fingers;

    const lerp = (a, b, t) => a + (b - a) * t;

    bones.rightArm.shoulder.rotation.z = lerp(this.restPose.rightArm.shoulderZ, arm.shoulderZ, factor);
    bones.rightArm.elbow.rotation.x = lerp(this.restPose.rightArm.elbowX, arm.elbowX, factor);
    bones.rightArm.wrist.rotation.z = lerp(this.restPose.rightArm.wristZ, arm.wristZ, factor);

    Object.keys(fingers).forEach((f) => {
      if (bones.rightArm.fingers[f]) {
        const targetCurl = fingers[f] * 1.5;
        bones.rightArm.fingers[f].rotation.x = lerp(0, -targetCurl, factor);
      }
    });
  }

  applyPose(pose) {
    const bones = this.renderer.bones;
    if (!bones) return;

    if (pose.rightArm && bones.rightArm) {
      bones.rightArm.shoulder.rotation.z = pose.rightArm.shoulderZ;
      bones.rightArm.shoulder.rotation.x = pose.rightArm.shoulderX || 0;
      bones.rightArm.elbow.rotation.x = pose.rightArm.elbowX;
      bones.rightArm.wrist.rotation.z = pose.rightArm.wristZ;
    }

    if (pose.leftArm && bones.leftArm) {
      bones.leftArm.shoulder.rotation.z = pose.leftArm.shoulderZ;
      bones.leftArm.shoulder.rotation.x = pose.leftArm.shoulderX || 0;
      bones.leftArm.elbow.rotation.x = pose.leftArm.elbowX;
      bones.leftArm.wrist.rotation.z = pose.leftArm.wristZ;
    }

    if (pose.head && bones.head) {
      bones.head.rotation.x = pose.head.x;
      bones.head.rotation.y = pose.head.y;
    }

    if (pose.fingers && bones.rightArm) {
      Object.keys(pose.fingers).forEach((f) => {
        if (bones.rightArm.fingers[f]) {
          bones.rightArm.fingers[f].rotation.x = -pose.fingers[f] * 1.5;
        }
        if (bones.leftArm && bones.leftArm.fingers[f]) {
          bones.leftArm.fingers[f].rotation.x = -pose.fingers[f] * 1.5;
        }
      });
    }
  }
}
