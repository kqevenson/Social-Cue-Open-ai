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
      activeAudio.stop(0);
    } catch (e) {
      // Buffer source may already be stopped
    }
    activeAudio = null;
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
  if (!trimmed) throw new Error('Cannot synthesize empty text');

  const client = getOpenAIClient();
  const voice = options.voice || DEFAULT_VOICE;
  const model = options.model || DEFAULT_MODEL;

  // Ensure AudioContext is available and resumed
  const ctx = await getAudioContext();
  await ctx.resume();

  // Fetch TTS audio as arrayBuffer
  let speech;
  try {
    speech = await client.audio.speech.create({
      model,
      voice,
      input: trimmed,
      format: "mp3"
    });
  } catch (error) {
    throw new Error(`OpenAI TTS failed: ${error?.message || 'Unknown error'}`);
  }

  const audioArrayBuffer = await speech.arrayBuffer();
  if (!audioArrayBuffer || audioArrayBuffer.byteLength === 0) {
    throw new Error('OpenAI TTS returned empty audio buffer');
  }

  // Decode MP3 into AudioBuffer
  const audioBuffer = await ctx.decodeAudioData(audioArrayBuffer.slice(0));

  // Stop any existing playback
  stopOpenAITTSPlayback();

  // Create buffer source
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  // Connect to destination
  source.connect(ctx.destination);

  activeAudio = source;

  // Optional callbacks
  options.onLoadStart?.();
  options.onStart?.();

  return new Promise((resolve, reject) => {
    source.onended = () => {
      activeAudio = null;
      options.onEnded?.();
      resolve();
    };

    try {
      source.start(0);
    } catch (err) {
      activeAudio = null;
      options.onError?.(err);
      reject(err);
    }
  });
}

export { stopOpenAITTSPlayback };
