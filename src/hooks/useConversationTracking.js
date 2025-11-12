import { useState, useCallback, useEffect, useRef } from 'react';
import contentService from '../services/contentService';
import { getVoiceIntro } from '../content/training/introduction-scripts';

export const useConversationTracking = (gradeLevel, scenario) => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [turnCount, setTurnCount] = useState(0);
  const [studentSuccessRate, setStudentSuccessRate] = useState(0);

  console.debug('[ConversationTracking] initialized', { gradeLevel, scenario });
  const introInjectedRef = useRef(false);

  /**
   * Update conversation phase based on progress
   */
  const updatePhase = useCallback(
    (turns, successRate) => {
      const newPhase =
        contentService.leadershipMethod?.getCurrentPhase?.(turns, successRate) ??
        currentPhase;

      if (newPhase !== currentPhase) {
        console.log(`Phase transition: ${currentPhase} → ${newPhase}`);
        setCurrentPhase(newPhase);
      }
    },
    [currentPhase]
  );

  /**
   * Add message to conversation history
   */
  const addMessage = useCallback(
    (role, text, needsHelp = false, phaseOverride = null) => {
      const phase = phaseOverride || currentPhase;
      if (role === 'assistant' || role === 'ai') {
        console.log('[📤 Pushing assistant message to UI]', { role: 'assistant', content: text, phase });
      }
      console.debug('[Conversation] addMessage', { role, phase, text });
      const message = {
        id: Date.now(),
        role,
        text,
        timestamp: new Date(),
        needsHelp,
        phase: currentPhase
      };

      setConversationHistory((prev) => [...prev, message]);

      const nextTurnCount = role === 'user' ? turnCount + 1 : turnCount;
      if (role === 'user') {
        setTurnCount(nextTurnCount);
      }

      const updatedHistory =
        role === 'user'
          ? [...conversationHistory, message]
          : [...conversationHistory, message];

      if (typeof contentService.calculateSuccessRate === 'function') {
        const newSuccessRate = contentService.calculateSuccessRate(updatedHistory);
        setStudentSuccessRate(newSuccessRate);
        updatePhase(nextTurnCount, newSuccessRate);
      } else {
        updatePhase(nextTurnCount, studentSuccessRate);
      }

      return message;
    },
    [
      conversationHistory,
      currentPhase,
      studentSuccessRate,
      turnCount,
      updatePhase
    ]
  );

  /**
   * Get current phase instructions
   */
  const getPhaseInstructions = useCallback(() => {
    if (typeof contentService.getPhaseInstructions === 'function') {
      return contentService.getPhaseInstructions(turnCount, studentSuccessRate);
    }
    return null;
  }, [studentSuccessRate, turnCount]);

  /**
   * Check if conversation should continue
   */
  const shouldContinue = useCallback(() => {
    return currentPhase !== 'masteryCheck' && turnCount < 12;
  }, [currentPhase, turnCount]);

  /**
   * Reset conversation
   */
  const reset = useCallback(() => {
    setConversationHistory([]);
    setCurrentPhase('intro');
    setTurnCount(0);
    setStudentSuccessRate(0);
  }, []);

  useEffect(() => {
    if (introInjectedRef.current) return;
    if (currentPhase !== 'intro') return;
    if (conversationHistory.length > 0) return;

    const descriptor =
      scenario?.topicId || scenario?.topic || scenario?.title || scenario?.category || '';
    const introData = getVoiceIntro(gradeLevel, descriptor, scenario);
    const introLine = introData?.firstPrompt || introData?.greetingIntro ||
      "I'm your practice guide. Ready to try this together?";

    console.log('[🎤 Intro Setup]', { currentPhase, introLine, descriptor });
    addMessage('assistant', introLine, false, 'intro');
    introInjectedRef.current = true;
  }, [addMessage, conversationHistory.length, currentPhase, gradeLevel, scenario]);

  return {
    conversationHistory,
    currentPhase,
    turnCount,
    studentSuccessRate,
    addMessage,
    getPhaseInstructions,
    shouldContinue,
    reset
  };
};

export default useConversationTracking;

