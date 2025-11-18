import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import localforage from 'localforage';
import useVoiceConversation from '../hooks/useVoiceConversation';
import { playVoiceResponseWithOpenAI, stopOpenAITTSPlayback, unlockAudio } from '../services/openAITTSService';
import StorageService from '../services/storageService';

const MAX_STORED_LINES = 40;
const PHASE_STORAGE_KEY = 'voiceCoach:lastPhase';

const MISSING_SCENARIO_MESSAGE = 'We could not load this scenario. Please go back and choose another practice activity.';

const VoiceCoachOrbScreen = ({
  scenario,
  gradeLevel = '6',
  learnerName: initialLearnerName = '',
  autoStart = false,
  onEndSession
}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [phaseRestored, setPhaseRestored] = useState(false);
  const [userPrompt, setUserPrompt] = useState('Ready when you are');
  const [sessionPrimed, setSessionPrimed] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);

  const resolvedGradeLevel = scenario?.gradeLevel || gradeLevel || '6';

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const cancelledRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const shouldIgnoreInputRef = useRef(true);
  const listeningTimeoutRef = useRef(null);

  const storedUser = StorageService.getUserData();
  const learnerName = storedUser?.userName || storedUser?.username || storedUser?.name || "";

  // Use the conversation hook - it handles ALL intro/scenario/teaching logic
  const conversation = useVoiceConversation({
    scenario,
    autoStart: autoStart && sessionPrimed,
    learnerName,
    onPhaseChange: (newPhase, oldPhase) => {
      console.log('[VoiceCoachOrbScreen] Phase changed:', { oldPhase, newPhase });
    },
    onError: (err) => {
      console.error('[VoiceCoachOrbScreen] Conversation error:', err);
      setError('Sorry, something went wrong. Please try again.');
    }
  });

  const { messages, phase, isSpeaking, isLoading, sendUserMessage, startConversation } = conversation;

  // Update transcript from messages
  useEffect(() => {
    const newTranscript = messages.map(m => m.text).filter(Boolean);
    setTranscript(newTranscript.slice(-MAX_STORED_LINES));
  }, [messages]);

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

  const handleSessionEnd = useCallback(
    (details) => {
      cancelledRef.current = true;
      cleanup();
      onEndSession?.({
        ...details,
        messages
      });
    },
    [cleanup, onEndSession, messages]
  );

  // Handle user messages from speech recognition
  const handleUserMessage = useCallback(
    async (rawText) => {
      const text = (rawText || '').trim();
      if (!text) return;

      if (shouldIgnoreInputRef.current || isSpeaking) {
        console.debug('[VoiceCoachOrbScreen] Ignoring speech during suppression window:', text);
        return;
      }

      stopListening();
      appendTranscript(text);

      try {
        // Use the hook's sendUserMessage - it handles all conversation logic
        await sendUserMessage(text);
      } catch (conversationError) {
        console.error('Voice conversation error:', conversationError);
        setError('Sorry, something went wrong. Please try again.');
      } finally {
        if (!cancelledRef.current && !isSpeaking) {
          resumeListeningAfterDelay(900);
        }
      }
    },
    [appendTranscript, sendUserMessage, stopListening, resumeListeningAfterDelay, isSpeaking]
  );

  // Initialize speech recognition and start conversation when ready
  useEffect(() => {
    if (!scenario) {
      setError(MISSING_SCENARIO_MESSAGE);
      return;
    }

    if (!phaseRestored || !sessionPrimed) {
      return;
    }

    setError((prev) => (prev === MISSING_SCENARIO_MESSAGE ? null : prev));

    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;

      if (hasInitializedRef.current) {
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
        return;
      }

      hasInitializedRef.current = true;

      if (!('webkitSpeechRecognition' in window)) {
        console.warn('[VoiceCoachOrbScreen] Speech recognition is not supported in this browser.');
        // Start conversation even without speech recognition
        if (autoStart && sessionPrimed) {
          startConversation();
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
          setUserPrompt("Still listening... speak when you're ready.");
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

      // Start conversation when ready
      if (autoStart && sessionPrimed) {
        startConversation();
      }

      // Start listening after a brief delay
      setTimeout(() => {
        if (!cancelledRef.current && !isSpeaking) {
          shouldIgnoreInputRef.current = false;
          setIsListening(true);
          try {
            recognition.start();
            isListeningRef.current = true;
          } catch (startError) {
            console.warn('[VoiceCoachOrbScreen] Unable to start recognition:', startError);
          }
        }
      }, 1000);
    };

    initialize();

    return () => {
      mounted = false;
      cancelledRef.current = true;
      cleanup();
    };
  }, [cleanup, handleUserMessage, phaseRestored, scenario, sessionPrimed, autoStart, startConversation, isSpeaking]);

  // Restore persisted phase
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const savedPhase = await localforage.getItem('voiceCoach:lastPhase');
        if (!cancelled && typeof savedPhase === 'string') {
          console.debug('[VoiceCoachOrbScreen] Restoring persisted phase:', savedPhase);
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
  }, []);

  const statusText = useMemo(() => {
    if (!sessionPrimed) return 'Tap start to unlock audio and begin.';
    if (isSpeaking) return '🔊 Speaking...';
    if (isListening) return '💡 Listening... speak naturally!';
    if (isLoading) return '🤖 Thinking...';
    return 'Ready when you are';
  }, [isListening, isLoading, isSpeaking, sessionPrimed]);

  const handleStartPractice = useCallback(async () => {
    if (isAudioUnlocked) {
      setShowStartButton(false);
      setSessionPrimed(true);
      setError(null);
      // Start conversation immediately when primed
      if (autoStart) {
        startConversation();
      }
      return;
    }

    try {
      await unlockAudio();
      setIsAudioUnlocked(true);
      setShowStartButton(false);
      setSessionPrimed(true);
      setError(null);
      // Start conversation immediately when primed
      if (autoStart) {
        startConversation();
      }
    } catch (unlockError) {
      console.error('Failed to unlock audio context:', unlockError);
      const message = unlockError?.message || unlockError?.toString() || '';
      if (message.includes('NotSupportedError')) {
        setError('Audio playback is blocked. Try tapping again or switch browsers.');
      } else {
        setError('Tap the start button so we can enable audio.');
      }
    }
  }, [isAudioUnlocked, autoStart, startConversation]);

  // Handle phase completion
  useEffect(() => {
    if (phase === 'complete' || phase === 'COMPLETE') {
      handleSessionEnd({ phase: 'complete' });
    }
  }, [phase, handleSessionEnd]);

  return (
    <div className="relative min-h-screen w-full bg-[#020412] text-white flex items-center justify-center overflow-hidden">
      {showStartButton && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <button
            type="button"
            onClick={handleStartPractice}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:scale-[1.02] transition-transform"
          >
            🎤 Start Practice
          </button>
        </div>
      )}
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
