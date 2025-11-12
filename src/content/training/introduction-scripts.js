import gradeIntros from '../../content/training/introductions.json';

import {
  generateScenarioForTopic,
  deriveTopicTitle,
  getGradeBandFromGrade
} from '../../data/voicePracticeScenarios';

const FALLBACK_PROMPT = 'What would you say first?';

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

  const gradeKey = gradeRange.toLowerCase(); // matches "k-2", "3-5", etc
  const introString = gradeIntros[gradeKey] || gradeIntros['6-8'];

  const scenarioDetails = ensureScenario(
    topic || scenarioOverride?.topicId || scenarioOverride?.topicTitle,
    numericGrade,
    scenarioOverride
  );

  const scenarioIntro =
    scenarioDetails?.contextLine ||
    `Let's practice ${scenarioDetails?.topicTitle?.toLowerCase() || 'this skill'}.`;

  const firstPrompt = scenarioDetails?.warmupQuestion || FALLBACK_PROMPT;

  return {
    greetingIntro: introString,
    scenarioIntro,
    safetyAndConsent: '',
    firstPrompt,
    gradeRange,
    topicTitle: scenarioDetails?.topicTitle,
    scenarioDetails
  };
};

export default getVoiceIntro;
