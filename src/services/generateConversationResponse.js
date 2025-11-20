// ---------------------------------------------------------------------------
// generateConversationResponse.js — NEW AUTONOMY ENGINE FOR SOCIAL CUE (2025)
// ---------------------------------------------------------------------------
// Cue now behaves like:
// - a warm, upbeat, friendly conversational coach
// - fully autonomous + natural like ChatGPT voice
// - grade-aware
// - topic-aware
// - scenario-generating
// - non-repetitive
// - no clipped sentences
// - no template constraints
// ---------------------------------------------------------------------------

import { personaEngine } from "./personaEngine";
import { buildTeachingTurn } from "../content/training/AIBehaviorConfig";
import { MICRO_TIPS } from "../content/training/AIBehaviorConfig";

// ---------------------------------------------------------
// Helper — never trim AI output (old behavior removed)
// ---------------------------------------------------------
function clean(text) {
  if (!text) return "";
  return String(text).replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------
// Dynamic scenario generator — ALWAYS NEW & VARIED
// ---------------------------------------------------------
function generateFreshScenario(topicName, gradeLevel) {
  const settings = [
    "the hallway before class",
    "the lunch tables",
    "the bus line",
    "your science group",
    "the library corner",
    "the gym before PE",
    "outside during break",
    "near the lockers",
    "waiting for pickup",
    "working on a class project"
  ];

  const actions = {
    "small-talk-basics": [
      "you notice someone you know and want to say something friendly",
      "someone is talking about their weekend plans",
      "a classmate is wearing something cool and you want to comment",
      "a friend sits next to you and you want to start chatting"
    ],
    "active-listening": [
      "someone is telling a story and you want to show you're listening",
      "a friend shares something important",
      "a group is talking and you want to follow along",
      "someone explains something and you need to respond naturally"
    ],
    "joining-groups": [
      "a group of classmates is already in a conversation and you want to join",
      "your friends are chatting and you walk up",
      "you want to join a group during lunch",
      "a few kids are discussing a game and you want to be part of it"
    ],
    "confidence-building": [
      "you want to say something but feel unsure",
      "you want to share an idea with the group",
      "you want to speak up during class",
      "you want to introduce yourself to someone"
    ],
    "resolving-conflicts": [
      "a misunderstanding pops up with a friend",
      "someone seems upset and you want to respond calmly",
      "you and a classmate disagree about something",
      "a small argument happened and you want to fix it"
    ]
  };

  const setting = settings[Math.floor(Math.random() * settings.length)];
  const activity = (actions[topicName] || actions["small-talk-basics"])[
    Math.floor(Math.random() * (actions[topicName] || actions["small-talk-basics"]).length)
  ];

  return `Imagine you're at ${setting}, and ${activity}.`;
}

// ---------------------------------------------------------
// MAIN GENERATION ENGINE
// ---------------------------------------------------------
export async function generateConversationResponse({
  openai,
  currentPhase,
  history,
  learnerName,
  gradeLevel,
  difficulty,
  scenario
}) {
  const persona = personaEngine.getPersona(gradeLevel);
  const topicName =
    scenario?.topicName ||
    scenario?.title ||
    scenario?.topicId ||
    "this skill";

  const lastUserTurn = history.filter((m) => m.role === "user").slice(-1)[0];
  const userText = lastUserTurn?.content || "";

  // Generate a fresh scenario every time we need one
  const freshScenario = generateFreshScenario(topicName, gradeLevel);

  // ---------------------------------------------------------
  // SYSTEM PROMPT — This is Cue's personality + autonomy
  // ---------------------------------------------------------
  const system = `
You are CUE — a warm, upbeat, friendly, human-like social coach.
You speak naturally, like ChatGPT voice: clear, calm, supportive, warm.
No emojis. No robotic templates. No clipped short answers.

GOALS:
- Help the learner practice real communication skills.
- Speak like a friendly mentor or peer (age-aware).
- Use natural full sentences, not fragments.
- Keep responses short (1–2 sentences), but expressive and human.
- Follow the topic: ${topicName}.
- Adjust tone to grade level: ${gradeLevel}.
- Encourage, support, and respond to what the learner says.
- Never repeat the same scenario. Keep things fresh each session.

CONVERSATION RULES:
- Never cut yourself off. Always finish full thoughts.
- Never speak in list format.
- Never lecture.
- Never use strict “steps."
- Stay focused on the skill through natural conversation.
- If the learner seems unsure, gently guide them.
- If demonstrating, speak in a natural example sentence.
- If asking them to try, be clear but warm.

PHASE BEHAVIOR (soft, not restrictive):
• INTRO: Greet warmly + ask something simple.
• PREVIEW: Briefly explain what you'll practice today, using a new scenario.
• DEMONSTRATE: Give one natural example of what YOU would say.
• REPEAT: Ask them to try it.
• TEACHING: Respond to their attempt with praise + a tiny tip.
• VARIATION: Introduce a NEW scenario variation and continue practicing.
• COMPLETE: Wrap up warmly.

Remember:
You are a real conversational partner — not a script.
You improvise naturally but always support the learner.
`;

  // ---------------------------------------------------------
  // USER PROMPT = context of conversation so far
  // ---------------------------------------------------------
  const user = `
Learner name: ${learnerName || "friend"}
Current phase: ${currentPhase}

Fresh scenario you can use:
"${freshScenario}"

Recent conversation:
${history
  .slice(-8)
  .map((m) => `${m.role === "assistant" ? "Cue" : "Learner"}: ${m.content}`)
  .join("\n")}

Now generate Cue's next natural response + choose the next phase.

Output JSON exactly like this:
{
  "aiResponse": "your natural message here",
  "nextPhase": "PHASE_NAME"
}
`;

  // ---------------------------------------------------------
  // OpenAI call
  // ---------------------------------------------------------
  let result;
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.95,
      max_tokens: 220,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    });

    result = res.choices[0]?.message?.content;
  } catch (err) {
    console.error("AutonomyEngine OpenAI Error:", err);
    return {
      aiResponse: "I think I lost my place for a second — want to continue?",
      nextPhase: "repeat"
    };
  }

  // ---------------------------------------------------------
  // Parse JSON safely
  // ---------------------------------------------------------
  let parsed;
  try {
    parsed = JSON.parse(result);
  } catch (e) {
    console.warn("Failed to parse AI JSON, recovering…", e);

    return {
      aiResponse: clean(result || "Let's keep going together."),
      nextPhase: "repeat"
    };
  }

  return {
    aiResponse: clean(parsed.aiResponse || ""),
    nextPhase: parsed.nextPhase || "repeat"
  };
}
