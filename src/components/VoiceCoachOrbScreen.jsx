import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CleanVoiceService from '../services/CleanVoiceService';
import { playVoiceResponseWithOpenAI, stopOpenAITTSPlayback } from '../services/openAITTSService';

const MAX_STORED_LINES = 40;

const MISSING_SCENARIO_MESSAGE = 'We could not load this scenario. Please go back and choose another practice activity.';
const MISSING_INTRO_MESSAGE = 'Intro line was missing. Generating a new greeting...';
const INTRO_RETRY_DELAY = 1500;

const VoiceCoachOrbScreen = ({
  introLine,
  scenario,
  gradeLevel = '6',
  learnerName: initialLearnerName = '',
  introScripts = null,
  onEndSession
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [transcript, setTranscript] = useState([]);
  const [learnerName, setLearnerName] = useState(initialLearnerName || null);

  const resolvedGradeLevel = scenario?.gradeLevel || gradeLevel || '6';

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

  const guessLearnerName = useCallback((userText) => {
    if (!userText) return null;
    const lowered = userText.toLowerCase();
    const explicitMatch = lowered.match(/(?:my name is|i am|i'm|im)\s+([a-z]+)/i);
    if (explicitMatch && explicitMatch[1]) {
      return explicitMatch[1];
    }
    const singleWord = userText.trim();
    if (/^[A-Za-z]+$/.test(singleWord) && singleWord.length > 1 && singleWord.length <= 16) {
      return singleWord;
    }
    return null;
  }, []);

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
        const toneHint = await CleanVoiceService.analyzeTone(text);
        let updatedName = learnerName;
        if (!updatedName) {
          const potentialName = guessLearnerName(text);
          if (potentialName) {
            const normalizedName =
              potentialName.charAt(0).toUpperCase() + potentialName.slice(1).toLowerCase();
            setLearnerName(normalizedName);
            updatedName = normalizedName;
          }
        }

        const response = await CleanVoiceService.generateResponse({
          conversationHistory: messagesRef.current,
          scenario,
          gradeLevel: resolvedGradeLevel,
          phase: currentPhaseRef.current,
          toneHint,
          learnerName: updatedName
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
    [appendTranscript, resolvedGradeLevel, handleSessionEnd, learnerName, resumeListeningAfterDelay, scenario, setLearnerName, setSpeakingState, speakText, stopListening, guessLearnerName]
  );

  useEffect(() => {
    currentPhaseRef.current = currentPhase;
  }, [currentPhase]);

  const speakIntroAndScenario = useCallback(async () => {
    if (!scenario) {
      console.warn('[VoiceCoachOrbScreen] No scenario available. Intro flow aborted.');
      return;
    }

    const scriptBundle = introScripts || scenario?.introScripts || null;
    const compiledIntroLine = scriptBundle
      ? [scriptBundle.greetingIntro, scriptBundle.scenarioIntro, scriptBundle.safetyAndConsent]
          .filter(Boolean)
          .join(' ')
          .trim()
      : null;

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
          gradeLevel: resolvedGradeLevel,
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
      let resolvedIntro =
        introLine?.trim() || compiledIntroLine || (await fetchIntroLine()) || buildFallbackIntro();

      appendTranscript(resolvedIntro);
      messagesRef.current = [{ role: 'assistant', content: resolvedIntro, phase: 'intro' }];
      console.debug('[VoiceCoachOrbScreen] Intro line ready:', resolvedIntro);
      await speakText(resolvedIntro);

      let scenarioLine = '';
      if (scriptBundle?.scenarioIntro) {
        scenarioLine = scriptBundle.scenarioIntro.trim();
      } else if (typeof scenario === 'string') {
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
  }, [appendTranscript, resolvedGradeLevel, introLine, introScripts, resumeListeningAfterDelay, scenario, speakText, stopListening]);

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

const statusText = useMemo(() => {
  if (isSpeaking) return '🔊 Speaking...';
  if (isListening) return '💡 Listening... speak naturally!';
  if (isProcessing) return '🤖 Thinking...';
  return 'Ready when you are';
}, [isListening, isProcessing, isSpeaking]);

  return (
    <div className="relative min-h-screen w-full bg-[#020412] text-white flex items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.22),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,118,246,0.12),_transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-6">
        <div
          className={`orb ${isSpeaking ? 'orb--speaking' : isListening ? 'orb--listening' : 'orb--idle'}`}
        />

        <p className="subtitle text-cyan-100 drop-shadow-sm">{statusText}</p>

        <div className="flex flex-col gap-2 max-w-xl mt-4 text-white/90 text-sm">
          {transcript.map((line, idx) => (
            <p
              key={idx}
              className="bg-white/5 rounded-xl px-4 py-2 border border-white/10"
            >
              {line}
            </p>
          ))}
        </div>

        {error && (
          <p className="text-sm text-rose-200 bg-rose-500/10 border border-rose-500/30 rounded-full px-4 py-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceCoachOrbScreen;
