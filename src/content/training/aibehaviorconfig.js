// -------------------------------------------------------------
// AIBehaviorConfig.js — SOCIAL CUE 2025 BEHAVIOR ENGINE (v2)
// -------------------------------------------------------------
// This engine produces:
// - Natural, friend-like intros (“Hey Kelsey! I’m Cue!”)
// - Grade-aware speech patterns (K-2 vs 9-12)
// - Warm, short, engaging social coaching
// - Dynamic scenario generation
// - Teaching + micro-tips + turn-taking
// - Phased conversation flow
// -------------------------------------------------------------

import { personaEngine } from "../../services/personaEngine.js";


// -------------------------------------------------------------
// 1. MICRO TEACHING BANKS — short, child-friendly tips per topic
// -------------------------------------------------------------
export const MICRO_TIPS = {
  "small-talk-basics": [
    "Try giving a small wave first.",
    "A tiny question keeps things going.",
    "Short and friendly always works.",
    "Notice something and mention it."
  ],
  "active-listening": [
    "Nodding shows you're listening.",
    "Try repeating one word they said.",
    "A tiny 'oh wow?' goes a long way.",
    "Ask a soft follow-up question."
  ],
  "confidence-building": [
    "You get braver every time you try.",
    "Your voice matters even if it's small.",
    "One brave step is all it takes.",
    "You can handle this, I know you can."
  ],
  "resolving-conflicts": [
    "Start calm. Tone changes everything.",
    "Saying the feeling helps a lot.",
    "Look for the middle ground.",
    "Ask, 'What would help right now?'"
  ]
};


// -------------------------------------------------------------
// 2. GRADE-BASED RESPONSE RULES
// -------------------------------------------------------------
export const GRADE_RULES = {
  "k-2": { maxWords: 8, speechRate: 0.86, friendly: true, slang: false },
  "3-5": { maxWords: 12, speechRate: 0.9, friendly: true, slang: "soft" },
  "6-8": { maxWords: 15, speechRate: 0.95, friendly: "peer", slang: "mild" },
  "9-12": { maxWords: 20, speechRate: 1.0, friendly: "peer", slang: "natural" }
};


// -------------------------------------------------------------
// 3. PRAISE AND FEEDBACK CLIPS
// -------------------------------------------------------------
export const FEEDBACK_SNIPS = {
  praise: ["Nice!", "Love that!", "Strong move!", "Good choice!", "Smooth!"],
  nudge: ["Try it softer.", "Maybe friendlier.", "Give it one more shot.", "Try that again gently."]
};


// -------------------------------------------------------------
// 4. INTRODUCTION FLOW — 3 turns, natural & friendly
// -------------------------------------------------------------
export function buildIntroFlow({ gradeLevel, topicName, learnerName, lastScenario }) {
  const namePrefix = learnerName ? `${learnerName}, ` : "";

  return {
    turn1: `Hey ${namePrefix}I'm Cue! Today we're practicing ${topicName}.`,

    turn2: `Before we get started — have you tried this before?`,

    turn3: `Awesome. Let's jump in and practice ${topicName} together!`
  };
}


// -------------------------------------------------------------
// 5. TEACHING TURN — provides tips + asks learner to try again
// -------------------------------------------------------------
export function buildTeachingTurn({ gradeLevel, topicId, learnerMessage }) {
  const persona = personaEngine.getPersona(gradeLevel);
  const gradeKey = personaEngine.getPersonaKey(gradeLevel);
  const rules = GRADE_RULES[gradeKey];
  const tips = MICRO_TIPS[topicId] || ["Try keeping it simple."];

  // Choose a micro-teaching tip
  const tip = tips[Math.floor(Math.random() * tips.length)];

  // Choose praise-like tone from persona
  const praise = persona.praise();

  // Construct response
  let text = `${praise} ${tip} Your turn!`;

  // Word limit per grade
  const words = text.split(/\s+/);
  if (words.length > rules.maxWords) {
    text = `${words.slice(0, rules.maxWords).join(" ")}…`;
  }

  return text.trim();
}


// -------------------------------------------------------------
// 6. PHASE STRUCTURE — where learner is in the flow
// -------------------------------------------------------------
export const PHASES = {
  INTRO_1: "intro-1",       // greeting
  INTRO_2: "intro-2",       // check-in
  INTRO_3: "intro-3",       // scenario intro ("imagine this…")
  INTRO_PREVIEW: "intro_preview", // skill preview before practice
  DEMONSTRATE: "demonstrate", // demonstration phase
  REPEAT: "repeat",         // guided repetition phase
  SCENARIO: "scenario",     // learner tries it
  TEACHING: "teaching",     // skill coaching
  VARIATION: "variation",   // new version of scenario
  COMPLETE: "complete"      // exit phase
};

export function getNextPhase(phase) {
  switch (phase) {
    case PHASES.INTRO_1: return PHASES.INTRO_2;
    case PHASES.INTRO_2: return PHASES.INTRO_3;
    case PHASES.INTRO_3: return PHASES.INTRO_PREVIEW;
    case PHASES.SCENARIO: return PHASES.TEACHING;
    case PHASES.TEACHING: return PHASES.VARIATION;
    default: return PHASES.COMPLETE;
  }
}


// -------------------------------------------------------------
// 7. EXPORT FINAL BEHAVIOR CONFIG
// -------------------------------------------------------------
export const AI_BEHAVIOR_CONFIG = {
  MICRO_TIPS,
  FEEDBACK_SNIPS,
  GRADE_RULES,
  buildIntroFlow,
  buildTeachingTurn,
  PHASES,
  getNextPhase
};

export default AI_BEHAVIOR_CONFIG;
