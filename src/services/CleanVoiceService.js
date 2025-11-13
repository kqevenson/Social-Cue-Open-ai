import OpenAI from 'openai';
import { getVoiceIntro, getIntroductionSequence } from '../content/training/introduction-scripts';

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
    toneHint = null,
    phase = null,
    learnerName = null
  }) {
    const gradeString = (() => {
      if (gradeLevel == null) return '6';
      const str = String(gradeLevel).trim();
      if (!str) return '6';
      const match = str.match(/\d+/);
      if (match) return match[0];
      return str;
    })();

    const userTurns = conversationHistory.filter(
      (m) => m?.role === 'user' && ((m?.text ?? '').trim() || (m?.content ?? '').trim())
    ).length;

    const normalizedPhase = (() => {
      if (typeof phase === 'string' && phase.trim()) {
        return phase.trim().toLowerCase();
      }
      if (userTurns === 0) return 'intro';
      if (userTurns < 5) return 'practice';
      if (userTurns < 7) return 'feedback';
      return 'complete';
    })();

    const scenarioKeyCandidates = [
      scenario?.scriptKey,
      scenario?.scenarioKey,
      scenario?.id,
      scenario?.topicId,
      scenario?.topic,
      scenario?.topicTitle,
      scenario?.title
    ];

    const resolvedScenarioKey =
      scenarioKeyCandidates
        .map((candidate) => candidate && String(candidate).trim().toLowerCase())
        .find(Boolean) || '';

    const introSequenceConfig = getIntroductionSequence(gradeString, resolvedScenarioKey);
    const {
      greetingIntro,
      scenarioIntro,
      safetyAndConsent,
      firstPrompt,
      microCoachTips,
      scenarioScripts,
      fallbackScenario
    } = introSequenceConfig || {};

    const baseIntroScriptParts = [greetingIntro, scenarioIntro, safetyAndConsent].filter(Boolean);
    const baseIntroScript = baseIntroScriptParts.join(' ');

    const scenarioScript =
      (resolvedScenarioKey &&
        scenarioScripts &&
        scenarioScripts[resolvedScenarioKey]) ||
      fallbackScenario ||
      {};

    console.log('[Cue Script Lookup]', {
      gradeString,
      resolvedScenarioKey,
      scenarioScript
    });

    const gradePrompts = {
      K: 'Use very short, kind sentences. Imagine you’re talking to a kindergartener.',
      1: 'Speak with simple words. Be cheerful and warm like a 1st grade teacher.',
      2: 'Keep things playful and easy to understand. Use short, clear sentences.',
      3: 'Speak simply and kindly, like you’re talking to a 3rd grader. Use short, friendly sentences.',
      4: 'Use encouraging, easy-to-read sentences. Add small examples to help them relate.',
      5: 'Make your tone friendly and clear. Don’t use complicated words.',
      6: 'Use clear, supportive language. Avoid big words and use examples that feel real to a 6th grader.',
      7: 'Keep things casual, like you’re a cool mentor helping them think out loud.',
      8: 'Use relatable tone. Show empathy and curiosity without overwhelming them.',
      9: 'Use slightly more mature language. Be relatable, casual, and guide them toward thinking for themselves.',
      10: 'Talk like a thoughtful peer—helpful and friendly. Encourage them to reflect.',
      11: 'Use confident but kind language. Help them go deeper with their thinking.',
      12: 'Speak to them like a smart young adult. Let your advice feel real, not scripted.'
    };

    const gradeInstruction = gradePrompts[gradeString] || gradePrompts['6'];

    const personaInstructions = {
      friendly: 'You’re upbeat and supportive.',
      shy: 'You’re quiet but kind. Keep your responses short and gentle.',
      chatty: 'You love to talk. Respond with friendly enthusiasm.'
    };

    const personaInstruction = personaInstructions[persona] || '';
    const toneInstruction = toneHint ? `The learner sounds like this: ${toneHint}.` : '';
    const nameInstruction = learnerName
      ? `Their name is ${learnerName}. Use it naturally once in your reply.`
      : 'If they share their name, use it naturally once.';

    const baseIdentity = `You are Cue, a friendly and warm AI coach who talks like a supportive older friend. Keep replies to one short sentence and an optional follow-up question. Pause between ideas. ${gradeInstruction} ${personaInstruction} ${toneInstruction} ${nameInstruction}`.trim();

    const scenarioContext = scenario.description
      ? `The learner is practicing this situation: "${scenario.description}".`
      : scenarioIntro
      ? `The scenario focus: "${scenarioIntro}".`
      : `We’re practicing ${scenario?.title || 'a real-life social scenario'}.`;

    const microCoachTipsSafe = Array.isArray(microCoachTips) ? microCoachTips : [];
    const randomMicroTip =
      microCoachTipsSafe[Math.floor(Math.random() * microCoachTipsSafe.length)] ||
      'Take a breath, keep it friendly, and try one small step.';

    const latestLearnerMessage =
      [...conversationHistory]
        .reverse()
        .find((msg) => msg?.role === 'user' && (msg?.text || msg?.content))?.text ||
      [...conversationHistory]
        .reverse()
        .find((msg) => msg?.role === 'user' && (msg?.text || msg?.content))?.content ||
      '';

    let systemPrompt = baseIdentity;

    if (normalizedPhase === 'intro') {
      if (userTurns === 0) {
        systemPrompt = `${baseIdentity}
Here is the base intro script. Paraphrase it naturally in two short sentences max:
"${baseIntroScript}"
Finish with a question similar to "${firstPrompt || 'Ready to practice with me?'}"`;
      } else {
        const guidance = scenarioScript?.afterResponse
          ? `Use this follow-up cue as guidance: "${scenarioScript.afterResponse}"`
          : 'Offer encouragement, reassure them, and invite them to try the scenario with you.';

        systemPrompt = `${baseIdentity}
${scenarioContext}
They just said: "${latestLearnerMessage}"
${guidance}
Keep it to one short sentence and a quick question.`;
      }
    } else if (normalizedPhase === 'practice') {
      const guidance = scenarioScript?.afterResponse
        ? `Reference this coaching tip: "${scenarioScript.afterResponse}"`
        : 'Give one actionable suggestion and encourage them to try again.';

      systemPrompt = `${baseIdentity}
${scenarioContext}
Learner tone: ${toneHint || 'neutral'}
They just said: "${latestLearnerMessage}"
${guidance}
Optional micro coaching tip: "${randomMicroTip}"
Respond with one short sentence plus a friendly follow-up question.`;
    } else if (normalizedPhase === 'feedback') {
      systemPrompt = `${baseIdentity}
${scenarioContext}
Wrap up with specific praise and one friendly suggestion for next time. Keep it under 18 words.`;
    } else {
      systemPrompt = `${baseIdentity}
${scenarioContext}
Celebrate their effort and close the session with encouragement to keep practicing. Keep it under 18 words.`;
    }

    const fewShot = [
      {
        role: 'user',
        content: 'uhhh maybe like… just saying hi to people?'
      },
      {
        role: 'assistant',
        content:
          'Totally get that — starting convos can feel awkward sometimes. Wanna try a trick I use when I feel nervous?'
      },
      {
        role: 'user',
        content: 'yeah'
      },
      {
        role: 'assistant',
        content:
          "Okay cool — try smiling and saying 'Hey, I like your shirt.' Want to practice with me right now?"
      }
    ];

    const includeFewShot = normalizedPhase !== 'intro' || userTurns >= 2;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(includeFewShot ? fewShot : []),
      ...conversationHistory
        .filter((msg) => (msg?.text || msg?.content || '').trim())
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: (msg?.text || msg?.content || '').trim()
        }))
    ];

    console.log('[DEBUG] Sending to OpenAI:', messages);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.6,
        max_tokens: 160
      });

      let aiResponse = response.choices[0]?.message?.content?.trim() || '';

      if (normalizedPhase === 'practice' && userTurns >= 5) {
        aiResponse += ` ${randomMicroTip}`;
      }

      const nextPhase =
        normalizedPhase === 'intro' && userTurns >= 1
          ? 'practice'
          : normalizedPhase === 'practice' && userTurns >= 6
          ? 'feedback'
          : normalizedPhase === 'feedback' && userTurns >= 7
          ? 'complete'
          : normalizedPhase;

      return {
        aiResponse,
        shouldContinue: nextPhase !== 'complete',
        phase: nextPhase
      };
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }
}

export default new CleanVoiceService();
