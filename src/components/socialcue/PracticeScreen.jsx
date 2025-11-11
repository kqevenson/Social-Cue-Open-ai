// PracticeScreen.jsx

import React, { useMemo } from 'react';
import { topics as voiceTopics } from "../../data/voicePracticeScenarios";
import { ChevronLeft } from 'lucide-react';

export default function PracticeScreen({ onNavigate, onBack, gradeLevel = '6', darkMode }) {

  const topicButtons = useMemo(() => {
    const fallbackIcons = ['🗣️', '🤝', '🎯', '💬', '🤗', '🎓'];
    return voiceTopics.map((topic, index) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      icon: fallbackIcons[index % fallbackIcons.length]
    }));
  }, []);

  const handleTopicSelect = (topicId) => {
    if (typeof onNavigate === 'function') {
      onNavigate('practice', 1, { topicId });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {onBack && (
        <button
          onClick={() => {
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <div className="max-w-6xl mx-auto">
        <>
          <h1 className="text-3xl font-bold mb-4">🎯 Choose a Topic</h1>
          <p className="text-gray-400 mb-8">Pick a topic you’d like to practice with Coach Cue.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topicButtons.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 transition"
              >
                <div className="text-3xl mb-2">{topic.icon}</div>
                <h2 className="text-lg font-semibold">{topic.title}</h2>
                {topic.description && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{topic.description}</p>
                )}
              </button>
            ))}
          </div>
        </>
      </div>
    </div>
  );
}
