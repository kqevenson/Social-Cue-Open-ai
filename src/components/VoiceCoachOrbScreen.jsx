import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import localforage from 'localforage';
import CleanVoiceService from '../services/CleanVoiceService';
import { playVoiceResponseWithOpenAI, stopOpenAITTSPlayback } from '../services/openAITTSService';

const MAX_STORED_LINES = 40;
const PHASE_STORAGE_KEY = 'voiceCoach:lastPhase';

const MISSING_SCENARIO_MESSAGE = 'We could not load this scenario. Please go back and choose another practice activity.';
const INTRO_RETRY_DELAY = 1500;

const VoiceCoachOrbScreen = ({
  scenario,
  gradeLevel = '6',
  learnerName: initialLearnerName = '',
  onEndSession
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [transcript, setTranscript] = useState([]);
  const [learnerName, setLearnerName] = useState(initialLearnerName || null);
  const [phaseRestored, setPhaseRestored] = useState(false);
  const [userPrompt, setUserPrompt] = useState('Ready when you are');

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

  const persistPhase = useCallback(async (phaseValue) => {
    if (!phaseValue) return;
    try {
      currentPhaseRef.current = phaseValue;
      setCurrentPhase(phaseValue);
      await localforage.setItem(PHASE_STORAGE_KEY, phaseValue);
    } catch (storageError) {
      console.warn('[VoiceCoachOrbScreen] Unable to persist phase:', storageError);
    }
  }, []);

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
    localforage.removeItem(PHASE_STORAGE_KEY).catch((storageError) => {
      console.warn('[VoiceCoachOrbScreen] Unable to clear persisted phase:', storageError);
    });
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

        const prevPhase = currentPhaseRef.current;
        const nextPhase = response?.phase || prevPhase;
        if (nextPhase !== prevPhase) {
          console.log('[PHASE] before change:', prevPhase);
        }
        await persistPhase(nextPhase);
        if (nextPhase !== prevPhase) {
          console.log('[PHASE] after change:', nextPhase);
        }

        appendTranscript(aiText);

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
    [appendTranscript, resolvedGradeLevel, handleSessionEnd, learnerName, persistPhase, resumeListeningAfterDelay, scenario, setLearnerName, setSpeakingState, speakText, stopListening, guessLearnerName]
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

    const prevPhase = currentPhaseRef.current;
    if (prevPhase !== 'intro') {
      console.log('[PHASE] before change:', prevPhase);
    }
    await persistPhase('intro');
    if (prevPhase !== 'intro') {
      console.log('[PHASE] after change:', currentPhaseRef.current);
    }

    let introResponse = null;
    const fetchIntroResponse = async () => {
      try {
        console.debug('[VoiceCoachOrbScreen] Generating intro line via CleanVoiceService');
        const aiResponsePayload = await CleanVoiceService.generateResponse({
          conversationHistory: [],
          scenario,
          gradeLevel: resolvedGradeLevel,
          phase: 'intro',
          learnerName: learnerName || null
        });
        console.log('[VoiceCoachOrbScreen] 🔄 AI intro response:', {
          scenarioKey: scenario?.scriptKey || scenario?.topicId || scenario?.id,
          response: aiResponsePayload?.aiResponse,
          phase: aiResponsePayload?.phase,
          learnerName: learnerName || null
        });
        return aiResponsePayload;
      } catch (introError) {
        console.error('[VoiceCoachOrbScreen] Failed to generate intro line:', introError);
        return null;
      }
    };

    let resolvedIntro = null;

    let shouldAdvancePhase = false;

    try {
      introResponse = await fetchIntroResponse();
      if (introResponse?.aiResponse) {
        resolvedIntro = introResponse.aiResponse.trim();
      }

      if (!resolvedIntro) {
        console.warn('[VoiceCoachOrbScreen] Intro response empty, using fallback.');
        resolvedIntro = `Hi, I'm Cue — let's practice ${
          scenario?.title || 'a real conversation'
        } together. Ready?`;
      }

      appendTranscript(resolvedIntro);
      messagesRef.current = [{ role: 'assistant', content: resolvedIntro, phase: 'intro' }];
      console.debug('[VoiceCoachOrbScreen] Intro line ready:', resolvedIntro);
      await speakText(resolvedIntro);

      const nextPhase = introResponse?.phase || (learnerName?.trim() ? 'practice' : 'intro');
      shouldAdvancePhase = nextPhase !== 'intro';

      if (!shouldAdvancePhase) {
        console.debug('[VoiceCoachOrbScreen] Awaiting learner input before advancing phase.');
      }
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

      const targetPhase = introResponse?.phase || (learnerName?.trim() ? 'practice' : 'intro');
      if (shouldAdvancePhase && targetPhase !== 'intro') {
        console.log('[PHASE] before change:', currentPhaseRef.current);
        await persistPhase(targetPhase);
        console.log('[PHASE] after change:', currentPhaseRef.current);
      }

      if (!cancelledRef.current) {
        const delay = targetPhase === 'intro' ? 800 : 1500;
        console.debug('[VoiceCoachOrbScreen] Intro completed; scheduling listener start in', delay, 'ms');
        resumeListeningAfterDelay(delay);
      }
    }
  }, [learnerName, persistPhase, resolvedGradeLevel, resumeListeningAfterDelay, scenario, speakText, stopListening]);

  useEffect(() => {
    if (!scenario) {
      setError(MISSING_SCENARIO_MESSAGE);
      return;
    }

    if (!phaseRestored) {
      return;
    }

    setError((prev) => (prev === MISSING_SCENARIO_MESSAGE ? null : prev));

    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;
      const shouldStartWithIntro = messagesRef.current.length === 0;

      if (hasInitializedRef.current) {
        if (shouldStartWithIntro || currentPhaseRef.current === 'intro') {
          await speakIntroAndScenario();
        } else {
          shouldIgnoreInputRef.current = false;
          setIsListening(true);
          try {
            if (recognitionRef.current) {
              recognitionRef.current.start();
              isListeningRef.current = true;
            }
          } catch (startError) {
            console.warn('[VoiceCoachOrbScreen] Unable to restart recognition:', startError);
          }
        }
        return;
      }

      hasInitializedRef.current = true;

      if (!('webkitSpeechRecognition' in window)) {
        console.warn('[VoiceCoachOrbScreen] Speech recognition is not supported in this browser.');
        if (shouldStartWithIntro || currentPhaseRef.current === 'intro') {
          await speakIntroAndScenario();
        }
        return;
      }

      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcriptChunk = Array.from(event.results)
          .map((result) => result[0]?.transcript || '')
          .join(' ')
          .trim();

        if (transcriptChunk) {
          console.debug('[VoiceCoachOrbScreen] Recognized speech chunk:', transcriptChunk);
          handleUserMessage(transcriptChunk);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          console.log('⚠️ [VoiceCoachOrbScreen] No speech detected, continuing to listen...');
          setUserPrompt('Still listening... speak when you’re ready.');
          return;
        }
        if (event.error === 'not-allowed') {
          console.error('[VoiceCoachOrbScreen] Microphone permission denied.');
          setError('Microphone access is blocked. Please allow access in your browser settings.');
          return;
        }
        console.error('Speech recognition error:', event.error);
        setError('Listening error. We will keep trying...');
      };

      recognition.onend = () => {
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

      if (shouldStartWithIntro || currentPhaseRef.current === 'intro') {
        await speakIntroAndScenario();
      } else {
        shouldIgnoreInputRef.current = false;
        setIsListening(true);
        try {
          recognition.start();
          isListeningRef.current = true;
        } catch (startError) {
          console.warn('[VoiceCoachOrbScreen] Unable to start recognition:', startError);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      cancelledRef.current = true;
      cleanup();
    };
  }, [cleanup, handleUserMessage, phaseRestored, resumeListeningAfterDelay, scenario, speakIntroAndScenario]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const savedPhase = await localforage.getItem('voiceCoach:lastPhase');
        if (!cancelled && typeof savedPhase === 'string') {
          console.debug('[VoiceCoachOrbScreen] Restoring persisted phase:', savedPhase);
          currentPhaseRef.current = savedPhase;
          setCurrentPhase(savedPhase);

          if (savedPhase !== 'intro' && transcript.length === 0) {
            const fallbackLine = scenario?.contextLine || scenario?.description || scenario?.prompt;
            if (fallbackLine) {
              appendTranscript(fallbackLine);
            }
          }
        }
      } catch (storageError) {
        console.warn('[VoiceCoachOrbScreen] Unable to restore last phase:', storageError);
      } finally {
        if (!cancelled) {
          setPhaseRestored(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appendTranscript, scenario, transcript.length]);

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

        <div className="space-y-3 max-w-2xl w-full">
          <p className="text-lg font-medium text-cyan-100 drop-shadow-sm">{statusText}</p>
          {userPrompt && !error && (
            <p className="text-sm text-cyan-100/80">{userPrompt}</p>
          )}
          {error && (
            <p className="text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 inline-block">
              {error}
            </p>
          )}
        </div>

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
      </div>
    </div>
  );
};

export default VoiceCoachOrbScreen;
