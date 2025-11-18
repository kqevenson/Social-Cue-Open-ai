// personaEngine.js — Social Cue persona definitions (2025 clean version)

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* -----------------------------------------------------
   PERSONA: KINDERGARTEN – 2ND GRADE
------------------------------------------------------*/
const personaK2 = {
  key: "k-2",

  greet() {
    return pick([
      "Hey! I'm Cue — let's practice together.",
      "Hi! I'm Cue. Ready to start?",
      "Hey there! I'm Cue — let's jump in."
    ]);
  },

  checkIn() {
    return "How are you feeling before we get started?";
  },

  scenarioLeadIn(scene) {
    return `Imagine this: ${scene.description}. What would you say?`;
  },

  teachTip() {
    const tips = [
      "Try using a kind voice.",
      "You can smile when you talk.",
      "You can start with a simple hello.",
      "You can ask one small question.",
    ];
    return `${random(tips)} Your turn!`;
  },

  variationCue(scene) {
    return `Let's try a variation: ${scene.description}. What would you say now?`;
  },

  praise() {
    return random([
      "Great job! 🎉",
      "Nice try! 😊",
      "You’re doing awesome!",
      "I love that answer!",
    ]);
  },
};

/* -----------------------------------------------------
   PERSONA: 3RD – 5TH GRADE
------------------------------------------------------*/
const persona35 = {
  key: "3-5",

  greet() {
    return pick([
      "Hey! I'm Cue — let's practice together.",
      "Hi! I'm Cue. Ready to start?",
      "Hey there! I'm Cue — let's jump in."
    ]);
  },

  checkIn() {
    return "How are you feeling before we get started?";
  },

  scenarioLeadIn(scene) {
    return `Imagine this: ${scene.description}. What would you say?`;
  },

  teachTip() {
    const tips = [
      "Try adding one friendly question.",
      "You can notice something and comment on it.",
      `A simple “Hey, what’s up?” works great.`,
    ];
    return `${random(tips)} Your turn to try.`;
  },

  variationCue(scene) {
    return `Let's try a variation: ${scene.description}. What would you say now?`;
  },

  praise() {
    return random([
      "Nice move! 👍",
      "That was smooth!",
      "Love that answer!",
      "You’re getting good at this!",
    ]);
  },
};

/* -----------------------------------------------------
   PERSONA: 6TH – 8TH GRADE
------------------------------------------------------*/
const persona68 = {
  key: "6-8",

  greet() {
    return pick([
      "Hey! I'm Cue — let's practice together.",
      "Hi! I'm Cue. Ready to start?",
      "Hey there! I'm Cue — let's jump in."
    ]);
  },

  checkIn() {
    return "How are you feeling before we get started?";
  },

  scenarioLeadIn(scene) {
    return `Imagine this: ${scene.description}. What would you say?`;
  },

  teachTip() {
    const tips = [
      "Try reacting to what they said and add one detail.",
      "Ask a simple follow-up to keep things going.",
      "You can make it feel real by noticing something around you.",
    ];
    return `${random(tips)} Want to try that out?`;
  },

  variationCue(scene) {
    return `Let's try a variation: ${scene.description}. What would you say now?`;
  },

  praise() {
    return random([
      "Nice. 🔥",
      "Solid answer.",
      "Smooth response.",
      "Great instincts.",
    ]);
  },
};

/* -----------------------------------------------------
   PERSONA: 9TH – 12TH GRADE
------------------------------------------------------*/
const persona912 = {
  key: "9-12",

  greet() {
    return pick([
      "Hey! I'm Cue — let's practice together.",
      "Hi! I'm Cue. Ready to start?",
      "Hey there! I'm Cue — let's jump in."
    ]);
  },

  checkIn() {
    return "How are you feeling before we get started?";
  },

  scenarioLeadIn(scene) {
    return `Imagine this: ${scene.description}. What would you say?`;
  },

  teachTip() {
    const tips = [
      "Try grounding your response in something real they said.",
      "Add a follow-up question so it doesn’t feel one-sided.",
      "Keep it honest and not over-polished.",
    ];
    return `${random(tips)} Give me your version.`;
  },

  variationCue(scene) {
    return `Let's try a variation: ${scene.description}. What would you say now?`;
  },

  praise() {
    return random([
      "Good call.",
      "Great instinct.",
      "Nice move.",
      "Strong response.",
    ]);
  },
};

/* -----------------------------------------------------
   SELECTOR
------------------------------------------------------*/
export const personaEngine = {
  getPersona(gradeLevel) {
    const g = parseInt(gradeLevel, 10);
    if (Number.isNaN(g)) {
      // If we get a band like "6-8", just default mid-range persona
      if (String(gradeLevel).includes("k") || String(gradeLevel).includes("K")) {
        return personaK2;
      }
      if (String(gradeLevel).includes("3-5")) return persona35;
      if (String(gradeLevel).includes("6-8")) return persona68;
      if (String(gradeLevel).includes("9-12")) return persona912;
      return persona68;
    }

    if (g <= 2) return personaK2;
    if (g <= 5) return persona35;
    if (g <= 8) return persona68;
    return persona912;
  },

  // Optional helper some of your config uses:
  getPersonaKey(gradeLevel) {
    const persona = this.getPersona(gradeLevel);
    return persona.key;
  },
};

export default personaEngine;
