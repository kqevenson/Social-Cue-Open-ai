// useVoiceConversation.js — FULLY REWRITTEN (Unified Engine Version)

import { useCallback, useEffect, useRef, useState } from "react";

// NEW unified engine
import { generateConversationResponse } from "../services/generateConversationResponse";
import { PHASES, buildIntroFlow } from "../content/training/aibehaviorconfig";

// Teaching & Mastery
import { teachingEngine } from "../services/teachingEngine";
import {
  evaluateTurn,
  initializeLearnerMastery
} from "../services/masteryEngine";
import { generateAdaptiveScenario } from "../services/scenarioGenerator";

// Voice Output
import {
  unlockAudio,
  playVoiceResponseWithOpenAI,
  stopOpenAITTSPlayback
} from "../services/openAITTSService";

// Learner profile
import useLearnerProfile from "./useLearnerProfile";
import StorageService from "../services/storageService";

// ---------- UTIL ----------

const createMessage = (role, text, phase) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  text,
  phase,
  createdAt: new Date().toISOString()
});

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
  const introFlowRef = useRef(null);

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

      // Add AI message
      const msg = createMessage("ai", safeText, effectivePhase);
      setMessages((prev) => {
        const updated = [...prev, msg];
        messagesRef.current = updated;
        return updated;
      });

      // Speak message
      try {
        setIsSpeaking(true);
        await playVoiceResponseWithOpenAI(safeText);
      } catch (err) {
        console.error("TTS error:", err);
        onError?.(err);
      } finally {
        setIsSpeaking(false);
      }
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
      await unlockAudio();

      const topicId = scenarioRef.current?.topicId || scenarioRef.current?.topic || "";

      // 🔥 ALWAYS rebuild intro flow fresh
      const flow = buildIntroFlow(
        resolvedGradeLevel,
        topicId,
        lastScenarioRef.current
      );

      introFlowRef.current = flow; // store all 3 turns

      // Turn 1 (greeting)
      const turn1 = {
        aiResponse: flow.turn1,
        nextPhase: PHASES.INTRO_2
      };

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
        await unlockAudio();

        const conversationHistory = messagesRef.current.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text,
          phase: m.phase
        }));

      const topicId = scenarioRef.current?.topicId || scenarioRef.current?.topic || "";

      // NEW UNIFIED INTRO LOGIC — All 3 intro turns handled through generateConversationResponse

      // INTRO TURN 2
      if (current === PHASES.INTRO_2) {
        const flow = introFlowRef.current;
        const turn2 = {
          aiResponse: flow.turn2,
          nextPhase: PHASES.INTRO_3
        };
        await handleAIResult(turn2, PHASES.INTRO_2);
        return;
      }

      // INTRO TURN 3
      if (current === PHASES.INTRO_3) {
        const flow = introFlowRef.current;
        const turn3 = {
          aiResponse: flow.turn3,
          nextPhase: PHASES.SCENARIO,
          dynamicScenario: flow.dynamicScenario
        };
        scenarioRef.current = flow.dynamicScenario;
        await handleAIResult(turn3, PHASES.INTRO_3);
        return;
      }

      // NON-INTRO PHASES → use generateConversationResponse
      const engineResult = await generateConversationResponse({
        conversationHistory,
        gradeLevel: resolvedGradeLevel,
        learnerName,
        topicId,
        currentPhase: current,
        scenario: scenarioRef.current
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

          // Adaptive next scenario
          const topicMastery = masteryRef.current.topicMastery[topicId] || {
            score: 0,
            level: "easy"
          };
          const successRate = Math.min(1, Math.max(0, topicMastery.score / 100));

          const nextScenario = generateAdaptiveScenario({
            topicId,
            gradeLevel: resolvedGradeLevel,
            lastScenarioId: scenarioRef.current?.id || null,
            previousDifficulty: topicMastery.level,
            successRate
          });

          if (nextScenario) {
            scenarioRef.current = nextScenario;
          }
        }

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

