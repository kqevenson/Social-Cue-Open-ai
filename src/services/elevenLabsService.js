const ELEVENLABS_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.ELEVENLABS_API_KEY) ||
  '';

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is not set. Check your environment variables.');
}

const VOICE_IDS = {
  'k-2': 'pNInz6obpgDQGcFmaJgB',
  '3-5': 'EXAVITQu4vr4xnSDxMaL',
  '6-8': '21m00Tcm4TlvDq8ikWAM',
  '9-12': 'AZnzlk1XvdvUeBnXmlld'
};

const VOICE_SETTINGS = {
  'k-2': { stability: 0.75, similarity_boost: 0.75 },
  '3-5': { stability: 0.7, similarity_boost: 0.75 },
  '6-8': { stability: 0.65, similarity_boost: 0.8 },
  '9-12': { stability: 0.6, similarity_boost: 0.8 }
};

const getVoiceSettings = (gradeLevel) => VOICE_SETTINGS[gradeLevel] || VOICE_SETTINGS['6-8'];

export const textToSpeechElevenLabs = async (text, gradeLevel = '6-8') => {
  if (!text || text.trim() === '') {
    console.error('❌ Cannot send empty text to ElevenLabs');
    return null;
  }

  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY is missing. Add it to your .env or deployment settings.');
    throw new Error('ELEVENLABS_API_KEY is missing');
  }

  const cleanText = text.replace(/undefined/gi, '').replace(/\n+/g, ' ').trim();
  if (!cleanText) {
    console.error('❌ Cleaned text is empty, skipping ElevenLabs request');
    return null;
  }

  const voiceId = VOICE_IDS[gradeLevel] || VOICE_IDS['6-8'];
  const voiceSettings = getVoiceSettings(gradeLevel);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: cleanText,
      voice_settings: voiceSettings,
      model_id: 'eleven_monolingual_v1'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ ElevenLabs request failed:', response.status, errorText);
    throw new Error(`ElevenLabsError ${response.status}: ${errorText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  return URL.createObjectURL(audioBlob);
};

export default {
  textToSpeechElevenLabs
};
