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

const MICRO_COACH_TIPS = [
  "Sometimes just saying “Hey, can I join?” is all it takes.",
  'If you’re nervous, try asking a question—people love talking about themselves.',
  'A quick smile and eye contact go a long way.',
  'You can always say, “Want to team up?” to break the ice.',
  'If you blank, try “What have you been up to?” and listen closely.',
  'Taking a breath before you speak can calm those butterflies.'
];

const BASE_INTRO_SEQUENCE = [
  "Hey there, I'm Cue! I'm really glad you're here.",
  "I love practicing with new friends—can I grab your name?",
  "Nice to meet you, {{name}}!",
  "This is our little zone to practice things like making friends, asking for help, or joining groups.",
  "Does any of that sound like something you’d wanna get better at?"
];

const INTRO_SEQUENCE_BY_GRADE = {
  'k-2': {
    greeting: "Hi! I'm Cue, and I'm really happy you're here.",
    introduction: "We get to practice saying hi, asking to play, and trying new social moves together.",
    safety: "This is a cozy practice space where trying is celebrated.",
    consent: "Want to try a quick round with me?",
    introScript: [
      "Hi, I'm Cue! I'm really happy you're here.",
      "What's your name? I like practicing with friends.",
      "Yay! Nice to meet you, {{name}}!",
      "We can practice things like saying hi or asking to play.",
      "Does that sound fun to you?"
    ],
    firstPrompt: "Want to try practicing with me?",
    scenarios: {
      'small-talk-basics': {
        intro: "Today we're practicing how to say hi and start a friendly chat.",
        afterResponse: "Respond with a cheerful follow-up question and invite them to keep talking."
      },
      'small-talk-hallway': {
        intro: "We’re practicing a quick hallway hello with a classmate.",
        afterResponse: "Encourage them to smile, wave, and say something friendly back."
      },
      'small-talk-lunch': {
        intro: "Let’s practice joining a lunch table conversation in a friendly way.",
        afterResponse: "Invite them to ask one more question or share something fun."
      },
      'small-talk-bus': {
        intro: "We’ll practice chatting with someone on the bus ride home.",
        afterResponse: "Suggest another casual question they could ask."
      },
      'active-listening': {
        intro: "We’re practicing how to listen and show you care.",
        afterResponse: "Have them reflect back what they heard and ask a gentle question."
      },
      'confidence-building': {
        intro: "We’re practicing being brave, speaking up, and cheering yourself on.",
        afterResponse: "Celebrate their bravery and encourage one more confident try."
      },
      'resolving-conflicts': {
        intro: "We’re practicing how to solve a disagreement with kind words.",
        afterResponse: "Coach them to suggest a calm, fair solution."
      }
    }
  },
  '3-5': {
    greeting: "Hey, I'm Cue! I'm so glad you showed up.",
    introduction:
      "We can practice things like joining a group, asking for help, making new friends, and dealing with tricky moments.",
    safety: "This is a chill practice space where we mess up together and try again.",
    consent: "Ready to give it a go with me?",
    introScript: [
      "Hey there, I'm Cue! I'm so glad you showed up.",
      "Can I know your name? I like cheering on my friends.",
      "Nice to meet you, {{name}}!",
      "We can practice stuff like joining groups, asking for help, or making friends.",
      "Does any of that sound like something you’d want to practice today?"
    ],
    firstPrompt: "Is there something you'd like to get better at?",
    scenarios: {
      'small-talk-basics': {
        intro: "We’re practicing how to start mini conversations with people around you.",
        afterResponse: "Encourage them to notice something cool about the person and comment on it."
      },
      'small-talk-hallway': {
        intro: "Let’s practice starting a quick hallway conversation with a classmate.",
        afterResponse: "Suggest a follow-up question that keeps the hallway chat going."
      },
      'small-talk-lunch': {
        intro: "Today we’re practicing how to join a lunch table conversation smoothly.",
        afterResponse: "Coach them to react to what they heard and keep the chat friendly."
      },
      'small-talk-bus': {
        intro: "We’ll practice keeping a bus ride conversation going in a natural way.",
        afterResponse: "Invite them to share one more detail or fun fact."
      },
      'active-listening': {
        intro:
          "We’re practicing active listening—really hearing someone and responding in a thoughtful way.",
        afterResponse:
          "Guide them to reflect back the main idea and ask a curious follow-up question."
      },
      'confidence-building': {
        intro: "We’re practicing speaking up, using a confident voice, and cheering yourself on.",
        afterResponse:
          "Remind them of a time they were brave and invite them to take one more bold step."
      },
      'resolving-conflicts': {
        intro: "We’re practicing how to stay calm and fair when there’s a disagreement.",
        afterResponse:
          "Encourage them to name everyone’s feelings and suggest a next step together."
      }
    }
  },
  '6-8': {
    greeting: "Hey! I'm Cue, your practice buddy.",
    introduction:
      "We can rehearse real-life social moves—stuff like joining group chats, staying confident, speaking up, or handling awkward moments.",
    safety: "This space is private and low-stakes—we can rewind and try again anytime.",
    consent: "Want to jump into a quick practice together?",
    introScript: BASE_INTRO_SEQUENCE,
    firstPrompt: "What sounds helpful to practice together right now?",
    scenarios: {
      'small-talk-basics': {
        intro: "We’re practicing how to kick off casual conversations without it feeling weird.",
        afterResponse:
          "Encourage them to respond with interest and add a question that keeps the vibe going."
      },
      'small-talk-hallway': {
        intro: "Let’s rehearse a hallway conversation—quick, friendly, and low pressure.",
        afterResponse:
          "Invite them to mention something relevant (class, clubs) and keep it natural."
      },
      'small-talk-lunch': {
        intro: "We’ll practice joining a lunch conversation in a way that feels smooth.",
        afterResponse:
          "Suggest they react to what someone said and add one personal detail."
      },
      'small-talk-bus': {
        intro: "We’re practicing keeping a bus ride chatter going without awkward silences.",
        afterResponse:
          "Coach them to notice something around them and use it as a follow-up."
      },
      'active-listening': {
        intro:
          "We’re working on active listening—proving you’re paying attention by reflecting back and asking something thoughtful.",
        afterResponse:
          "Encourage them to name the key point and add a question that digs deeper."
      },
      'confidence-building': {
        intro:
          "Let’s practice sharing ideas and stepping up boldly, even when your stomach flips.",
        afterResponse:
          "Remind them of their strengths, praise their bravery, and challenge them to go one step further."
      },
      'resolving-conflicts': {
        intro:
          "We’re rehearsing how to handle conflict with calm, honest language that keeps friends close.",
        afterResponse:
          "Coach them to acknowledge feelings, restate the problem, and suggest a next step."
      }
    }
  },
  '9-12': {
    greeting: "Hey, I'm Cue—thanks for hanging with me today.",
    introduction:
      "We can run through the real stuff: navigating group projects, setting boundaries, joining conversations, or smoothing things over when they get tense.",
    safety: "This is your practice zone—zero judgment, all wins, rewinds welcome.",
    consent: "Want to walk through a real scenario together?",
    introScript: [
      "Hey, I'm Cue—thanks for hanging out with me today.",
      "Mind if I grab your name? It's more fun practicing together.",
      "Good to meet you, {{name}}.",
      "We can run through real-world stuff like starting conversations, staying confident, or resolving awkward moments.",
      "What feels most helpful to practice right now?"
    ],
    firstPrompt: "Which social skill do you want to level up today?",
    scenarios: {
      'small-talk-basics': {
        intro: "We’re sharpening small-talk moves so you can start conversations without it feeling forced.",
        afterResponse:
          "Encourage them to reference a shared interest and escalate the convo with a thoughtful question."
      },
      'small-talk-hallway': {
        intro: "Let’s practice a hallway check-in—quick, genuine, and not awkward.",
        afterResponse:
          "Coach them to acknowledge the person’s vibe and ask something relevant about their day."
      },
      'small-talk-lunch': {
        intro: "We’ll rehearse how to drop into a lunch conversation with confidence.",
        afterResponse:
          "Invite them to react to the topic and add a personal take that keeps things flowing."
      },
      'small-talk-bus': {
        intro: "We’re practicing keeping a commute chat light, casual, and easy to exit.",
        afterResponse:
          "Suggest a supportive response and one more question before bowing out."
      },
      'active-listening': {
        intro:
          "We’re focusing on deeper listening—echoing back, validating, and engaging authentically.",
        afterResponse:
          "Encourage them to name what stood out and ask a question that shows real curiosity."
      },
      'confidence-building': {
        intro:
          "We’re practicing backing yourself up—owning your voice, your ideas, and your vibe.",
        afterResponse:
          "Highlight their strengths, recap their confident move, and challenge them to push a little further."
      },
      'resolving-conflicts': {
        intro:
          "We’re practicing conflict resolution—staying cool, naming what matters, and keeping friendships intact.",
        afterResponse:
          "Coach them to reflect feelings, suggest a compromise, and confirm everyone’s good."
      }
    }
  }
};

const SCENARIO_SCRIPT_LIBRARY = {};

const registerScenarioScript = (keys, script) => {
  keys.forEach((key) => {
    if (!key) return;
    SCENARIO_SCRIPT_LIBRARY[key.toLowerCase()] = script;
  });
};


const FALLBACK_SCENARIO_SCRIPT = {
  intro:
    "Let me paint the scene. I’ll describe what’s happening and invite you to try one friendly line. Keep it short and natural.",
  afterResponse:
    "Awesome effort. Build on what they shared, offer one clear suggestion, and invite them to keep practicing."
};

registerScenarioScript(
  [
    'small-talk-basics',
    'small-talk-hallway',
    'small-talk-lunch',
    'small-talk-bus'
  ],
  {
    intro:
      "Let’s practice jumping into a light conversation. Start with a quick friendly greeting, then add one curious question.",
    afterResponse:
      "Keep the vibe easy. React to what they said and offer a simple follow-up question to keep things going."
  }
);

registerScenarioScript(
  [
    'active-listening',
    'listening-project',
    'listening-story',
    'listening-family'
  ],
  {
    intro:
      "We’re working on active listening. Show you’re tuned in by reflecting what they said and adding a short question.",
    afterResponse:
      "Respond with a supportive nod or phrase, then encourage them to share a little more."
  }
);

registerScenarioScript(
  [
    'confidence-building',
    'confidence-class',
    'confidence-team',
    'confidence-new'
  ],
  {
    intro:
      "Let’s boost your confidence. Start with one encouraging thought, then take a brave step like sharing an idea or greeting someone.",
    afterResponse:
      "Praise their effort, remind them of the brave move they made, and invite them to try a slightly bolder version."
  }
);

registerScenarioScript(
  [
    'resolving-conflicts',
    'conflict-group',
    'conflict-game',
    'conflict-text'
  ],
  {
    intro:
      "We’re going to solve a sticky moment calmly. Start by naming the issue and asking how everyone feels.",
    afterResponse:
      "Acknowledge their point, keep your tone calm, and suggest a small next step everyone can agree on."
  }
);

registerScenarioScript(
  [
    'entering-group-conversations'
  ],
  {
    intro: "We’re practicing how to confidently join a group conversation that’s already in progress.",
    afterResponse: "Encourage them to greet the group, mention one thing they noticed, and ask a friendly follow-up question."
  }
);

export const getIntroductionSequence = (gradeInput = '6', scenarioKey = '') => {
  console.log('🧩 [getIntroductionSequence] scenarioKey:', scenarioKey);
  console.log('🎓 Grade Level:', gradeInput);
  const { gradeRange, numericGrade } = normalizeGradeInput(gradeInput);
  const gradeBandKey = (gradeRange || '').toLowerCase();
  const script =
    INTRO_SEQUENCE_BY_GRADE[gradeBandKey] ||
    INTRO_SEQUENCE_BY_GRADE['6-8'] ||
    BASE_INTRO_SEQUENCE;

  const introScript = Array.isArray(script?.introScript)
    ? script.introScript
    : Array.isArray(script)
    ? script
    : BASE_INTRO_SEQUENCE;

  const normalizedScenarioKey = String(scenarioKey || '').trim().toLowerCase();
  const scenarioMap =
    script && script.scenarios && typeof script.scenarios === 'object'
      ? Object.entries(script.scenarios).reduce((acc, [key, value]) => {
          if (!key || !value) return acc;
          acc[String(key).toLowerCase()] = value;
          return acc;
        }, {})
      : {};

  const gradeScenarioEntry = normalizedScenarioKey && scenarioMap[normalizedScenarioKey]
    ? scenarioMap[normalizedScenarioKey]
    : null;
  const libraryScenarioEntry = normalizedScenarioKey && SCENARIO_SCRIPT_LIBRARY[normalizedScenarioKey]
    ? SCENARIO_SCRIPT_LIBRARY[normalizedScenarioKey]
    : null;

  console.debug('[IntroSequence] request', {
    gradeInput,
    gradeRange,
    scenarioKey,
    normalizedScenarioKey,
    foundInGradeConfig: !!gradeScenarioEntry,
    foundInLibrary: !!libraryScenarioEntry,
    availableScenarioKeys: Object.keys(scenarioMap || {})
  });

  if (!gradeScenarioEntry && !libraryScenarioEntry && normalizedScenarioKey) {
    console.warn('[IntroSequence] No scenario match for key:', normalizedScenarioKey);
  }

  const greeting = (script?.greeting || '').trim();
  const introduction = (script?.introduction || '').trim();
  const safety = (script?.safety || '').trim();
  const consent = (script?.consent || '').trim();

  const greetingIntro = `${greeting} ${introduction}`
    .replace(/\s+/g, ' ')
    .trim();

  const scenarioIntro = gradeScenarioEntry?.intro?.trim()
    ? gradeScenarioEntry.intro.trim()
    : 'Today we’re practicing a common social situation.';

  const safetyAndConsent = `${safety} ${consent}`
    .replace(/\s+/g, ' ')
    .trim();

  const firstPromptByBand = {
    'k-2': "Want to try practicing with me?",
    '3-5': "Is there something you'd like to get better at?",
    '6-8': "What sounds helpful to practice together right now?",
    '9-12': "Which social skill do you want to level up today?"
  };

  const firstPrompt =
    firstPromptByBand[gradeBandKey] ||
    'What sounds helpful to practice together right now?';

  return {
    introScript,
    greetingIntro,
    scenarioIntro,
    safetyAndConsent,
    firstPrompt,
    gradeRange,
    scenarios: script?.scenarios || {},
    scenarioScripts: SCENARIO_SCRIPT_LIBRARY,
    fallbackScenario: FALLBACK_SCENARIO_SCRIPT,
    microCoachTips: MICRO_COACH_TIPS,
    numericGrade
  };
};
