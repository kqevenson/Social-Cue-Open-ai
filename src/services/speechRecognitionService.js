// speechRecognitionService.js

import { globalTTSLock } from './openAITTSService';

let recognition = null;
let isRecognitionActive = false;
let handlers = {
  onInterim: null,
  onFinal: null,
  onError: null,
  onEnd: null,
};

export function initRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    console.warn('Speech recognition not supported');
    return null;
  }

  recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    if (globalTTSLock.isSpeaking) {
      // AI is still talking; ignore speech
      return;
    }

    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (interimTranscript && handlers.onInterim) {
      handlers.onInterim(interimTranscript.trim());
    }

    if (finalTranscript && handlers.onFinal) {
      handlers.onFinal(finalTranscript.trim());
    }
  };

  recognition.onerror = (event) => {
    isRecognitionActive = false;
    handlers.onError?.(event.error);
  };

  recognition.onend = () => {
    isRecognitionActive = false;
    if (!globalTTSLock.isSpeaking) {
      handlers.onEnd?.();
    }
  };

  return recognition;
}

export function setHandlers(newHandlers) {
  handlers = { ...handlers, ...newHandlers };
}

export function startRecognition() {
  if (!recognition) return;

  if (globalTTSLock.isSpeaking) {
    // Do NOT start listening while TTS is speaking
    return;
  }

  // Do not start again if already active
  if (isRecognitionActive) {
    console.warn('Recognition already active, not restarting');
    return;
  }

  try {
    recognition.start();
    isRecognitionActive = true;
  } catch (e) {
    console.warn('Recognition already started');
  }
}

export function stopRecognition() {
  if (!recognition) return;
  try {
    recognition.stop();
  } finally {
    isRecognitionActive = false;
  }
}
