import OpenAI from 'openai';
import { getIntroductionSequence } from '../content/training/introduction-scripts';
import { conversationFlow } from '../content/training/aibehaviorconfig';

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
    const gradeWordLimit =
      conversationFlow?.turnTaking?.wordLimits?.[gradeString.toUpperCase()] ||
      conversationFlow?.stopTalk?.talk?.maxWords ||
      40;

    const userTurns = Math.max(
      0,
      conversationHistory.filter(
        (m) => m?.role === 'user' && ((m?.text ?? '').trim() || (m?.content ?? '').trim())
      ).length
    );
    console.log('🧪 CleanVoiceService turnCount:', userTurns, conversationHistory);

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
    console.log('🧩 scenarioKey:', resolvedScenarioKey);

    const introSequenceConfig = getIntroductionSequence(gradeString, resolvedScenarioKey);

    const {
      greetingIntro,
      scenarioIntro,
      safetyAndConsent,
      firstPrompt,
      microCoachTips,
      scenarioScripts,
      fallbackScenario,
      scenarios,
      fullIntro
    } = introSequenceConfig || {};

    const normalizedScenarioKey = resolvedScenarioKey;

    const gradeScenarioScripts = scenarios && typeof scenarios === 'object' ? scenarios : {};
    const gradeScenarioEntry = normalizedScenarioKey
      ? Object.entries(gradeScenarioScripts).reduce((acc, [key, value]) => {
          if (acc) return acc;
          if (!key || !value) return acc;
          return key.toLowerCase() === normalizedScenarioKey ? value : acc;
        }, null)
      : null;

    const scenarioScriptsMap = scenarioScripts || {};
    const libraryScenarioEntry = normalizedScenarioKey
      ? scenarioScriptsMap[normalizedScenarioKey] || null
      : null;

    const scenarioScript = gradeScenarioEntry || libraryScenarioEntry || fallbackScenario || {};

    const scenarioIntroScript = scenarioScript?.intro || scenarioIntro || null;
    const baseIntroScriptParts = [fullIntro, scenarioIntroScript].filter(Boolean);
    const baseIntroScript = baseIntroScriptParts.length
      ? baseIntroScriptParts.join(' ')
      : "Hi! I’m your practice buddy. Let’s warm up together. Ready to give it a go?";
    const fullIntroScript = (baseIntroScript || '').trim();

    const needsLearnerName = !learnerName || !String(learnerName).trim();

    const microCoachTipsSafe = Array.isArray(microCoachTips) ? microCoachTips : [];
    const tipsSource = Array.isArray(scenarioScript?.tips)
      ? scenarioScript.tips
      : microCoachTipsSafe;
    const topicTips = tipsSource.filter(Boolean).slice(0, 2);
    const tipsGuidance = topicTips.length
      ? topicTips.map((tip, idx) => `${idx + 1}. ${tip}`).join(' ')
      : '1. Smile, stay kind, and take the first small step. 2. Notice how others feel and keep your tone encouraging.';

    const scenarioScene =
      scenarioIntroScript ||
      scenario?.contextLine ||
      scenario?.description ||
      scenario?.prompt ||
      `Let’s practice ${scenario?.title || 'a real-life conversation'}.`;

    const scenarioQuestion =
      scenarioScript?.practicePrompt ||
      scenario?.warmupQuestion ||
      scenario?.prompt ||
      'How would you respond?';

    console.log('🧠 Resolved scenarioKey:', resolvedScenarioKey);
    console.log('🧠 scenarioIntroScript:', scenarioIntroScript);
    console.log('🧠 baseIntroScript:', baseIntroScript);
    console.log('🧠 introSequence.firstPrompt:', introSequenceConfig?.firstPrompt);
    console.log('[Cue Script Lookup]', {
      gradeLevel: gradeString,
      scenarioKey: resolvedScenarioKey,
      needsLearnerName,
      scenarioScene,
      topicTips
    });

    const effectiveFirstPrompt = firstPrompt || introSequenceConfig?.firstPrompt || 'Ready to try it with me?';

    console.log('🧠 scenarioIntroScript:', scenarioIntroScript);
    console.log('🧠 baseIntroScript:', baseIntroScript);
    console.log('🧠 firstPrompt:', effectiveFirstPrompt);

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

    const baseIdentity = `You are Cue, a friendly and warm AI coach who talks like a supportive older friend. Keep replies to at most three short sentences and finish with one guiding question when appropriate. Pause between ideas. ${gradeInstruction} ${personaInstruction} ${toneInstruction} ${nameInstruction}`.trim();

    const scenarioContext = `We’re focusing on this scenario: "${scenarioScene}"`;

    const randomMicroTip =
      microCoachTipsSafe[Math.floor(Math.random() * microCoachTipsSafe.length)] ||
      'Take a breath, keep it friendly, and try one small step.';
    const scenarioTip =
      scenario?.coachingTip ||
      scenarioScript?.afterResponse ||
      scenarioScript?.practicePrompt ||
      randomMicroTip;

    const latestLearnerMessage =
      [...conversationHistory]
        .reverse()
        .find((msg) => msg?.role === 'user' && (msg?.text || msg?.content))?.text ||
      [...conversationHistory]
        .reverse()
        .find((msg) => msg?.role === 'user' && (msg?.text || msg?.content))?.content ||
      '';

    let systemPrompt = baseIdentity;

    const learnerLine = latestLearnerMessage
      ? `They just said: "${latestLearnerMessage}"`
      : 'They are ready to begin.';

    if (normalizedPhase === 'intro') {
      const coachTeacherLine = 'You are both a friendly coach and a supportive teacher.';

      if (userTurns === 0) {
        systemPrompt = `${baseIdentity}
${coachTeacherLine}
You must deliver a warm paraphrase of this intro script: "${baseIntroScript}".
After that, ask a short question like: "${effectiveFirstPrompt}".
Keep it to two sentences total.`;
      } else {
        if (needsLearnerName) {
          systemPrompt = `${baseIdentity}
${coachTeacherLine}
You still do not know their name. Encourage them again, in a new way, to share it.
Keep it to one supportive sentence plus a short question.`;
        } else {
          systemPrompt = `${baseIdentity}
${coachTeacherLine}
${learnerLine}
Acknowledge their name (${learnerName}) and show appreciation.
Offer two quick tips such as: ${tipsGuidance}
Guide them into this scene: "${scenarioScene}"
End with the guiding question: "${scenarioQuestion}"
Stay under three short sentences and keep the tone warm.`;
        }
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

    const toneVariations = [
      'pep talk energy',
      'curious, thoughtful tone',
      'cheerful mentor voice',
      'calm, confident coach vibe',
      'playful teammate energy',
      'gentle, encouraging whisper'
    ];
    const toneModifier = toneVariations[Math.floor(Math.random() * toneVariations.length)];
    const scenarioTopicLabel =
      scenario?.topic ||
      scenario?.topicTitle ||
      scenario?.category ||
      scenarioScene;
    const scenarioSkillFocus =
      scenario?.skill ||
      scenario?.focus ||
      scenario?.goal ||
      'building real conversation confidence';
    const friendlyName = learnerName?.trim() || 'friend';
    const closingVariants = [
      'Ready to dive in?',
      'Want to give it a go?',
      'Let’s try it out!',
      'Wanna jump in with me?',
      'Ready to roll?'
    ];
    const closingPrompt = closingVariants[Math.floor(Math.random() * closingVariants.length)];
    const introPrepMessage =
      normalizedPhase === 'intro' && userTurns === 0
        ? `Session marker: ${Date.now()}. You must generate 1-2 short sentences (max ${gradeWordLimit} words total) that sound like Cue, a supportive older friend. Tone modifier: ${toneModifier}. Learner name: ${friendlyName}. Grade level: ${gradeString}. Scenario topic: "${scenarioTopicLabel}". Skill focus: "${scenarioSkillFocus}". Helpful tip to include: "${scenarioTip}". Use varied phrasing like "let’s try", "here’s the plan", or "today we’re gonna" so no two intros feel the same. Mention the scenario, weave in the tip, keep it casual, and end with a friendly invitation such as "${closingPrompt}". Never ask what they want to work on.`
        : null;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(introPrepMessage ? [{ role: 'user', content: introPrepMessage }] : []),
      ...(includeFewShot ? fewShot : []),
      ...conversationHistory
        .filter((msg) => (msg?.text || msg?.content || '').trim())
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: (msg?.text || msg?.content || '').trim()
        }))
    ];

    console.log('🧠 [generateResponse] Phase:', normalizedPhase);
    console.log('🧠 [generateResponse] scenarioScript keys:', Object.keys(scenarioScript || {}));
    console.log('🧠 [generateResponse] gradePrompt:', gradePrompts[gradeString]);
    console.log('[🧠 SYSTEM PROMPT]', systemPrompt);
    console.log('[DEBUG] Sending to OpenAI:', messages);

    const modelTemperature =
      normalizedPhase === 'intro' && userTurns === 0
        ? 0.95
        : 0.6;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: modelTemperature,
        max_tokens: 160
      });

      let aiResponse = response.choices[0]?.message?.content?.trim() || '';

      if (normalizedPhase === 'practice' && userTurns >= 5) {
        aiResponse += ` ${randomMicroTip}`;
      }

      const nextPhase = (() => {
        if (normalizedPhase === 'intro') {
          return needsLearnerName ? 'intro' : 'practice';
        }
        if (normalizedPhase === 'practice' && userTurns >= 6) {
          return 'feedback';
        }
        if (normalizedPhase === 'feedback' && userTurns >= 7) {
          return 'complete';
        }
        if (normalizedPhase === 'practice') {
          return 'practice';
        }
        return normalizedPhase;
      })();

      console.log('[✅ AI Intro Response]', { phase: normalizedPhase, aiResponse });

      return {
        aiResponse,
        audioBlob: null,
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
