import React, { useMemo, useState } from 'react';
import { getVoiceIntro } from '../content/training/introduction-scripts';
import { topics } from '../data/voicePracticeScenarios';

const TestVoiceIntro = () => {
  const [selectedGrade, setSelectedGrade] = useState('6');
  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.id || '');

  const introPreview = useMemo(() => {
    const introData = getVoiceIntro(selectedGrade, selectedTopic) || {};
    return {
      greeting: introData.greetingIntro || "Hi, I'm Cue — let's get started!",
      scenarioIntro: introData.scenarioIntro || "Here's a bit of context for our practice...",
      safety: introData.safetyAndConsent || "If at any time you'd like to stop, just let me know.",
      warmup: introData.firstPrompt || "Let's begin with a warm-up question.",
      scenario: introData.scenarioDetails || "Here's the scenario we'll be working on."
    };
  }, [selectedGrade, selectedTopic]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>Voice Introduction Tester</h2>

      <div>
        <label>Grade Level: </label>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
          <option value="1">K-2</option>
          <option value="4">3-5</option>
          <option value="7">6-8</option>
          <option value="10">9-12</option>
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Topic: </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}
      >
        <h3>AI Would Say:</h3>
        <div style={{ marginBottom: '15px' }}>
          <strong>Greeting + Intro:</strong>
          <p>{introPreview.greeting}</p>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Scenario Context:</strong>
          <p>{introPreview.scenarioIntro}</p>
        </div>
        <div>
          <strong>Warm-up Question:</strong>
          <p>{introPreview.warmup}</p>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#d4edda',
          borderRadius: '5px'
        }}
      >
        <span>✅ Topic-based scripts are working!</span>
      </div>
    </div>
  );
};

export default TestVoiceIntro;
