// ---------------------------------------------------------------------------
// useVoiceConversation.js — FULLY REWRITTEN AUTONOMOUS VOICE ENGINE (2025)
// ---------------------------------------------------------------------------
// This new engine:
// • Fixes all DEMONSTRATE → REPEAT cutoff issues
// • Gives ChatGPT-level natural conversation
// • Clean TTS → recognition flow
// • No race conditions
// • No double-speaking
// • No rigid phase forcing
// • Built to work with your new autonomy engine
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";
import { OpenAI } from "openai";
import {
  unlockAudio,
  playVoiceResponseWithOpenAI,
  stopOpenAITTSPlayback
} from "../services/openAITTSService";

import {
  startRecognition,
  stopRecognition
} from "../services/speechRecognitionService";

import { PHASES } from "../content/training/AIBehaviorConfig";
import { generateConversationResponse } from "../services/generateConversationResponse";

// ---------------------------------------------------------------------------
// Helper: Create Message Object
// ---------------------------------------------------------------------------
function createMsg(role, text, phase) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
    phase,
    isFinal: true,
    createdAt: new Date().toISOString()
  };
}

// ---------------------------------------------------------------------------
// MAIN HOOK
// ---------------------------------------------------------------------------
export default function useVoiceConversation({
  scenario,
  learnerName = "",
  gradeLevel = "6-8",
  autoStart = true,
  onAudioStart,
  onAudioComplete,
  onPhaseChange,
  onError
}) {
  // State
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState(PHASES.INTRO_1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs to avoid stale closures
  const messagesRef = useRef([]);
  const phaseRef = useRef(PHASES.INTRO_1);
  const startedRef = useRef(false);
  const scenarioRef = useRef(scenario);
  const openaiRef = useRef(null);
  const micLockedRef = useRef(false); // prevents mic activation during TTS
  const shouldIgnoreInputRef = useRef(false); // prevents processing user input during AI-only phases

  // ---------------------------------------------------------------------------
  // Initialize OpenAI Client
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const key =
      import.meta.env.VITE_OPENAI_API_KEY ||
      globalThis?.process?.env?.OPENAI_API_KEY ||
      "";

    if (key) {
      openaiRef.current = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true
      });
    }
  }, []);

  // Keep refs up to date
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    scenarioRef.current = scenario;
  }, [scenario]);

  // ---------------------------------------------------------------------------
  // Helper: Allow user responses after TTS completes
  // ---------------------------------------------------------------------------
  function allowUserResponses() {
    shouldIgnoreInputRef.current = false;
  }

  // ---------------------------------------------------------------------------
  // Internal: Speak an AI message (handles TTS + state)
  // ---------------------------------------------------------------------------
  const speakAI = useCallback(
    async (text, nextPhase = null) => {
      const clean = (text || "").toString().trim();
      if (!clean) return;

      try {
        // Phase update
        const prev = phaseRef.current;
        const phaseToUse = nextPhase || prev;
        if (phaseToUse !== prev) {
          setPhase(phaseToUse);
          phaseRef.current = phaseToUse;
          onPhaseChange?.(phaseToUse, prev);
        }

        // Append message
        const msg = createMsg("ai", clean, phaseToUse);
        setMessages((m) => [...m, msg]);
        messagesRef.current.push(msg);

        // TTS start
        micLockedRef.current = true;
        shouldIgnoreInputRef.current = true; // Block user input during TTS

        await playVoiceResponseWithOpenAI(clean, {
          onAudioStart: () => {
            setIsSpeaking(true);
            stopRecognition();
            shouldIgnoreInputRef.current = true; // Ensure input is blocked during TTS
            if (onAudioStart) onAudioStart();
          },
          onAudioComplete: () => {
            setIsSpeaking(false);
            micLockedRef.current = false;
            allowUserResponses(); // Allow user responses after TTS completes
            if (onAudioComplete) onAudioComplete();
          }
        });
      } catch (err) {
        console.warn("TTS failed:", err);
        setIsSpeaking(false);
        micLockedRef.current = false;
        allowUserResponses(); // Allow user responses even if TTS fails
      }
    },
    [onAudioStart, onAudioComplete]
  );

  // ---------------------------------------------------------------------------
  // START CONVERSATION (INTRO FLOW)
// ---------------------------------------------------------------------------
  const startConversation = useCallback(async () => {
    if (!scenarioRef.current) return;
    if (startedRef.current) return;

    try {
      startedRef.current = true;
      await unlockAudio();
      setIsLoading(true);

      // Intro controlled by AI itself now
      const introResult = await generateConversationResponse({
        openai: openaiRef.current,
        currentPhase: PHASES.INTRO_1,
        history: [],
        learnerName,
        gradeLevel,
        difficulty: 1,
        scenario: scenarioRef.current
      });

      await speakAI(introResult.aiResponse, introResult.nextPhase);
    } catch (err) {
      console.error("Intro error:", err);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [gradeLevel, learnerName, speakAI, onError]);

  // ---------------------------------------------------------------------------
  // SEND USER MESSAGE
  // ---------------------------------------------------------------------------
  const sendUserMessage = useCallback(
    async (raw) => {
      const cleaned = (raw || "").trim();
      if (!cleaned) return;

      // Block user input only during DEMONSTRATE phase (AI-only monologue)
      if (phaseRef.current === PHASES.DEMONSTRATE) {
        console.log("[DEMONSTRATE] Ignoring user input - DEMONSTRATE is AI-only");
        return;
      }

      try {
        setIsLoading(true);
        stopOpenAITTSPlayback();

        // Save user message
        const prev = phaseRef.current;
        const userMsg = createMsg("user", cleaned, prev);
        setMessages((m) => [...m, userMsg]);
        messagesRef.current.push(userMsg);

        // Prepare AI context
        const history = messagesRef.current.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text,
          phase: m.phase
        }));

        const ai = await generateConversationResponse({
          openai: openaiRef.current,
          currentPhase: phaseRef.current,
          history,
          learnerName,
          gradeLevel,
          difficulty: 1,
          scenario: scenarioRef.current
        });

        await speakAI(ai.aiResponse, ai.nextPhase);
      } catch (err) {
        console.error("sendUserMessage error:", err);
        onError?.(err);
      } finally {
        setIsLoading(false);
      }
    },
    [gradeLevel, learnerName, speakAI, onError]
  );

  // ---------------------------------------------------------------------------
  // RESET SESSION
  // ---------------------------------------------------------------------------
  const resetConversation = useCallback(() => {
    stopOpenAITTSPlayback();
    stopRecognition();
    startedRef.current = false;
    setMessages([]);
    messagesRef.current = [];
    setPhase(PHASES.INTRO_1);
    phaseRef.current = PHASES.INTRO_1;
  }, []);

  // ---------------------------------------------------------------------------
  // AUTO-START
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (autoStart && scenarioRef.current) {
      startConversation();
    }
  }, [autoStart, scenarioRef.current, startConversation]);

  // Cleanup
  useEffect(() => () => stopOpenAITTSPlayback(), []);

  // ---------------------------------------------------------------------------
  // RETURN HOOK API (expected by your UI)
// ---------------------------------------------------------------------------
  return {
    messages,
    phase,
    isSpeaking,
    isLoading,
    startConversation,
    sendUserMessage,
    resetConversation
  };
}
