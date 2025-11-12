const CHAT_ENDPOINT = "/api/chat";

const DEFAULT_OPTIONS = {
  model: "gpt-4o-mini",
  temperature: 0.8,
  max_tokens: 120
};

export async function generateResponse({ conversationHistory = [], scenario = {}, gradeLevel = '6', phase = 'intro' }) {
  const messages = buildPrompt(conversationHistory, scenario, gradeLevel, phase);

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages,
      ...DEFAULT_OPTIONS
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat proxy failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return {
    aiResponse: data?.choices?.[0]?.message?.content?.trim() || '',
    phase,
    shouldContinue: true
  };
}

function buildPrompt(history, scenario, gradeLevel, phase) {
  const gradeBand = gradeLevelToBand(gradeLevel);
  const scenarioTitle = scenario?.title || scenario?.name || 'a real-world conversation';

  const friendlyIdentity = `You are Cue, a warm, encouraging AI social coach for students in grades ${gradeBand}. You sound like a supportive older friend. Keep responses under 20 words, speak in natural phrases, and always end with a warm turn-taking cue like "Your turn!" or "Want to try?"`;

  const baseMessages = [
    {
      role: 'system',
      content: friendlyIdentity
    },
    {
      role: 'user',
      content: `We are practicing the scenario "${scenarioTitle}" with a grade ${gradeLevel} learner. Current phase: ${phase}.`
    }
  ];

  const formattedHistory = (history || []).map((msg) => ({
    role: msg.role === 'ai' ? 'assistant' : msg.role === 'learner' ? 'user' : msg.role,
    content: msg.text || msg.content || ''
  })).filter((msg) => msg.content.trim().length > 0);

  const fewShot = [
    {
      role: 'user',
      content: 'uhhh maybe like… just saying hi to people?'
    },
    {
      role: 'assistant',
      content: 'Totally get that — starting convos can feel awkward. Want a quick trick I use?'
    },
    {
      role: 'user',
      content: 'yeah'
    },
    {
      role: 'assistant',
      content: "Sweet! Try smiling and saying 'Hey, I like your shirt.' Ready to practice with me?"
    }
  ];

  return [...baseMessages, ...fewShot, ...formattedHistory];
}

function gradeLevelToBand(grade) {
  const num = parseInt(grade, 10);
  if (Number.isNaN(num)) return '6-8';
  if (num <= 2) return 'K-2';
  if (num <= 5) return '3-5';
  if (num <= 8) return '6-8';
  return '9-12';
}


