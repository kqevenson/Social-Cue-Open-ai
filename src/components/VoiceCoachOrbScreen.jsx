import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import localforage from 'localforage';
import useVoiceConversation from '../hooks/useVoiceConversation';
import { playVoiceResponseWithOpenAI, stopOpenAITTSPlayback } from '../services/openAITTSService';
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
  const [recognitionReady, setRecognitionReady] = useState(false);

  const resolvedGradeLevel = scenario?.gradeLevel || gradeLevel || '6';

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const cancelledRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const shouldIgnoreInputRef = useRef(false);
  const listeningTimeoutRef = useRef(null);

  const storedUser = StorageService.getUserData();
  const learnerName = storedUser?.userName || storedUser?.username || storedUser?.name || "";

  // Use the conversation hook - it handles ALL intro/scenario/teaching logic
  const conversation = useVoiceConversation({
    scenario,
    autoStart: true, // Always auto-start when mounted
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
      console.debug('[VoiceCoach] startListening called');
      recognitionRef.current.start();
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.warn('[VoiceCoach] startListening failed:', err);
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
    shouldIgnoreInputRef.current = false;
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
          resumeListeningAfterDelay(1500);
        }
      }
    },
    [appendTranscript, sendUserMessage, stopListening, resumeListeningAfterDelay, isSpeaking]
  );

  // Initialize speech recognition synchronously
  useEffect(() => {
    if (!scenario) {
      setError(MISSING_SCENARIO_MESSAGE);
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      console.warn('[VoiceCoachOrbScreen] Speech recognition is not supported.');
      return;
    }

    // Synchronous creation (Safari-friendly)
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];

      if (result.isFinal) {
        const text = result[0].transcript.trim();
        if (text) {
          console.debug('[VoiceCoach] Final speech:', text);
          handleUserMessage(text);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access is blocked.');
        return;
      }
      console.error('Speech error:', event.error);
    };

    recognition.onend = () => {
      console.debug('[VoiceCoach] onend fired');

      if (!cancelledRef.current && isListeningRef.current && !isSpeaking) {
        setTimeout(() => {
          try {
            console.debug('[VoiceCoach] Restarting speech recognition...');
            recognition.start();
          } catch (e) {
            console.warn('[VoiceCoach] Could not restart recognition:', e);
          }
        }, 250); // delay fixes Safari abort bug
      }
    };

    recognitionRef.current = recognition;
    setRecognitionReady(true);

    // Auto-start mic when component mounts (audio already unlocked by PracticeStartScreen)
    try {
      shouldIgnoreInputRef.current = false;
      recognition.start();
      isListeningRef.current = true;
      setIsListening(true);
    } catch (err) {
      console.warn('[VoiceCoachOrbScreen] Failed to start mic on mount:', err);
    }
  }, [scenario, handleUserMessage]);

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

  const handleStartPractice = useCallback(async () => {
    try {
      // ⚠️ CRITICAL: unlockAudio() creates AudioContext - must be called on user gesture
      await unlockAudio();
      console.log('✅ Audio unlocked, starting practice session');
      
      setIsAudioUnlocked(true);
      setSessionPrimed(true);
      
      // Start mic after audio is unlocked
      try {
        shouldIgnoreInputRef.current = false;
        if (recognitionRef.current) {
          recognitionRef.current.start();
          isListeningRef.current = true;
          setIsListening(true);
        }
      } catch (err) {
        console.warn("Failed to start mic after unlock:", err);
      }
      
      // Start conversation
      startConversation();
    } catch (error) {
      console.error('Failed to unlock audio:', error);
      setError('Failed to start practice. Please try again.');
    }
  }, [startConversation]);

  const statusText = useMemo(() => {
    if (!sessionPrimed) return 'Tap "Start Practice" to begin.';
    if (isSpeaking) return '🔊 Speaking...';
    if (isListening) return '💡 Listening... speak naturally!';
    if (isLoading) return '🤖 Thinking...';
    return 'Ready when you are';
  }, [isListening, isLoading, isSpeaking, sessionPrimed]);


  // Handle phase completion
  useEffect(() => {
    if (phase === 'complete' || phase === 'COMPLETE') {
      handleSessionEnd({ phase: 'complete' });
    }
  }, [phase, handleSessionEnd]);

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
          {!sessionPrimed && !error && (
            <button
              onClick={handleStartPractice}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              🎤 Start Practice
            </button>
          )}
          {userPrompt && !error && sessionPrimed && (
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
