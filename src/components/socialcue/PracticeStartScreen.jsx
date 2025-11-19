import React, { useEffect, useState } from 'react';
import { OpenAI } from 'openai';
import { unlockAudio } from '../../services/openAITTSService';
import { initRecognition, startRecognition, stopRecognition } from '../../services/speechRecognitionService';
import { Sparkles, Clock, Lightbulb, Target, ArrowRight } from 'lucide-react';

// ---------- AI SCENARIO GENERATOR ----------

async function generateAIPracticeScenario({ topicName, gradeLevel, openaiClient }) {
  const systemPrompt = `You are Cue, a K-12 social skills coach. Generate a practice scenario based on topicName and gradeLevel.

Use friendly, age-appropriate language. Keep the preview short.

Produce:
- scenarioTitle (string): A catchy, friendly title for this practice scenario
- shortPreview (1–2 sentences): A brief, engaging description that gets the learner excited
- fullContext (3–4 sentences): A detailed scenario description that sets the scene
- whatYouWillLearn: three short bullet points describing the key skills they'll practice
- tips: 2–3 grade-appropriate coaching tips to help them succeed
- estimatedTime: a short string like '5–8 minutes' or '10–12 minutes'

Return your response as a JSON object with these exact keys: scenarioTitle, shortPreview, fullContext, whatYouWillLearn (array), tips (array), estimatedTime.

Be encouraging and make the scenario feel relevant to their grade level.`;

  const userPrompt = `Generate a practice scenario for:
Topic: "${topicName}"
Grade Level: "${gradeLevel}"

Make it engaging, age-appropriate, and focused on real-world social skills practice.`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from AI');
    }

    const parsed = JSON.parse(content);
    
    // Ensure arrays are properly formatted
    return {
      scenarioTitle: parsed.scenarioTitle || `${topicName} Practice`,
      shortPreview: parsed.shortPreview || `Let's practice ${topicName} together!`,
      fullContext: parsed.fullContext || `You'll practice ${topicName} in a safe, supportive environment. This scenario will help you build confidence and improve your social skills.`,
      whatYouWillLearn: Array.isArray(parsed.whatYouWillLearn) 
        ? parsed.whatYouWillLearn 
        : (parsed.whatYouWillLearn || '').split('\n').filter(Boolean).slice(0, 3),
      tips: Array.isArray(parsed.tips)
        ? parsed.tips
        : (parsed.tips || '').split('\n').filter(Boolean).slice(0, 3),
      estimatedTime: parsed.estimatedTime || '5–8 minutes'
    };
  } catch (error) {
    console.error('Failed to generate AI scenario:', error);
    // Fallback scenario
    return {
      scenarioTitle: `${topicName} Practice Session`,
      shortPreview: `Let's practice ${topicName} together in a supportive environment!`,
      fullContext: `You'll practice ${topicName} with Coach Cue. This scenario is designed to help you build confidence and improve your social skills. We'll work through real-world situations together.`,
      whatYouWillLearn: [
        `How to handle ${topicName} situations`,
        'Communication skills for social situations',
        'Building confidence through practice'
      ],
      tips: [
        'Speak naturally and be yourself',
        'Take your time - there\'s no rush',
        'Remember, practice makes progress!'
      ],
      estimatedTime: '5–8 minutes'
    };
  }
}

// ---------- MICROPHONE ACCESS ----------

async function ensureMicrophoneAccess() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (err) {
    console.error("Microphone permission denied:", err);
    throw new Error("Microphone permission required to begin the session.");
  }
}

// ---------- COMPONENT ----------

const PracticeStartScreen = ({ topicName, gradeLevel, learnerName, onStartSession, darkMode = true }) => {
  const [scenario, setScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [openaiClient, setOpenaiClient] = useState(null);

  // Initialize OpenAI client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const processEnvApiKey =
        typeof globalThis !== 'undefined' &&
        typeof globalThis.process !== 'undefined' &&
        globalThis.process?.env?.OPENAI_API_KEY;

      const OPENAI_API_KEY =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_KEY) ||
        processEnvApiKey ||
        '';

      if (OPENAI_API_KEY) {
        setOpenaiClient(new OpenAI({
          apiKey: OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        }));
      } else {
        setError('OpenAI API key not configured');
        setIsLoading(false);
      }
    }
  }, []);

  // Generate scenario on mount
  useEffect(() => {
    if (!openaiClient || !topicName) return;

    const loadScenario = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const generated = await generateAIPracticeScenario({
          topicName,
          gradeLevel: gradeLevel || '6-8',
          openaiClient
        });
        
        setScenario(generated);
      } catch (err) {
        console.error('Error generating scenario:', err);
        setError('Failed to generate practice scenario. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadScenario();
  }, [openaiClient, topicName, gradeLevel]);

  const handleBeginSession = async () => {
    if (!scenario) return;

    // 1. MIC ACCESS
    try {
      await ensureMicrophoneAccess();
    } catch (err) {
      alert(err.message);
      return;
    }

    // 2. AUDIO UNLOCK
    const ctx = await unlockAudio();
    try {
      await ctx.resume();
    } catch (err) {
      console.warn("Audio resume error:", err);
    }

    // 3. INIT + START SPEECH RECOGNITION
    initRecognition();
    stopRecognition();
    setTimeout(() => {
      startRecognition();
    }, 200);

    // 4. NAVIGATE TO ORB SCREEN
    setIsStarting(true);

    setTimeout(() => {
      const scenarioObject = {
        title: scenario.scenarioTitle,
        topicName,
        gradeLevel,
        preview: scenario.shortPreview,
        fullContext: scenario.fullContext,
        tips: scenario.tips,
        difficulty: 'easy',
        estimatedTime: scenario.estimatedTime
      };

      onStartSession(scenarioObject);
    }, 50);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
            <Sparkles className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold">Creating your practice scenario...</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI is crafting a personalized practice session just for you!
          </p>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold">Oops!</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error || 'Failed to load practice scenario'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} py-10 px-6`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {topicName}
          </h1>
          {learnerName && (
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ready to practice, {learnerName}?
            </p>
          )}
        </div>

        {/* Today's Scenario Card */}
        <div className={`rounded-3xl border p-8 ${darkMode ? 'bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border-white/10' : 'bg-white border-gray-200 shadow-lg'}`}>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Today's Scenario
            </h2>
          </div>
          <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {scenario.scenarioTitle}
          </h3>
          <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {scenario.shortPreview}
          </p>
          <p className={`mt-4 text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {scenario.fullContext}
          </p>
        </div>

        {/* What You'll Learn */}
        <div className={`rounded-3xl border p-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'}`}>
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-emerald-400" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What You'll Learn
            </h2>
          </div>
          <ul className="space-y-3">
            {scenario.whatYouWillLearn.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className={`text-emerald-400 font-bold mt-1 ${darkMode ? '' : 'text-emerald-600'}`}>
                  •
                </span>
                <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips Before You Start */}
        <div className={`rounded-3xl border p-8 ${darkMode ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-white/10' : 'bg-white border-gray-200 shadow-lg'}`}>
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tips Before You Start
            </h2>
          </div>
          <ul className="space-y-3">
            {scenario.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className={`text-amber-400 font-bold mt-1 ${darkMode ? '' : 'text-amber-600'}`}>
                  💡
                </span>
                <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Estimated Time & Begin Button */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-2 text-lg">
            <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Estimated time: <span className="font-semibold">{scenario.estimatedTime}</span>
            </span>
          </div>

          <button
            onClick={handleBeginSession}
            className="w-full max-w-md px-8 py-6 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            Begin Session
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeStartScreen;

