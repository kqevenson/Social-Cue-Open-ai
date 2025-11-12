/**
 * STANDALONE Enhanced Content Service - FIXED INTRO REPEATING
 * NO EXTERNAL DEPENDENCIES - Everything built-in!
 */

import responseEvaluationService from './responseEvaluationService.js';
import { getVoiceIntro } from '../content/training/introduction-scripts.js';
import { leadershipMethod as leadershipMethodConfig } from '../content/training/aibehaviorconfig.js';

const WORD_LIMITS = {
  'K-2': 8,
  '3-5': 12,
  '6-8': 15,
  '9-12': 20
};

const TIMING_RULES = {
  'K-2': {
    helpTimeout: 2000,
    afterResponse: 1000,
    maxTurnLength: 8,
    responseSpeed: 'slow',
    speechRate: 0.85
  },
  '3-5': {
    helpTimeout: 2000,
    afterResponse: 800,
    maxTurnLength: 12,
    responseSpeed: 'moderate',
    speechRate: 0.90
  },
  '6-8': {
    helpTimeout: 2500,
    afterResponse: 500,
    maxTurnLength: 15,
    responseSpeed: 'moderate',
    speechRate: 0.95
  },
  '9-12': {
    helpTimeout: 3000,
    afterResponse: 500,
    maxTurnLength: 20,
    responseSpeed: 'natural',
    speechRate: 1.00
  }
};

// ==================== MAIN SERVICE CLASS ====================

class StandaloneContentService {
  constructor() {
    this.wordLimits = WORD_LIMITS;
    this.timingRules = TIMING_RULES;
    this.evaluationService = responseEvaluationService;
    this.phaseCues = {
      intro: 'Welcome learner, explain safety, ask if they are ready.',
      demonstrate: 'Model the skill with a short example and clear cue.',
      practice: 'Let the learner respond. Give small prompts, stay supportive.',
      feedback: 'Celebrate wins and nudge the next improvement.',
      masteryCheck: 'Add a twist to confirm they can generalize the skill.',
      complete: 'Wrap up with praise and a next step.'
    };
    this.leadershipMethod = {
      ...leadershipMethodConfig,
      getCurrentPhase: (turns = 0, successRate = 0) =>
        this.determinePhase(turns, successRate)
    };
  }

  getGradeKey(gradeLevel) {
    const grade = parseInt(gradeLevel) || 6;
    if (grade <= 2) return 'K-2';
    if (grade <= 5) return '3-5';
    if (grade <= 8) return '6-8';
    return '9-12';
  }

  getWordLimit(gradeLevel) {
    const gradeKey = this.getGradeKey(gradeLevel);
    return this.wordLimits[gradeKey];
  }

  getTimingForGrade(gradeLevel) {
    const gradeKey = this.getGradeKey(gradeLevel);
    return this.timingRules[gradeKey];
  }

  determinePhase(turnCount = 0, successRate = 0) {
    if (turnCount <= 0) return 'intro';
    if (turnCount <= 2) return 'demonstrate';
    if (turnCount <= 5) return successRate < 0.5 ? 'practice' : 'practice';
    if (turnCount <= 7 && successRate >= 0.6) return 'feedback';
    if (turnCount > 7 && successRate >= 0.75) return 'complete';
    return 'practice';
  }

  determineNextPhase(currentPhase, exchangeCount) {
    if (currentPhase === 'intro' && exchangeCount >= 1) return 'practice';
    if (currentPhase === 'practice' && exchangeCount >= 5) return 'feedback';
    if (currentPhase === 'feedback') return 'complete';
    return currentPhase;
  }

  generateSystemPrompt(
    gradeLevel,
    scenario,
    elapsedTime,
    isInCharacterMode,
    characterRole,
    characterExchangeCount,
    lessonId,
    currentPhase,
    lastStudentResponse = null,
    conversationHistory = []
  ) {
    const wordLimit = this.getWordLimit(gradeLevel);
    const gradeKey = this.getGradeKey(gradeLevel);
    const scenarioContext = scenario?.context || scenario?.description || 'a social situation';
    const aiRole = characterRole || scenario?.aiRole || 'friend';

    console.log('🎯 Word limit for grade', gradeLevel, ':', wordLimit);
    console.log('📍 Current phase:', currentPhase);
    console.log('🎭 Character mode:', isInCharacterMode);

    // ===== INTRO PHASE - Use curriculum scripts =====
    if (currentPhase === 'intro') {
      console.log('📖 Generating INTRO prompt from curriculum');
      return this.generateIntroPrompt(gradeKey, scenario, aiRole, wordLimit, conversationHistory);
    }

    // ===== PRACTICE PHASE - Evaluate and adapt =====
    let evaluation = null;
    if (lastStudentResponse && currentPhase === 'practice') {
      evaluation = this.evaluationService.evaluateResponse(lastStudentResponse, {
        scenario,
        gradeLevel,
        conversationHistory,
        expectedSkills: scenario?.targetSkills || ['greeting', 'followUpQuestion'],
        previousPerformance: this.extractPreviousPerformance(conversationHistory)
      });
      
      console.log('📊 Student Evaluation:', {
        performance: evaluation.performanceLevel,
        contentScore: evaluation.contentQuality.score.toFixed(2),
        skillsScore: evaluation.socialSkills.score.toFixed(2),
        tone: evaluation.toneAnalysis.confidenceLevel
      });
    }

    if (currentPhase === 'practice') {
      console.log('🎓 Generating PRACTICE prompt with adaptive teaching');
      return this.generatePracticePrompt(
        aiRole,
        scenarioContext,
        gradeKey,
        wordLimit,
        evaluation
      );
    }

    // ===== FEEDBACK PHASE =====
    if (currentPhase === 'feedback') {
      console.log('⭐ Generating FEEDBACK prompt');
      return this.generateFeedbackPrompt(gradeKey, wordLimit, conversationHistory);
    }

    return this.generateIntroPrompt(gradeKey, scenario, aiRole, wordLimit, conversationHistory);
  }

  /**
   * Generate INTRO prompt - FIXED to not repeat!
   */
  generateIntroPrompt(gradeKey, scenario, role, wordLimit, conversationHistory = []) {
    const topicDescriptor =
      scenario?.topicId || scenario?.topic || scenario?.title || scenario?.category || '';
    const introData = getVoiceIntro(gradeKey, topicDescriptor, scenario);
    const userMessages = conversationHistory.filter((m) => m.role === 'user').length;

    if (userMessages === 0) {
      const combinedIntro = `${introData.greetingIntro} ${introData.scenarioIntro} ${introData.safetyAndConsent}`
        .replace(/\s+/g, ' ')
        .trim();

      return `You are Cue, the Social Cue coach for ${gradeKey} students.

INTRO EXCHANGE 1 of 2:

Say: "${combinedIntro}"

Keep it simple and warm. Stay under ${wordLimit} words.`;
    }

    return `You are Cue, the Social Cue coach for ${gradeKey} students.

INTRO EXCHANGE 2 of 2:

Say: "${introData.firstPrompt}"

Encourage them to respond so you can move into roleplay as ${role}. Keep it warm and under ${wordLimit} words.`;
  }

  generatePracticePrompt(role, context, gradeKey, wordLimit, evaluation) {
    const ageGuidance = this.getAgeGuidance(gradeKey);
    
    let prompt = `You're ${role} teaching conversation skills naturally.

Scenario: ${context}

${ageGuidance}

`;

    if (evaluation) {
      prompt += this.generateTeachingStrategy(evaluation);
    } else {
      prompt += `TEACH THROUGH DIALOGUE:
- When they do well: continue naturally with enthusiasm
- When they struggle: model better responses through your dialogue
- Keep it natural, warm, supportive`;
    }

    prompt += `

Keep responses around ${wordLimit} words. Be encouraging and natural.

After 5-6 exchanges, wrap up: "Great job! You really showed [specific skill]!"`;

    return prompt;
  }

  generateTeachingStrategy(evaluation) {
    const performance = evaluation.performanceLevel;
    
    let strategy = `ADAPTIVE TEACHING (Performance: ${performance}):\n\n`;
    
    if (performance === 'excellent') {
      strategy += `🌟 EXCELLENT!\n`;
      strategy += `- Celebrate enthusiastically: "${evaluation.strengths[0]?.praise || 'Perfect!'}"\n`;
      strategy += `- Continue naturally\n`;
      strategy += `- Slight complexity increase\n`;
    } 
    else if (performance === 'good') {
      strategy += `👍 DOING WELL!\n`;
      strategy += `- Praise: "${evaluation.strengths[0]?.praise || 'Nice!'}"\n`;
      strategy += `- Continue naturally\n`;
      if (evaluation.improvements[0]) {
        strategy += `- Subtly model: ${evaluation.improvements[0].model}\n`;
      }
    }
    else if (performance === 'adequate') {
      strategy += `📚 LEARNING - needs support:\n`;
      strategy += `- Find positive: "${this.findPositive(evaluation)}"\n`;
      strategy += `- Model better version naturally\n`;
      if (evaluation.improvements[0]) {
        strategy += `- Help: ${evaluation.improvements[0].gentle_suggestion}\n`;
        strategy += `- Model: ${evaluation.improvements[0].model}\n`;
      }
    }
    else if (performance === 'needs_support') {
      strategy += `🤝 NEEDS EXTRA SUPPORT:\n`;
      strategy += `- Encourage: "You're doing great! Let me help!"\n`;
      strategy += `- Break into steps\n`;
      strategy += `- Give exact examples\n`;
      strategy += `- Simplify next prompt\n`;
    }
    else {
      strategy += `🆘 STRUGGLING - maximum help:\n`;
      strategy += `- Max encouragement: "It's okay! Everyone learns!"\n`;
      strategy += `- Fill-in-blanks: "Try saying: Hi, my name is ___"\n`;
      strategy += `- Celebrate ANY response\n`;
    }
    
    return strategy;
  }

  generateFeedbackPrompt(gradeKey, wordLimit, history) {
    const strengths = this.analyzeConversation(history);
    
    return `Give specific, warm feedback about what the student did well.

They showed:
${strengths.map(s => `  • ${s}`).join('\n')}

Be enthusiastic and specific. Around ${wordLimit} words. Make them proud!

Example: "You did great! I noticed you [specific thing]. That's exactly how good conversations work!"`;
  }

  getAgeGuidance(gradeKey) {
    const guidance = {
      'K-2': 'Teaching young kids: Simple language, LOTS of encouragement, model clearly, keep playful',
      '3-5': 'Teaching elementary: Clear examples, encourage details, be patient, make it fun',
      '6-8': 'Teaching middle schoolers: Keep cool, not preachy, model naturally, low-pressure',
      '9-12': 'Teaching high schoolers: Mature tone, realistic scenarios, subtle modeling, practical'
    };
    return guidance[gradeKey] || guidance['6-8'];
  }

  analyzeConversation(history) {
    const studentMessages = history.filter(m => m.role === 'user');
    const strengths = [];
    
    if (studentMessages.length >= 5) strengths.push('stayed engaged throughout');
    if (studentMessages.some(m => m.text?.includes('?') || m.content?.includes('?'))) strengths.push('asked questions');
    if (studentMessages.some(m => ((m.text || m.content || '').split(/\s+/).length) > 10)) strengths.push('gave detailed responses');
    if (studentMessages.some(m => /please|thank|sorry/i.test((m.text || m.content || '')))) strengths.push('used polite language');
    
    if (strengths.length === 0) strengths.push('practiced conversation skills');
    
    return strengths;
  }

  extractPreviousPerformance(history) {
    return history
      .filter(m => m.role === 'user')
      .slice(-3)
      .map(m => ({
        wordCount: (m.text || m.content || '').split(/\s+/).length,
        skillsUsed: []
      }));
  }

  findPositive(evaluation) {
    if (evaluation.strengths.length > 0) return evaluation.strengths[0].praise;
    return "I can see you're trying!";
  }

  getConversationRules(gradeLevel) {
    return {
      maxResponseLength: this.getWordLimit(gradeLevel),
      timing: this.getTimingForGrade(gradeLevel)
    };
  }

  validateResponse(responseText, timing) {
    const wordCount = responseText.trim().split(/\s+/).length;
    const warnings = [];
    const limit = timing?.maxTurnLength || 15;

    if (wordCount > limit * 2) {
      warnings.push(`Response is long (${wordCount} words)`);
    }

    return {
      valid: warnings.length === 0,
      warnings,
      wordCount,
      methodology: 'Adaptive Teaching'
    };
  }

  getHelpPrompt() {
    const prompts = [
      "Take your time. What would you like to say?",
      "It's okay to pause and think. Your turn!",
      "Need a hint? Try starting with..."
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  calculateSuccessRate(history = []) {
    const userTurns = history.filter((m) => m.role === 'user');
    if (!userTurns.length) {
      return 0;
    }
    const successfulTurns = userTurns.filter((m) => m.needsHelp !== true).length;
    return Number((successfulTurns / userTurns.length).toFixed(2));
  }

  getPhaseInstructions(turnCount = 0, successRate = 0) {
    const phase = this.leadershipMethod.getCurrentPhase?.(turnCount, successRate) ?? 'intro';
    return {
      phase,
      cue: this.phaseCues[phase] || this.phaseCues.practice
    };
  }
}

const standaloneContentService = new StandaloneContentService();
export default standaloneContentService;
