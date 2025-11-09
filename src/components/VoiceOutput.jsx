import React, { useEffect, useState } from 'react';
import CleanVoiceService from '../services/CleanVoiceService';
import ElevenLabsVoiceOrb from './ElevenLabsVoiceOrb';

const VoiceOutput = ({ conversationHistory = [], lesson = null, gradeLevel = '6', mode = null }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAIResponse = async () => {
      try {
        const response = await CleanVoiceService.generateResponse({
          conversationHistory,
          gradeLevel,
          scenario: lesson,
          mode
        });
        setAiResponse(response.aiResponse);
        setIsSpeaking(true);
      } catch (err) {
        console.error('AI error:', err);
        setError('There was a problem generating a response.');
      }
    };

    getAIResponse();
  }, [conversationHistory, lesson, gradeLevel, mode]);

  const handleSpeechEnd = () => {
    setIsSpeaking(false);
  };

  return (
    <div className="voice-output">
      {error && <p className="error">{error}</p>}
      {aiResponse && (
        <>
          <p className="ai-response-text">{aiResponse}</p>
          <ElevenLabsVoiceOrb
            text={aiResponse}
            onEnd={handleSpeechEnd}
            isSpeaking={isSpeaking}
          />
        </>
      )}
    </div>
  );
};

export default VoiceOutput;
