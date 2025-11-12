import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import useVoiceConversation from '../hooks/useVoiceConversation';
import { UserProfile } from '../utils/userProfile';
import contentService from '../services/contentService';
import { playVoiceResponseWithOpenAI } from '../services/openAITTSService';
import { getVoiceIntro } from '../content/training/introduction-scripts';

const ChatGPTVoiceChat = ({ scenario, onClose }) => {
  const gradeLevel = UserProfile.getGrade() || '6';
  const [userInput, setUserInput] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [introMessage, setIntroMessage] = useState(null);
  const [introSpoken, setIntroSpoken] = useState(false);
  const [speakingIntro, setSpeakingIntro] = useState(false);

  const normalizedScenario = useMemo(() => {
    if (!scenario) {
      return {
        title: 'Voice Practice',
        category: 'conversation-starters',
        description: 'Practice real conversations with your AI coach.'
      };
    }
    return scenario;
  }, [scenario]);

  const voiceConversation = useVoiceConversation({
    scenario: normalizedScenario,
    gradeLevel,
    onComplete: () => {
      console.log('✅ Session saved!');
    }
  });

  const {
    messages,
    isAIThinking,
    startConversation,
    sendUserMessage,
    endConversation,
    error,
    currentPhase
  } = voiceConversation || {};

  const buildIntroLine = useCallback(() => {
    if (typeof contentService?.getPhaseInstructions === 'function') {
      const phaseInfo = contentService.getPhaseInstructions('intro', normalizedScenario, gradeLevel);
      if (phaseInfo?.introLine) {
        return phaseInfo.introLine.trim();
      }
    }

    try {
      const topicDescriptor =
        normalizedScenario?.topic ||
        normalizedScenario?.topicTitle ||
        normalizedScenario?.topicId ||
        normalizedScenario?.title ||
        '';
      const introData = getVoiceIntro(gradeLevel, topicDescriptor, normalizedScenario);
      return `${introData.greetingIntro} ${introData.scenarioIntro} ${introData.safetyAndConsent}`
        .replace(/\s+/g, ' ')
        .trim();
    } catch (fallbackError) {
      console.warn('Falling back to default intro line', fallbackError);
      return "Hi! I'm Cue. Ready to warm up before practice?";
    }
  }, [gradeLevel, normalizedScenario]);

  const displayedMessages = useMemo(() => {
    if (!introMessage) return messages;

    const filtered = messages.filter((msg, index) => {
      if (index === 0 && msg.role === 'ai') {
        return msg.text?.trim() !== introMessage.text?.trim();
      }
      return true;
    });

    return introMessage ? [introMessage, ...filtered] : filtered;
  }, [introMessage, messages]);

  useEffect(() => {
    if (hasStarted || introSpoken || speakingIntro || !voiceConversation) {
      return;
    }

    let cancelled = false;

    const runIntro = async () => {
      try {
        setSpeakingIntro(true);

        const introLineScript = buildIntroLine();
        const introPayload = {
          id: `intro_${Date.now()}`,
          role: 'ai',
          text: introLineScript,
          phase: 'intro',
          timestamp: Date.now()
        };

        setIntroMessage(introPayload);

        if (introLineScript) {
          await playVoiceResponseWithOpenAI(introLineScript, { voice: 'shimmer' });
        }

        if (cancelled) return;

        await startConversation();
        setIntroSpoken(true);
        setHasStarted(true);
      } catch (introErr) {
        console.error('Failed to handle intro phase', introErr);
        setIntroSpoken(true);
        setHasStarted(true);
      } finally {
        if (!cancelled) {
          setSpeakingIntro(false);
        }
      }
    };

    runIntro();

    return () => {
      cancelled = true;
    };
  }, [buildIntroLine, gradeLevel, hasStarted, introSpoken, normalizedScenario, speakingIntro, startConversation, voiceConversation]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;
    await sendUserMessage(userInput.trim());
    setUserInput('');
  };

  const handleExit = async () => {
    try {
      await endConversation();
    } catch (err) {
      console.error('Error ending conversation', err);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 text-white p-6">
      <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 text-sm text-purple-200 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Practice
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <h2 className="text-lg font-semibold">{normalizedScenario.title}</h2>
              <p className="text-xs text-purple-200">
                Grade {gradeLevel} • {normalizedScenario.category?.replace('-', ' ')}
              </p>
            </div>
          </div>
          <div className="text-xs text-purple-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {currentPhase === 'intro' && 'Getting started'}
            {currentPhase === 'practice' && 'In practice mode'}
            {currentPhase === 'feedback' && 'Giving feedback'}
            {currentPhase === 'complete' && 'Session complete'}
          </div>
        </div>

        {/* Conversation */}
        <div className="h-[28rem] overflow-y-auto px-6 py-6 space-y-4">
          {displayedMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-purple-200/70">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">Getting things ready...</p>
              <p className="text-sm">Your AI coach is preparing the session.</p>
            </div>
          ) : (
            displayedMessages.map((message) => (
              <div
                key={message.id}
                className={`max-w-3xl rounded-2xl px-5 py-4 border bg-white/5 ${
                  message.role === 'user'
                    ? 'ml-auto border-purple-500/40 text-purple-50'
                    : 'border-white/10 text-white/90'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wide text-purple-200/70">
                  <span>{message.role === 'user' ? 'You' : 'Coach'}</span>
                  <span>•</span>
                  <span>{new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
            ))
          )}

          {isAIThinking && (
            <div className="flex items-center gap-2 text-sm text-purple-200/80">
              <Loader2 className="w-4 h-4 animate-spin" />
              Coach is thinking...
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-400/40 text-red-100 text-sm px-4 py-2 rounded-2xl">
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-white/10 px-6 py-4 bg-black/30 flex items-center gap-3">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Speak or type your response..."
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 transition px-5 py-3 rounded-xl font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatGPTVoiceChat;
