export class TextToSpeechManager {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.onStateChange = null;

    if (this.synth) {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
      this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer English voices, Nigerian if available
    this.selectedVoice = voices.find(v => v.lang.includes('NG') || v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0];
  }

  speak(text) {
    if (!this.synth || !text) return;
    this.synth.cancel(); // Stop any pending utterance

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange({ isSpeaking: true });
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
    }
  }
}
