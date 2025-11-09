import OpenAI from 'openai';
import curriculum from '../content/curriculum/curriculum-index';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Utility to safely extract examples/tips from curriculum
function getCurriculumContent(gradeLevel = '6', scenario = {}) {
  const gradeKey = curriculum.getGradeKey(gradeLevel); // e.g., "6-8"
  const gradeData = curriculum.grades?.[gradeKey];
  const topicData = scenario?.title
    ? gradeData?.scenarios?.find(s => s.title === scenario.title)
    : gradeData?.defaultScenario;

  return {
    tips: topicData?.tips || gradeData?.defaultTips || [],
    example: topicData?.example || gradeData?.defaultExample || '',
    scenarioPrompt: topicData?.prompt || 'Let’s pretend we’re practicing a real-life situation.'
  };
}

class CleanVoiceService {
  async generateResponse({
    conversationHistory = [],
    scenario = {},
    gradeLevel = '6',
    mode = 'default' // e.g., "shy", "funny", "supportive", etc.
  }) {
    const turnCount = conversationHistory.filter(m => m.role === 'user').length;

    const messages = conversationHistory
      .filter(msg => (msg?.text || msg?.content || '').trim())
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: (msg?.text || msg?.content || '').trim()
      }));

    const { tips, example, scenarioPrompt } = getCurriculumContent(gradeLevel, scenario);

    let systemPrompt = '';

    if (turnCount === 0) {
      systemPrompt = `You're Cue, a warm, relatable social coach for grade ${gradeLevel}.
Greet the student casually and ask how they're feeling today. Under 15 words.`;
    } else if (turnCount === 1) {
      systemPrompt = `You're Cue, helping a grade ${gradeLevel} student with "${scenario?.title || 'a social situation'}".

Your tone should match their grade. Be friendly, not robotic.

Do the following:
- Acknowledge their message warmly.
- Share 2 quick tips based on this topic: ${tips.slice(0, 2).join(', ')}
- Give one example: "${example}"
- Set up a short scenario: "${scenarioPrompt}"
- Ask: “What would you say?”

Sound natural — like a real conversation. Avoid overexplaining. Under 50 words.`;
    } else if (turnCount >= 2 && turnCount <= 5) {
      systemPrompt = `You're a student at school. You're practicing with someone roleplaying a classmate.

They just said something to you. Respond naturally — friendly, realistic, brief. Stay in character. 30 words or less.`;
    } else {
      systemPrompt = `You're Cue again. Time to wrap up. Mention one thing they did well, give encouragement, and end on a positive note. 30 words max.`;
    }

    // Persona modifier (optional)
    const personaTone =
      mode === 'shy'
        ? 'Speak gently, use simple phrases, be encouraging.'
        : mode === 'funny'
        ? 'Be playful and lighthearted but stay on topic.'
        : mode === 'supportive'
        ? 'Be especially kind and affirming.'
        : '';

    if (personaTone) {
      systemPrompt += `\n\nAlso, persona mode: ${mode}. ${personaTone}`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.8,
        max_tokens: 160
      });

      const aiResponse = response.choices[0]?.message?.content?.trim() || '';

      return {
        aiResponse,
        shouldContinue: turnCount < 7,
        phase: turnCount < 2 ? 'intro' : turnCount < 6 ? 'practice' : 'feedback'
      };
    } catch (error) {
      console.error('❌ Error generating response:', error);
      return {
        aiResponse: "Hmm, something went wrong. Let's try that again!",
        shouldContinue: false,
        phase: 'error'
      };
    }
  }
}

export default new CleanVoiceService();
