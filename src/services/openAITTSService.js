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

export async function playVoiceResponseWithOpenAI(text, options = {}) {
  const trimmed = (text ?? '').toString().trim();
  if (!trimmed) {
    throw new Error('Cannot synthesize empty text');
  }

  console.log('🟢 Requesting OpenAI TTS with input:', trimmed);
  console.log('📢 Intro text length:', trimmed.length);

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
  if (!audioBuffer || audioBuffer.byteLength === 0) {
    throw new Error('OpenAI TTS returned empty audio buffer');
  }
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error('OpenAI TTS returned invalid audio blob');
  }
  console.log('📦 Audio Blob Size:', audioBlob.size);

  stopOpenAITTSPlayback();

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.preload = 'auto';
  audio.onloadeddata = () => console.log('✅ Audio loaded');
  audio.onerror = (e) => console.error('🔻 Audio error:', e);
  audio.addEventListener('canplaythrough', () => console.log('🎧 Audio can play through'), { once: true });

  const test = new Audio('https://upload.wikimedia.org/wikipedia/commons/4/4e/Bird_call_in_mangrove.ogg');
  test.play().catch((err) => {
    console.warn('Test audio play blocked:', err);
  });

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
      console.log('🔚 Audio finished');
      stopOpenAITTSPlayback();
      options.onEnded?.();
      resolve();
    };

    audio.onerror = () => {
      handleError(new Error('Audio playback failed'));
    };

    const startPlayback = () => {
      audio.removeEventListener('canplaythrough', startPlayback);
      try {
        const playPromise = audio.play();
        if (playPromise?.then) {
          playPromise
            .then(() => options.onStart?.())
            .catch(handleError);
        } else {
          options.onStart?.();
        }
      } catch (error) {
        handleError(error);
      }
    };

    audio.addEventListener('canplaythrough', startPlayback, { once: true });

    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      startPlayback();
    }
  });
}

export { stopOpenAITTSPlayback };
