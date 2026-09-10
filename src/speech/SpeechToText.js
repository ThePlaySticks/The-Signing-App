export class SpeechToTextManager {
  constructor(options = {}) {
    this.recognition = null;
    this.isListening = false;
    this.onResult = options.onResult || null;
    this.onInterim = options.onInterim || null;
    this.onError = options.onError || null;
    this.onStateChange = options.onStateChange || null;
    this.lang = options.lang || 'en-NG'; // Nigerian English default with fallback to en-US

    this.init();
  }

  isSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported by this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStateChange) this.onStateChange({ isListening: true });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStateChange) this.onStateChange({ isListening: false });
    };

    this.recognition.onerror = (e) => {
      console.warn('SpeechRecognition error:', e.error);
      if (this.onError) this.onError(e.error);
      this.isListening = false;
      if (this.onStateChange) this.onStateChange({ isListening: false });
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (interimTranscript && this.onInterim) {
        this.onInterim(interimTranscript);
      }

      if (finalTranscript && this.onResult) {
        this.onResult(finalTranscript.trim());
      }
    };
  }

  start() {
    if (!this.recognition) return false;
    try {
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      return false;
    }
  }

  stop() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch (err) {
      // ignore
    }
  }

  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
}
