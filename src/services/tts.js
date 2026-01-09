// Text-to-Speech Service
// Supports: Browser (free), OpenAI TTS, ElevenLabs
import { CONFIG } from '../config';

const OPENAI_VOICE = 'shimmer'; // Options: 'nova', 'shimmer', 'alloy', 'echo', 'fable', 'onyx'
const OPENAI_SPEED = 0.75; // Slower for maximum clarity
const BROWSER_SPEED = 0.7; // Browser TTS speed - slower for clarity
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // "Bella" - warm, friendly female voice
const CACHE_KEY_PREFIX = 'tts_audio_';

class TTSService {
  constructor() {
    this.openaiApiKey = null;
    this.elevenlabsApiKey = null;
    this.audioCache = new Map();
    this.loadCacheFromStorage();

    // Detect old iOS devices (iPhone 6 maxes at iOS 12.5)
    // These can't play audio blobs from ElevenLabs/OpenAI APIs
    this.isOldDevice = this.detectOldDevice();

    // TTS mode: 'elevenlabs' (default), 'openai', or 'browser'
    // Force browser mode on old devices for compatibility
    if (this.isOldDevice) {
      this.mode = 'browser';
      localStorage.setItem('tts_mode', 'browser');
      console.log('Old iOS detected - using browser speech for compatibility');
    } else {
      this.mode = localStorage.getItem('tts_mode') || 'elevenlabs';
    }

    // Initialize API keys after construction
    this.openaiApiKey = this.getOpenAIApiKey();
    this.elevenlabsApiKey = this.getElevenLabsApiKey();
  }

  // Detect old iOS devices that can't handle audio blob playback
  detectOldDevice() {
    const ua = navigator.userAgent;
    // Check for iOS
    if (/iPad|iPhone|iPod/.test(ua)) {
      // Extract iOS version
      const match = ua.match(/OS (\d+)_/);
      if (match) {
        const iosVersion = parseInt(match[1], 10);
        // iOS 12 and below have issues with audio blob playback
        // iPhone 6/6+ max at iOS 12.5, iPhone 5s also iOS 12
        if (iosVersion <= 12) {
          return true;
        }
      }
    }
    return false;
  }

  // OpenAI API key management
  getOpenAIApiKey() {
    return CONFIG.OPENAI_API_KEY || localStorage.getItem('openai_api_key');
  }

  setOpenAIApiKey(key) {
    localStorage.setItem('openai_api_key', key);
    this.openaiApiKey = key;
  }

  hasOpenAIApiKey() {
    return !!this.openaiApiKey;
  }

  // ElevenLabs API key management
  getElevenLabsApiKey() {
    return CONFIG.ELEVENLABS_API_KEY || localStorage.getItem('elevenlabs_api_key');
  }

  setElevenLabsApiKey(key) {
    localStorage.setItem('elevenlabs_api_key', key);
    this.elevenlabsApiKey = key;
  }

  hasElevenLabsApiKey() {
    return !!this.elevenlabsApiKey;
  }

  // Legacy compatibility
  getApiKey() {
    return this.getOpenAIApiKey();
  }

  setApiKey(key) {
    this.setOpenAIApiKey(key);
  }

  hasApiKey() {
    return this.hasOpenAIApiKey();
  }

  // Get/Set TTS mode
  getMode() {
    return this.mode;
  }

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem('tts_mode', mode);
  }

  isOpenAIMode() {
    return this.mode === 'openai' && this.hasApiKey();
  }

  // Load cached audio from localStorage
  loadCacheFromStorage() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          const text = key.replace(CACHE_KEY_PREFIX, '');
          const audioData = localStorage.getItem(key);
          this.audioCache.set(text, audioData);
        }
      });
    } catch (e) {
      console.warn('Failed to load audio cache:', e);
    }
  }

  // Save audio to cache
  saveToCache(text, audioBlob) {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result;
        this.audioCache.set(text, base64Audio);
        localStorage.setItem(CACHE_KEY_PREFIX + text, base64Audio);
      };
      reader.readAsDataURL(audioBlob);
    } catch (e) {
      console.warn('Failed to cache audio:', e);
    }
  }

  // Get cached audio if available
  getCachedAudio(text) {
    return this.audioCache.get(text);
  }

  // Generate speech using OpenAI TTS API
  async generateOpenAISpeech(text) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not set');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: OPENAI_VOICE,
          input: text,
          speed: OPENAI_SPEED
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      this.saveToCache(text, audioBlob);
      return audioBlob;
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw error;
    }
  }

  // Generate speech using ElevenLabs API (faster, more natural)
  async generateElevenLabsSpeech(text) {
    if (!this.elevenlabsApiKey) {
      throw new Error('ElevenLabs API key not set');
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.elevenlabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2', // Slower, clearer than turbo
          voice_settings: {
            stability: 0.75, // Higher = more consistent pace
            similarity_boost: 0.75,
            style: 0.3, // Lower = calmer, slower delivery
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      this.saveToCache(text, audioBlob);
      return audioBlob;
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw error;
    }
  }

  // Legacy alias
  async generateSpeech(text) {
    return this.generateOpenAISpeech(text);
  }

  // Fallback to browser speech synthesis
  speakWithBrowser(text, onEnd) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = BROWSER_SPEED;
      utterance.lang = 'en-GB';

      // Try to use a female voice (prefer UK voices for British English)
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(v =>
        (v.name.includes('Kate') || v.name.includes('Samantha') || v.name.includes('Female')) &&
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onend = onEnd;
      speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  }

  // Main speak function - respects mode toggle
  async speak(text, onStart, onEnd, onError) {
    // Browser mode - use browser speech directly (no API calls)
    if (this.mode === 'browser') {
      if (onStart) onStart();
      const success = this.speakWithBrowser(text, onEnd);
      if (!success && onError) {
        onError(new Error('No speech synthesis available'));
      }
      return;
    }

    // API modes (OpenAI or ElevenLabs) - check cache first
    const cachedAudio = this.getCachedAudio(text);
    if (cachedAudio) {
      try {
        const audio = new Audio(cachedAudio);
        audio.onplay = onStart;
        audio.onended = onEnd;
        audio.onerror = () => {
          console.warn('Cached audio failed, regenerating...');
          this.speakWithAPI(text, onStart, onEnd, onError);
        };
        await audio.play();
        return;
      } catch (e) {
        console.warn('Failed to play cached audio:', e);
      }
    }

    // Not in cache, generate with API
    await this.speakWithAPI(text, onStart, onEnd, onError);
  }

  async speakWithAPI(text, onStart, onEnd, onError) {
    // Try ElevenLabs if selected and has key
    if (this.mode === 'elevenlabs' && this.hasElevenLabsApiKey()) {
      try {
        if (onStart) onStart();
        const audioBlob = await this.generateElevenLabsSpeech(text);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          if (onEnd) onEnd();
        };
        await audio.play();
        return;
      } catch (error) {
        console.warn('ElevenLabs TTS failed, falling back to browser speech:', error);
      }
    }

    // Try OpenAI if selected and has key
    if (this.mode === 'openai' && this.hasOpenAIApiKey()) {
      try {
        if (onStart) onStart();
        const audioBlob = await this.generateOpenAISpeech(text);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          if (onEnd) onEnd();
        };
        await audio.play();
        return;
      } catch (error) {
        console.warn('OpenAI TTS failed, falling back to browser speech:', error);
      }
    }

    // Fallback to browser speech if API fails or no key
    if (onStart) onStart();
    const success = this.speakWithBrowser(text, onEnd);
    if (!success && onError) {
      onError(new Error('No speech synthesis available'));
    }
  }

  // Legacy compatibility
  async speakWithOpenAI(text, onStart, onEnd, onError) {
    return this.speakWithAPI(text, onStart, onEnd, onError);
  }

  // Clear all cached audio
  clearCache() {
    this.audioCache.clear();
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export singleton instance
export default new TTSService();
