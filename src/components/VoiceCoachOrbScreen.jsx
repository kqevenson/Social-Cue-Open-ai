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

  const resumeListeningAfterDelay = useCallback((delay = 2000) => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }
    listeningTimeoutRef.current = setTimeout(() => {
      if (!cancelledRef.current && recognitionRef.current) {
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

      console.log("🔥 USER MESSAGE RECEIVED:", text);
      if (isSpeaking) {
        console.debug("AI still speaking, ignoring transcript:", text);
        return;
      }

      stopListening();
      appendTranscript(text);

      // Silence-capture delay before sending user message
      await new Promise(r => setTimeout(r, 1200));

      try {
        // Use the hook's sendUserMessage - it handles all conversation logic
        console.log("➡️ Sending to AI:", text);
        await sendUserMessage(text);
      } catch (conversationError) {
        console.error('Voice conversation error:', conversationError);
        setError('Sorry, something went wrong. Please try again.');
      } finally {
        if (!cancelledRef.current && !isSpeaking) {
          resumeListeningAfterDelay(2000); // 2 seconds minimum
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
        // Silence-capture delay before sending user message
        await new Promise(r => setTimeout(r, 1200));
        if (!isSpeaking && !isLoading) {
          console.log("➡️ Sending to AI:", finalText);
          await sendUserMessage(finalText);
        }
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
        <div className="relative flex items-center justify-center mb-12">
          <div
            className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
              isSpeaking
                ? "bg-emerald-400/40 scale-150"
                : isListening
                ? "bg-blue-400/40 scale-125 animate-pulse-slow"
                : "bg-gray-400/20 scale-100"
            }`}
          />
          <div
            className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-500 ${
              isSpeaking
                ? "bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 border-emerald-400/50 scale-105"
                : isListening
                ? "bg-gradient-to-br from-blue-400/30 to-blue-600/30 border-blue-400/50"
                : "bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-400/30"
            } border-2 backdrop-blur-xl`}
          >
            <div
              className={`smiley-bounce transition-all duration-500 ${
                isSpeaking ? "scale-110" : "scale-100"
              }`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "30px"
              }}
            >
              <div className="eyes-blink flex" style={{ gap: "48px" }}>
                <div
                  className="eye-left rounded-full"
                  style={{
                    width: "21px",
                    height: "21px",
                    background: "#4A90E2",
                    boxShadow: "0 0 20px rgba(74,144,226,0.8)"
                  }}
                />
                <div
                  className="eye-right rounded-full"
                  style={{
                    width: "21px",
                    height: "21px",
                    background: "#4A90E2",
                    boxShadow: "0 0 20px rgba(74,144,226,0.8)"
                  }}
                />
              </div>

              <div
                style={{
                  width: "105px",
                  height: "66px",
                  borderLeft: "15px solid #34D399",
                  borderRight: "15px solid #34D399",
                  borderBottom: "15px solid #34D399",
                  borderRadius: "0 0 52px 52px",
                  filter: "drop-shadow(0 0 25px rgba(52,211,153,0.6))"
                }}
              />
            </div>
          </div>
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

      <style>{`
@keyframes pulse-slow {
  0%,100% { opacity:1; }
  50% { opacity:.7; }
}
.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

@keyframes smileyBounce {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
.smiley-bounce {
  animation: smileyBounce 2.5s ease-in-out infinite;
}

@keyframes eyesBlink {
  0%,90%,100% { transform: scaleY(1); }
  93% { transform: scaleY(.2); }
  94%,96% { transform: scaleY(0); }
  97% { transform: scaleY(.2); }
}
.eyes-blink {
  animation: eyesBlink 3.5s ease-in-out infinite;
  animation-delay: .5s;
}

@keyframes leftEyeWink {
  0%,90%,100% { transform: scaleY(1); }
  94%,96% { transform: scaleY(0); }
}
.eye-left {
  animation: leftEyeWink 7s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes rightEyeWink {
  0%,90%,100% { transform: scaleY(1); }
  94%,96% { transform: scaleY(0); }
}
.eye-right {
  animation: rightEyeWink 8s ease-in-out infinite;
  animation-delay: 5s;
}

.smiley-bounce,
.smiley-bounce *,
.eyes-blink,
.eye-left,
.eye-right {
  transition: none !important;
}
      `}</style>
    </div>
  );
};

export default VoiceCoachOrbScreen;
