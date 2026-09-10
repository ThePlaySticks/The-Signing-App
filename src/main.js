import { AvatarRenderer } from './avatar/AvatarRenderer.js';
import { AvatarAnimator } from './avatar/Animator.js';
import { SpeechToTextManager } from './speech/SpeechToText.js';
import { TextToSpeechManager } from './speech/TextToSpeech.js';
import { CameraManager } from './vision/CameraManager.js';
import { GestureRecognizer } from './vision/GestureRecognizer.js';
import { MediaPipeHandTracker } from './vision/MediaPipeHandTracker.js';
import { SignVideoPlayer } from './components/SignVideoPlayer.js';
import { FavoritesManager } from './modules/FavoritesManager.js';
import { QUICK_CATEGORIES, QUICK_PHRASES } from './data/quick_phrases_data.js';
import { nslTranslator } from './services/NslTranslator.js';
import { signAssetService } from './services/SignAssetService.js';

// Application State
const appState = {
  currentView: 'translate-view',
  renderMode: 'avatar', // 'avatar' or 'video'
  selectedCategory: 'all',
  searchQuery: '',
  highContrast: false,
  largeText: false,
  hapticEnabled: true,
  autoTTS: true,
  currentDialect: 'nsl',
  isListening: false,
  cameraActive: false,
  activeTargetSign: null
};

// Global Managers
let avatarRenderer = null;
let avatarAnimator = null;
let signVideoPlayer = null;
let speechRecognizer = null;
let speechSynthesizer = null;
let cameraManager = null;
let gestureRecognizer = null;
let mediaPipeTracker = null;
let favoritesManager = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initManagers();
  setupNavigation();
  setupTranslateStudio();
  setupCameraVision();
  setupConversationMode();
  setupQuickPhrases();
  setupSettingsModal();
  registerServiceWorker();

  // Play an initial friendly welcome sign ("HELLO") on avatar after load
  setTimeout(() => {
    if (avatarAnimator) {
      avatarAnimator.playSentence('Hello');
    }
  }, 1000);
});

/* =========================================================================
   1. Managers Initialization
   ========================================================================= */
function initManagers() {
  favoritesManager = new FavoritesManager();
  speechSynthesizer = new TextToSpeechManager();

  // 3D Avatar Setup
  const avatarStage = document.getElementById('avatar-stage');
  if (avatarStage) {
    avatarRenderer = new AvatarRenderer(avatarStage);
    avatarAnimator = new AvatarAnimator(avatarRenderer);

    avatarAnimator.onWordChange = (info) => {
      const wordEl = document.getElementById('avatar-current-word');
      const typeEl = document.getElementById('avatar-current-type');
      if (wordEl) wordEl.textContent = info.word;
      if (typeEl) {
        if (info.isVerified) {
          typeEl.textContent = `Verified NSL: ${info.gloss}`;
          typeEl.style.color = 'var(--accent-emerald)';
        } else {
          typeEl.textContent = `Fingerspell: ${info.word}`;
          typeEl.style.color = 'var(--accent-cyan)';
        }
      }
      
      highlightActiveGlossToken(info.gloss || info.word);
    };

    avatarAnimator.onComplete = () => {
      const wordEl = document.getElementById('avatar-current-word');
      const typeEl = document.getElementById('avatar-current-type');
      if (wordEl) wordEl.textContent = 'COMPLETE';
      if (typeEl) {
        typeEl.textContent = 'READY';
        typeEl.style.color = 'var(--accent-cyan)';
      }
    };

    avatarAnimator.onStateChange = (state) => {
      const playPauseBtn = document.getElementById('btn-avatar-playpause');
      if (playPauseBtn) {
        playPauseBtn.innerHTML = state.isPlaying && !state.isPaused
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      }
    };
  }

  // Native Sign Video Player Setup
  const videoStage = document.getElementById('video-stage');
  if (videoStage) {
    signVideoPlayer = new SignVideoPlayer(videoStage);
  }

  // Speech Recognition Setup
  speechRecognizer = new SpeechToTextManager({
    onResult: (finalText) => {
      handleHearingSpeechInput(finalText);
    },
    onInterim: (interimText) => {
      const liveEl = document.getElementById('speech-live-transcript');
      if (liveEl) liveEl.textContent = interimText;
    },
    onStateChange: (state) => {
      appState.isListening = state.isListening;
      const micBtn = document.getElementById('btn-speech-mic');
      const statusLabel = document.getElementById('speech-status-label');
      const waveFill = document.getElementById('audio-wave-fill');

      if (micBtn) {
        if (state.isListening) {
          micBtn.classList.add('listening');
          if (statusLabel) statusLabel.textContent = 'Listening... Speak now';
          if (waveFill) waveFill.style.width = '75%';
        } else {
          micBtn.classList.remove('listening');
          if (statusLabel) statusLabel.textContent = 'Tap Microphone to Speak';
          if (waveFill) waveFill.style.width = '0%';
        }
      }
    },
    onError: (err) => {
      const statusLabel = document.getElementById('speech-status-label');
      if (statusLabel) statusLabel.textContent = `Mic issue: ${err}. Try typing below!`;
    }
  });

  // Computer Vision & Gesture Recognition Setup
  const videoEl = document.getElementById('camera-video');
  const canvasEl = document.getElementById('camera-canvas');
  cameraManager = new CameraManager(videoEl, canvasEl);
  gestureRecognizer = new GestureRecognizer();
  mediaPipeTracker = new MediaPipeHandTracker({
    video: videoEl,
    canvas: canvasEl,
    onResults: handleMediaPipeResults,
    onError: (err) => {
      console.warn('MediaPipe tracker note:', err);
    }
  });

  gestureRecognizer.onGestureDetected = (sign) => {
    handleDetectedGesture(sign);
  };
}

/* =========================================================================
   2. Navigation & View Routing
   ========================================================================= */
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab-btn[data-view]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetView = tab.getAttribute('data-view');
      switchView(targetView);
    });
  });
}

function switchView(viewId) {
  appState.currentView = viewId;

  // Update tabs
  document.querySelectorAll('.nav-tab-btn[data-view]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
  });

  // Update view panels
  document.querySelectorAll('.view-section').forEach((section) => {
    section.classList.toggle('active', section.id === viewId);
  });

  // Trigger avatar resize if returning to translate view
  if (viewId === 'translate-view' && avatarRenderer) {
    setTimeout(() => avatarRenderer.onResize(), 50);
  }
}

/* =========================================================================
   3. Studio: Speech & Text to Sign with Dual Renderers
   ========================================================================= */
function setupTranslateStudio() {
  // Mode Switcher: 3D Avatar vs Native Video
  const btnModeAvatar = document.getElementById('btn-mode-avatar');
  const btnModeVideo = document.getElementById('btn-mode-video');
  const avatarStage = document.getElementById('avatar-stage');
  const videoStage = document.getElementById('video-stage');

  if (btnModeAvatar && btnModeVideo) {
    btnModeAvatar.addEventListener('click', () => {
      appState.renderMode = 'avatar';
      btnModeAvatar.classList.add('active');
      btnModeVideo.classList.remove('active');
      if (avatarStage) avatarStage.style.display = 'block';
      if (videoStage) videoStage.style.display = 'none';
      if (avatarRenderer) avatarRenderer.onResize();
    });

    btnModeVideo.addEventListener('click', () => {
      appState.renderMode = 'video';
      btnModeVideo.classList.add('active');
      btnModeAvatar.classList.remove('active');
      if (avatarStage) avatarStage.style.display = 'none';
      if (videoStage) videoStage.style.display = 'block';
    });
  }

  // Reset avatar angle button
  const resetBtn = document.getElementById('btn-reset-avatar-rot');
  if (resetBtn && avatarRenderer) {
    resetBtn.addEventListener('click', () => {
      avatarRenderer.resetRotation();
    });
  }

  // Play / Pause toggle
  const playPauseBtn = document.getElementById('btn-avatar-playpause');
  if (playPauseBtn && avatarAnimator) {
    playPauseBtn.addEventListener('click', () => {
      if (!avatarAnimator.isPlaying) {
        avatarAnimator.replay();
      } else if (avatarAnimator.isPaused) {
        avatarAnimator.resume();
      } else {
        avatarAnimator.pause();
      }
    });
  }

  // Replay
  const replayBtn = document.getElementById('btn-avatar-replay');
  if (replayBtn && avatarAnimator) {
    replayBtn.addEventListener('click', () => {
      avatarAnimator.replay();
    });
  }

  // Speed selector
  const speedSelect = document.getElementById('avatar-speed-select');
  if (speedSelect && avatarAnimator) {
    speedSelect.addEventListener('change', (e) => {
      avatarAnimator.setSpeed(parseFloat(e.target.value));
    });
  }

  // Push-to-talk microphone button
  const micBtn = document.getElementById('btn-speech-mic');
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (appState.hapticEnabled && navigator.vibrate) navigator.vibrate(30);
      speechRecognizer.toggle();
    });
  }

  // Text translate input
  const textInput = document.getElementById('text-translate-input');
  const translateBtn = document.getElementById('btn-translate-text');

  const executeTranslation = () => {
    const text = textInput ? textInput.value.trim() : '';
    if (!text) return;
    executeSignTranslation(text);
  };

  if (translateBtn) translateBtn.addEventListener('click', executeTranslation);
  if (textInput) {
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeTranslation();
    });
  }

  // Sample chips
  document.querySelectorAll('.chip-sample').forEach((chip) => {
    chip.addEventListener('click', () => {
      const phrase = chip.getAttribute('data-phrase');
      if (textInput) textInput.value = phrase;
      executeSignTranslation(phrase);
    });
  });
}

function handleHearingSpeechInput(transcript) {
  const liveEl = document.getElementById('speech-live-transcript');
  if (liveEl) liveEl.textContent = `"${transcript}"`;
  const textInput = document.getElementById('text-translate-input');
  if (textInput) textInput.value = transcript;

  executeSignTranslation(transcript);
}

/**
 * Execute translation using NslTranslator and route to appropriate renderer
 */
function executeSignTranslation(text) {
  // 1. Generate structured sign sequence through NSL grammar translation
  const translation = nslTranslator.translate(text);

  // 2. Render structured grammar tokens with honest provenance labels
  renderGrammarBreakdown(translation);

  // 3. Render on Video Player if in video mode or if verified video asset exists
  const firstVerifiedSign = translation.signSequence.find(s => s.assetUrl);
  if (firstVerifiedSign && signVideoPlayer) {
    const signAsset = signAssetService.getSignById(firstVerifiedSign.signId);
    if (signAsset) {
      signVideoPlayer.loadSign(signAsset);
    }
  }

  // 4. Render on 3D Avatar
  if (avatarAnimator) {
    avatarAnimator.playSignSequence(translation);
  }
}

function renderGrammarBreakdown(translation) {
  const container = document.getElementById('gloss-tokens-container');
  const grammarRuleBadge = document.getElementById('grammar-rule-badge');
  if (!container) return;

  if (grammarRuleBadge && translation.target) {
    grammarRuleBadge.textContent = `${translation.target.grammarStructure || 'TOPIC-COMMENT'} (NSL)`;
  }

  container.innerHTML = '';

  if (!translation.signSequence || translation.signSequence.length === 0) {
    container.innerHTML = '<span style="font-size: 0.85rem; color: var(--text-subtle); font-style: italic;">No sign tokens generated.</span>';
    return;
  }

  translation.signSequence.forEach((step) => {
    const span = document.createElement('span');
    span.className = 'cat-pill';
    span.style.fontSize = '0.8rem';
    span.style.padding = '4px 10px';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.gap = '6px';
    span.dataset.gloss = step.gloss.toUpperCase();

    if (step.isVerified) {
      span.style.border = '1px solid rgba(16, 185, 129, 0.5)';
      span.style.background = 'rgba(16, 185, 129, 0.1)';
      span.innerHTML = `<span>${step.gloss}</span><span style="font-size: 0.65rem; color: var(--accent-emerald); font-weight: 700;">✓ NSL</span>`;
    } else {
      span.style.border = '1px solid rgba(245, 158, 11, 0.5)';
      span.style.background = 'rgba(245, 158, 11, 0.1)';
      span.innerHTML = `<span>${step.gloss}</span><span style="font-size: 0.65rem; color: var(--accent-amber); font-weight: 600;">Fingerspell</span>`;
    }

    container.appendChild(span);
  });
}

function highlightActiveGlossToken(word) {
  const container = document.getElementById('gloss-tokens-container');
  if (!container) return;

  const pills = container.querySelectorAll('.cat-pill');
  pills.forEach((p) => {
    if (p.dataset.gloss === word.toUpperCase()) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

/* =========================================================================
   4. Vision: Real Computer Vision & Interactive Sign Guide
   ========================================================================= */
function setupCameraVision() {
  const startBtn = document.getElementById('btn-start-camera');
  const videoEl = document.getElementById('camera-video');
  const placeholder = document.getElementById('camera-placeholder');
  const flipBtn = document.getElementById('btn-flip-camera');
  const speakBtn = document.getElementById('btn-speak-detected');
  const autoTtsCheckbox = document.getElementById('toggle-auto-tts');

  if (autoTtsCheckbox) {
    autoTtsCheckbox.addEventListener('change', (e) => {
      appState.autoTTS = e.target.checked;
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', async () => {
      try {
        startBtn.textContent = 'Initializing Camera & AI Tracker...';
        await cameraManager.start();
        if (placeholder) placeholder.style.display = 'none';
        if (videoEl) videoEl.style.display = 'block';

        // Load real MediaPipe Hands model
        await mediaPipeTracker.loadMediaPipe();

        cameraManager.onFrame = (video) => {
          mediaPipeTracker.processFrame(video);
        };
      } catch (err) {
        console.error('Camera startup failed:', err);
        alert('Could not start camera. Please verify device camera permissions.');
        startBtn.innerHTML = '<span>Retry Camera</span>';
      }
    });
  }

  if (flipBtn) {
    flipBtn.addEventListener('click', () => {
      cameraManager.flipCamera();
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const titleEl = document.getElementById('detected-sign-title');
      if (titleEl && titleEl.textContent && !titleEl.textContent.includes('Waiting') && !titleEl.textContent.includes('No hand')) {
        speechSynthesizer.speak(titleEl.textContent);
      }
    });
  }

  // Interactive Supported Signs Practice Buttons
  setupSupportedSignsGuide();
}

function setupSupportedSignsGuide() {
  const buttons = document.querySelectorAll('.sign-guide-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSign = btn.getAttribute('data-sign-target');
      appState.activeTargetSign = targetSign;

      // Update UI active badge
      buttons.forEach(b => {
        b.style.borderColor = 'var(--border-subtle)';
        const badge = b.querySelector('.badge-nsl');
        if (badge) badge.textContent = 'Test Sign';
      });

      btn.style.borderColor = 'var(--accent-cyan)';
      const badge = btn.querySelector('.badge-nsl');
      if (badge) badge.textContent = 'Target Active';

      // Load target sign into avatar or video player
      const glossMap = {
        'HELLO': 'Hello',
        'YES_GOOD': 'Yes',
        'ILY': 'I love you',
        'PEACE_V': 'V',
        'OK': 'OK',
        'WATER_W': 'Water'
      };

      const phrase = glossMap[targetSign] || targetSign;
      if (avatarAnimator) {
        avatarAnimator.playSentence(phrase);
      }

      // Update Camera prompt
      const titleEl = document.getElementById('detected-sign-title');
      const glossEl = document.getElementById('detected-sign-gloss');
      if (titleEl) titleEl.textContent = `Sign: ${phrase}`;
      if (glossEl) glossEl.textContent = `Target set — hold up your hand to match the gesture`;

      if (speechSynthesizer) {
        speechSynthesizer.speak(`Practice sign: ${phrase}`);
      }
    });
  });
}

/**
 * Handle real MediaPipe hand tracking frame results
 */
function handleMediaPipeResults(results) {
  const canvas = document.getElementById('camera-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Hands are physically present in camera view
    results.multiHandLandmarks.forEach((landmarks) => {
      // 1. Draw real skeletal joints on canvas
      gestureRecognizer.drawLandmarks(ctx, landmarks, w, h);

      // 2. Classify real hand landmark geometry
      const detected = gestureRecognizer.classifyLandmarks(landmarks);
      if (detected) {
        handleDetectedGesture(detected);
      }
    });
  } else {
    // Honest: No hands present in front of the camera
    const titleEl = document.getElementById('detected-sign-title');
    const glossEl = document.getElementById('detected-sign-gloss');
    if (titleEl && !appState.activeTargetSign) {
      titleEl.textContent = 'No hand in view';
      titleEl.style.color = 'var(--text-muted)';
    }
    if (glossEl && !appState.activeTargetSign) {
      glossEl.textContent = 'Hold your hand up to the camera to sign';
    }
  }
}

function handleDetectedGesture(sign) {
  const titleEl = document.getElementById('detected-sign-title');
  const glossEl = document.getElementById('detected-sign-gloss');

  if (titleEl) {
    titleEl.textContent = sign.text;
    titleEl.style.color = 'var(--accent-emerald)';
  }
  if (glossEl) {
    glossEl.textContent = `Recognized Gesture: ${sign.gloss} (Confidence: ${Math.round((sign.confidence || 0.85) * 100)}%)`;
  }

  // Haptic feedback
  if (appState.hapticEnabled && navigator.vibrate) {
    navigator.vibrate(40);
  }

  // Automatic voice readout if enabled
  if (appState.autoTTS && speechSynthesizer) {
    speechSynthesizer.speak(sign.text);
  }
}

/* =========================================================================
   5. Conversation Mode (Split Screen)
   ========================================================================= */
function setupConversationMode() {
  const chatStream = document.getElementById('convo-chat-stream');
  const convoInput = document.getElementById('convo-input');
  const convoSendBtn = document.getElementById('btn-convo-send');
  const convoMicBtn = document.getElementById('btn-convo-mic');

  // Mini Avatar in Deaf column
  const miniContainer = document.getElementById('convo-avatar-container');
  let miniAvatarRenderer = null;
  let miniAvatarAnimator = null;

  if (miniContainer) {
    miniAvatarRenderer = new AvatarRenderer(miniContainer);
    miniAvatarAnimator = new AvatarAnimator(miniAvatarRenderer);
  }

  const sendHearingMessage = (text) => {
    if (!text.trim()) return;

    // Append Hearing bubble
    appendChatBubble('hearing', text);

    // Sign message on deaf partner's avatar using NslTranslator
    if (miniAvatarAnimator) {
      const translation = nslTranslator.translate(text);
      miniAvatarAnimator.playSignSequence(translation);
    }

    if (convoInput) convoInput.value = '';
  };

  if (convoSendBtn) {
    convoSendBtn.addEventListener('click', () => {
      if (convoInput) sendHearingMessage(convoInput.value);
    });
  }

  if (convoInput) {
    convoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendHearingMessage(convoInput.value);
    });
  }

  if (convoMicBtn) {
    convoMicBtn.addEventListener('click', () => {
      speechRecognizer.toggle();
    });
  }

  // Quick replies for Deaf User
  document.querySelectorAll('.convo-quick-reply').forEach((btn) => {
    btn.addEventListener('click', () => {
      const replyText = btn.getAttribute('data-reply');
      appendChatBubble('deaf', replyText);

      // Speak message out loud for the hearing user
      speechSynthesizer.speak(replyText);
    });
  });

  function appendChatBubble(sender, text) {
    if (!chatStream) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `
      <div>${text}</div>
      <div class="chat-meta">${sender === 'hearing' ? 'Hearing User (Speech/Text)' : 'Deaf User (Signed)'} • ${time}</div>
    `;
    chatStream.appendChild(bubble);
    chatStream.scrollTop = chatStream.scrollHeight;
  }
}

/* =========================================================================
   6. Quick Phrase Library & Favorites
   ========================================================================= */
function setupQuickPhrases() {
  const categoryBar = document.getElementById('phrase-category-bar');
  const gridContainer = document.getElementById('phrases-grid-container');
  const searchInput = document.getElementById('phrase-search-input');

  // Render category filter pills
  if (categoryBar) {
    categoryBar.innerHTML = '';
    QUICK_CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = `cat-pill ${cat.id === appState.selectedCategory ? 'active' : ''}`;
      btn.textContent = cat.label;
      btn.addEventListener('click', () => {
        appState.selectedCategory = cat.id;
        document.querySelectorAll('#phrase-category-bar .cat-pill').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        renderPhraseCards();
      });
      categoryBar.appendChild(btn);
    });
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.toLowerCase();
      renderPhraseCards();
    });
  }

  // Render initial cards
  renderPhraseCards();

  function renderPhraseCards() {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    const filtered = QUICK_PHRASES.filter((p) => {
      const matchCat = appState.selectedCategory === 'all' || p.category === appState.selectedCategory;
      const matchSearch = !appState.searchQuery ||
        p.text.toLowerCase().includes(appState.searchQuery) ||
        p.signGloss.toLowerCase().includes(appState.searchQuery) ||
        p.culturalNote.toLowerCase().includes(appState.searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
          No matching phrases found. Try searching for "hospital", "money", or "help".
        </div>
      `;
      return;
    }

    filtered.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'phrase-card';

      const isFav = favoritesManager.isFavorite(p.id);

      card.innerHTML = `
        <div>
          <div class="phrase-card-header">
            <span class="badge-nsl">${p.dialect}</span>
            <button class="fav-star-btn ${isFav ? 'favorited' : ''}" title="Save Favorite" data-id="${p.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
          </div>
          <div class="phrase-main-text" style="margin-top: 0.5rem;">${p.text}</div>
          <div class="phrase-gloss" style="margin-top: 0.35rem;">GLOSS: ${p.signGloss}</div>
          <div class="phrase-meta-note" style="margin-top: 0.4rem;">${p.culturalNote}</div>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 0.6rem;">
          <button class="btn-primary btn-sign-phrase" style="flex: 1; padding: 0.45rem 0.8rem; font-size: 0.82rem;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Demonstrate Sign</span>
          </button>
          <button class="btn-secondary btn-speak-phrase" style="padding: 0.45rem 0.8rem; font-size: 0.82rem;" title="Speak with Voice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </button>
        </div>
      `;

      // Favorite toggle handler
      const favBtn = card.querySelector('.fav-star-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newState = favoritesManager.toggleFavorite(p.id);
        favBtn.classList.toggle('favorited', newState);
        const svg = favBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', newState ? 'currentColor' : 'none');
      });

      // Sign with avatar or video
      card.querySelector('.btn-sign-phrase').addEventListener('click', () => {
        switchView('translate-view');
        const textInput = document.getElementById('text-translate-input');
        if (textInput) textInput.value = p.text;
        executeSignTranslation(p.text);
      });

      // Speak aloud
      card.querySelector('.btn-speak-phrase').addEventListener('click', () => {
        speechSynthesizer.speak(p.text);
      });

      gridContainer.appendChild(card);
    });
  }
}

/* =========================================================================
   7. Accessibility Settings Modal & Toggles
   ========================================================================= */
function setupSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('btn-settings-open');
  const closeBtn = document.getElementById('btn-settings-close');
  const saveBtn = document.getElementById('btn-save-settings');

  const toggleContrast = document.getElementById('toggle-high-contrast');
  const toggleLargeText = document.getElementById('toggle-large-text');
  const toggleHaptic = document.getElementById('toggle-haptic');
  const selectDialect = document.getElementById('select-dialect');

  const toggleModal = (open) => {
    if (modal) modal.classList.toggle('open', open);
  };

  if (openBtn) openBtn.addEventListener('click', () => toggleModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
  if (saveBtn) saveBtn.addEventListener('click', () => toggleModal(false));

  if (toggleContrast) {
    toggleContrast.addEventListener('change', (e) => {
      document.body.classList.toggle('high-contrast', e.target.checked);
    });
  }

  if (toggleLargeText) {
    toggleLargeText.addEventListener('change', (e) => {
      document.body.classList.toggle('large-text', e.target.checked);
    });
  }

  if (toggleHaptic) {
    toggleHaptic.addEventListener('change', (e) => {
      appState.hapticEnabled = e.target.checked;
    });
  }

  if (selectDialect) {
    selectDialect.addEventListener('change', (e) => {
      appState.currentDialect = e.target.value;
      const dialectBadge = document.getElementById('avatar-dialect-badge');
      if (dialectBadge) {
        dialectBadge.textContent = e.target.value === 'nsl' ? 'NSL Syntax Active' : 'ASL Syntax Active';
      }
    });
  }
}

/* =========================================================================
   8. Service Worker Registration
   ========================================================================= */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration note:', err);
    });
  }
}
