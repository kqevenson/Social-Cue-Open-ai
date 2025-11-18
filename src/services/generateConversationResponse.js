// generateConversationResponse.js
// SOCIAL CUE — Unified Voice Conversation Engine (2025 Edition)

import { PHASES } from "../content/training/aibehaviorconfig.js";
import { personaEngine } from "./personaEngine.js";
import introEngine from "./introEngine.js";
import { generateDynamicScenario } from "./generateDynamicScenario.js";
import { teachingEngine } from "./teachingEngine.js";

/**
 * conversationHistory: [{ role: 'user'|'assistant', content: string }]
 * gradeLevel: "K-2" | "3-5" | "6-8" | "9-12"
 * learnerName: string
 * topicId: string
 * currentPhase: PHASES.*
 * scenario: existing or adaptive scenario object
 */

export async function generateConversationResponse({
  conversationHistory = [],
  gradeLevel = "6-8",
  learnerName = "",
  topicId = "",
  currentPhase = PHASES.INTRO_1,
  scenario = null
}) {
  try {
    const userTurns = conversationHistory.filter(m => m.role === "user");
    const lastUserMessage = userTurns[userTurns.length - 1]?.content || "";
    const persona = personaEngine.getPersona(gradeLevel);

    // -----------------------------------------------------
    // 🔵 PHASE 1 — INTRO TURN 1 (Greeting)
    // -----------------------------------------------------
    if (currentPhase === PHASES.INTRO_1) {
      const res = introEngine.buildTurn1({
        gradeLevel,
        topicId
      });

      return {
        aiResponse: res.aiResponse,
        nextPhase: res.nextPhase,
        shouldContinue: true
      };
    }

    // -----------------------------------------------------
    // 🔵 PHASE 2 — INTRO TURN 2 (Check-in)
    // -----------------------------------------------------
    if (currentPhase === PHASES.INTRO_2) {
      // If learner didn't answer → gentle reprompt (Option B)
      if (!lastUserMessage?.trim()) {
        const retry = introEngine.buildSilentRetry();
        return {
          aiResponse: retry.aiResponse,
          nextPhase: retry.nextPhase,
          shouldContinue: true
        };
      }

      const res = introEngine.buildTurn2();

      return {
        aiResponse: res.aiResponse,
        nextPhase: res.nextPhase,
        shouldContinue: true
      };
    }

    // -----------------------------------------------------
    // 🔵 PHASE 3 — SCENARIO INTRO ("Imagine this...")
    // -----------------------------------------------------
    if (currentPhase === PHASES.SCENARIO) {
      const res = introEngine.buildScenarioIntro({
        gradeLevel,
        topicId,
        previousScenario: scenario?.id || scenario?.description || null,
        difficulty: scenario?.difficulty || "easy"
      });

      return {
        aiResponse: res.aiResponse,
        nextPhase: res.nextPhase,
        dynamicScenario: res.dynamicScenario,
        shouldContinue: true
      };
    }

    // -----------------------------------------------------
    // 🔵 PHASE 4 — TEACHING TURN
    // (This is where REAL teaching happens)
    // -----------------------------------------------------
    if (currentPhase === PHASES.TEACHING) {
      const teaching = teachingEngine({
        userMessage: lastUserMessage,
        topicId,
        gradeLevel,
        learnerName,
        dynamicScenario: scenario
      });

      return {
        aiResponse: teaching.ttsOutput,      // Warm, coach-like feedback
        nextPhase: PHASES.VARIATION,
        shouldContinue: true
      };
    }

    // -----------------------------------------------------
    // 🔵 PHASE 5 — VARIATION TURN
    // (Slight twist to generalize skill)
    // -----------------------------------------------------
    if (currentPhase === PHASES.VARIATION) {
      const dynamic = generateDynamicScenario({
        topicId,
        gradeLevel,
        learnerName,
        previousScenario: scenario?.id || scenario?.description,
        difficulty: scenario?.difficulty || "easy"
      });

      const sceneObj = { description: dynamic.spokenScene };
      const aiResponse =
        persona.variationCue(sceneObj) ||
        `Let’s try something slightly different — ${sceneObj.description}. What would you say now?`;

      return {
        aiResponse,
        nextPhase: PHASES.COMPLETE,
        dynamicScenario: dynamic,
        shouldContinue: true
      };
    }

    // -----------------------------------------------------
    // 🔵 PHASE 6 — SESSION COMPLETE
    // -----------------------------------------------------
    return {
      aiResponse: "Great session! Want to try another topic?",
      nextPhase: PHASES.COMPLETE,
      shouldContinue: false
    };

  } catch (err) {
    console.error("generateConversationResponse ERROR:", err);

    return {
      aiResponse: "Oops — can you try that again?",
      nextPhase: currentPhase,
      shouldContinue: true
    };
  }
}

export default {
  generateConversationResponse
};
