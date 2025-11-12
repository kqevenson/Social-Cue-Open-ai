import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CleanVoiceService from '../services/CleanVoiceService';
import { playVoiceResponseWithOpenAI, stopOpenAITTSPlayback } from '../services/openAITTSService';

const MAX_VISIBLE_LINES = 5;
const MAX_STORED_LINES = 40;

const MISSING_SCENARIO_MESSAGE = 'We could not load this scenario. Please go back and choose another practice activity.';
const MISSING_INTRO_MESSAGE = 'Intro line was missing. Generating a new greeting...';
const INTRO_RETRY_DELAY = 1500;

const VoiceCoachOrbScreen = ({
  introLine,
  scenario,
  gradeLevel = '6',
  onEndSession
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [transcript, setTranscript] = useState([]);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const messagesRef = useRef([]);
  const currentPhaseRef = useRef('intro');
  const cancelledRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const introRetryRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const shouldIgnoreInputRef = useRef(true);
  const listeningTimeoutRef = useRef(null);

  const appendTranscript = useCallback((line) => {
    if (!line) return;
    setTranscript((prev) => {
      const next = [...prev, line.trim()].filter(Boolean);
      if (next.length > MAX_STORED_LINES) {
        return next.slice(next.length - MAX_STORED_LINES);
      }
      return next;
    });
  }, []);

  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = null;
    }
    shouldIgnoreInputRef.current = true;
    isListeningRef.current = false;
    setIsListening(false);
    stopOpenAITTSPlayback();
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return;

    try {
      console.debug('[VoiceCoachOrbScreen] Starting speech recognition listener');
      recognitionRef.current.start();
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
    } catch (startError) {
      console.error('[VoiceCoachOrbScreen] Error starting recognition:', startError);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (isListeningRef.current) {
      console.debug('[VoiceCoachOrbScreen] Stopping speech recognition listener');
    }
    isListeningRef.current = false;
    setIsListening(false);
  }, []);

  const resumeListeningAfterDelay = useCallback((delay = 800) => {
    shouldIgnoreInputRef.current = true;
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }
    listeningTimeoutRef.current = setTimeout(() => {
      if (!cancelledRef.current && recognitionRef.current) {
        shouldIgnoreInputRef.current = false;
        startListening();
      }
      listeningTimeoutRef.current = null;
    }, delay);
  }, [startListening]);

  const speakText = useCallback(async (text) => {
    console.debug('[VoiceCoachOrbScreen] Speaking text via OpenAI TTS:', text);
    await playVoiceResponseWithOpenAI(text, { voice: 'shimmer' });
  }, []);

  const setSpeakingState = useCallback(
    (value) => {
      isSpeakingRef.current = value;
      setIsSpeaking(value);
    },
    [setIsSpeaking]
  );

  const handleSessionEnd = useCallback(
    (details) => {
      cancelledRef.current = true;
      cleanup();
      onEndSession?.({
        ...details,
        messages: messagesRef.current
      });
    },
    [cleanup, onEndSession]
  );

  const handleUserMessage = useCallback(
    async (rawText) => {
      const text = (rawText || '').trim();
      if (!text) return;

      if (shouldIgnoreInputRef.current || isSpeakingRef.current) {
        console.debug('[VoiceCoachOrbScreen] Ignoring speech during suppression window:', text);
        return;
      }

      stopListening();
      setIsProcessing(true);
      setError(null);

      messagesRef.current = [...messagesRef.current, { role: 'user', content: text }];
      appendTranscript(text);

      try {
        const response = await CleanVoiceService.generateResponse({
          conversationHistory: messagesRef.current,
          scenario,
          gradeLevel,
          phase: currentPhaseRef.current
        });

        const aiText = response?.aiResponse?.trim() ||
          "Let's take a quick pause and try again.";
        messagesRef.current = [
          ...messagesRef.current,
          { role: 'assistant', content: aiText, phase: response?.phase || currentPhaseRef.current }
        ];

        appendTranscript(aiText);

        if (response?.phase && response.phase !== currentPhaseRef.current) {
          console.log('[PHASE] before change:', currentPhaseRef.current);
          currentPhaseRef.current = response.phase;
          setCurrentPhase(response.phase);
          console.log('[PHASE] after change:', currentPhaseRef.current);
        }

        setSpeakingState(true);
        await speakText(aiText);
        setSpeakingState(false);

        if (response?.phase === 'complete') {
          handleSessionEnd({ phase: 'complete' });
        } else if (!cancelledRef.current) {
          resumeListeningAfterDelay(900);
        }
      } catch (conversationError) {
        console.error('Voice conversation error:', conversationError);
        const fallback = "I'm having a little trouble right now. Could you try that again?";
        setError('Sorry, something went wrong. Please try again.');
        messagesRef.current = [...messagesRef.current, { role: 'assistant', content: fallback }];
        appendTranscript(fallback);

        try {
          setSpeakingState(true);
          await speakText(fallback);
          setSpeakingState(false);
        } catch (fallbackError) {
          console.error('Fallback playback failed:', fallbackError);
          setSpeakingState(false);
        } finally {
          if (!cancelledRef.current) {
            resumeListeningAfterDelay(1200);
          }
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [appendTranscript, gradeLevel, handleSessionEnd, resumeListeningAfterDelay, scenario, setSpeakingState, speakText, stopListening]
  );

  useEffect(() => {
    currentPhaseRef.current = currentPhase;
  }, [currentPhase]);

  const speakIntroAndScenario = useCallback(async () => {
    if (!scenario) {
      console.warn('[VoiceCoachOrbScreen] No scenario available. Intro flow aborted.');
      return;
    }

    stopListening();
    setSpeakingState(true);
    setError(null);
    console.log('[PHASE] before change:', currentPhaseRef.current);
    currentPhaseRef.current = 'intro';
    setCurrentPhase('intro');
    console.log('[PHASE] after change:', currentPhaseRef.current);

    const buildFallbackIntro = () => `Hi, I'm Cue — let's practice ${
      scenario?.title || 'a real conversation'
    } together. Ready?`;

    const fetchIntroLine = async () => {
      try {
        console.debug('[VoiceCoachOrbScreen] Generating intro line via CleanVoiceService');
        const aiIntro = await CleanVoiceService.generateResponse({
          conversationHistory: [],
          scenario,
          gradeLevel,
          phase: 'intro'
        });
        return aiIntro?.aiResponse?.trim();
      } catch (introError) {
        console.error('[VoiceCoachOrbScreen] Failed to generate intro line:', introError);
        return null;
      }
    };

    let advancedToPractice = false;

    try {
      let resolvedIntro = introLine?.trim() || (await fetchIntroLine()) || buildFallbackIntro();

      appendTranscript(resolvedIntro);
      messagesRef.current = [{ role: 'assistant', content: resolvedIntro, phase: 'intro' }];
      console.debug('[VoiceCoachOrbScreen] Intro line ready:', resolvedIntro);
      await speakText(resolvedIntro);

      let scenarioLine = '';
      if (typeof scenario === 'string') {
        scenarioLine = scenario.trim();
      } else {
        scenarioLine =
          scenario?.contextLine ||
          scenario?.prompt ||
          scenario?.description ||
          scenario?.warmupQuestion ||
          '';
        scenarioLine = scenarioLine?.trim() || '';
      }

      if (scenarioLine) {
        console.debug('[VoiceCoachOrbScreen] Scenario line ready:', scenarioLine);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        appendTranscript(scenarioLine);
        messagesRef.current = [
          ...messagesRef.current,
          { role: 'assistant', content: scenarioLine, phase: 'intro' }
        ];
        await speakText(scenarioLine);
      } else {
        console.debug('[VoiceCoachOrbScreen] No scenario line available to speak.');
      }

      advancedToPractice = true;
    } catch (introFlowError) {
      console.error('[VoiceCoachOrbScreen] Intro flow failed:', introFlowError);
      setError('We had trouble starting the session. Try again?');
      if (!introRetryRef.current) {
        introRetryRef.current = true;
        setTimeout(() => {
          if (!cancelledRef.current) {
            console.debug('[VoiceCoachOrbScreen] Retrying intro flow once');
            speakIntroAndScenario();
          }
        }, INTRO_RETRY_DELAY);
        return;
      }
    } finally {
      setSpeakingState(false);
      introRetryRef.current = false;
      if (advancedToPractice) {
        console.log('[PHASE] before change:', currentPhaseRef.current);
        currentPhaseRef.current = 'practice';
        setCurrentPhase('practice');
        console.log('[PHASE] after change:', currentPhaseRef.current);
      }
      if (!cancelledRef.current) {
        console.debug('[VoiceCoachOrbScreen] Intro and scenario completed; scheduling listener start');
        resumeListeningAfterDelay(1500);
      }
    }
  }, [appendTranscript, gradeLevel, introLine, resumeListeningAfterDelay, scenario, speakText, stopListening]);

  useEffect(() => {
    console.debug('[VoiceCoachOrbScreen] Incoming props:', { introLine, scenario });

    if (!scenario) {
      setError(MISSING_SCENARIO_MESSAGE);
      return;
    }

    setError((prev) => (prev === MISSING_SCENARIO_MESSAGE ? null : prev));

    if (!introLine?.trim()) {
      setError((prev) =>
        prev && prev !== MISSING_SCENARIO_MESSAGE ? prev : MISSING_INTRO_MESSAGE
      );
    } else {
      setError((prev) => (prev === MISSING_INTRO_MESSAGE ? null : prev));
    }
  }, [introLine, scenario]);

  useEffect(() => {
    if (!scenario) {
      console.warn('[VoiceCoachOrbScreen] scenario prop is missing. Skipping voice flow.');
      return;
    }

    if (hasInitializedRef.current) {
      console.debug('[VoiceCoachOrbScreen] Intro already initialized; skipping re-run.');
      return;
    }
    hasInitializedRef.current = true;
    cancelledRef.current = false;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return () => {
        cancelledRef.current = true;
      };
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const spoken = event.results[last][0].transcript;
      if (spoken?.trim()) {
        if (shouldIgnoreInputRef.current || isSpeakingRef.current) {
          console.debug('[VoiceCoachOrbScreen] Ignoring captured audio while AI is speaking:', spoken);
          return;
        }
        console.debug('[VoiceCoachOrbScreen] User message recognized:', spoken);
        handleUserMessage(spoken);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') return;
      console.error('Speech recognition error:', event.error);
      setError('Listening error. We will keep trying...');
    };

    recognition.onend = () => {
      if (cancelledRef.current) return;
      if (isListeningRef.current) {
        try {
          console.debug('[VoiceCoachOrbScreen] Recognition ended; restarting listener');
          recognition.start();
        } catch (restartError) {
          console.warn('[VoiceCoachOrbScreen] Speech recognition restart failed:', restartError);
        }
      }
    };

    recognitionRef.current = recognition;

    speakIntroAndScenario();

    return () => {
      cancelledRef.current = true;
      cleanup();
    };
  }, [cleanup, handleUserMessage, scenario, speakIntroAndScenario]);

  const visibleTranscript = useMemo(() => transcript.slice(-MAX_VISIBLE_LINES), [transcript]);

  const statusText = useMemo(() => {
    if (isSpeaking) return 'Speaking...';
    if (isListening) return 'Listening...';
    if (isProcessing) return 'Processing...';
    return 'Ready when you are';
  }, [isListening, isProcessing, isSpeaking]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#050914] via-[#02060f] to-[#000205] text-white flex flex-col">
      <div className="w-full flex justify-end px-8 pt-8">
        <button
          type="button"
          onClick={() => handleSessionEnd({ endedByUser: true })}
          className="px-5 py-2 rounded-full border border-white/20 bg-white/10 text-sm font-semibold tracking-wide shadow-lg shadow-cyan-500/10 hover:bg-white/20 transition"
        >
          End Session
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-4 text-center space-y-10">
        <div className="relative flex items-center justify-center">
          <div
            className={`absolute inset-0 m-auto w-56 h-56 rounded-full blur-3xl transition-colors duration-700 ${
              isSpeaking
                ? 'bg-cyan-400/70 animate-pulse'
                : isListening
                ? 'bg-sky-400/40 animate-[pulse_3s_ease-in-out_infinite]'
                : 'bg-sky-500/20'
            }`}
          />
          <div
            className={`relative w-44 h-44 rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_50px_rgba(56,189,248,0.55)] transition-transform duration-700 ${
              isSpeaking ? 'scale-110' : isListening ? 'scale-105' : 'scale-100'
            }`}
          />
        </div>

        <div className="space-y-3 max-w-2xl w-full">
          <p className="text-lg font-medium text-cyan-100 drop-shadow-sm">{statusText}</p>
          {error && (
            <p className="text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 inline-block">
              {error}
            </p>
          )}
        </div>

        <div className="w-full max-w-2xl max-h-48 overflow-y-auto bg-white/5 border border-white/10 rounded-3xl px-6 py-5 backdrop-blur-sm text-left space-y-2 text-base text-gray-200">
          {visibleTranscript.map((line, index) => (
            <p key={`transcript-${index}`} className="tracking-wide leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceCoachOrbScreen;
