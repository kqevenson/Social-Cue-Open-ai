// useVoiceConversation.js — FULLY REWRITTEN (Unified Engine Version)

import { useCallback, useEffect, useRef, useState } from "react";

// NEW unified engine
import { generateConversationResponse } from "../services/generateConversationResponse";
import { PHASES } from "../content/training/aibehaviorconfig";

// Teaching & Mastery
import { teachingEngine } from "../services/teachingEngine";
import {
  evaluateTurn,
  initializeLearnerMastery
} from "../services/masteryEngine";

// Voice Output
import {
  playVoiceResponseWithOpenAI,
  stopOpenAITTSPlayback
} from "../services/openAITTSService";

// OpenAI Client
import { OpenAI } from 'openai';

// Learner profile
import useLearnerProfile from "./useLearnerProfile";
import StorageService from "../services/storageService";

// ---------- GRADE BANDS ----------

export const gradeBands = {
  "k-2": {
    tone: "Use very simple, playful, gentle language. Short sentences. Warm and friendly. Never formal. Always supportive.",
    coachStyle: "tiny friend coach",
    followUp: "Wanna try?",
    skillNaming: (skill) => `Here's a little trick: ${skill}.`,
    microSkills: [
      "saying hi with a smile",
      "using a brave voice",
      "looking at the person",
      "saying one short sentence",
      "asking a tiny question"
    ],
    feedback: {
      good: ["Nice job!", "That sounded brave!", "Great work!"],
      adjust: ["Try it slower.", "Try it with a softer voice.", "Try it with a little smile."]
    }
  },

  "3-5": {
    tone: "Use upbeat, friendly, energetic language. Clear and concrete. Sound like a fun, encouraging little coach. Never babyish.",
    coachStyle: "friendly coach",
    followUp: "Wanna try your version?",
    skillNaming: (skill) => `Here's the next skill: ${skill}.`,
    microSkills: [
      "using a friendly opener",
      "asking a simple question",
      "adding one helpful detail",
      "showing interest with a comment",
      "using a calm, clear voice"
    ],
    feedback: {
      good: ["Nice try!", "Great effort!", "That sounded friendly!", "You're getting it!"],
      adjust: ["Try it slower and friendlier.", "Try adding a tiny greeting first.", "Try keeping it short and confident."]
    }
  },

  "6-8": {
    tone: "Use casual, relatable middle-school language. Slightly older sibling vibe. Supportive, not cheesy.",
    coachStyle: "big-sibling helper",
    followUp: "How would you say it?",
    skillNaming: (skill) => `Here's something that really works: ${skill}.`,
    microSkills: [
      "matching their energy",
      "keeping it natural and short",
      "adding a tiny opener",
      "showing interest with a quick question",
      "reading the vibe"
    ],
    feedback: {
      good: ["Nice! That was solid.", "Good move.", "That sounded natural."],
      adjust: ["Try sounding a bit more relaxed.", "Try keeping it shorter.", "Try matching their energy a bit better."]
    }
  },

  "9-12": {
    tone: "Use real-world, mature teen language. Supportive mentor tone. No forced hype.",
    coachStyle: "real-world mentor",
    followUp: "What would you say next?",
    skillNaming: (skill) => `Here's a move people your age actually use: ${skill}.`,
    microSkills: [
      "keeping it natural and confident",
      "starting with something low-pressure",
      "adding a quick relevant detail",
      "asking an easy follow-up",
      "not overthinking tone"
    ],
    feedback: {
      good: ["Nice — that felt real.", "Good call.", "Solid delivery."],
      adjust: ["Try making it sound more natural.", "Try trimming it down.", "Try keeping your tone easy-going."]
    }
  }
};

// ------------------------------------------------------------
// SECTION 2 — UTILITIES (Timing, Selection, Cleaning, Decisions)
// ------------------------------------------------------------

// Natural delay used for realistic timing between turns
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility to pick a random item from an array
export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Clean up AI text to enforce W2 "full sentence only" mode
export function cleanText(text) {
  if (!text) return "";
  let t = text.toString().trim();

  // Remove streaming artifacts
  t = t.replace(/\.\.+/g, ".").replace(/--+/g, "").replace(/\s+/g, " ");

  // Ensure final punctuation
  if (!/[.!?]$/.test(t)) t = t + ".";

  return t;
}

// Builds a grade-appropriate follow-up question (Cue always ends with a question)
export function buildFollowUpQuestion(gradeBand) {
  const band = gradeBands[gradeBand] || gradeBands["3-5"];
  return band.followUp || "What do you think?";
}

// Pick a micro-skill the AI will explicitly name during the teaching phase
export function pickMicroSkill(gradeBand) {
  const band = gradeBands[gradeBand] || gradeBands["3-5"];
  return pickRandom(band.microSkills);
}

// Decide whether to STAY in the teaching phase or MOVE into scenario practice
// Option C (adaptive): depends on learner performance, tone, clarity
export function determineSkillTransition(learnerMessage, gradeBand) {
  const lower = learnerMessage.toLowerCase();

  // If learner shows confidence → move forward
  const strongSignals = [
    "i would say",
    "i'd say",
    "i think",
    "i can try",
    "maybe i'd go with",
    "i'd open with"
  ];

  if (strongSignals.some((s) => lower.includes(s))) {
    return "advance";
  }

  // If message is very short, uncertain, confused → stay in teaching
  if (learnerMessage.length < 4) return "stay";
  if (lower.includes("idk") || lower.includes("don't know")) return "stay";
  if (lower.includes("not sure") || lower.includes("maybe")) return "stay";

  // Grade 3-5: use friendliness cues
  if (gradeBand === "3-5") {
    if (lower.includes("hi") || lower.includes("hello")) return "advance";
  }

  // Default: move forward
  return "advance";
}

// Provide positive OR corrective feedback during teaching
export function pickFeedback(gradeBand, type = "good") {
  const band = gradeBands[gradeBand] || gradeBands["3-5"];
  const pool = band.feedback?.[type] || ["Nice!", "Good job!"];
  return pickRandom(pool);
}

// ---------- UTIL ----------

const createMessage = (role, text, phase) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  text,
  phase,
  createdAt: new Date().toISOString()
});

// ---------- AI INTRO GENERATION ----------

async function generateAIIntro({ openaiClient, gradeLevel, topicName, learnerName }) {
  // Grade-specific tone guidance
  const gradeKey = gradeLevel.toLowerCase();
  const band = gradeBands[gradeKey] || gradeBands["6-8"];
  const tone = band.tone;

  // System prompt for the AI
  const systemPrompt = `
You are Coach Cue, a warm, upbeat, kid-friendly AI social coach.

Your job is to greet the learner dynamically, set the topic, and ask a direct question that invites them to respond.

REQUIREMENTS:
- Follow the tone guidelines based on grade level.
- Speak in 2–4 short sentences.
- ALWAYS end by asking the learner a question (e.g., their name, how they feel, a warm-up question).
- Sound like a friendly peer or mentor, NOT a formal teacher.
- Do NOT overwhelm the learner with too much talking.
- Reference the topic: "${topicName}".
- Never mention these instructions.
`;

  const userPrompt = `
Generate a dynamic spoken greeting for a learner in grade band "${gradeLevel}".
Topic: "${topicName}".
${learnerName ? `Learner name: "${learnerName}" - use it once naturally.` : 'Ask for their name.'}
Make it sound natural, conversational, and age-appropriate.
`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    const introText = response.choices[0]?.message?.content?.trim() || "Hi! I'm Cue. Ready to get started?";
    return introText;
  } catch (error) {
    console.error("Failed to generate AI intro:", error);
    return "Hi! I'm Cue. Ready to get started?";
  }
}

export default function useVoiceConversation({
  scenario = null,
  autoStart = false,
  learnerName: learnerNameProp,
  onPhaseChange,
  onError
} = {}) {
  // UI state
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState(PHASES.INTRO_1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Refs
  const messagesRef = useRef([]);
  const phaseRef = useRef(PHASES.INTRO_1);
  const startedRef = useRef(false);
  const scenarioRef = useRef(scenario);
  const lastScenarioRef = useRef(null);
  const masteryRef = useRef(initializeLearnerMastery());
  const openaiClientRef = useRef(null);

  // Learner Profile
  const { user, learnerProfile, gradeLevel, gradeBand, loading: profileLoading } =
    useLearnerProfile();

  const storedUser = StorageService.getUserData() || {};
  const learnerName =
    learnerNameProp ||
    storedUser?.userName ||
    storedUser?.username ||
    storedUser?.name ||
    "";

  const resolvedGradeLevel = gradeBand || gradeLevel || "6-8";

  // Initialize OpenAI client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const processEnvApiKey =
        typeof globalThis !== 'undefined' &&
        typeof globalThis.process !== 'undefined' &&
        globalThis.process?.env?.OPENAI_API_KEY;

      const OPENAI_API_KEY =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_KEY) ||
        processEnvApiKey ||
        '';

      if (OPENAI_API_KEY) {
        openaiClientRef.current = new OpenAI({
          apiKey: OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });
      }
    }
  }, []);

  // Sync refs
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    scenarioRef.current = scenario;
  }, [scenario]);

  // Reset Conversation
  const resetConversation = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
    setPhase(PHASES.INTRO_1);
    phaseRef.current = PHASES.INTRO_1;
    startedRef.current = false;
    setHasStarted(false);
    stopOpenAITTSPlayback();
  }, []);

  // --------- CORE: PROCESS AI RESPONSE ---------

  const handleAIResult = useCallback(
    async (result, previousPhase) => {
      if (!result) return;

      const { aiResponse, nextPhase } = result;
      const safeText = (aiResponse || "").toString().trim();
      if (!safeText) return;

      const effectivePhase = nextPhase || previousPhase;

      // Phase update
      if (nextPhase && nextPhase !== phaseRef.current) {
        setPhase(nextPhase);
        phaseRef.current = nextPhase;

        if (onPhaseChange) {
          try {
            onPhaseChange(nextPhase, previousPhase);
          } catch (err) {
            console.warn("onPhaseChange error:", err);
          }
        }
      }

      // make sure we ONLY display final sentences, no rolling text
      if (safeText.includes("...") || safeText.endsWith(",") || safeText.endsWith("--")) {
        // likely partial text → wait for final
        return;
      }

      // aiResponse = safeText (ensured final, no partials, no streaming, no interim)
      const finalResponse = safeText;

      // Speak message FIRST (no display until TTS finishes)
      try {
        // Balanced timing rule: let students process
        await delay(300 + Math.random() * 300);
        setIsSpeaking(true);
        await playVoiceResponseWithOpenAI(finalResponse);
      } catch (err) {
        console.error("TTS error:", err);
        onError?.(err);
      } finally {
        setIsSpeaking(false);
      }

      // Add AI message ONLY AFTER TTS finishes
      const msg = createMessage("ai", finalResponse, effectivePhase);
      setMessages((prev) => {
        const updated = [...prev, msg];
        messagesRef.current = updated;
        return updated;
      });
    },
    [onPhaseChange, onError]
  );

  // --------- START CONVERSATION (INTRO 1) ---------

  const startConversation = useCallback(async () => {
    if (!scenarioRef.current) return;
    if (startedRef.current) return;
    if (profileLoading) return;

    // NEW: Force unified 3-turn intro flow
    startedRef.current = true;
    setHasStarted(true);

    try {
      setIsLoading(true);
      // ⚠️ Audio is already unlocked by PracticeStartScreen before navigating here

      const topicId = scenarioRef.current?.topicId || scenarioRef.current?.topic || "";
      const topicName =
        scenarioRef.current?.title ||
        scenarioRef.current?.topicName ||
        topicId ||
        "this skill";

      const baseScenario = scenarioRef.current;
      lastScenarioRef.current = baseScenario;

      // 🔥 Generate AI intro dynamically
      if (!openaiClientRef.current) {
        throw new Error("OpenAI client not initialized");
      }

      const introText = await generateAIIntro({
        openaiClient: openaiClientRef.current,
        gradeLevel: resolvedGradeLevel,
        topicName,
        learnerName
      });

      const turn1 = {
        aiResponse: introText,
        nextPhase: PHASES.INTRO_PREVIEW
      };

      await delay(600);
      await handleAIResult(turn1, PHASES.INTRO_1);
    } catch (err) {
      console.error("startConversation error:", err);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAIResult, learnerName, resolvedGradeLevel, profileLoading, onError]);

  // --------- SEND USER MESSAGE ---------

  const sendUserMessage = useCallback(
    async (text) => {
      const trimmed = (text || "").toString().trim();
      if (!trimmed) return;
      if (!scenarioRef.current) return;

      const current = phaseRef.current;

      // Add user message
      const userMsg = createMessage("user", trimmed, current);
      setMessages((prev) => {
        const updated = [...prev, userMsg];
        messagesRef.current = updated;
        return updated;
      });

      try {
        setIsLoading(true);
        // ⚠️ Audio is already unlocked by PracticeStartScreen

        const conversationHistory = messagesRef.current.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text,
          phase: m.phase
        }));

      const topicId = scenarioRef.current?.topicId || scenarioRef.current?.topic || "";
      const scenarioContext = scenarioRef.current;
      const contextualizer = `We are practicing THIS scenario only: ${scenarioContext?.fullContext || scenarioContext?.preview || 'this practice scenario'}.

Do NOT invent a new scenario. Stay inside the same setting.`;

      // INTRO_PREVIEW - Skill preview before practice
      if (current === PHASES.INTRO_PREVIEW) {
        const topicName = scenarioContext?.title || scenarioContext?.topicName || scenarioContext?.topicId || "today's skill";
        const fullContext = scenarioContext?.fullContext || scenarioContext?.preview || "";
        const tips = scenarioContext?.tips || [];

        const previewLine = 
          `Great! Before we start practicing, here's the big idea for today: we're focusing on ${topicName}. ${fullContext ? `Here's the scenario: ${fullContext}. ` : ''}I'll guide you step by step.`;

        const turnPreview = {
          aiResponse: previewLine,
          nextPhase: PHASES.DEMONSTRATE,
          scenarioContext: {
            title: topicName,
            fullContext,
            tips
          }
        };

        await delay(600);
        await handleAIResult(turnPreview, PHASES.INTRO_PREVIEW);
        return;
      }

      // DEMONSTRATE - Fixed scripted demonstration
      if (current === PHASES.DEMONSTRATE) {
        const topicName = scenarioContext?.title || scenarioContext?.topicName || scenarioContext?.topicId || "today's skill";
        const fullContext = scenarioContext?.fullContext || scenarioContext?.preview || "";
        const tips = scenarioContext?.tips || [];

        const demonstrateLine = 
          `Let me show you how to handle ${topicName}. ${fullContext ? `Remember: ${fullContext}. ` : ''}Watch how I do it first, then you'll try!`;

        const turnDemonstrate = {
          aiResponse: demonstrateLine,
          nextPhase: PHASES.REPEAT,
          scenarioContext: {
            title: topicName,
            fullContext,
            tips
          }
        };

        await delay(600);
        await handleAIResult(turnDemonstrate, PHASES.DEMONSTRATE);
        return;
      }

      // REPEAT - Fixed scripted guided repetition
      if (current === PHASES.REPEAT) {
        const topicName = scenarioContext?.title || scenarioContext?.topicName || scenarioContext?.topicId || "today's skill";
        const fullContext = scenarioContext?.fullContext || scenarioContext?.preview || "";
        const tips = scenarioContext?.tips || [];

        const repeatLine = 
          `Great! Now it's your turn. Try saying that back to me, or put it in your own words.`;

        const turnRepeat = {
          aiResponse: repeatLine,
          nextPhase: PHASES.SCENARIO,
          scenarioContext: {
            title: topicName,
            fullContext,
            tips
          }
        };

        await delay(600);
        await handleAIResult(turnRepeat, PHASES.REPEAT);
        return;
      }

      // SCENARIO - Use teachingEngine and masteryEngine
      if (current === PHASES.SCENARIO) {
        // natural thinking time
        await delay(400);
        const engineResult = await generateConversationResponse({
          conversationHistory,
          gradeLevel: resolvedGradeLevel,
          learnerName,
          topicId,
          currentPhase: current,
          scenario: {
            ...scenarioRef.current,
            fullContext: scenarioContext?.fullContext || scenarioContext?.preview || "",
            tips: scenarioContext?.tips || [],
            title: scenarioContext?.title || scenarioContext?.topicName || scenarioContext?.topicId || ""
          },
          contextualizer,
          streaming: false,
          finalOnly: true,
          disablePartial: true
        });

        const teaching = teachingEngine({
          userMessage: trimmed,
          topicId,
          gradeLevel: resolvedGradeLevel,
          learnerName,
          dynamicScenario: engineResult.dynamicScenario
        });

        engineResult.aiResponse = teaching.ttsOutput;

        // Mastery update
        const masteryUpdate = evaluateTurn({
          userMessage: trimmed,
          topicId,
          masteryState: masteryRef.current
        });

        masteryRef.current = masteryUpdate.masteryState;

        await delay(600);
        await handleAIResult(engineResult, current);
        return;
      }

      // VARIATION - Use teachingEngine and masteryEngine
      if (current === PHASES.VARIATION) {
        // natural thinking time
        await delay(400);
        const engineResult = await generateConversationResponse({
          conversationHistory,
          gradeLevel: resolvedGradeLevel,
          learnerName,
          topicId,
          currentPhase: current,
          scenario: {
            ...scenarioRef.current,
            fullContext: scenarioContext?.fullContext || scenarioContext?.preview || "",
            tips: scenarioContext?.tips || [],
            title: scenarioContext?.title || scenarioContext?.topicName || scenarioContext?.topicId || ""
          },
          contextualizer,
          streaming: false,
          finalOnly: true,
          disablePartial: true
        });

        const teaching = teachingEngine({
          userMessage: trimmed,
          topicId,
          gradeLevel: resolvedGradeLevel,
          learnerName,
          dynamicScenario: engineResult.dynamicScenario
        });

        engineResult.aiResponse = teaching.ttsOutput;

        // Mastery update
        const masteryUpdate = evaluateTurn({
          userMessage: trimmed,
          topicId,
          masteryState: masteryRef.current
        });

        masteryRef.current = masteryUpdate.masteryState;

        await delay(600);
        await handleAIResult(engineResult, current);
        return;
      }

      // NON-INTRO PHASES → use generateConversationResponse
      // natural thinking time
      await delay(400);
      const engineResult = await generateConversationResponse({
        conversationHistory,
        gradeLevel: resolvedGradeLevel,
        learnerName,
        topicId,
        currentPhase: current,
        scenario: {
          ...scenarioRef.current,
          fullContext: scenarioContext?.fullContext || scenarioContext?.preview || "",
          tips: scenarioContext?.tips || [],
          title: scenarioContext?.title || scenarioContext?.topicName || scenarioContext?.topicId || ""
        },
        contextualizer,
        streaming: false,        // ensure final only
        finalOnly: true,         // tell engine to return only final completions
        disablePartial: true     // remove token-by-token updates
      });

      // teaching phase still handled normally
        if (current === PHASES.TEACHING || engineResult.nextPhase === PHASES.TEACHING) {
          const teaching = teachingEngine({
            userMessage: trimmed,
            topicId,
            gradeLevel: resolvedGradeLevel,
            learnerName,
            dynamicScenario: engineResult.dynamicScenario
          });

          engineResult.aiResponse = teaching.ttsOutput;

          // Mastery update
          const masteryUpdate = evaluateTurn({
            userMessage: trimmed,
            topicId,
            masteryState: masteryRef.current
          });

          masteryRef.current = masteryUpdate.masteryState;
        }

        await delay(600);
        await handleAIResult(engineResult, current);
      } catch (err) {
        console.error("sendUserMessage error:", err);
        onError?.(err);
      } finally {
        setIsLoading(false);
      }
    },
    [handleAIResult, learnerName, resolvedGradeLevel, onError]
  );

  // --------- Auto-start ---------

  useEffect(() => {
    if (!scenarioRef.current) return;
    if (!autoStart) return;
    if (startedRef.current) return;
    if (profileLoading) return;

    startConversation();
  }, [autoStart, startConversation, profileLoading]);

  // --------- Reset when scenario changes ---------

  useEffect(() => {
    if (!scenario) {
      resetConversation();
      return;
    }
    resetConversation();
  }, [scenario, resetConversation]);

  // --------- Cleanup ---------

  useEffect(() => {
    return () => stopOpenAITTSPlayback();
  }, []);

  return {
    messages,
    phase,
    currentPhase: phase,
    isLoading,
    isSpeaking,
    hasStarted,

    gradeLevel: resolvedGradeLevel,
    learnerName,

    startConversation,
    sendUserMessage,
    resetConversation
  };
}
