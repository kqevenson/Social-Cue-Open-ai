import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, Clock, BookOpen, Brain, ChevronLeft } from 'lucide-react';
import {
  getScenariosByGrade,
  getScenarioForGrade,
  normalizeGradeLevel
} from '../data/voicePracticeScenarios';

const LoadingView = ({ onBack }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
    {onBack && (
      <button
        onClick={onBack}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
    )}
    <div className="text-center max-w-md mx-auto px-6">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
          <Sparkles className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-white">🎨 Creating fun questions just for you...</h2>
      <p className="text-lg text-gray-400 mb-2">AI is crafting personalized scenarios</p>
      <p className="text-sm text-gray-500">This will only take a moment!</p>
    </div>
  </div>
);

const ErrorView = ({ message, onBack, onRetry }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative">
    {onBack && (
      <button
        onClick={onBack}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
    )}
    <div className="max-w-md text-center space-y-4">
      <h2 className="text-2xl font-bold">Oops!</h2>
      <p className="text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 mx-auto"
        >
          <ArrowRight className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  </div>
);

export default function AIPracticeSession({
  gradeLevel = '6-8',
  onBack,
  onStartScenario
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const normalizedGrade = useMemo(() => normalizeGradeLevel(gradeLevel), [gradeLevel]);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const gradeScenarios = getScenariosByGrade(normalizedGrade);

      if (!Array.isArray(gradeScenarios) || gradeScenarios.length === 0) {
        setScenarios([]);
        setSelectedScenario(null);
        setError('No practice scenarios available for this grade yet.');
      } else {
        setScenarios(gradeScenarios);
        const initialScenario = getScenarioForGrade(gradeScenarios[0].id, normalizedGrade);
        setSelectedScenario(initialScenario);
      }
    } catch (err) {
      console.error('❌ Failed to load voice practice scenarios:', err);
      setError('Unable to load voice practice scenarios. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [normalizedGrade]);

  const handleScenarioSelect = (scenario) => {
    const gradeSpecificScenario = getScenarioForGrade(scenario.id, normalizedGrade);
    setSelectedScenario(gradeSpecificScenario);
  };

  const handleStart = () => {
    if (!selectedScenario) return;

    if (typeof onStartScenario === 'function') {
      onStartScenario(selectedScenario);
    } else {
      console.log('🎯 Voice scenario selected:', selectedScenario);
      alert('Voice practice is coming soon!');
    }
  };

  if (loading) {
    return <LoadingView onBack={onBack} />;
  }

  if (error) {
    return <ErrorView message={error} onBack={onBack} onRetry={null} />;
  }

  if (!scenarios.length) {
    return <ErrorView message="No practice scenarios found." onBack={onBack} onRetry={null} />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 text-yellow-400 uppercase tracking-wide text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Voice Practice Library · Grade {normalizedGrade.toUpperCase()}
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">Choose a scenario to practice</h1>
          <p className="mt-3 text-gray-400 max-w-2xl">
            Select a topic below to see the scenario details, learning objectives, and practice prompts tailored to your grade level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-8">
          <div className="space-y-3">
            {scenarios.map((scenario) => {
              const gradeScenario = getScenarioForGrade(scenario.id, normalizedGrade);
              const isActive = selectedScenario?.id === scenario.id;

              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-emerald-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl">
                    {gradeScenario?.icon || scenario.icon || '🎤'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {gradeScenario?.title || scenario.title[normalizedGrade]}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {gradeScenario?.description || scenario.description[normalizedGrade]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
            {!selectedScenario ? (
              <div className="text-center text-gray-400">
                Select a scenario on the left to view practice details.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-blue-300">
                    <span>{selectedScenario.category?.replace(/-/g, ' ')}</span>
                  </div>
                  <h2 className="mt-2 text-3xl font-bold text-white">
                    {selectedScenario.title}
                  </h2>
                  <p className="mt-3 text-gray-300 text-base">
                    {selectedScenario.description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      <Clock className="w-4 h-4" />
                      Estimated Time
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {selectedScenario.estimatedDuration || 5} minutes
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                      <BookOpen className="w-4 h-4" />
                      Practice Partner
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {selectedScenario.characterRole || 'Coach Cue'}
                    </p>
                  </div>
                </div>

                {selectedScenario.learningObjectives?.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-3">
                      <Brain className="w-4 h-4" />
                      Learning Objectives
                    </div>
                    <ul className="space-y-2 text-sm text-gray-200">
                      {selectedScenario.learningObjectives.map((objective, index) => (
                        <li key={`${selectedScenario.id}-objective-${index}`} className="flex gap-2">
                          <span className="text-blue-300">•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScenario.setupPrompt && (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                    <div className="text-sm font-semibold text-amber-300 mb-2">Voice Coach Prompt</div>
                    <p className="text-gray-200 leading-relaxed">
                      {selectedScenario.setupPrompt}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleStart}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  Start Voice Practice
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
