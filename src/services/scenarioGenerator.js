// scenarioGenerator.js
import practiceTopics, { flattenPracticeScenarios } from '../content/practiceTopics';

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export function generateAdaptiveScenario({
  topicId,
  gradeLevel,
  lastScenarioId = null,
  previousDifficulty = null,
  successRate = 0.5
}) {
  const allScenarios = flattenPracticeScenarios();
  const topicScenarios = allScenarios.filter((s) => s.topicId === topicId);

  if (topicScenarios.length === 0) {
    console.warn('⚠ No scenarios for topic:', topicId);
    return null;
  }

  let targetDifficulty;

  if (!previousDifficulty) {
    targetDifficulty = 'easy';
  } else {
    const idx = DIFFICULTY_ORDER.indexOf(previousDifficulty);
    if (successRate > 0.7 && idx < 2) targetDifficulty = DIFFICULTY_ORDER[idx + 1];
    else if (successRate < 0.4 && idx > 0) targetDifficulty = DIFFICULTY_ORDER[idx - 1];
    else targetDifficulty = previousDifficulty;
  }

  let candidates = topicScenarios.filter((s) => s.difficulty === targetDifficulty);
  if (candidates.length === 0) candidates = [...topicScenarios];

  candidates = candidates.filter((s) => s.id !== lastScenarioId);
  if (candidates.length === 0) return topicScenarios[0];

  const choice = shuffle(candidates)[0];

  return {
    ...choice,
    difficulty: choice.difficulty,
    topicId,
    usedDifficulty: targetDifficulty
  };
}
