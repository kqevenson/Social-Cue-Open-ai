import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { topics as voiceTopics, getScenariosForTopic } from '../../data/voicePracticeScenarios';

const PracticeScenarioDetail = ({ topicId, scenarioId, grade }) => {
  const navigate = useNavigate();

  const { topic, scenario } = useMemo(() => {
    const foundTopic = voiceTopics.find((t) => t.id === topicId) || null;
    const topicScenarios = foundTopic ? getScenariosForTopic(foundTopic.id, grade) : [];
    const selectedScenario = topicScenarios.find((s) => s.id === scenarioId) || null;
    return { topic: foundTopic, scenario: selectedScenario };
  }, [topicId, scenarioId, grade]);

  if (!topic || !scenario) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <p className="text-lg text-gray-300 mb-6">We couldn’t find that practice scenario.</p>
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => navigate(`/practice/${topic.id}`)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to topic
      </button>

      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div>
          <p className="uppercase tracking-wide text-xs text-emerald-300">{topic.title}</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{scenario.title}</h1>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-amber-300 mb-2">Practice Prompt</h2>
          <p className="text-gray-200 leading-relaxed">{scenario.prompt}</p>
        </div>

        {scenario.guidance && (
          <div>
            <h2 className="text-sm font-semibold text-sky-300 mb-2">Coach Guidance</h2>
            <p className="text-gray-200 leading-relaxed">{scenario.guidance}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeScenarioDetail;
