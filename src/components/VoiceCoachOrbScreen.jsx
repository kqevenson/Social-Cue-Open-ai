import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import localforage from 'localforage';
import useVoiceConversation from '../hooks/useVoiceConversation';
import { playVoiceResponseWithOpenAI, stopOpenAITTSPlayback } from '../services/openAITTSService';
import { setHandlers, startRecognition, stopRecognition } from '../services/speechRecognitionService';
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
  const [transcript, setTranscript] = useState('');
  const [aiLine, setAiLine] = useState('');
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

  // Update AI line from messages and manage transcript display
  useEffect(() => {
    const aiMessages = messages.filter(m => m.role === 'ai');
    if (aiMessages.length > 0) {
      const latestAI = aiMessages[aiMessages.length - 1];
      if (isSpeaking) {
        // When AI is speaking, show AI line and clear transcript
        setAiLine(latestAI.text || '');
        setTranscript('');
      } else {
        // When AI finishes, keep showing AI line until learner speaks
        setAiLine(latestAI.text || '');
      }
    }
  }, [messages, isSpeaking]);

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
    stopRecognition();
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

  // Initialize speech recognition handlers
  useEffect(() => {
    if (!scenario) {
      setError(MISSING_SCENARIO_MESSAGE);
      return;
    }

    setHandlers({
      onInterim: (interim) => {
        setAiLine('');
        setTranscript(interim);
      },
      onFinal: async (finalText) => {
        stopRecognition();
        setTranscript(finalText);
        await sendUserMessage(finalText);
      },
      onError: () => {},
      onEnd: () => {
        if (!isSpeaking) startRecognition();
      }
    });

    setRecognitionReady(true);
  }, [scenario, sendUserMessage, isSpeaking]);

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

  // Auto-start conversation when component mounts with scenario
  useEffect(() => {
    if (!scenario) return;
    if (!recognitionReady) return;

    // Start conversation automatically
    startConversation();
  }, [scenario, recognitionReady, startConversation]);

  // After AI finishes speaking, restart recognition
  useEffect(() => {
    if (!isSpeaking && recognitionReady) {
      setIsListening(true);
      startRecognition();
    }
  }, [isSpeaking, recognitionReady]);

  const statusText = useMemo(() => {
    if (isSpeaking) return '🔊 Speaking...';
    if (isListening) return '💡 Listening... speak naturally!';
    if (isLoading) return '🤖 Thinking...';
    return 'Ready when you are';
  }, [isListening, isLoading, isSpeaking]);


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
        <div className="orb-container mb-12">
          <div className={`orb ${isSpeaking ? 'orb--speaking' : isListening ? 'orb--listening' : 'orb--idle'}`} />
          <div className={`orb-glow ${isSpeaking ? 'glow--speaking' : isListening ? 'glow--listening' : ''}`} />
        </div>

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

        <div className="w-full max-w-3xl px-8 text-left">
          {aiLine && (
            <p className="text-white/80 text-lg mb-4">{aiLine}</p>
          )}
          {transcript && (
            <p className="text-white/90 text-lg whitespace-pre-wrap">{transcript}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceCoachOrbScreen;
