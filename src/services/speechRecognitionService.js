// speechRecognitionService.js

let recognition = null;
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
    handlers.onError?.(event.error);
  };

  recognition.onend = () => {
    handlers.onEnd?.();
  };

  return recognition;
}

export function setHandlers(newHandlers) {
  handlers = { ...handlers, ...newHandlers };
}

export function startRecognition() {
  if (!recognition) return;
  try {
    recognition.start();
  } catch (e) {
    console.warn('Recognition already started');
  }
}

export function stopRecognition() {
  if (!recognition) return;
  recognition.stop();
}
