import React, { useEffect, useMemo, useState } from "react";
import VoiceCoachOrbScreen from "../VoiceCoachOrbScreen";
import {
  topics as voicePracticeTopics,
  getScenariosForTopic,
  getGradeBandFromGrade
} from "../../data/voicePracticeScenarios";
import { getScenarioForTopic } from "../../content/training/conversation-flow";
import { AI_BEHAVIOR_CONFIG } from "../../content/training/aibehaviorconfig";

const FALLBACK_ICON = "💬";

const PracticeScreen = ({ darkMode }) => {
  const [userGradeBand, setUserGradeBand] = useState("6-8");
  const [userGradeNumber, setUserGradeNumber] = useState(6);
  const [learnerName, setLearnerName] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("socialCueUserData");
      if (stored) {
        const parsed = JSON.parse(stored);
        const rawGrade = parsed?.gradeLevel || parsed?.grade || "6";
        const numeric = parseInt(String(rawGrade).replace(/[^0-9]/g, "") || "6", 10);
        const band = getGradeBandFromGrade(numeric).toLowerCase();
        setUserGradeBand(band);
        setUserGradeNumber(Number.isNaN(numeric) ? 6 : numeric);

        const possibleName =
          parsed?.firstName ||
          parsed?.first_name ||
          parsed?.profile?.firstName ||
          parsed?.profile?.name ||
          parsed?.displayName ||
          parsed?.name ||
          "";
        setLearnerName(possibleName);
        return;
      }
    } catch (err) {
      console.warn("Failed to parse grade level from localStorage", err);
    }
    setUserGradeBand("6-8");
    setUserGradeNumber(6);
  }, []);

  const topicPreviews = useMemo(() => {
    return voicePracticeTopics.map((topic) => {
      const gradeScenarios = getScenariosForTopic(topic.id, userGradeNumber || 6) || [];
      const sampleScenario = gradeScenarios?.[0] || null;
      const scenarioTitles = gradeScenarios.map((scenario) => scenario.title).filter(Boolean);

      return {
        topic,
        gradeScenarios,
        sampleScenario,
        scenarioTitles
      };
    });
  }, [userGradeNumber]);

  const handleStartPractice = (topic) => {
    const scenario = getScenarioForTopic(topic.id, userGradeNumber || 6);
    if (!scenario) {
      alert("No scenarios available for this topic.");
      return;
    }

    const enrichedScenario = {
      ...scenario,
      topicId: topic.id,            // REQUIRED
      topic: topic.id,              // backup alias
      difficulty: "easy",           // default for intro
      behaviorConfig: AI_BEHAVIOR_CONFIG
    };

    setSelectedSession({
      scenario: enrichedScenario,
      learnerName: learnerName || ""
    });
  };

  if (selectedSession) {
    return (
      <VoiceCoachOrbScreen
        scenario={selectedSession.scenario}
        gradeLevel={selectedSession.scenario.gradeLevel}
        learnerName={selectedSession.learnerName}
        behaviorConfig={AI_BEHAVIOR_CONFIG}
        autoStart={true}
        onEndSession={() => setSelectedSession(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className={`text-4xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Practice
      </h1>
      <p className={`mb-8 text-lg ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
        Pick a topic to try a conversation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topicPreviews.map(({ topic, gradeScenarios, sampleScenario, scenarioTitles }) => (
          <div
            key={topic.id}
            className={`rounded-3xl p-6 border transition-all hover:shadow-xl cursor-pointer ${
              darkMode ? "bg-white/5 text-white border-white/10" : "bg-white text-gray-900 border-gray-200"
            }`}
            onClick={() => handleStartPractice(topic)}
          >
            <div className="text-4xl mb-4">{topic.icon || FALLBACK_ICON}</div>
            <h2 className="text-2xl font-semibold mb-2">{topic.title}</h2>
            {topic.description && <p className="text-sm mb-3">{topic.description}</p>}

            {sampleScenario && (
              <div className={`${darkMode ? "bg-white/10" : "bg-blue-50"} rounded-xl p-4`}>
                <p className="text-sm font-medium">
                  Example: <span className="italic">{sampleScenario.title}</span>
                </p>
                {sampleScenario.contextLine && (
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-300">{sampleScenario.contextLine}</p>
                )}
              </div>
            )}

            {scenarioTitles.length > 1 && (
              <p className="text-xs mt-3 text-gray-500 dark:text-gray-300">
                Includes scenarios like {scenarioTitles.slice(0, 3).join(", ")}
                {scenarioTitles.length > 3 ? " and more." : "."}
              </p>
            )}

            <button className="mt-4 inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500">
              Start Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeScreen;