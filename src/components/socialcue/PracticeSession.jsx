import React, { useCallback, useMemo, useState } from 'react';
import AIPracticeSession from '../AIPracticeSession';
import VoiceCoachOrbScreen from '../VoiceCoachOrbScreen';

const topicIdMap = {
  1: 'entering-group-conversations',
  2: 'disagreeing-respectfully',
  3: 'staying-on-topic',
  4: 'active-listening',
  5: 'taking-turns-speaking',
  6: 'expressing-emotions-respectfully',
  7: 'giving-and-receiving-feedback',
  8: 'resolving-conflicts'
};

const PracticeSession = ({
  sessionId,
  onComplete,
  onExit,
  gradeLevel = '6',
  ...rest
}) => {
  const [activeVoiceSession, setActiveVoiceSession] = useState(null);

  const selectedTopicId = useMemo(() => {
    if (!sessionId) return null;
    return topicIdMap[sessionId] || null;
  }, [sessionId]);

  const handleScenarioStart = useCallback(
    ({ scenario, gradeLevel: scenarioGradeLevel, gradeBand }) => {
      if (!scenario) return;

      // Prefer dynamic scenario properties, fallback to static contextLine
      const intro = scenario?.introLine ||
        scenario?.spokenScene ||
        scenario?.description ||
        scenario?.contextLine ||
        scenario?.warmupQuestion ||
        scenario?.prompt ||
        `Let's practice ${scenario?.title || 'this social skill'} together.`;

      setActiveVoiceSession({
        scenario,
        gradeLevel: scenarioGradeLevel || gradeLevel,
        gradeBand,
        introLine: intro
      });
    },
    [gradeLevel]
  );

  const handleVoiceSessionEnd = useCallback(
    (result) => {
      setActiveVoiceSession(null);

      if (result?.endedByUser) {
        onExit?.();
        return;
      }

      if (result?.phase === 'complete') {
        onComplete?.(result);
      } else {
        onExit?.();
      }
    },
    [onComplete, onExit]
  );

  if (activeVoiceSession) {
    return (
      <VoiceCoachOrbScreen
        scenario={activeVoiceSession.scenario}
        gradeLevel={activeVoiceSession.gradeLevel}
        introLine={activeVoiceSession.introLine}
        onEndSession={handleVoiceSessionEnd}
      />
    );
  }

  return (
    <AIPracticeSession
      gradeLevel={gradeLevel}
      selectedTopicId={selectedTopicId}
      onBack={() => onExit?.()}
      onStartScenario={handleScenarioStart}
      {...rest}
    />
  );
};

export default PracticeSession;
