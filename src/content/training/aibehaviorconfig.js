// Social Cue AI Behavior Files — Unified Structure

import k2 from '../curriculum/k-2-curriculum.js';
import grades3to5 from '../curriculum/3-5-curriculum.js';
import grades6to8 from '../curriculum/6-8-curriculum.js';
import grades9to12 from '../curriculum/9-12-curriculum.js';

export const curriculum = {
  grades: {
    'k-2': k2,
    '3-5': grades3to5,
    '6-8': grades6to8,
    '9-12': grades9to12
  },
  getGradeKey(gradeLevel) {
    const grade = parseInt(gradeLevel, 10);
    if (grade <= 2) return 'k-2';
    if (grade <= 5) return '3-5';
    if (grade <= 8) return '6-8';
    return '9-12';
  }
};

export const conversationFlow = {
  stopTalk: {
    stop: { duration: 500, purpose: 'Process response and prepare feedback' },
    talk: {
      maxWords: 15,
      structure: 'feedback + question + turn_signal',
      turnSignals: ['Your turn!', 'What would you say?', 'Now you try!', 'Go ahead!']
    }
  },
  turnTaking: {
    oneQuestionPerTurn: true,
    explicitTurnSignals: true,
    waitForCompleteResponse: true,
    fastFeedback: true,
    wordLimits: { 'K-2': 8, '3-5': 12, '6-8': 15, '9-12': 20 }
  },
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
  pacing: {
    minimumTurns: 5,
    maximumTurns: 12,
    idealTurns: 8,
    energyLevel: 'high',
    enthusiasm: 'consistent'
  }
};

export const formatAIResponse = (feedback, content, gradeLevel) => {
  const normalizedGrade = gradeLevel.toUpperCase();
  const wordLimit =
    conversationFlow.turnTaking.wordLimits[normalizedGrade] ??
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

export const timingRules = {
  gradeRanges: {
    'K-2': {
      helpTimeout: 2000,
      afterResponse: 1000,
      maxTurnLength: 8,
      responseSpeed: 'slow',
      pauseTolerance: 'high',
      speechRate: 0.85,
      paceLabel: 'LIVELY'
    },
    '3-5': {
      helpTimeout: 2000,
      afterResponse: 800,
      maxTurnLength: 12,
      responseSpeed: 'moderate',
      pauseTolerance: 'moderate',
      speechRate: 0.90,
      paceLabel: 'MOMENTUM'
    },
    '6-8': {
      helpTimeout: 2500,
      afterResponse: 500,
      maxTurnLength: 15,
      responseSpeed: 'moderate',
      pauseTolerance: 'moderate',
      speechRate: 0.95,
      paceLabel: 'NATURAL'
    },
    '9-12': {
      helpTimeout: 3000,
      afterResponse: 500,
      maxTurnLength: 20,
      responseSpeed: 'natural',
      pauseTolerance: 'low',
      speechRate: 1.00,
      paceLabel: 'REAL-TIME'
    }
  },
  rapidMethod: {
    recognize: 'Detect pause after 2 seconds',
    assess: 'Determine if student needs help or is thinking',
    provide: 'Offer specific, actionable prompt',
    invite: 'Explicitly invite response ("Your turn!")',
    deliver: 'Praise attempt immediately'
  },
  helpPrompts: {
    gentle: [
      "Take your time. What would you like to say?",
      "It's okay to pause and think. Your turn!",
      "Need a hint? Try starting with..."
    ],
    specific: [
      "Try saying: 'Hi, my name is...'",
      "You could ask: 'What do you like to do?'",
      "Remember to make eye contact and smile!"
    ]
  }
};

export const getTimingForGrade = (gradeLevel) => {
  const gradeNum = parseInt(gradeLevel, 10);
  if (gradeNum <= 2) return timingRules.gradeRanges['K-2'];
  if (gradeNum <= 5) return timingRules.gradeRanges['3-5'];
  if (gradeNum <= 8) return timingRules.gradeRanges['6-8'];
  return timingRules.gradeRanges['9-12'];
};

export const leadershipMethod = {
  phases: [
    { key: 'demonstrate', title: 'Demonstrate', description: 'AI models the skill first, playing both roles.', scriptCue: "Watch me first. Listen to my words and tone..." },
    { key: 'guided-repetition', title: 'Guided Repetition', description: 'Learner repeats line-by-line with coaching.', scriptCue: 'Repeat after me: ' },
    { key: 'scenario-practice', title: 'Scenario Practice', description: 'AI acts in character while learner applies skill.', scriptCue: "Now I'm going to be the other person. Ready? Go!" },
    { key: 'variation', title: 'Variation', description: 'Add variations to solidify skill and adaptability.', scriptCue: "Great! Let’s make it a little harder by adding..." }
  ],
  expectations: {
    characterMode: {
      maxExchanges: 5,
      reminders: [
        'Stay in character until the exit cue.',
        'No coaching during character mode.',
        'Exit with explicit praise and reflection.'
      ]
    }
  }
};
