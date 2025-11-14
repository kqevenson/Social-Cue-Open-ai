import OpenAI from 'openai';
import standaloneContentService from './contentService.js';
import { getVoiceIntro } from '../content/training/introduction-scripts.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

console.log('🔑 OpenAI API Key present:', !!import.meta.env.VITE_OPENAI_API_KEY);

/**
 * Generate AI conversation response with ADAPTIVE TEACHING
 */
export async function generateConversationResponse({
  conversationHistory,
  scenario,
  gradeLevel = '6-8',
  currentPhase = 'intro',
  lessonId = null,
  isInCharacterMode = false,
  characterRole = null,
  characterExchangeCount = 0,
  learnerName = null
}) {
  try {
    const history = Array.isArray(conversationHistory) ? conversationHistory : [];
    const historyForAI = currentPhase === 'intro' ? [] : history;
    console.log('🤖 Generating Social Cue response...');
    console.log('📍 Phase:', currentPhase, '| Character mode:', isInCharacterMode);
    console.log('🎓 Grade:', gradeLevel, '| Scenario:', scenario?.title);

    const timing = standaloneContentService.getTimingForGrade(gradeLevel);
    const exchangeCount = Math.floor(history.length / 2);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎤 GENERATING AI RESPONSE');
    console.log('Phase:', currentPhase);
    console.log('Turn count:', conversationHistory.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const curriculumScript = await deriveCurriculumScript(
      currentPhase,
      history,
      gradeLevel,
      scenario,
      learnerName
    );

    if (curriculumScript && typeof curriculumScript === 'string') {
      console.log('✅ Curriculum script found for phase:', currentPhase);
      return {
        response: curriculumScript,
        phase: currentPhase,
        aiResponse: curriculumScript,
        text: curriculumScript,
        shouldContinue: true,
        nextPhase: currentPhase,
        exchangeCount: exchangeCount,
        validation: { valid: true, warnings: [] },
        hasEvaluation: false,
        feedback: null
      };
    }

    let introPromptPayload = null;
    if (curriculumScript && typeof curriculumScript === 'object' && curriculumScript.type === 'short-intro-prompt') {
      introPromptPayload = curriculumScript;
    }

    if (introPromptPayload?.prompt) {
      const introLine = await fulfillShortIntroPrompt(introPromptPayload);
      const resolvedIntro = introLine || buildFallbackIntroText(introPromptPayload.fallbackIntro);
      if (resolvedIntro) {
        return {
          response: resolvedIntro,
          phase: currentPhase,
          aiResponse: resolvedIntro,
          text: resolvedIntro,
          shouldContinue: true,
          nextPhase: currentPhase,
          exchangeCount: exchangeCount,
          validation: { valid: true, warnings: [] },
          hasEvaluation: false,
          feedback: null
        };
      }
    }

    let aiResponse = '';
    let apiSucceeded = false;

    try {
      console.log('🌐 Calling API...');
      const response = await fetch(`${API_BASE_URL}/api/voice/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: historyForAI,
          scenario,
          gradeLevel,
          phase: currentPhase,
          curriculumScript,
          lessonId,
          isInCharacterMode,
          characterRole,
          characterExchangeCount
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      console.log('🤖 AI RESPONDED:');
      console.log(data.aiResponse);

      if (curriculumScript) {
        const matches = data.aiResponse?.includes(curriculumScript.substring(0, 30));
        console.log(matches ? '✅ AI USED CURRICULUM!' : '❌ AI IGNORED CURRICULUM!');
        if (!matches) {
          console.log('⚠️  EXPECTED:', curriculumScript);
          console.log('⚠️  GOT:', data.aiResponse);
        }
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      aiResponse = data.aiResponse?.trim() || '';
      apiSucceeded = true;
    } catch (apiError) {
      console.error('❌ API call failed, falling back to direct OpenAI call:', apiError);
    }

    if (!apiSucceeded) {
      const fallbackMessages = historyForAI
        .map((msg) => {
          const content = String(msg?.content || msg?.text || '').trim();
          if (!content) return null;
          return {
            role: msg?.role === 'user' ? 'user' : 'assistant',
            content
          };
        })
        .filter(Boolean);

      if (curriculumScript) {
        fallbackMessages.push({
          role: 'user',
          content: `RESPOND WITH EXACTLY: "${curriculumScript}"`
        });
        console.log('💪 FORCING curriculum in fallback OpenAI call:', curriculumScript);
      } else {
        console.log('ℹ️  No curriculum script for fallback call');
      }

      const fallbackSystemPrompt = `${standaloneContentService.generateSystemPrompt(
        gradeLevel,
        scenario,
        0,
        isInCharacterMode,
        characterRole,
        characterExchangeCount,
        lessonId,
        currentPhase
      )}

CRITICAL OVERRIDE INSTRUCTION:
When you receive a message that says "RESPOND WITH EXACTLY: [text]", you MUST repeat that exact text word-for-word as your complete response. Do not add anything before or after it. Do not paraphrase. Just say those exact words.`;

      console.log('📤 Sending fallback request to OpenAI with', fallbackMessages.length + 1, 'messages');

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'system', content: fallbackSystemPrompt }, ...fallbackMessages],
        temperature: 0.3,
        max_tokens: 200
      });

      aiResponse = completion.choices[0]?.message?.content?.trim() || '';
      console.log('🤖 OpenAI fallback responded:', aiResponse);
      if (curriculumScript) {
        const matches = aiResponse.includes(curriculumScript.substring(0, 30));
        console.log(matches ? '✅ Fallback used curriculum!' : '❌ Fallback ignored curriculum!');
      }
    }

    const validation = standaloneContentService.validateResponse(aiResponse, timing);

    if (!validation.valid) {
      console.warn('⚠️ Response warnings:', validation.warnings);
    }

    const nextPhase = standaloneContentService.determineNextPhase(currentPhase, exchangeCount);
    
    if (nextPhase !== currentPhase) {
      console.log(`🔄 Phase transition: ${currentPhase} → ${nextPhase}`);
    }

    return {
      response: aiResponse,
      aiResponse: aiResponse,
      text: aiResponse,
      shouldContinue: nextPhase !== 'complete',
      phase: currentPhase,
      nextPhase: nextPhase,
      exchangeCount: exchangeCount,
      validation: validation,
      hasEvaluation: false,
      feedback: nextPhase === 'complete' ? generateSessionFeedback(history) : null
    };

  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error?.status,
      type: error?.type
    });

    return {
      response: "I'm having a little trouble right now. Can you try saying that again?",
      aiResponse: "I'm having a little trouble right now. Can you try saying that again?",
      text: "I'm having a little trouble right now. Can you try saying that again?",
      shouldContinue: true,
      phase: currentPhase,
      nextPhase: currentPhase,
      hasEvaluation: false,
      error: error.message
    };
  }
}

/**
 * Generate session feedback
 */
function generateSessionFeedback(conversationHistory) {
  const totalExchanges = Math.floor(conversationHistory.length / 2);
  const studentMessages = conversationHistory.filter(m => m.role === 'user');
  
  const avgWordCount = studentMessages.reduce((sum, m) => {
    const words = (m.content || m.text || '').split(/\s+/).length;
    return sum + words;
  }, 0) / studentMessages.length;
  
  const askedQuestions = studentMessages.filter(m => 
    (m.content || m.text || '').includes('?')
  ).length;
  
  const achievements = [];
  
  if (totalExchanges >= 5) achievements.push('Completed full practice');
  if (avgWordCount >= 10) achievements.push('Gave detailed responses');
  if (askedQuestions > 0) achievements.push('Asked questions');
  
  return {
    totalExchanges,
    completed: true,
    achievements,
    message: achievements.length > 0 
      ? `Great work! You ${achievements.join(', ')}.`
      : "Great practice session!"
  };
}

async function deriveCurriculumScript(currentPhase, conversationHistory, gradeLevel, scenario, learnerName) {
  try {
    const turnCount = conversationHistory.length;

    if (currentPhase !== 'intro') {
      console.log('ℹ️  No curriculum script for phase:', currentPhase, 'turn:', turnCount);
      return null;
    }

    const topicDescriptor =
      scenario?.topicId || scenario?.topic || scenario?.topicTitle || scenario?.title || '';
    const introData = getVoiceIntro(gradeLevel, topicDescriptor, scenario) || {};
    const baseIntroScript = [
      introData.greetingIntro,
      introData.scenarioIntro,
      introData.safetyAndConsent
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (turnCount === 0) {
      const scenarioTitle = scenario?.title || topicDescriptor || 'a real-life moment';
      const scenarioTopic =
        scenario?.topic ||
        scenario?.topicTitle ||
        scenario?.category ||
        topicDescriptor ||
        scenarioTitle;
      const gradeLabel = gradeLevel || '6-8';
      const learnerLine = learnerName ? `- Learner name: ${learnerName}` : '';
      const coachingTip =
        scenario?.coachingTip ||
        scenario?.tip ||
        scenarioTopic ||
        'Take a calm breath, smile, and keep it friendly.';

      const shortIntroPrompt = `
You are a friendly and encouraging voice-based conversation coach designed to help K–12 learners practice real-world social skills. Your tone should always be:
- supportive
- conversational (not robotic)
- clear and age-appropriate

Your current task is to generate a short, natural-sounding **introduction line** (1–2 sentences) to start a conversation practice session.

Use the following context:
- Scenario: ${scenarioTitle}
- Grade level: ${gradeLabel}
${learnerLine ? `${learnerLine}\n` : ''}
🔹 YOUR INTRO SHOULD:
- Greet the learner in a casual, friendly way (use their name if provided)
- Briefly describe the social situation they’ll be practicing — without using technical words like “scenario” or “topic”
- Be short, friendly, and sound like a real person
- Use language that fits the learner’s grade level
- Feel fresh and slightly different each time — not templated

❌ DO NOT:
- Mention being an AI or a coach
- Use the words “scenario,” “topic,” “phase,” or “practice round”
- Over-explain or sound formal

🔸 EXAMPLES:
- “Hey! You’re about to ask a classmate to hang out—let’s practice.”
- “Hi there! Ready to try jumping into a group conversation?”
- “Nice to see you. Let’s imagine you’re joining a new lunch table.”
- “Okay, picture this: you want to talk to someone you don’t know well.”

Your response should be one warm, natural, short intro line — nothing else.
`.trim();

      return {
        type: 'short-intro-prompt',
        prompt: shortIntroPrompt,
        fallbackIntro: introData,
        scenarioTitle,
        scenarioTopic,
        baseIntroScript,
        learnerName,
        coachingTip
      };
    }

    if (turnCount === 2) {
      console.log('✅ Using topic-based first prompt for turn 2');
      return introData.firstPrompt;
    }

    console.log('ℹ️  No curriculum script for phase:', currentPhase, 'turn:', turnCount);
    return null;
  } catch (error) {
    console.warn('⚠️ Unable to load curriculum script:', error.message);
    return null;
  }
}

async function fulfillShortIntroPrompt(introConfig) {
  if (!introConfig || typeof introConfig !== 'object') {
    return null;
  }

  const { scenarioTitle, scenarioTopic, baseIntroScript, learnerName, coachingTip } = introConfig;

  const friendlyName = (learnerName && learnerName.trim()) || 'friend';
  const topicSummary = scenarioTitle || scenarioTopic || 'a real-life social moment';
  const tipLine =
    (coachingTip && coachingTip.trim()) || 'Tip: Take a calm breath and keep your tone kind.';
  const paraphraseGuide = baseIntroScript
    ? `Paraphrase this base script in your own natural words: "${baseIntroScript}".`
    : '';

  const systemPrompt = `You are Cue, a warm and encouraging AI practice buddy for kids and teens. Always lead the session confidently. Your intro must: 1) greet ${friendlyName} by name (or say "friend" if unknown) and say you’re ready to practice together, 2) mention you’ll work on ${topicSummary}, and 3) share this coaching tip: "${tipLine}". Keep everything under 40 words. Do not ask what they want to practice or pose other questions. End with a gentle pause like “Let’s dive in.”`;

  const userPrompt = `${paraphraseGuide} Generate a single spoken intro line now that follows those rules.`;

  try {
    console.log('📤 Sending intro prompt to OpenAI (system + user message)...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.8,
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const introLine = completion.choices?.[0]?.message?.content?.trim();

    if (!introLine) return null;
    return introLine.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.warn('⚠️ Short intro prompt failed:', error?.message || error);
    return null;
  }
}

function buildFallbackIntroText(introData = {}) {
  const fallbackLine = `${introData.greetingIntro || ''} ${introData.scenarioIntro || ''}`
    .replace(/\s+/g, ' ')
    .trim();
  if (fallbackLine) return fallbackLine;
  if (introData.firstPrompt) return introData.firstPrompt;
  return "Let's get warmed up—ready to try a quick practice?";
}

export default {
  generateConversationResponse
};
