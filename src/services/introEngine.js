// introEngine.js — Social Cue Unified Introduction Engine (2025 Edition)

import { personaEngine } from "./personaEngine.js";
import { generateDynamicScenario } from "./generateDynamicScenario.js";
import { PHASES } from "../content/training/aibehaviorconfig.js";
import { topics as voicePracticeTopics } from "../data/voicePracticeScenarios.js";

const introGreetings = [
  "Hey! I'm Cue — excited to practice with you.",
  "Hi! I'm Cue. Ready to get started?",
  "Hello! I'm Cue — let's jump in.",
  "Hey there! I'm Cue. Let's practice together.",
  "Hi! I'm Cue — today will be fun."
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Tracks last scenario to avoid intro repetition
let lastScenarioRef = { current: null };

export const introEngine = {
  /**
   * Creates turn 1 intro (greeting)
   */
  buildTurn1({ gradeLevel, topicId }) {
    return {
      aiResponse: pick(introGreetings),
      nextPhase: "intro-2"
    };
  },

  /**
   * Creates turn 2 intro (check-in)
   */
  buildTurn2() {
    return {
      aiResponse: "Before we begin — how are you feeling today?",
      nextPhase: "intro-3"
    };
  },

  /**
   * Used when a learner *does not respond* during the check-in phase.
   * Option B: gently prompt once, then continue.
   */
  buildSilentRetry() {
    return {
      aiResponse: "It's okay if you need a moment — how are you feeling?",
      nextPhase: "intro-3"
    };
  },

  /**
   * Creates the scenario introduction turn
   */
  buildScenarioIntro({ gradeLevel, topicId, previousScenario, difficulty }) {
    const dynamic = generateDynamicScenario({
      topicId,
      gradeLevel,
      learnerName: "",
      previousScenario,
      difficulty
    });

    return {
      aiResponse: `Great! Let's try this. Imagine: ${dynamic.spokenScene}. What would you say first?`,
      nextPhase: "scenario",
      dynamicScenario: dynamic
    };
  },

  /**
   * Resets previous scenario tracking if needed
   */
  reset() {
    lastScenarioRef.current = null;
  }
};

export default introEngine;
