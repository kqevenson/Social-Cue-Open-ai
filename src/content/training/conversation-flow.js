// Social Cue Conversation Flow (STOP-TALK method)

import { getVoiceIntro } from './introduction-scripts';
import {
  topics as voicePracticeTopics,
  getScenariosForTopic,
  getGradeBandFromGrade,
  getScenarioIntroKey
} from '../../data/voicePracticeScenarios';

export const conversationFlow = {
  // STOP-TALK phases
  stopTalk: {
    stop: {
      duration: 500, // ms to pause after student speaks
      purpose: 'Process response and prepare feedback'
    },
    talk: {
      maxWords: 15, // strict word limit
      structure: 'feedback + question + turn_signal',
      turnSignals: ['Your turn!', 'What would you say?', 'Now you try!', 'Go ahead!']
    }
  },

  // Turn-taking rules
  turnTaking: {
    oneQuestionPerTurn: true,
    explicitTurnSignals: true,
    waitForCompleteResponse: true,
    fastFeedback: true,
    wordLimits: {
      'K-2': 8,
      '3-5': 12,
      '6-8': 15,
      '9-12': 20
    }
  },

  // Response structure template
  responseStructure: {
    feedback: 'Short, specific praise or correction (3-5 words)',
    content: 'Main teaching point or question (5-8 words)',
    turnSignal: 'Explicit prompt for student to respond (2-3 words)',
    example: {
      feedback: 'Great eye contact!',
      content: 'Now ask about their hobby.',
      turnSignal: 'Your turn!'
    }
  },

  // Conversation pacing
  pacing: {
    minimumTurns: 5,
    maximumTurns: 12,
    idealTurns: 8,
    energyLevel: 'high', // fast-paced, energetic
    enthusiasm: 'consistent' // maintain throughout
  }
};

export function classifyGradeBand(gradeLevel) {
  const grade = parseInt(gradeLevel, 10);
  if (Number.isNaN(grade)) return '6-8';
  if (grade <= 2) return 'K-2';
  if (grade <= 5) return '3-5';
  if (grade <= 8) return '6-8';
  return '9-12';
}

// Helper to format AI response with proper structure
export const formatAIResponse = (feedback, content, gradeLevel) => {
  const normalizedGradeLevel = classifyGradeBand(gradeLevel);

  const wordLimit =
    conversationFlow.turnTaking.wordLimits[normalizedGradeLevel] ??
    conversationFlow.stopTalk.talk.maxWords;

  const { turnSignals } = conversationFlow.stopTalk.talk;
  const turnSignal = turnSignals[Math.floor(Math.random() * turnSignals.length)];

  let response = `${feedback} ${content} ${turnSignal}`.trim();
  const words = response.split(/\s+/);

  if (words.length > wordLimit) {
    response = `${words.slice(0, wordLimit).join(' ')}!`;
  }

  return response;
};

export function getScenarioForTopic(topicLike, gradeLevel = '6') {
  if (!topicLike) return null;

  const topicId =
    typeof topicLike === 'string' ? topicLike : (topicLike && topicLike.id) ? topicLike.id : null;
  const topic = voicePracticeTopics.find((t) => t.id === topicId) || null;

  const numericGrade = parseInt(gradeLevel, 10) || 6;
  const gradeScenarios = topic ? getScenariosForTopic(topic.id, numericGrade) || [] : [];
  const firstScenario = gradeScenarios[0] || null;

  if (!topic || !firstScenario) {
    return null;
  }

  const scenarioTitles = gradeScenarios.map((scenario) => scenario.title).filter(Boolean);
  const compiledDescription = [
    topic.description || '',
    scenarioTitles.length
      ? `This topic includes scenarios such as ${scenarioTitles
          .slice(0, 3)
          .join(', ')}${scenarioTitles.length > 3 ? ' and more.' : '.'}`
      : null
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const baseDescription =
    compiledDescription ||
    firstScenario.description ||
    firstScenario.prompt ||
    `Practice conversations related to ${topic.title.toLowerCase()}.`;

  return {
    id: firstScenario.id,
    scenarioId: firstScenario.id,
    title: topic.title,
    category: topic.category || topic.id,
    description: baseDescription,
    prompt: firstScenario.prompt || firstScenario.contextLine || '',
    warmupQuestion: firstScenario.prompt || firstScenario.warmupQuestion || '',
    topicId: topic.id,
    topicTitle: topic.title,
    topicDescription: topic.description,
    topicIcon: topic.icon,
    relatedScenarios: gradeScenarios,
    gradeLevel: numericGrade,
    gradeBand: getGradeBandFromGrade(numericGrade).toLowerCase(),
    scriptKey: getScenarioIntroKey(topic.id)
  };
}

export default conversationFlow;

const DEFAULT_MICRO_TIPS = [
  "Sometimes just saying 'Hey, can I join?' is all it takes!",
  'If you feel nervous, try asking a question — most people love to talk about themselves.',
  'Eye contact and a quick smile go a long way.',
  'You can always start with a compliment or something you both notice.',
  'Even a simple “Hey, how’s it going?” can open a door.'
];

const FALLBACK_GREETING = 'Hey! I’m Cue — it’s good to meet you.';
const FALLBACK_ASK_NAME = 'What should I call you? I love practicing with friends!';
const FALLBACK_ENCOURAGE = 'We can take it step by step together.';

const SCENARIO_FALLBACK = (scenario) =>
  scenario?.prompt || scenario?.description || `Let’s practice ${scenario?.title || 'a real-life conversation'}.`;

/**
 * Builds a natural, voice-paced intro sequence that feels like a supportive peer coach.
 * Pauses are intentional between each segment to mimic human conversation and allow TTS to breathe.
 * Prompts include greeting, learner name exchange, scenario context, a micro tip, and a warm-up question.
 * Designed to create rapport, reduce cognitive load, and ease learners into the practice flow.
 */
export function buildIntroSegments({
  scenario,
  gradeLevel,
  learnerName,
  tips = DEFAULT_MICRO_TIPS
} = {}) {
  const sequence = getIntroductionSequence(gradeLevel || '6');
  const sections = sequence.sections || {};
  const scenarioKey = getScenarioIntroKey(scenario?.topicId || scenario?.id || '');
  const scenarioScripts = sequence.scenarios || {};
  const scenarioScript = scenarioKey ? scenarioScripts[scenarioKey] : null;

  const greetingLine = sections.greeting || FALLBACK_GREETING;
  const introLine = sections.introduction || '';
  const safetyLine = sections.safety || FALLBACK_ENCOURAGE;
  const consentLine = sections.consent || '';

  const namePrompt = FALLBACK_ASK_NAME;

  const acknowledgement = learnerName
    ? `Awesome, ${learnerName}! I'm really glad you're here.`
    : "Nice to meet you! I'm really glad you're here.";

  const scenarioLine = scenarioScript?.intro || SCENARIO_FALLBACK(scenario);
  const coachingTip = tips[Math.floor(Math.random() * tips.length)];
  const warmUpQuestion =
    scenarioScript?.practicePrompt || sequence.firstPrompt || 'Wanna try it out with me?';

  return [
    { id: 'greet', text: greetingLine, expectResponse: false },
    introLine ? { id: 'intro-1', text: introLine, expectResponse: false } : null,
    safetyLine ? { id: 'intro-2', text: safetyLine, expectResponse: false } : null,
    consentLine ? { id: 'intro-3', text: consentLine, expectResponse: false } : null,
    { id: 'ask-name', text: namePrompt, expectResponse: true },
    { id: 'ack-name', text: acknowledgement, expectResponse: false },
    {
      id: 'scenario-setup',
      text: `Today we’re practicing how to handle this: ${scenario?.title || 'a real-life chat'}. ${scenarioLine}`,
      expectResponse: false
    },
    {
      id: 'coaching-tip',
      text: `Here’s a quick tip: ${coachingTip}`,
      expectResponse: false
    },
    {
      id: 'first-question',
      text: warmUpQuestion,
      expectResponse: true
    }
  ].filter(Boolean);
}
