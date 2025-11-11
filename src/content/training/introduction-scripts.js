import {
  generateScenarioForTopic,
  deriveTopicTitle,
  getGradeBandFromGrade
} from '../../data/voicePracticeScenarios';

export const introductionScripts = {
  'K-2': {
    greeting: "Hi! I'm Cue, and I'm so excited to practice with you today!",
    introduction:
      "We're going to practice real situations, and I'll help you know what to say.",
    safety: 'This is a safe space—no wrong answers here.',
    consent: 'Ready to try it with me?'
  },
  '3-5': {
    greeting: "Hey there! I'm Cue, your practice coach.",
    introduction:
      "We'll walk through real situations so you can feel confident before they happen.",
    safety: "It's just you and me, so you can try anything and we'll improve it together.",
    consent: 'Sound good?'
  },
  '6-8': {
    greeting: "Hi, I'm Cue.",
    introduction:
      "Think of me as the friend who helps you rehearse tricky social moments before they happen.",
    safety: 'No judgment, just honest practice.',
    consent: 'Want to jump in?'
  },
  '9-12': {
    greeting: "Hey, I'm Cue.",
    introduction:
      "I help you run through real-life conversations so they feel natural when they happen.",
    safety: "Everything we say here stays here, and I'll keep it real with you.",
    consent: 'Ready?'
  }
};

const FALLBACK_PROMPT = 'What would you say first?';

const normalizeGradeInput = (gradeInput) => {
  if (!gradeInput && gradeInput !== 0) {
    return { numericGrade: 6, gradeRange: '6-8' };
  }

  if (typeof gradeInput === 'string' && gradeInput.includes('-')) {
    return { numericGrade: parseInt(gradeInput.split('-')[0], 10) || 6, gradeRange: gradeInput };
  }

  const numericGrade =
    typeof gradeInput === 'number'
      ? gradeInput
      : parseInt(String(gradeInput).trim(), 10);

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
  const script =
    introductionScripts[gradeRange] || introductionScripts[getGradeBandFromGrade(6)];

  const scenarioDetails = ensureScenario(
    topic || scenarioOverride?.topicId || scenarioOverride?.topicTitle,
    numericGrade,
    scenarioOverride
  );

  const greetingIntro = `${script.greeting} ${script.introduction}`.trim();
  const safetyAndConsent = `${script.safety} ${script.consent}`.trim();
  const scenarioIntro =
    scenarioDetails?.contextLine ||
    `Let's practice ${scenarioDetails?.topicTitle?.toLowerCase() || 'this skill'}.`;
  const firstPrompt =
    scenarioDetails?.warmupQuestion || FALLBACK_PROMPT;

  return {
    greetingIntro,
    scenarioIntro,
    safetyAndConsent,
    firstPrompt,
    gradeRange,
    topicTitle: scenarioDetails?.topicTitle,
    scenarioDetails,
    sections: {
      greeting: script.greeting,
      introduction: script.introduction,
      safety: script.safety,
      consent: script.consent
    }
  };
};

export default introductionScripts;
