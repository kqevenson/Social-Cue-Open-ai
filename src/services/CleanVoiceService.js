import OpenAI from 'openai';
import { getVoiceIntro } from '../content/training/introduction-scripts';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

class CleanVoiceService {
  async analyzeTone(text) {
    const content = text?.trim();
    if (!content) return null;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You are a concise tone analyzer. Given a single user sentence, respond with a short interpretation in the format "tone: <one or two adjectives>; notes: <brief observation>". Keep it under 12 words.'
          },
          {
            role: 'user',
            content: `How would you describe the tone of this response?
+"${content}"`
          }
        ]
      });

      return response.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
      console.error('❌ Tone analysis error:', error);
      return null;
    }
  }
  async generateResponse({
    conversationHistory = [],
    scenario = {},
    gradeLevel = '6',
    persona = 'friendly',
    toneHint = null
  }) {
    const gradeString = (() => {
      if (gradeLevel == null) return '6';
      const str = String(gradeLevel).trim();
      if (!str) return '6';
      const match = str.match(/\d+/);
      if (match) return match[0];
      return str;
    })();
  
    const turnCount = Math.max(
      0,
      conversationHistory.filter(
        (m) => m?.role === 'user' && ((m?.text ?? '').trim() || (m?.content ?? '').trim())
      ).length
    );
  
    const gradePrompts = {
      'K': 'Use very short, kind sentences. Imagine you’re talking to a kindergartener.',
      '1': 'Speak with simple words. Be cheerful and warm like a 1st grade teacher.',
      '2': 'Keep things playful and easy to understand. Use short, clear sentences.',
      '3': 'Speak simply and kindly, like you’re talking to a 3rd grader. Use short, friendly sentences.',
      '4': 'Use encouraging, easy-to-read sentences. Add small examples to help them relate.',
      '5': 'Make your tone friendly and clear. Don’t use complicated words.',
      '6': 'Use clear, supportive language. Avoid big words and use examples that feel real to a 6th grader.',
      '7': 'Keep things casual, like you’re a cool mentor helping them think out loud.',
      '8': 'Use relatable tone. Show empathy and curiosity without overwhelming them.',
      '9': 'Use slightly more mature language. Be relatable, casual, and guide them toward thinking for themselves.',
      '10': 'Talk like a thoughtful peer—helpful and friendly. Encourage them to reflect.',
      '11': 'Use confident but kind language. Help them go deeper with their thinking.',
      '12': 'Speak to them like a smart young adult. Let your advice feel real, not scripted.'
    };
  
    const gradeInstruction = gradePrompts[gradeString] || gradePrompts['6'];
  
    const topicDescriptor =
      scenario?.topicId || scenario?.topic || scenario?.topicTitle || scenario?.title || '';

    const introConfig = getVoiceIntro(gradeString, topicDescriptor, scenario);
    const baseIntroScriptParts = [
      introConfig.greetingIntro,
      introConfig.scenarioIntro,
      introConfig.safetyAndConsent
    ].filter(Boolean);
    const baseIntroScript = baseIntroScriptParts.length
      ? baseIntroScriptParts.join(' ')
      : 'Hi! I’m your practice buddy. Let’s warm up together. Ready to give it a go?';

    const scenarioContext = scenario.description
      ? `The student is working on the following situation: "${scenario.description}"`
      : `The scenario topic is "${topicDescriptor || scenario.title || 'social practice'}".`;
  
    const personaInstructions = {
      friendly: 'You’re upbeat and supportive.',
      shy: 'You’re quiet but kind. Keep your responses short and gentle.',
      chatty: 'You love to talk. Respond with friendly enthusiasm.'
    };
  
    const personaInstruction = personaInstructions[persona] || '';
    const toneInstruction = toneHint ? `Learner tone hint: ${toneHint}` : '';
  
    const baseIdentity = `You are Cue, a friendly and warm AI coach who talks like a supportive older friend. Keep responses short (1-2 sentences), ask natural follow-up questions, celebrate wins, and never overwhelm the learner. Pause between ideas. ${gradeInstruction} ${personaInstruction} ${toneInstruction}`.trim();
  
    const fewShot = [
      {
        role: 'user',
        content: 'uhhh maybe like… just saying hi to people?'
      },
      {
        role: 'assistant',
        content: 'Totally get that — starting convos can feel awkward sometimes. Wanna try a trick I use when I feel nervous?'
      },
      {
        role: 'user',
        content: 'yeah'
      },
      {
        role: 'assistant',
        content: "Okay cool — try smiling and saying 'Hey, I like your shirt.' Want to practice with me right now?"
      }
    ];
  
    let systemPrompt = baseIdentity;
  
    if (turnCount === 0) {
      const introGuidance = baseIntroScript
        ? `Use the following base script as your source material. Paraphrase naturally while preserving each part in order. Base script: """${baseIntroScript}"""`
        : 'Provide a warm greeting, explain who you are, reassure them it is safe to practice, and ask for their readiness.';
  
      const closingQuestion = introConfig.firstPrompt
        ? `Finish with a short question similar to: "${introConfig.firstPrompt}"`
        : 'Finish with a short question that invites them to respond.';
  
      systemPrompt = baseIntroScript
        ? `${baseIdentity}
  You must deliver a warm paraphrase of this intro script: "${baseIntroScript}".
  After that, ask a short question like: "${introConfig.firstPrompt || 'Ready to try it with me?'}".
  Keep it to two sentences total.`
        : `${baseIdentity}
  ${scenarioContext}
  ${introGuidance}
  ${closingQuestion}`;
    } else if (turnCount === 1) {
      const learnerResponse = conversationHistory.at(-1)?.content ||
        conversationHistory.at(-1)?.text || '';
      const topicLine = introConfig.scenarioIntro || `We’re focusing on ${topicDescriptor || 'this social skill'}.`;

      const followupGuidance = `The learner just said: "${learnerResponse}". Respond with encouragement, reference ${topicLine}, and invite them to try it with you.`;

      systemPrompt = `${baseIdentity}
 ${scenarioContext}
 ${followupGuidance}
 Keep the tone supportive and conversational. Share 1–2 concrete suggestions and end with a question that keeps the learner engaged.`;
    } else if (turnCount >= 2 && turnCount <= 5) {
      systemPrompt = `${baseIdentity}
 You're roleplaying as a realistic peer practicing ${topicDescriptor || 'this skill'}. React to what the learner said in one short sentence (under 15 words) and keep the scene going.`;
    } else {
      systemPrompt = `${baseIdentity}
  Wrap up the practice with specific praise and one friendly suggestion for next time. Keep it under 20 words.`;
    }
  
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(turnCount >= 2 ? fewShot : []),
      ...conversationHistory
        .filter(msg => (msg?.text || msg?.content || '').trim())
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: (msg?.text || msg?.content || '').trim()
        }))
    ];
  
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.6,
        max_tokens: 160
      });
  
      let aiResponse = response.choices[0]?.message?.content?.trim() || '';
  
      const wrapUps = [
        "You stayed confident—awesome job!",
        "Nice work using friendly words!",
        "I liked how clearly you spoke.",
        "Your energy felt really welcoming!",
        "You’re improving every round!"
      ];
  
      if (turnCount >= 6) {
        aiResponse += ` ${wrapUps[Math.floor(Math.random() * wrapUps.length)]}`;
      }
  
      return {
        aiResponse,
        shouldContinue: turnCount < 7,
        phase: turnCount < 2 ? 'intro' : turnCount < 6 ? 'practice' : 'feedback'
      };
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }  
}

export default new CleanVoiceService();
