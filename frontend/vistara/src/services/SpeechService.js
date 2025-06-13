/**
 * SpeechService - Service for handling speech recognition functionality
 */

// Language options
export const SPEECH_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ar-SA', name: 'Arabic' }
];

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.isListening = false;
    this.language = 'en-US'; // Default language
    this.initialize();
  }

  initialize() {
    if (!this.isSupported) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;
    this.recognition.maxAlternatives = 1;
  }

  /**
   * Set the language for speech recognition
   * @param {string} langCode - Language code (e.g., 'en-US', 'es-ES')
   */
  setLanguage(langCode) {
    if (!this.recognition) return false;
    
    if (SPEECH_LANGUAGES.some(lang => lang.code === langCode)) {
      this.language = langCode;
      this.recognition.lang = langCode;
      return true;
    }
    
    console.warn(`Language code ${langCode} is not supported. Using default.`);
    return false;
  }

  /**
   * Get the current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.language;
  }

  /**
   * Start speech recognition
   * @param {Function} onResult - Callback for speech results
   * @param {Function} onEnd - Callback for when recognition ends
   * @param {Function} onError - Callback for errors
   * @param {string} lang - Optional language code to use for this recognition session
   */
  start(onResult, onEnd, onError, lang) {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser');
      return false;
    }

    // Update language if provided
    if (lang) {
      this.setLanguage(lang);
    }

    try {
      // Set up event handlers
      this.recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        // Get confidence level from the most recent result
        const confidence = lastResult[0].confidence;
        
        if (onResult) onResult(transcript, confidence);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      // Start recognition
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) onError(error.message);
      return false;
    }
  }

  /**
   * Stop speech recognition
   */
  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return true;
    }
    return false;
  }

  /**
   * Check if speech recognition is currently active
   * @returns {boolean} Whether speech recognition is active
   */
  isActive() {
    return this.isListening;
  }

  /**
   * Check if speech recognition is supported
   * @returns {boolean} Whether speech recognition is supported
   */
  checkSupport() {
    return this.isSupported;
  }
}

// Create and export a singleton instance
const speechService = new SpeechService();
export default speechService; 