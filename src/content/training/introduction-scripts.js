// ⚠️ DEPRECATED: This file has been replaced by the new conversation engine
// 
// All intro/scenario logic is now handled by:
//   - generateConversationResponse() in src/services/generateConversationResponse.js
//   - introEngine in src/services/introEngine.js
//   - personaEngine in src/services/personaEngine.js
//
// This file is kept temporarily for backward compatibility with:
//   - server.js (may still use getVoiceIntro)
//   - Test components (TestVoiceIntro.jsx, TestCurriculumForcing.jsx)
//
// Please migrate all code to use generateConversationResponse() instead.
// This file will be removed in a future release.

/* COMMENTED OUT - REPLACED BY NEW ENGINE
// All code below is commented out and deprecated

import gradeIntros from '../../content/training/introductions.json';

import {
  generateScenarioForTopic,
  deriveTopicTitle,
  getGradeBandFromGrade
} from '../../data/voicePracticeScenarios';

const FALLBACK_PROMPT = 'What would you say first?';

const normalizeKey = (value) => {
  if (!value && value !== 0) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const resolveScenarioCandidates = (descriptor = '', scenarioOverride = null) => {
  const candidates = [
    descriptor,
    scenarioOverride?.scriptKey,
    scenarioOverride?.scenarioKey,
    scenarioOverride?.topicId,
    scenarioOverride?.topic,
    scenarioOverride?.topicTitle,
    scenarioOverride?.category,
    scenarioOverride?.title
  ]
    .map(normalizeKey)
    .filter(Boolean);

  return Array.from(new Set(candidates));
};

const normalizeGradeInput = (gradeInput) => {
  const numericGrade =
    typeof gradeInput === 'number' ? gradeInput : parseInt(String(gradeInput).trim(), 10);
  const gradeRange = getGradeBandFromGrade(numericGrade);
  return { numericGrade, gradeRange };
};

const ensureScenario = (topic, gradeLevel, fallbackScenario) => {
  if (fallbackScenario?.contextLine || fallbackScenario?.warmupQuestion) {
    return {
      ...fallbackScenario,
      topicTitle: fallbackScenario.topicTitle || deriveTopicTitle(topic).topicTitle
    };
  }
  return generateScenarioForTopic(topic, gradeLevel, { forceFirst: true });
};

export const getVoiceIntro = (gradeInput, topic = '', scenarioOverride = null) => {
  const { numericGrade, gradeRange } = normalizeGradeInput(gradeInput);
  const gradeKey = (gradeRange || '6-8').toLowerCase();
  const defaultGreeting = gradeIntros[gradeKey] || gradeIntros['6-8'];
  const gradeConfig = INTRO_SEQUENCE_BY_GRADE[gradeKey] || INTRO_SEQUENCE_BY_GRADE['6-8'] || {};

  const scenarioDetails = ensureScenario(
    topic || scenarioOverride?.topicId || scenarioOverride?.topicTitle,
    numericGrade,
    scenarioOverride
  );

  const candidateKeys = resolveScenarioCandidates(topic, scenarioOverride);
  const scenariosMap = gradeConfig.scenarios || {};
  const availableKeys = Object.keys(scenariosMap);

  const matchedEntry = Object.entries(scenariosMap).find(([key]) => {
    const normalizedKey = normalizeKey(key);
    return candidateKeys.some((candidate) => {
      if (candidate === normalizedKey) return true;
      if (candidate && normalizedKey.includes(candidate)) return true;
      if (candidate && candidate.includes(normalizedKey)) return true;
      return false;
    });
  });

  console.log('[VoiceIntro Lookup]', {
    gradeKey,
    candidateKeys,
    availableKeys,
    matchedKey: matchedEntry ? matchedEntry[0] : null
  });

  const matchedScenario = matchedEntry?.[1] || null;

  const scenarioIntro =
    matchedScenario?.intro ||
    scenarioDetails?.contextLine ||
    `Let's practice ${scenarioDetails?.topicTitle?.toLowerCase() || 'this skill'}.`;

  const firstPrompt =
    matchedScenario?.firstPrompt ||
    gradeConfig.firstPrompt ||
    scenarioDetails?.warmupQuestion ||
    FALLBACK_PROMPT;

  const safetyAndConsent =
    gradeConfig.safety ||
    gradeConfig.consent ||
    gradeConfig.safetyAndConsent ||
    '';

  const greetingIntro = matchedScenario?.greeting || gradeConfig.greeting || defaultGreeting;

  return {
    greetingIntro,
    scenarioIntro,
    safetyAndConsent,
    firstPrompt,
    gradeRange,
    topicTitle: scenarioDetails?.topicTitle,
    scenarioDetails,
    matchedScenarioKey: matchedEntry?.[0] || null
  };
};

export default getVoiceIntro;

// Rest of the file content is commented out for brevity
// Full implementation preserved but not executed
// See git history for complete code if needed for migration
*/

// Temporary backward compatibility exports
// These return empty/default values to prevent breaking existing imports
export const getVoiceIntro = () => {
  console.warn('⚠️ getVoiceIntro() is deprecated. Use generateConversationResponse() instead.');
  return {
    greetingIntro: "Hey there, I'm Cue.",
    scenarioIntro: "Let's practice together.",
    safetyAndConsent: "Ready to try it with me?",
    firstPrompt: "What would you try first?",
    gradeRange: "6-8",
    topicTitle: "",
    scenarioDetails: {},
    matchedScenarioKey: null
  };
};

export function getIntroductionSequence({ gradeInput, scenarioDetails = {}, learnerName = null, topicTitle = "" }) {
  console.warn('⚠️ getIntroductionSequence() is deprecated. Use generateConversationResponse() instead.');
  return {
    greetingIntro: learnerName ? `Hey ${learnerName}, I'm Cue. Let's warm up together.` : "Hey there, I'm Cue. Let's warm up together.",
    scenarioIntro: `Today we're practicing ${scenarioDetails?.title || topicTitle || "this skill"}.`,
    safetyAndConsent: "Ready to try it with me? I'll go first, then you jump in when you're ready.",
    firstPrompt: scenarioDetails?.warmupQuestion || "What would you try first?",
    fullIntro: ""
  };
}

export default getVoiceIntro;
