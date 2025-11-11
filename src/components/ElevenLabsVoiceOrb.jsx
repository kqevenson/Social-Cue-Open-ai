import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Volume2, Mic, Loader } from 'lucide-react';
import CleanVoiceService from '../services/CleanVoiceService';
import { textToSpeechElevenLabs } from '../services/elevenLabsService';
import { getVoiceIntro } from '../content/training/introduction-scripts';

const ElevenLabsVoiceOrb = ({
  scenario,
  gradeLevel = '6-8',
  timingConfig,
  onClose
}) => {
  const gradeString = (() => {
    if (gradeLevel == null) return '6';
    const str = String(gradeLevel).trim();
    if (str.includes('-')) {
      const [start] = str.split('-');
      return start.trim() || '6';
    }
    return str || '6';
  })();

  console.log('🎓 Grade level converted in ElevenLabsVoiceOrb:', {
    received: gradeLevel,
    type: typeof gradeLevel,
    converted: gradeString
  });

  // State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiText, setAiText] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [introExchangeCount, setIntroExchangeCount] = useState(0);
  const [isInCharacterMode, setIsInCharacterMode] = useState(false);
  const [characterRole, setCharacterRole] = useState(null);
  const [characterExchangeCount, setCharacterExchangeCount] = useState(0);
  const [introStage, setIntroStage] = useState('greeting');
  const [awaitingName, setAwaitingName] = useState(false);
  const [learnerName, setLearnerName] = useState(null);

  // Refs
  const recognitionRef = useRef(null);
  const hasSpokenIntroRef = useRef(false);
  const currentAudioRef = useRef(null);
  const recognitionActiveRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const silenceTimerRef = useRef(null);
  const currentPhaseRef = useRef('intro');
  const introStageRef = useRef('greeting');

  const topicDescriptor = useMemo(() => scenario?.topic || scenario?.topicTitle || scenario?.topicId || scenario?.title || '', [scenario]);
  const introConfig = useMemo(
    () => getVoiceIntro(gradeString, topicDescriptor, scenario),
    [gradeString, topicDescriptor, scenario]
  );
  const introSections = introConfig.sections || {};
  const scenarioIntroLine = introConfig.scenarioIntro;
  const scenarioPracticePrompt = introConfig.firstPrompt?.trim();
  const microCoachTips = useMemo(() => ([
    "Sometimes just saying 'Hey, can I join?' is all it takes!",
    "If you're nervous, ask a question — people love talking about themselves.",
    'Eye contact and a smile go a long way!',
    'Remember, everyone feels awkward sometimes — you’re not alone.',
    'You can always start with a compliment or a genuine observation.'
  ]), []);

  async function speakIntro() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 GENERATING DYNAMIC INTRO');
    console.log('Scenario:', scenario?.title);
    console.log('Grade:', gradeString);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    setIsThinking(true);
    try {
      const aiData = await CleanVoiceService.generateResponse({
        conversationHistory: [],
        scenario,
        gradeLevel: gradeString,
        phase: 'intro',
        toneHint: 'friendly'
      });

      const introMessage = aiData?.aiResponse?.trim() || `Let's practice ${scenario?.title || 'conversation skills'}. Ready?`;

      console.log('✅ GPT-generated intro:', introMessage);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      setMessages([{ role: 'assistant', content: introMessage }]);
      setCurrentPhase('intro');
      setIntroExchangeCount(0);

      await speakWithElevenLabs(introMessage);
      runIntroStage();
    } catch (error) {
      console.error('GPT intro generation failed:', error);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      const fallback = `Let's practice ${scenario?.title || 'conversation skills'}. Ready?`;
      setMessages([{ role: 'assistant', content: fallback }]);
      await speakWithElevenLabs(fallback);
      runIntroStage();
    } finally {
      setIsThinking(false);
    }
  }

  // Initialize once on mount
  useEffect(() => {
    initializeSpeechRecognition();

    const timing = timingConfig || {};
    const introDelay = typeof timing.introDelay === 'number'
      ? timing.introDelay
      : typeof timing.afterResponse === 'number'
      ? Math.max(timing.afterResponse, 500)
      : 2000;
    const introTimeout = setTimeout(() => {
      if (!hasSpokenIntroRef.current) {
        speakIntro();
        hasSpokenIntroRef.current = true;
      }
    }, introDelay);

    return () => {
      clearTimeout(introTimeout);
      cleanup();
    };
  }, [gradeString, timingConfig, scenario?.id]);

  useEffect(() => {
    currentPhaseRef.current = currentPhase;
  }, [currentPhase]);

  useEffect(() => {
    introStageRef.current = introStage;
  }, [introStage]);

  function cleanup() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  }

  function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🎤 Mic started - listening...');
      recognitionActiveRef.current = true;
      setIsListening(true);
      finalTranscriptRef.current = '';
    };

    recognition.onresult = (event) => {
      console.log('🎤 Got speech result');
      
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptPiece + ' ';
          console.log('✅ Final transcript so far:', finalTranscriptRef.current);
        } else {
          interimTranscript += transcriptPiece;
          console.log('⏳ Interim:', interimTranscript);
        }
      }
      
      // Show live transcript
      const displayText = finalTranscriptRef.current + interimTranscript;
      setTranscript(displayText.trim());
      
      // Reset silence timer on each result
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      // Stop after 3 seconds of silence
      silenceTimerRef.current = setTimeout(() => {
        console.log('⏱️ 3 seconds of silence detected - stopping');
        if (recognitionRef.current && recognitionActiveRef.current) {
          recognitionRef.current.stop();
        }
      }, 3000);
    };

    recognition.onerror = (event) => {
      console.error('❌ Recognition error:', event.error);
      
      // Don't stop on "no-speech" error
      if (event.error === 'no-speech') {
        console.log('ℹ️ No speech detected, but keeping mic open');
        return;
      }
      
      recognitionActiveRef.current = false;
      setIsListening(false);
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    recognition.onend = () => {
      console.log('🛑 Recognition ended');
      recognitionActiveRef.current = false;
      setIsListening(false);
      
      // Clear silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      // Send the final transcript
      const finalText = finalTranscriptRef.current.trim();
      if (finalText) {
        console.log('📤 Sending transcript:', finalText);
        handleUserMessage(finalText);
      }
      
      finalTranscriptRef.current = '';
      setTranscript('');
    };

    recognitionRef.current = recognition;
  }

  function startListening() {
    if (!recognitionRef.current || recognitionActiveRef.current || isSpeaking || isThinking) {
      console.log('❌ Cannot start - already active or busy');
      return;
    }

    finalTranscriptRef.current = '';
    setTranscript('');

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log('✅ Mic permission granted');
        try {
          recognitionRef.current.start();
          console.log('🎤 Started listening - speak now!');
        } catch (err) {
          console.error('❌ Mic start error:', err);
          recognitionActiveRef.current = false;
          setIsListening(false);
        }
      })
      .catch((err) => {
        console.error('❌ Mic permission denied:', err);
      });
  }

  function stopListening() {
    if (recognitionRef.current && recognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping:', e);
      }
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }

  async function speakWithElevenLabs(text, options = {}) {
    const { autoResumeListening = false } = options;
    const safeText = text.replace(/\s+/g, ' ').trim();
    if (!safeText) return;

    try {
      stopListening();
      setIsSpeaking(true);
      setAiText(safeText);

      console.log('🔊 Speaking:', safeText);
      const audioUrl = await textToSpeechElevenLabs(safeText, gradeString);
      
      if (!audioUrl) {
        setIsSpeaking(false);
        return;
      }

      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      await new Promise((resolve, reject) => {
        audio.onended = () => {
          console.log('✅ Finished speaking');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;

          setTimeout(() => {
            if (autoResumeListening && currentPhaseRef.current !== 'complete') {
              startListening();
            }
          }, 500);

          resolve();
        };

        audio.onerror = (event) => {
          console.error('❌ Audio playback error:', event);
          setIsSpeaking(false);
          reject(event);
        };

        audio.play().catch((err) => {
          console.error('❌ Playback start error:', err);
          setIsSpeaking(false);
          reject(err);
        });
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  }

  function extractNameFromInput(input) {
    const lowered = input.trim();
    if (!lowered) return null;

    const namePatterns = [
      /(?:my name is|i am|i'm|call me)\s+([A-Za-z]+)/i,
      /this is\s+([A-Za-z]+)/i
    ];

    for (const pattern of namePatterns) {
      const match = lowered.match(pattern);
      if (match && match[1]) {
        const candidate = match[1].replace(/[^A-Za-z]/g, '');
        if (candidate) {
          return candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
        }
      }
    }

    const singleWord = lowered.split(/\s+/).find(word => /^[A-Za-z]+$/.test(word));
    if (singleWord) {
      return singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase();
    }
    return null;
  }

  async function runIntroStage() {
    if (isSpeaking || isThinking || introStageRef.current === 'awaiting-name') return;

    switch (introStageRef.current) {
      case 'greeting': {
        // Intro already spoken by speakIntro
        break;
      }
      case 'ask-name': {
        const prompt = "Before we get started, what should I call you?";
        setMessages(prev => [...prev, { role: 'assistant', content: prompt }]);
        await speakWithElevenLabs(prompt);
        setAwaitingName(true);
        startListening();
        setIntroStage('awaiting-name');
        break;
      }
      case 'awaiting-name': {
        // Waiting for learner response
        break;
      }
      case 'ack-name': {
        const nameToUse = learnerName || 'friend';
        const acknowledgement = `Hi ${nameToUse}! I'm really glad you're here. Today we'll practice ${scenario?.topicTitle || scenario?.title || 'a new skill'}.`;
        setMessages(prev => [...prev, { role: 'assistant', content: acknowledgement }]);
        await speakWithElevenLabs(acknowledgement);
        setIntroStage('scenario-intro');
        break;
      }
      case 'scenario-intro': {
        const scenarioLine = scenarioIntroLine
          ? scenarioIntroLine
          : scenario?.prompt
          ? `Today we're practicing: ${scenario.prompt}`
          : `Today we're practicing ${scenario?.title || 'a new skill'}.`;
        setMessages(prev => [...prev, { role: 'assistant', content: scenarioLine }]);
        await speakWithElevenLabs(scenarioLine);

        const randomTip = microCoachTips[Math.floor(Math.random() * microCoachTips.length)];
        const practicePrompt = scenarioPracticePrompt
          || `When you're ready, try it out with me. Tip: ${randomTip}`;
        setMessages(prev => [...prev, { role: 'assistant', content: practicePrompt }]);
        await speakWithElevenLabs(practicePrompt, { autoResumeListening: true });

        setIntroStage('intro-complete');
        setCurrentPhase('intro');
        setIntroExchangeCount(0);
        break;
      }
      default:
        break;
    }
  }

  async function handleUserMessage(text) {
    if (!text?.trim() || isThinking || isSpeaking) return;

    console.log('\n═══════════════════════════════════════');
    console.log('📥 USER MESSAGE:', text);
    console.log('📍 Current phase:', currentPhase);
    console.log('📊 Intro exchanges:', introExchangeCount);
    console.log('💬 Total messages:', messages.length);
    console.log('═══════════════════════════════════════\n');

    if (awaitingName) {
      setMessages(prev => [...prev, { role: 'user', content: text.trim() }]);
      setAwaitingName(false);
      const extractedName = extractNameFromInput(text);
      setLearnerName(extractedName || null);
      setIntroStage('ack-name');
      return;
    }

    if (introStageRef.current !== 'intro-complete') {
      setMessages(prev => [...prev, { role: 'user', content: text.trim() }]);
      console.log('ℹ️ Intro still in progress; ignoring AI call.');
      return;
    }

    setIsThinking(true);

    try {
      const userMessage = { role: 'user', content: text.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      let phaseToUse = currentPhase;
      let characterModeActive = isInCharacterMode;
      let role = characterRole;

      if (currentPhase === 'intro') {
        const newIntroCount = introExchangeCount + 1;
        setIntroExchangeCount(newIntroCount);

        console.log('📊 Intro exchange:', newIntroCount, 'of 2');

        if (newIntroCount >= 2) {
          console.log('🚀 TRANSITIONING: intro → practice');

          phaseToUse = 'practice';
          role = scenario?.aiRole || 'friend';
          characterModeActive = true;

          setCurrentPhase('practice');
          setIsInCharacterMode(true);
          setCharacterRole(role);
          setCharacterExchangeCount(0);
        }
      }

      if (phaseToUse === 'practice' && characterModeActive) {
        setCharacterExchangeCount(prev => prev + 1);
      }

      const toneHint = await CleanVoiceService.analyzeTone(text);

      const aiData = await CleanVoiceService.generateResponse({
        conversationHistory: updatedMessages,
        scenario,
        gradeLevel: gradeString,
        phase: phaseToUse,
        toneHint
      });

      const textToSpeak = aiData?.aiResponse || '';

      if (!textToSpeak) {
        console.error('❌ No AI response');
        setIsThinking(false);
        return;
      }

      console.log('💬 AI response:', textToSpeak);

      setMessages(prev => [...prev, { role: 'assistant', content: textToSpeak }]);
      
      if (aiData.phase && aiData.phase !== phaseToUse) {
        setCurrentPhase(aiData.phase);

        if (aiData.phase === 'feedback' || aiData.phase === 'complete') {
          setIsInCharacterMode(false);
          setCharacterRole(null);
        }
      }

      setTranscript('');
      setIsThinking(false);

      await speakWithElevenLabs(textToSpeak, { autoResumeListening: true });

      if (aiData.phase === 'complete' || aiData.shouldContinue === false) {
        setTimeout(() => stopListening(), 2000);
      }

    } catch (error) {
      console.error('❌ Conversation error:', error);
      setIsThinking(false);
      
      const fallback = "I'm having trouble. Can you say that again?";
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      
      try {
        await speakWithElevenLabs(fallback, { autoResumeListening: true });
      } catch (e) {
        setTimeout(startListening, 1000);
      }
    }
  }

  useEffect(() => {
    const executeStage = async () => {
      if (isSpeaking || isThinking || introStageRef.current === 'awaiting-name') return;

      switch (introStage) {
        case 'ask-name':
        case 'ack-name':
        case 'scenario-intro':
          await runIntroStage();
          break;
        default:
          break;
      }
    };

    if (introStage === 'greeting' && !hasSpokenIntroRef.current) {
      speakIntro();
      hasSpokenIntroRef.current = true;
      return;
    }

    if (introStage !== 'greeting') {
      executeStage();
    }
  }, [introStage, isSpeaking, isThinking, runIntroStage, speakIntro]);

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{scenario.title}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Grade {gradeString} • Phase: {currentPhase}
              {currentPhase === 'intro' && ` (${introExchangeCount}/2)`}
              {isInCharacterMode && ` • 🎭 ${characterRole}`}
            </p>
          </div>
          <button
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Orb */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {(isListening || isSpeaking || isThinking) && (
            <>
              <div className="absolute inset-0 -m-12 rounded-full bg-blue-500 opacity-10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 -m-8 rounded-full bg-emerald-500 opacity-15 animate-ping" style={{ animationDuration: '2.5s' }} />
            </>
          )}

          <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
            isSpeaking ? 'bg-gradient-to-br from-blue-500 to-emerald-400 scale-110' :
            isThinking ? 'bg-gradient-to-br from-purple-600 to-blue-500 scale-105' :
            isListening ? 'bg-gradient-to-br from-blue-600 to-emerald-500 scale-105' :
            'bg-gradient-to-br from-gray-700 to-gray-800'
          }`}>
            <div className={`absolute inset-6 rounded-full ${
              (isSpeaking || isThinking || isListening) ? 'bg-white/30 animate-pulse' : 'bg-white/5'
            }`} />
            
            <div className="relative z-10">
              {isThinking ? <Loader className="w-20 h-20 text-white animate-spin" /> :
               isSpeaking ? <Volume2 className="w-20 h-20 text-white" /> :
               isListening ? <Mic className="w-20 h-20 text-white" /> :
               <Mic className="w-20 h-20 text-gray-400" />}
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="absolute bottom-32 left-0 right-0 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          {aiText && !isThinking && (
            <div className="animate-fadeIn">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {currentPhase === 'intro' ? 'Cue (Coach)' : 
                 isInCharacterMode ? characterRole : 'AI Coach'}
              </p>
              <p className="text-base text-gray-300">{aiText}</p>
            </div>
          )}
          {transcript && (
            <div className="animate-fadeIn">
              <p className="text-xs text-blue-400 uppercase tracking-wide mb-1">You're saying...</p>
              <p className="text-base text-blue-400">{transcript}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm font-medium">
            {isThinking ? <span className="text-purple-400">🧠 Thinking...</span> :
             isSpeaking ? <span className="text-blue-400">🎤 {
               currentPhase === 'intro' ? 'Cue speaking...' :
               isInCharacterMode ? `${characterRole} speaking...` : 
               'AI Coach speaking...'
             }</span> :
             isListening ? <span className="text-emerald-400">👂 Listening... (speak and pause when done)</span> :
             <span>⏳ Starting...</span>}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default ElevenLabsVoiceOrb;
