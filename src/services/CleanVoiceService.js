import OpenAI from 'openai';
import { getIntroductionSequence } from '../content/training/introduction-scripts.js';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

class CleanVoiceService {
  async generateResponse({ conversationHistory = [], scenario = {}, gradeLevel = '6', phase = 'intro' }) {
    console.log('📋 SCENARIO RECEIVED:', scenario);
    console.log('  Title:', scenario?.title);
    console.log('  Description:', scenario?.description);
    console.log('  Category:', scenario?.category);

    const studentMessages = conversationHistory.filter((msg) => msg.role === 'user');
    const turnCount = studentMessages.length;

    console.log('🎯 Turn count:', turnCount, '(student messages:', studentMessages.length, ')');

    const curriculum = this.getCurriculumForTurn(turnCount, gradeLevel, scenario);

    const messages = this.buildMessages(conversationHistory, curriculum);

    const systemPrompt = this.buildTeachingPrompt({
      gradeLevel,
      scenario,
      phase,
      turnCount,
      lastStudentMessage: studentMessages[studentMessages.length - 1]?.text || studentMessages[studentMessages.length - 1]?.content || '',
      curriculum
    });

    console.log('📝 System prompt length:', systemPrompt.length);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.9,
        top_p: 0.95,
        presence_penalty: 0.6,
        frequency_penalty: 0.6,
        max_tokens: 200
      });

      const aiResponse = response.choices[0]?.message?.content?.trim() || '';
      
      // Remove any markdown formatting
      const cleanResponse = aiResponse
        .replace(/\*\*Practice Scenario\*\*:/gi, '')
        .replace(/\*\*Example\*\*:/gi, '')
        .replace(/\*\*Tips\*\*:/gi, '')
        .replace(/\*\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      console.log('🤖 AI teaching response:', cleanResponse);

      return {
        aiResponse: cleanResponse,
        shouldContinue: turnCount < 5,
        phase: turnCount < 4 ? 'practice' : 'feedback'
      };
    } catch (error) {
      console.error('❌ CleanVoiceService error:', error);
      throw error;
    }
  }

  getCurriculumForTurn(turnCount, gradeLevel, scenario) {
    const introData = getIntroductionSequence(gradeLevel);
    const scenarioKey = this.getScenarioKey(scenario);
    const script = introData.scenarios?.[scenarioKey];

    if (!script) return null;

    if (turnCount === 0) {
      const greeting = `Hi, I'm Cue! We'll be practicing ${scenario?.title || 'conversation skills'} today.`;
      const smallTalk = 'How are you doing?';
      const friendlyIntro = `${greeting} ${smallTalk}`.replace(/\s+/g, ' ').trim();

      console.log('✅ Turn 0: Conversational intro (waiting for student response)');
      console.log('📝 Intro:', friendlyIntro);

      return { type: 'intro', text: friendlyIntro };
    }

    if (turnCount === 1) {
      console.log('✅ Turn 1: Teaching + Example + Scenario (AI will be creative)');
      
      // Don't return fixed text - let AI create unique content
      const scenarioIntro = script.intro || `Picture this: there's a new student sitting alone at lunch. How would you approach them?`;
      
      return { 
        type: 'teaching', 
        scenarioIntro: scenarioIntro,
        scenarioKey: scenarioKey
      };
    }

    if (turnCount === 2) {
      console.log('✅ Turn 2: Using afterResponse as teaching guide');
      return { type: 'afterResponse', text: script.afterResponse };
    }

    console.log('ℹ️ Turn', turnCount, ': natural coaching');
    return null;
  }

  buildMessages(conversationHistory, curriculum) {
    const messages = (conversationHistory || [])
      .filter((msg) => {
        const text = msg?.text || msg?.content || '';
        const hasText = typeof text === 'string' && text.trim() !== '';

        if (!hasText) {
          console.log('⚠️ Filtering out empty message:', msg);
        }

        return hasText;
      })
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: (msg?.text || msg?.content || '').trim()
      }));

    console.log('📝 Built', messages.length, 'valid messages from', conversationHistory.length, 'total (no forcing)');

    if (messages.length === 0 && (conversationHistory?.length || 0) > 0) {
      console.error('❌ ALL MESSAGES FILTERED OUT!');
      console.log('Original messages:', conversationHistory);
    }

    if (curriculum?.type === 'intro') {
      messages.push({
        role: 'user',
        content: `RESPOND WITH EXACTLY: "${curriculum.text}"`
      });
      console.log('💪 Forcing intro curriculum');
    }

    return messages;
  }

  buildTeachingPrompt({ gradeLevel, scenario, turnCount, lastStudentMessage, curriculum }) {
    const grade = parseInt(gradeLevel, 10) || 6;
    const wordLimit = this.getWordLimit(grade);
    const studentSaid = (lastStudentMessage && lastStudentMessage.trim()) || '[no response]';

    if (turnCount === 0) {
      return 'You are Cue. When you see "RESPOND WITH EXACTLY:", say those exact words and nothing else.';
    }

    if (turnCount === 1) {
      const ageGuidance = this.getAgeAppropriateCoaching(grade);
      const teachingPoints = this.getTeachingPointsForScenario(scenario);
      const scenarioIntro = curriculum?.scenarioIntro || `Picture this: there's a new student sitting alone at lunch.`;

      return `You are Cue, an enthusiastic social skills coach for grade ${grade} students.

The student said: "${studentSaid}"

YOUR RESPONSE STRUCTURE (follow exactly):

1. ACKNOWLEDGE warmly (1 short sentence):
   Examples: "Great!" / "Awesome!" / "Nice!" / "Perfect!" / "Love it!"

2. TEACH the key concepts briefly (2-3 sentences):
   For ${scenario?.title}, the key tips are:
${teachingPoints}

3. GIVE ONE EXAMPLE (1-2 sentences):
   - Use a unique name: Maya, Jordan, Riley, Sam, Casey, Taylor, Morgan, Quinn, etc.
   - Show exact words: "For example, you could say '[exact greeting or question]'"
   - Keep it brief and relevant to the scenario

4. PRESENT THE SCENARIO (1-2 sentences):
   ${scenarioIntro}

5. ASK FOR THEIR RESPONSE (1 sentence):
   End with: "What would you say?" or "How would you start?" or "What's your approach?"

${ageGuidance}

CRITICAL RULES:
- Present ONLY ONE scenario - do NOT jump to different settings
- If the scenario is about lunch, STAY with lunch - don't mention library, classroom, etc.
- Give ONE clear example, not multiple situations
- End by asking them to respond to THIS specific scenario
- NO markdown formatting (no **, __, etc.)
- Be conversational and natural
- Maximum ${wordLimit} words total

The student needs to focus on THIS ONE scenario before anything else!`;
    }

    if (turnCount >= 2) {
      const ageGuidance = this.getAgeAppropriateCoaching(grade);
      const scenarioKey = this.getScenarioKey(scenario);

      let characterRole = 'new student';
      let characterContext = 'sitting alone at lunch, open to conversation';

      if (scenarioKey === 'starting-conversation') {
        characterRole = 'new student';
        characterContext = 'sitting at lunch, looking friendly and approachable';
      } else if (scenarioKey === 'making-friends') {
        characterRole = 'potential new friend';
        characterContext = 'interested in making friends';
      } else if (scenarioKey === 'paying-attention') {
        characterRole = 'friend sharing a story';
        characterContext = 'talking about something that happened';
      } else if (scenarioKey === 'asking-help') {
        characterRole = 'classmate who can help';
        characterContext = 'working on homework nearby';
      } else if (scenarioKey === 'joining-group') {
        characterRole = 'member of a group conversation';
        characterContext = 'chatting with friends about something fun';
      }

      return `You are roleplaying as a ${characterRole} in a social situation. You are ${characterContext}.

IMPORTANT: You are NOT the coach right now. You are IN CHARACTER as the ${characterRole}.

The student just said to you: "${studentSaid}"

RESPOND AS THE ${characterRole}:
- Stay in character and respond naturally like a real ${characterRole} would
- Be friendly and receptive—help the student succeed in this practice
- Keep responses conversational and age-appropriate for grade ${grade}
- DO NOT use any markdown formatting - speak naturally
- Keep it realistic and true to the character

${ageGuidance}

Examples of good ${characterRole} responses:
- "Hey! Yeah, you can totally sit here. I'm new here, just started this week."
- "Oh hi! Sure, pull up a chair. How's your day going?"
- "Thanks for coming over! I don't know many people yet."

Keep response under ${wordLimit} words. BE the ${characterRole}, don't teach or give advice.`;
    }

    const ageGuidance = this.getAgeAppropriateCoaching(grade);
    const baseResponse = curriculum?.type === 'afterResponse' ? curriculum.text : '';

    return `You are Cue, a warm and insightful social skills coach for grade ${gradeLevel} students.

SCENARIO: ${scenario?.title || 'Starting a conversation'}
STUDENT JUST SAID: "${studentSaid}"
TURN: ${turnCount}

YOUR JOB:
${turnCount === 1 && baseResponse ? `1. Start with something NATURAL based on: "${baseResponse}"
` : ''}${turnCount === 1 && baseResponse ? '2. Then coach them:' : '1. Coach them:'}
   - Was their tone friendly, awkward, or rude?
   - Did they make a good conversation starter?
   - What SPECIFIC words worked well?
   - What could be better?

Give feedback like a real coach:
   - Point to exact words they used ("When you said ...")
   - Explain WHY it works or not
   - Model a better version if needed
   - Encourage their effort

${ageGuidance}

EXAMPLES:
If student says: "Hi, mind if I sit here?"
You say: "That's a solid opener! You asked permission with 'mind if I sit?' which is polite and friendly. Nice job! How would you keep it going after they say yes?"

If student says: "Why are you alone?"
You say: "Let's rethink that. 'Why are you alone?' might feel uncomfortable. Try 'Hey, mind if I join you?'—it's friendlier and doesn't put them on the spot. Want to try it?"

Keep response under ${wordLimit} words. Sound natural, supportive, and encouraging.`;
  }

  getAgeAppropriateCoaching(grade) {
    if (grade <= 2) return '- Use simple words\n- Be very encouraging\n- Keep it playful';
    if (grade <= 5) return '- Use clear language\n- Friendly tone\n- Specific praise';
    if (grade <= 8) return '- Conversational tone\n- Acknowledge complexity\n- Be supportive';
    return '- Mature dialogue\n- Nuanced feedback\n- Respect their perspective';
  }

  getWordLimit(grade) {
    if (grade <= 2) return 40;
    if (grade <= 5) return 50;
    if (grade <= 8) return 60;
    return 70;
  }

  getScenarioKey(scenario) {
    if (!scenario) {
      console.log('⚠️ No scenario provided, using default');
      return 'starting-conversation';
    }

    const title = (scenario.title || '').toLowerCase();
    const description = (scenario.description || '').toLowerCase();
    const category = (scenario.category || '').toLowerCase();

    console.log('🔍 Mapping scenario:', { title, description, category });

    if (title.includes('keeping') || title.includes('continue') || title.includes('sustain')) {
      console.log('✅ Mapped to: keeping-conversation (using starting-conversation curriculum)');
      return 'starting-conversation';
    }

    if (title.includes('friend') || title.includes('making friends')) {
      console.log('✅ Mapped to: making-friends');
      return 'making-friends';
    }

    if (title.includes('attention') || title.includes('listen') || title.includes('paying attention')) {
      console.log('✅ Mapped to: paying-attention');
      return 'paying-attention';
    }

    if (title.includes('help') && (title.includes('ask') || title.includes('need'))) {
      console.log('✅ Mapped to: asking-help');
      return 'asking-help';
    }

    if (title.includes('join') || title.includes('group')) {
      console.log('✅ Mapped to: joining-group');
      return 'joining-group';
    }

    if (title.includes('start') || title.includes('conversation') || title.includes('introduce')) {
      console.log('✅ Mapped to: starting-conversation');
      return 'starting-conversation';
    }

    console.log('⚠️ No match found, using default: starting-conversation');
    return 'starting-conversation';
  }

  getTeachingPointsForScenario(scenario) {
    const scenarioKey = this.getScenarioKey(scenario);

    switch (scenarioKey) {
      case 'starting-conversation':
        return `- Start with a friendly greeting
- Ask an open-ended question
- Use a warm, approachable tone`;
      case 'making-friends':
        return `- Show genuine interest in them
- Find common ground
- Be authentic`;
      case 'paying-attention':
        return `- Make eye contact
- Nod to show you're listening
- Ask follow-up questions`;
      case 'asking-help':
        return `- Be specific about what you need
- Explain why you need help
- Thank them for their time`;
      case 'joining-group':
        return `- Wait for a natural pause
- Make a relevant comment
- Read the group's energy`;
      default:
        return `- Be friendly
- Stay genuine
- Show kindness`;
    }
  }
}

export default new CleanVoiceService();