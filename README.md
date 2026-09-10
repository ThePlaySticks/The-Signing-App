# ASHA Sign — AI Sign Language Communication App

> Bridging Deaf and Hearing Communities with Nigerian Sign Language (NSL), Real-Time 3D Sign Avatar, and Computer Vision.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-emerald.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![NSL Support](https://img.shields.io/badge/Sign%20Language-NSL%20%2F%20ASL-indigo.svg)](https://en.wikipedia.org/wiki/Nigerian_Sign_Language)

---

## 🌟 Overview

**ASHA Sign** is an AI-powered communication web application designed to break down barriers between Deaf / Hard-of-Hearing individuals and Hearing individuals. Built with a primary focus on **Nigerian Sign Language (NSL)** alongside American Sign Language (ASL), it provides seamless two-way translation, face-to-face conversation mode, and offline emergency support.

---

## 🚀 Key Features

### 1. 🤖 3D AI Sign Language Avatar
- **Articulated Skeletal Rigs**: High-performance WebGL/Three.js humanoid avatar with natural movements across head, shoulders, elbows, wrists, and individual 5-finger joints.
- **Interactive Controls**: 360° drag-to-rotate view, replay button, and adjustable playback speeds (**0.5x slow motion**, 0.75x, 1.0x, 1.5x, 2.0x).
- **Fingerspelling Fallback**: Unknown words and names are dynamically fingerspelled using the NSL/ASL manual alphabet.

### 2. 🎙️ Speech-to-Sign Language
- Real-time speech transcription via the Web Speech API with support for Nigerian and global English accents.
- Live audio waveform feedback and push-to-talk microphone trigger.

### 3. ✍️ Text-to-Sign & Grammar Engine
- Natural sign language syntax translator that transforms standard English into **Topic-Comment / NSL grammar** (e.g., *"Where is the hospital?"* → `HOSPITAL WHERE?`).

### 4. 📷 Computer Vision Sign Recognition (Sign-to-Speech)
- Real-time on-device camera tracking with 21 skeletal hand landmarks.
- Instant gesture recognition for common signs:
  - 👋 **Hello / Greeting** (Open palm)
  - 👍 **Yes / Good** (Thumbs up)
  - 🤟 **I Love You** (ILY sign)
  - ✌️ **Peace / V**
  - 💧 **Water / W**
  - 👉 **You / Point**
  - 👌 **OK / Understood**
- **Automated Voice Output (TTS)**: Synthesizes spoken audio so hearing partners can listen to the translated signs naturally.

### 5. 💬 Two-Way Split-Screen Conversation Mode
- Dedicated split-view layout optimized for face-to-face table interaction or mobile handover:
  - **Hearing User Side**: Speech mic, text input, audio feedback.
  - **Deaf User Side**: Mini 3D Avatar signer, instant response chips.

### 6. 📚 Quick Phrase Library & Offline PWA
- Essential expressions categorized for:
  - 🏥 **Hospitals & Healthcare** (*"I feel pain here"*, *"Doctor"*, *"Allergy"*)
  - 🏦 **Banks & Finance** (*"Open account"*, *"Withdraw cash"*, *"ATM"*)
  - 🚌 **Transport & Places** (*"Restroom"*, *"Market fare"*, *"Bus stop"*)
  - 🚨 **Emergency & Police** (*"Help me"*, *"I am deaf"*, *"Call ambulance"*)
  - 🇳🇬 **Nigerian Cultural Greetings** (*"Bawo ni"*, *"Kedu"*, *"Sannu"*, *"Good afternoon"*)
- Offline caching via Service Worker (`sw.js`) and PWA installability.
- Bookmarks & Favorites stored locally.

### 7. ♿ Accessibility Controls
- High-contrast mode (solid black background with high-visibility borders).
- Large text scale toggle for all screens.
- Haptic vibration feedback upon sign detection.

---

## 🛠️ Technology Stack

- **Core**: Vanilla JavaScript (ES Modules), HTML5 Semantic Shell.
- **Styling**: Vanilla CSS (Custom Design System, Glassmorphism, CSS Grid & Flexbox).
- **3D Graphics**: Three.js (WebGL rendering & skeletal bone joints).
- **Audio & Vision APIs**: Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), WebRTC MediaDevices, HTML5 Canvas.
- **Build Tool**: Vite.

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+) & npm

### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/ThePlaySticks/The-Signing-App.git
cd The-Signing-App

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production
```bash
npm run build
```
The optimized bundle will be created in `/dist`.

---

## 📄 License
MIT License.
