// NSL Vocabulary, Sign Grammar, and Keyframe Definitions

export const NSL_ALPHABET = {
  'A': { desc: 'Fist with thumb resting beside index finger', rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 } },
  'B': { desc: 'Open flat 4 fingers straight up, thumb tucked across palm', rightArm: { shoulderZ: -0.5, elbowX: 1.5, wristZ: 0.1 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 0 } },
  'C': { desc: 'Curved hand forming a C shape facing left', rightArm: { shoulderZ: -0.4, elbowX: 1.3, wristZ: 0.3 }, fingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 } },
  'D': { desc: 'Index finger straight up, other fingers curled with thumb', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 0.8, index: 0, middle: 0.9, ring: 0.9, pinky: 0.9 } },
  'E': { desc: 'Curled fingers resting on thumb tip', rightArm: { shoulderZ: -0.4, elbowX: 1.5, wristZ: 0.2 }, fingers: { thumb: 0.8, index: 0.9, middle: 0.9, ring: 0.9, pinky: 0.9 } },
  'F': { desc: 'Index and thumb touching, 3 outer fingers extended', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 0.7, index: 0.7, middle: 0, ring: 0, pinky: 0 } },
  'G': { desc: 'Index pointing sideways, thumb parallel', rightArm: { shoulderZ: -0.4, elbowX: 1.2, wristZ: 0.6 }, fingers: { thumb: 0, index: 0, middle: 1, ring: 1, pinky: 1 } },
  'H': { desc: 'Index and middle fingers pointing horizontally', rightArm: { shoulderZ: -0.4, elbowX: 1.2, wristZ: 0.6 }, fingers: { thumb: 0.8, index: 0, middle: 0, ring: 1, pinky: 1 } },
  'I': { desc: 'Pinky finger straight up, fist closed', rightArm: { shoulderZ: -0.5, elbowX: 1.5, wristZ: 0.1 }, fingers: { thumb: 1, index: 1, middle: 1, ring: 1, pinky: 0 } },
  'J': { desc: 'Pinky finger traces a J curve in air', rightArm: { shoulderZ: -0.4, elbowX: 1.3, wristZ: 0.4 }, fingers: { thumb: 1, index: 1, middle: 1, ring: 1, pinky: 0 } },
  'K': { desc: 'Index up, middle forward, thumb between', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.2 }, fingers: { thumb: 0.2, index: 0, middle: 0.3, ring: 1, pinky: 1 } },
  'L': { desc: 'L-shape with thumb and index finger', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 0, index: 0, middle: 1, ring: 1, pinky: 1 } },
  'M': { desc: 'Three fingers draped over thumb', rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, fingers: { thumb: 0.9, index: 0.8, middle: 0.8, ring: 0.8, pinky: 1 } },
  'N': { desc: 'Two fingers draped over thumb', rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, fingers: { thumb: 0.9, index: 0.8, middle: 0.8, ring: 1, pinky: 1 } },
  'O': { desc: 'O-shape with fingertips touching thumb', rightArm: { shoulderZ: -0.4, elbowX: 1.3, wristZ: 0.2 }, fingers: { thumb: 0.6, index: 0.6, middle: 0.6, ring: 0.6, pinky: 0.6 } },
  'P': { desc: 'K-hand pointing downward', rightArm: { shoulderZ: -0.3, elbowX: 1.0, wristZ: -0.4 }, fingers: { thumb: 0.2, index: 0, middle: 0.3, ring: 1, pinky: 1 } },
  'Q': { desc: 'G-hand pointing downward', rightArm: { shoulderZ: -0.3, elbowX: 1.0, wristZ: -0.4 }, fingers: { thumb: 0, index: 0, middle: 1, ring: 1, pinky: 1 } },
  'R': { desc: 'Index and middle fingers crossed', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 1, pinky: 1 } },
  'S': { desc: 'Fist with thumb wrapped over fingers', rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, fingers: { thumb: 1, index: 1, middle: 1, ring: 1, pinky: 1 } },
  'T': { desc: 'Thumb tucked under index finger', rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, fingers: { thumb: 0.8, index: 0.8, middle: 1, ring: 1, pinky: 1 } },
  'U': { desc: 'Index and middle fingers held together upright', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 1, pinky: 1 } },
  'V': { desc: 'V-sign (peace) with index and middle separated', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 1, pinky: 1 } },
  'W': { desc: 'Three fingers (index, middle, ring) upright in W shape', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 1 } },
  'X': { desc: 'Curved hooked index finger', rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, fingers: { thumb: 0.9, index: 0.5, middle: 1, ring: 1, pinky: 1 } },
  'Y': { desc: 'Thumb and pinky outstretched (hang loose)', rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.1 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 0 } },
  'Z': { desc: 'Index finger traces Z in air', rightArm: { shoulderZ: -0.4, elbowX: 1.3, wristZ: 0.3 }, fingers: { thumb: 1, index: 0, middle: 1, ring: 1, pinky: 1 } }
};

// Word Sign sequences with keyframed animation poses
export const NSL_WORD_SIGNS = {
  'HELLO': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.6, elbowX: 1.7, wristZ: 0.3 }, leftArm: { shoulderZ: 0.2, elbowX: 0.3, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: -0.05 } },
      { t: 0.5, rightArm: { shoulderZ: -0.9, elbowX: 1.4, wristZ: 0.6 }, leftArm: { shoulderZ: 0.2, elbowX: 0.3, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0.05, x: 0.05 } },
      { t: 1.0, rightArm: { shoulderZ: -0.6, elbowX: 1.7, wristZ: 0.3 }, leftArm: { shoulderZ: 0.2, elbowX: 0.3, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.2,
    gloss: 'HELLO / GREETING'
  },
  'THANK-YOU': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.3, elbowX: 1.8, wristZ: 0.4 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: -0.08 } },
      { t: 0.5, rightArm: { shoulderZ: -0.2, elbowX: 0.8, wristZ: 0.1 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.12 } },
      { t: 1.0, rightArm: { shoulderZ: -0.1, elbowX: 0.4, wristZ: 0 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.05 } }
    ],
    duration: 1.3,
    gloss: 'THANK YOU'
  },
  'PLEASE': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.4, elbowX: 1.5, wristZ: 0.5 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.05 } },
      { t: 0.3, rightArm: { shoulderZ: -0.5, elbowX: 1.4, wristZ: 0.3 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.05 } },
      { t: 0.7, rightArm: { shoulderZ: -0.3, elbowX: 1.6, wristZ: 0.5 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.05 } },
      { t: 1.0, rightArm: { shoulderZ: -0.4, elbowX: 1.5, wristZ: 0.4 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.2,
    gloss: 'PLEASE'
  },
  'HELP': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.2, elbowX: 1.1, wristZ: 0.2 }, leftArm: { shoulderZ: 0.2, elbowX: 1.1, wristZ: -0.2 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: -0.05 } },
      { t: 0.6, rightArm: { shoulderZ: -0.5, elbowX: 1.6, wristZ: 0.3 }, leftArm: { shoulderZ: 0.5, elbowX: 1.6, wristZ: -0.3 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0.08 } },
      { t: 1.0, rightArm: { shoulderZ: -0.6, elbowX: 1.7, wristZ: 0.3 }, leftArm: { shoulderZ: 0.5, elbowX: 1.6, wristZ: -0.3 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.4,
    gloss: 'HELP'
  },
  'GOOD': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.3, elbowX: 1.6, wristZ: 0.2 }, leftArm: { shoulderZ: 0.2, elbowX: 1.1, wristZ: -0.2 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: -0.05 } },
      { t: 0.7, rightArm: { shoulderZ: -0.1, elbowX: 1.1, wristZ: 0.1 }, leftArm: { shoulderZ: 0.2, elbowX: 1.1, wristZ: -0.2 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.1 } },
      { t: 1.0, rightArm: { shoulderZ: -0.1, elbowX: 1.0, wristZ: 0.1 }, leftArm: { shoulderZ: 0.2, elbowX: 1.1, wristZ: -0.2 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.1,
    gloss: 'GOOD'
  },
  'AFTERNOON': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.6, elbowX: 1.2, wristZ: 0.1 }, leftArm: { shoulderZ: 0.3, elbowX: 1.0, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0 } },
      { t: 0.7, rightArm: { shoulderZ: -0.3, elbowX: 0.9, wristZ: 0.1 }, leftArm: { shoulderZ: 0.3, elbowX: 1.0, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.05 } },
      { t: 1.0, rightArm: { shoulderZ: -0.3, elbowX: 0.9, wristZ: 0.1 }, leftArm: { shoulderZ: 0.3, elbowX: 1.0, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.2,
    gloss: 'AFTERNOON'
  },
  'HOW': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.3, elbowX: 1.2, wristZ: -0.5 }, leftArm: { shoulderZ: 0.3, elbowX: 1.2, wristZ: 0.5 }, fingers: { thumb: 0.2, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }, head: { y: 0, x: -0.1 } },
      { t: 0.7, rightArm: { shoulderZ: -0.4, elbowX: 1.2, wristZ: 0.5 }, leftArm: { shoulderZ: 0.4, elbowX: 1.2, wristZ: -0.5 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.08 } },
      { t: 1.0, rightArm: { shoulderZ: -0.4, elbowX: 1.2, wristZ: 0.5 }, leftArm: { shoulderZ: 0.4, elbowX: 1.2, wristZ: -0.5 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.1,
    gloss: 'HOW'
  },
  'YOU': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.2, elbowX: 0.8, wristZ: 0 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0 } },
      { t: 0.8, rightArm: { shoulderZ: -0.1, elbowX: 0.3, wristZ: 0 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0.05 } },
      { t: 1.0, rightArm: { shoulderZ: -0.1, elbowX: 0.3, wristZ: 0 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.0,
    gloss: 'YOU'
  },
  'DEAF': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.7, elbowX: 1.8, wristZ: 0.5 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0, middle: 1, ring: 1, pinky: 1 }, head: { y: 0.05, x: 0 } },
      { t: 0.6, rightArm: { shoulderZ: -0.4, elbowX: 1.6, wristZ: 0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0.05 } },
      { t: 1.0, rightArm: { shoulderZ: -0.4, elbowX: 1.6, wristZ: 0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.2,
    gloss: 'DEAF'
  },
  'DOCTOR': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, leftArm: { shoulderZ: 0.2, elbowX: 1.0, wristZ: 0 }, fingers: { thumb: 0.5, index: 0, middle: 0, ring: 1, pinky: 1 }, head: { y: 0, x: 0.05 } },
      { t: 0.5, rightArm: { shoulderZ: -0.2, elbowX: 1.2, wristZ: 0 }, leftArm: { shoulderZ: 0.2, elbowX: 1.0, wristZ: 0 }, fingers: { thumb: 0.5, index: 0, middle: 0, ring: 1, pinky: 1 }, head: { y: 0, x: 0.08 } },
      { t: 1.0, rightArm: { shoulderZ: -0.2, elbowX: 1.2, wristZ: 0 }, leftArm: { shoulderZ: 0.2, elbowX: 1.0, wristZ: 0 }, fingers: { thumb: 0.5, index: 0, middle: 0, ring: 1, pinky: 1 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.2,
    gloss: 'DOCTOR'
  },
  'WATER': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.4, elbowX: 1.6, wristZ: 0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 1 }, head: { y: 0, x: 0 } },
      { t: 0.5, rightArm: { shoulderZ: -0.3, elbowX: 1.7, wristZ: 0.3 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 1 }, head: { y: 0, x: 0.05 } },
      { t: 1.0, rightArm: { shoulderZ: -0.4, elbowX: 1.6, wristZ: 0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 1 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.1,
    gloss: 'WATER'
  },
  'YES': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.4, elbowX: 1.3, wristZ: 0.3 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: -0.08 } },
      { t: 0.5, rightArm: { shoulderZ: -0.4, elbowX: 1.3, wristZ: -0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0.12 } },
      { t: 1.0, rightArm: { shoulderZ: -0.4, elbowX: 1.3, wristZ: 0.1 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.0,
    gloss: 'YES'
  },
  'NO': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 1, pinky: 1 }, head: { y: -0.1, x: 0 } },
      { t: 0.5, rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0.9, middle: 0.9, ring: 1, pinky: 1 }, head: { y: 0.1, x: 0 } },
      { t: 1.0, rightArm: { shoulderZ: -0.4, elbowX: 1.4, wristZ: 0.2 }, leftArm: { shoulderZ: 0.1, elbowX: 0.2, wristZ: 0 }, fingers: { thumb: 0.8, index: 0.9, middle: 0.9, ring: 1, pinky: 1 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.0,
    gloss: 'NO'
  },
  'WHERE': {
    keyframes: [
      { t: 0, rightArm: { shoulderZ: -0.3, elbowX: 1.1, wristZ: 0.3 }, leftArm: { shoulderZ: 0.3, elbowX: 1.1, wristZ: -0.3 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: -0.08 } },
      { t: 0.5, rightArm: { shoulderZ: -0.5, elbowX: 1.0, wristZ: 0.5 }, leftArm: { shoulderZ: 0.5, elbowX: 1.0, wristZ: -0.5 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0.05 } },
      { t: 1.0, rightArm: { shoulderZ: -0.3, elbowX: 1.1, wristZ: 0.3 }, leftArm: { shoulderZ: 0.3, elbowX: 1.1, wristZ: -0.3 }, fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 }, head: { y: 0, x: 0 } }
    ],
    duration: 1.2,
    gloss: 'WHERE'
  }
};

/**
 * Natural Sign Language Grammar Converter (Topic-Comment / NSL syntax)
 * Strips English auxiliary verbs ('is', 'are', 'the', 'a') and reorders to topic-comment.
 */
export function translateToSignGrammar(text) {
  if (!text) return [];
  const clean = text
    .toUpperCase()
    .replace(/[.,?!;:()'"]/g, '')
    .trim();
  
  const words = clean.split(/\s+/);
  const stopWords = new Set(['THE', 'IS', 'AM', 'ARE', 'A', 'AN', 'OF', 'TO', 'BE']);
  
  // Identify question words
  const questionWords = ['WHERE', 'WHAT', 'WHEN', 'WHO', 'WHY', 'HOW'];
  let foundQuestion = null;
  const filtered = [];

  for (const w of words) {
    if (questionWords.includes(w)) {
      foundQuestion = w;
    } else if (!stopWords.has(w)) {
      filtered.push(w);
    }
  }

  // In NSL / Sign grammar, question words move to the end (Topic-Comment-Question)
  if (foundQuestion) {
    filtered.push(foundQuestion);
  }

  return filtered.length ? filtered : words;
}
