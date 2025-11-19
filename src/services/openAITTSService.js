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
const SILENT_MP3_DATA_URL =
  'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjgzLjEwMAAAAAAAAAAAAAAA//NAxAAAAANIAAAAABhkbHIAAAAAAAAAAABMYXZmNTcuODMuMTAw//NAxAAAAANIAAAAABxkYXRhAAAAAA==';

let activeAudio = null;
let activeAudioUrl = null;
let openAIClient = null;
let audioUnlocked = false;
let pendingUnlockPromise = null;
let audioCtx = null;

export async function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    try {
      await audioCtx.resume();
    } catch (e) {
      console.warn("Could not resume AudioContext:", e);
    }
  }
  return audioCtx;
}

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

export async function unlockAudio() {
  if (audioUnlocked && audioCtx) {
    return audioCtx;
  }

  if (pendingUnlockPromise) {
    return pendingUnlockPromise;
  }

  pendingUnlockPromise = (async () => {
    try {
      const ctx = await getAudioContext();
      await ctx.resume();
      audioUnlocked = true;
      return ctx;
    } catch (error) {
      console.warn('⚠️ AudioContext resume failed, attempting silent unlock fallback.', error);

      if (typeof Audio === 'undefined') {
        audioUnlocked = true;
        return audioCtx;
      }

      await new Promise((resolve, reject) => {
        const silentAudio = new Audio();
        silentAudio.preload = 'auto';
        silentAudio.muted = true;
        silentAudio.loop = false;
        silentAudio.src = SILENT_MP3_DATA_URL;

        const cleanup = () => {
          silentAudio.pause();
          silentAudio.src = '';
        };

        silentAudio
          .play()
          .then(resolve)
          .catch((silentError) => {
            console.warn('⚠️ Audio unlock failed (user gesture required):', silentError);
            reject(silentError);
          })
          .finally(cleanup);
      });

      try {
        const ctx = await getAudioContext();
        await ctx.resume();
        audioUnlocked = true;
        return ctx;
      } catch (resumeError) {
        console.warn('⚠️ AudioContext still suspended after silent unlock attempt.', resumeError);
        return audioCtx;
      }
    } finally {
      pendingUnlockPromise = null;
    }
  })();

  return pendingUnlockPromise;
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

  let ctxForPlayback = null;
  try {
    ctxForPlayback = await getAudioContext();
  } catch (contextError) {
    console.warn('⚠️ AudioContext not available for playback:', contextError);
  }

  if (!ctxForPlayback) {
    console.warn('⚠️ AudioContext not initialized - unlockAudio() must be called first');
  }

  let speech;
  try {
    speech = await client.audio.speech.create({
      model,
      voice,
      input: trimmed,
      format: 'mp3'
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
  console.log('📦 Audio blob details:', {
    size: audioBlob.size,
    type: audioBlob.type,
    sizeKB: Number(audioBlob.size / 1024).toFixed(2)
  });

  stopOpenAITTSPlayback();

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.preload = 'auto';
  audio.onloadeddata = () => console.log('✅ Audio loaded');
  audio.onerror = (event) => {
    console.error('❌ Audio element error:', {
      event,
      src: audio.src,
      networkState: audio.networkState,
      readyState: audio.readyState,
      errorCode: audio.error?.code,
      errorMessage: audio.error?.message
    });
  };
  audio.addEventListener('canplaythrough', () => console.log('🎧 Audio can play through'), { once: true });

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
