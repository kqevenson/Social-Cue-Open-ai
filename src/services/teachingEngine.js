// teachingEngine.js
// Phase 6 — Dynamic Teaching Engine for Social Cue

import { conversationFlow } from "../content/training/conversation-flow";

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const PRAISE_BANK = {
  "k-2": ["Great try!", "Nice job!", "You did it!", "Good thinking!"],
  "3-5": ["Nice move!", "Great choice!", "Love that!", "Good thinking!"],
  "6-8": ["Solid start!", "Nice angle!", "I like that!", "Good move!"],
  "9-12": ["Good approach.", "Nice read.", "Smart move.", "Strong response."]
};

const TIP_BANK = {
  "small-talk-basics": [
    "Try mentioning something around you.",
    "Asking a simple question keeps it going.",
    "A quick smile helps a lot.",
    "Try adding one small personal detail."
  ],
  "active-listening": [
    "Repeat back the most important part.",
    "A follow-up question shows interest.",
    "Nodding helps people feel heard.",
    "Try saying “I get that.”"
  ],
  "confidence-building": [
    "Standing tall helps your voice sound confident.",
    "Start with one brave sentence.",
    "Talk slowly — it makes you sound sure.",
    "A deep breath helps everything."
  ],
  "resolving-conflicts": [
    "Try naming the feeling you notice.",
    "A calm voice is your superpower.",
    "Ask what they need from you.",
    "Suggest a small next step."
  ],
  "joining-groups": [
    "Start with a wave or smile.",
    "Mention the topic they're discussing.",
    "Ask if you can join in.",
    "Stand near the group first."
  ],
  "real-life": [
    "Start with something friendly.",
    "Point out something you both notice.",
    "A small compliment can open things up.",
    "Ask a quick, easy question."
  ]
};

const FOLLOW_UP_BANK = {
  "k-2": ["What else could you say?", "Want to try again?", "Your turn!"],
  "3-5": ["What would you add next?", "How would you follow up?", "Your turn!"],
  "6-8": ["What's a natural follow-up?", "How would you keep it going?", "Your turn!"],
  "9-12": ["What's your next move?", "How would you reply now?", "Your turn!"]
};

function getGradeKey(gradeLevel) {
  const grade = parseInt(gradeLevel, 10);
  if (grade <= 2) return "k-2";
  if (grade <= 5) return "3-5";
  if (grade <= 8) return "6-8";
  return "9-12";
}

export function determineSkillQuality(userMessage) {
  if (!userMessage) return "low";

  const msg = userMessage.toLowerCase();

  if (msg.includes("hi") || msg.includes("hey") || msg.includes("what's up"))
    return "good";

  if (msg.includes("?"))
    return "very-good";

  if (msg.length < 4)
    return "low";

  return "medium";
}

export function teachingEngine({
  userMessage,
  topicId,
  gradeLevel,
  learnerName,
  dynamicScenario
}) {
  const grade = getGradeKey(gradeLevel);

  const praise = random(PRAISE_BANK[grade]);
  const skillQuality = determineSkillQuality(userMessage);

  const teachingPoint = (() => {
    if (skillQuality === "low")
      return "Try adding one more friendly word.";
    if (skillQuality === "medium")
      return random(TIP_BANK[topicId] || TIP_BANK["real-life"]);
    if (skillQuality === "good")
      return random(TIP_BANK[topicId] || TIP_BANK["real-life"]);
    if (skillQuality === "very-good")
      return "Nice! That keeps the conversation flowing.";
  })();

  const followUp = random(FOLLOW_UP_BANK[grade]);
  const turnSignal = random(conversationFlow.stopTalk.talk.turnSignals);

  const ttsOutput = `${praise} ${teachingPoint} ${followUp} ${turnSignal}`;

  return {
    praise,
    teachingPoint,
    followUp,
    turnSignal,
    ttsOutput,
    skillQuality
  };
}

