import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { topics as voiceTopics, getScenariosForTopic, getGradeBandFromGrade } from '../../data/voicePracticeScenarios';
import useLearnerProfile from '../../hooks/useLearnerProfile';

const deriveGradeBand = (gradeLevel, fallbackBand) => {
  if (fallbackBand) return fallbackBand;
  if (gradeLevel == null) return null;

  if (typeof gradeLevel === 'string') {
    const normalized = gradeLevel.trim().toUpperCase();
    if (normalized === 'K' || normalized === 'K2' || normalized === 'K-2') return 'K-2';
    if (/^\d+\s*-\s*\d+$/.test(normalized)) {
      return normalized.replace(/\s+/g, '');
    }
  }

  return getGradeBandFromGrade(gradeLevel);
};

const toNumericGrade = (gradeLevel, gradeBand) => {
  if (gradeLevel == null || gradeLevel === '') {
    if (!gradeBand) return null;
    if (gradeBand === 'K-2') return 1;
    const parsedBand = parseInt(String(gradeBand).split('-')[0], 10);
    return Number.isNaN(parsedBand) ? null : parsedBand;
  }

  if (typeof gradeLevel === 'number') {
    return Number.isFinite(gradeLevel) ? gradeLevel : null;
  }

  const raw = String(gradeLevel).trim().toUpperCase();
  if (!raw) return null;

  if (raw === 'K' || raw === 'K2' || raw === 'K-2') {
    return 1;
  }

  if (/^\d+\s*-\s*\d+$/.test(raw)) {
    const [start] = raw.split(/\s*-\s*/);
    const parsed = parseInt(start, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  const numeric = parseInt(raw, 10);
  return Number.isNaN(numeric) ? null : numeric;
};

const PracticeTopicPage = ({ topicId, grade }) => {
  const navigate = useNavigate();
  const { loading, user, gradeLevel: learnerGradeLevel, gradeBand: learnerGradeBand } = useLearnerProfile();

  const effectiveGradeLevel = useMemo(
    () => (grade != null ? grade : learnerGradeLevel),
    [grade, learnerGradeLevel]
  );

  const effectiveGradeBand = useMemo(
    () => deriveGradeBand(effectiveGradeLevel, learnerGradeBand),
    [effectiveGradeLevel, learnerGradeBand]
  );

  const gradeForLookup = useMemo(
    () => toNumericGrade(effectiveGradeLevel, effectiveGradeBand),
    [effectiveGradeLevel, effectiveGradeBand]
  );

  const missingUser = !user && grade == null;

  const { topic, scenarios } = useMemo(() => {
    const foundTopic = voiceTopics.find((t) => t.id === topicId) || null;
    if (!foundTopic) {
      return { topic: null, scenarios: [] };
    }

    if (gradeForLookup == null) {
      return { topic: foundTopic, scenarios: [] };
    }

    const topicScenarios = getScenariosForTopic(foundTopic.id, gradeForLookup) || [];
    return { topic: foundTopic, scenarios: topicScenarios };
  }, [topicId, gradeForLookup]);

  if (loading && grade == null) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <p className="text-lg font-semibold mb-2">Loading your practice scenarios...</p>
        <p className="text-sm text-gray-400">We’re preparing activities for your grade level.</p>
      </div>
    );
  }

  if ((gradeForLookup == null || effectiveGradeBand == null || missingUser) && grade == null) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center space-y-3">
        <p className="text-lg font-semibold">Practice library unavailable</p>
        <p className="text-gray-400 max-w-md">
          Please sign in or set your grade level to see practice scenarios for this topic.
        </p>
        <button
          onClick={() => navigate('/practice')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to topics
        </button>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <p className="text-lg text-gray-300 mb-6">We couldn’t find that practice topic.</p>
        <button
          onClick={() => navigate('/practice')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all topics
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => navigate('/practice')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to topics
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
          {topic.description && <p className="text-gray-400">{topic.description}</p>}
          {effectiveGradeBand && (
            <p className="text-xs uppercase tracking-wide text-emerald-300 mt-3">
              Showing scenarios for grade band {effectiveGradeBand}
            </p>
          )}
        </div>

        {scenarios.length === 0 ? (
          <div className="text-gray-400">No scenarios available for your grade yet. Check back soon!</div>
        ) : (
          <div className="grid gap-6">
            {scenarios.map((scenario) => (
              <button
                key={`${topic.id}-${scenario.id}`}
                onClick={() => navigate(`/practice/${topic.id}/${scenario.id}`)}
                className="text-left p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all flex items-start gap-4"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white">{scenario.title}</h2>
                  <p className="mt-2 text-sm text-gray-300">{scenario.prompt}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeTopicPage;
