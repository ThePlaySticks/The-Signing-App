/**
 * Gesture Recognizer
 * Evaluates hand landmark geometry to classify common signs:
 * - HELLO (Open flat hand facing forward)
 * - YES / GOOD (Thumb up, fist closed)
 * - NO (Index & Middle snapping or open while others closed)
 * - HELP / THANK YOU (Hand forward from chest or flat palm)
 * - I LOVE YOU (ILY - Thumb, Index, Pinky extended, middle & ring curled)
 * - WATER (W-Handshape: Index, Middle, Ring up)
 * - PEACE / V (Index and Middle up in V)
 * - POINT / YOU (Index extended, others curled)
 * - OK (Thumb and Index touching in circle, 3 fingers up)
 */

export class GestureRecognizer {
  constructor() {
    this.onGestureDetected = null;
    this.lastDetectedSign = null;
    this.confidenceThreshold = 0.72;
    this.consecutiveCount = 0;
    this.candidateSign = null;
  }

  /**
   * Process 21 hand landmarks
   * Each landmark is { x, y, z } normalized [0, 1]
   */
  classifyLandmarks(landmarks) {
    if (!landmarks || landmarks.length < 21) return null;

    const lm = landmarks;

    // Helper: is finger extended? (tip.y < pip.y in normal upright hand)
    const isExtended = (tipIdx, pipIdx) => lm[tipIdx].y < lm[pipIdx].y - 0.04;
    const isCurled = (tipIdx, pipIdx) => lm[tipIdx].y > lm[pipIdx].y + 0.02;

    const thumbExtended = lm[4].x < lm[3].x - 0.04 || lm[4].y < lm[3].y - 0.04; // thumb is angled
    const indexExtended = isExtended(8, 6);
    const middleExtended = isExtended(12, 10);
    const ringExtended = isExtended(16, 14);
    const pinkyExtended = isExtended(20, 18);

    const indexCurled = isCurled(8, 6);
    const middleCurled = isCurled(12, 10);
    const ringCurled = isCurled(16, 14);
    const pinkyCurled = isCurled(20, 18);

    // Distance between thumb tip (4) and index tip (8)
    const thumbIndexDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);

    let sign = null;
    let confidence = 0.85;

    // 1. OPEN HAND / HELLO
    if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
      sign = {
        name: 'HELLO',
        gloss: 'HELLO / GREETING',
        text: 'Hello',
        confidence: 0.92
      };
    }
    // 2. THUMBS UP / YES / GOOD
    else if (lm[4].y < lm[3].y - 0.06 && indexCurled && middleCurled && ringCurled && pinkyCurled) {
      sign = {
        name: 'YES_GOOD',
        gloss: 'YES / GOOD',
        text: 'Yes, good',
        confidence: 0.94
      };
    }
    // 3. I LOVE YOU (ILY Sign)
    else if (thumbExtended && indexExtended && pinkyExtended && middleCurled && ringCurled) {
      sign = {
        name: 'ILY',
        gloss: 'I LOVE YOU',
        text: 'I love you',
        confidence: 0.95
      };
    }
    // 4. PEACE / V-SIGN
    else if (indexExtended && middleExtended && ringCurled && pinkyCurled && !thumbExtended) {
      sign = {
        name: 'PEACE_V',
        gloss: 'PEACE / LETTER V',
        text: 'Peace / V',
        confidence: 0.9
      };
    }
    // 5. THREE FINGERS / WATER (W)
    else if (indexExtended && middleExtended && ringExtended && pinkyCurled) {
      sign = {
        name: 'WATER_W',
        gloss: 'WATER / W',
        text: 'Water',
        confidence: 0.88
      };
    }
    // 6. POINTING / YOU / D
    else if (indexExtended && middleCurled && ringCurled && pinkyCurled) {
      sign = {
        name: 'YOU_POINT',
        gloss: 'YOU / POINT',
        text: 'You',
        confidence: 0.89
      };
    }
    // 7. PINKY UP / I
    else if (pinkyExtended && indexCurled && middleCurled && ringCurled) {
      sign = {
        name: 'LETTER_I',
        gloss: 'I / ME',
        text: 'I / Me',
        confidence: 0.86
      };
    }
    // 8. OK SIGN
    else if (thumbIndexDist < 0.08 && middleExtended && ringExtended && pinkyExtended) {
      sign = {
        name: 'OK',
        gloss: 'OK / UNDERSTOOD',
        text: 'OK / Understood',
        confidence: 0.91
      };
    }
    // 9. FIST / A
    else if (indexCurled && middleCurled && ringCurled && pinkyCurled && !thumbExtended) {
      sign = {
        name: 'FIST_A',
        gloss: 'FIST / SOLID / LETTER A',
        text: 'Fist (A)',
        confidence: 0.85
      };
    }

    // Debounce / smoothing over frames
    if (sign) {
      if (this.candidateSign && this.candidateSign.name === sign.name) {
        this.consecutiveCount++;
        if (this.consecutiveCount >= 4) { // stable for 4 frames
          if (!this.lastDetectedSign || this.lastDetectedSign.name !== sign.name) {
            this.lastDetectedSign = sign;
            if (this.onGestureDetected) {
              this.onGestureDetected(sign);
            }
          }
        }
      } else {
        this.candidateSign = sign;
        this.consecutiveCount = 1;
      }
    } else {
      this.consecutiveCount = Math.max(0, this.consecutiveCount - 1);
    }

    return sign;
  }

  /**
   * Render skeletal landmarks and connections on overlay canvas
   */
  drawLandmarks(ctx, landmarks, width, height) {
    if (!ctx || !landmarks || landmarks.length < 21) return;

    const HAND_CONNECTIONS = [
      [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],       // Index
      [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
      [9, 13], [13, 14], [14, 15], [15, 16],// Ring
      [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
      [0, 17]                               // Palm base
    ];

    // Draw lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    HAND_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    });

    // Draw joints
    landmarks.forEach((p, idx) => {
      const x = p.x * width;
      const y = p.y * height;
      ctx.beginPath();
      ctx.arc(x, y, idx === 0 || idx % 4 === 0 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20 ? '#ec4899' : '#818cf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }
}
