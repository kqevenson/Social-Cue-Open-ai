import { OpenAI } from 'openai';

const processEnvApiKey =
  typeof globalThis !== 'undefined' &&
  typeof globalThis.process !== 'undefined' &&
  globalThis.process?.env?.OPENAI_API_KEY;

const OPENAI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_KEY) ||
  processEnvApiKey ||
  '';

const DEFAULT_MODEL = 'tts-1';
const DEFAULT_VOICE = 'shimmer';

let activeAudio = null;
let activeAudioUrl = null;
let openAIClient = null;

function getOpenAIClient() {
  if (openAIClient) return openAIClient;
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key');
  }

  openAIClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  return openAIClient;
}

function stopOpenAITTSPlayback() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch (error) {
      console.warn('Unable to pause active audio', error);
    }
    activeAudio = null;
  }

  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = null;
  }
}

async function playVoiceResponseWithOpenAI(text, options = {}) {
  const trimmed = (text ?? '').toString().trim();
  if (!trimmed) {
    throw new Error('Cannot synthesize empty text');
  }

  if (typeof Audio === 'undefined') {
    throw new Error('Audio playback is not supported in this environment');
  }

  const client = getOpenAIClient();
  const voice = options.voice || DEFAULT_VOICE;
  const model = options.model || DEFAULT_MODEL;

  let speech;
  try {
    speech = await client.audio.speech.create({
      model,
      voice,
      input: trimmed
    });
  } catch (error) {
    throw new Error(`OpenAI TTS failed: ${error?.message || 'Unknown error'}`);
  }

  const audioBuffer = await speech.arrayBuffer();
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);

  stopOpenAITTSPlayback();

  const audio = new Audio(audioUrl);
  audio.preload = 'auto';
  activeAudio = audio;
  activeAudioUrl = audioUrl;

  options.onLoadStart?.();
  audio.onloadeddata = () => options.onLoaded?.();

  return new Promise((resolve, reject) => {
    const handleError = (error) => {
      stopOpenAITTSPlayback();
      options.onError?.(error);
      reject(error);
    };

    audio.onended = () => {
      stopOpenAITTSPlayback();
      options.onEnded?.();
      resolve();
    };

    audio.onerror = () => {
      handleError(new Error('Audio playback failed'));
    };

    const playPromise = audio.play();

    if (playPromise?.then) {
      playPromise
        .then(() => options.onStart?.())
        .catch(handleError);
    } else {
      options.onStart?.();
    }
  });
}

export { playVoiceResponseWithOpenAI, stopOpenAITTSPlayback };
