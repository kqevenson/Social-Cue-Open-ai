import { getAudioContext } from './openAITTSService';

class AudioFeedbackService {
  constructor() {
    // ⚠️ DO NOT create AudioContext here - use shared AudioContext from openAITTSService
    // AudioContext must be created after user gesture via unlockAudio()
    this.sounds = {
      yourTurn: this.createToneSound(440, 0.1), // A4
      thinking: this.createToneSound(330, 0.1), // E4
      correct: this.createToneSound(554.37, 0.15), // C#5
      helpNeeded: this.createToneSound(220, 0.2) // A3
    };
  }

  // Use shared AudioContext from openAITTSService
  // This should only be called after unlockAudio() has been called
  async getAudioContext() {
    try {
      return await getAudioContext();
    } catch (error) {
      console.warn('⚠️ AudioFeedbackService: AudioContext not available - unlockAudio() must be called first');
      return null;
    }
  }

  createToneSound(frequency, duration) {
    return async () => {
      const ctx = await this.getAudioContext();
      if (!ctx) {
        console.warn('⚠️ AudioFeedbackService: AudioContext not available - unlockAudio() must be called first');
        return;
      }
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
  }

  playYourTurn() {
    this.sounds.yourTurn();
  }

  playThinking() {
    this.sounds.thinking();
  }

  playCorrect() {
    this.sounds.correct();
  }

  playHelpNeeded() {
    this.sounds.helpNeeded();
  }
}

export default new AudioFeedbackService();






