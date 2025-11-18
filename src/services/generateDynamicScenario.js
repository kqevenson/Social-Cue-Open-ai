// generateDynamicScenario.js
// Phase 5 — Dynamic Scenario Generator
// Creates unique, grade-appropriate, topic-aligned scenarios every session.

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const REAL_LIFE_LOCATIONS = [
  "the grocery store",
  "the park",
  "your neighborhood",
  "a family gathering",
  "the community center",
  "a birthday party",
  "the playground",
  "a weekend sports game",
  "the library",
  "a friend's house"
];

const SCHOOL_LOCATIONS = [
  "the hallway",
  "the cafeteria",
  "your classroom",
  "the bus ride home",
  "PE class",
  "the lunch line",
  "recess",
  "your group project meeting"
];

/* ---------------------------------------------------------
   SCENARIO BANKS BY TOPIC
   Each topic has 8–12 real variations
---------------------------------------------------------*/

const TOPIC_SCENARIOS = {
  "small-talk-basics": [
    (name) => `${name}, you're walking into ${rand(SCHOOL_LOCATIONS)} and you see someone you kinda know. They look your way.`,
    (name) => `You and another kid arrive at the same time and stand next to each other. There's a little silence.`,
    () => `You're waiting in line and someone beside you yawns and laughs.`,
    () => `You sit near someone new. They're looking at their notebook.`
  ],

  "active-listening": [
    () => `A friend is telling you something important about their day.`,
    () => `Someone starts telling a story and looks at you like they want you to pay attention.`,
    () => `A classmate explains something they're excited about.`,
    () => `A family member starts venting about their long day.`
  ],

  "confidence-building": [
    () => `You're about to share an idea in a group, but your stomach flips.`,
    () => `You see someone new and want to say hi.`,
    () => `Coach asks if anyone wants to help demonstrate something.`,
    () => `You want to give your friend a compliment but feel nervous.`
  ],

  "resolving-conflicts": [
    () => `Someone thinks you ignored them earlier, but you didn't mean to.`,
    () => `A friend looks upset about something you said.`,
    () => `Two people next to you are arguing and pull you into it.`,
    () => `Someone misunderstood a text you sent.`
  ],

  "joining-groups": [
    () => `You walk up to a group already talking about something funny.`,
    () => `There's a circle of kids playing and you want to join.`,
    () => `A group at lunch is chatting about a show you know.`,
    () => `Two people are starting a project and you want to be part of it.`
  ],

  "real-life": [
    () => `You bump into someone at ${rand(REAL_LIFE_LOCATIONS)} and both laugh a little.`,
    () => `A neighbor walks by while you're outside.`,
    () => `Someone your age sits near you at the park.`,
    () => `A cousin your age sits next to you at a family event.`
  ]
};

/* ---------------------------------------------------------
   GRADE-BASED TONE ADJUSTMENTS
---------------------------------------------------------*/

const GRADE_TONE = {
  "k-2": {
    simplify(scene) {
      return `Imagine this: ${scene} What would you say first? Keep it short and friendly!`;
    }
  },

  "3-5": {
    simplify(scene) {
      return `Picture this: ${scene} What would you say or do to keep it friendly?`;
    }
  },

  "6-8": {
    simplify(scene) {
      return `Alright, imagine this for a sec: ${scene} How would you start the conversation? Keep it natural.`;
    }
  },

  "9-12": {
    simplify(scene) {
      return `Okay — real moment: ${scene} What's your first move?`;
    }
  }
};

/* ---------------------------------------------------------
   MAIN GENERATOR
---------------------------------------------------------*/

export function generateDynamicScenario({ topicId, gradeLevel, learnerName, previousScenario, difficulty = "easy" }) {
  const name = learnerName || "your friend";

  const gradeNum = parseInt(gradeLevel, 10);
  let gradeKey = "6-8";
  if (gradeNum <= 2) gradeKey = "k-2";
  else if (gradeNum <= 5) gradeKey = "3-5";
  else if (gradeNum <= 8) gradeKey = "6-8";
  else gradeKey = "9-12";

  const topicKey = topicId || "small-talk-basics";
  const bank = TOPIC_SCENARIOS[topicKey] || TOPIC_SCENARIOS["small-talk-basics"];

  let rawScenario;
  let attempts = 0;

  // prevent repeating last scenario
  do {
    rawScenario = rand(bank)(name);
    attempts++;
  } while (rawScenario === previousScenario && attempts < 5);

  const finalScene = GRADE_TONE[gradeKey].simplify(rawScenario);

  return {
    id: `${topicKey}-${Date.now()}`,
    topicId,
    gradeKey,
    difficulty,
    rawScene: rawScenario,
    description: rawScenario,
    spokenScene: finalScene
  };
}

