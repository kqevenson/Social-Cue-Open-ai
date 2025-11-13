import React, { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { flattenPracticeScenarios, getPracticeTopicById } from "../../content/practiceTopics";

const palette = [
  "from-purple-500/80 via-pink-500/70 to-rose-500/80",
  "from-indigo-500/80 via-blue-500/70 to-cyan-500/80",
  "from-fuchsia-500/80 via-purple-500/70 to-indigo-500/80",
  "from-amber-500/80 via-orange-500/70 to-rose-500/80"
];

const PracticeSelection = ({ onTopicSelect, onClose, topicIdFilter }) => {
  const scenarios = useMemo(() => flattenPracticeScenarios(), []);

  const filteredScenarios = useMemo(() => {
    if (!topicIdFilter) return scenarios;
    return scenarios.filter((scenario) => scenario.topicId === topicIdFilter);
  }, [scenarios, topicIdFilter]);

  const headerTopic = topicIdFilter ? getPracticeTopicById(topicIdFilter) : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white pb-24">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-fuchsia-500 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-64 w-64 rounded-full bg-purple-500 blur-3xl" />
        <div className="absolute bottom-16 left-1/4 h-80 w-80 rounded-full bg-rose-500 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <header className="mb-10 flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-lg transition hover:bg-white/20"
            aria-label="Back to practice"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Voice Practice</p>
            <h1 className="text-4xl font-semibold">
              {headerTopic ? headerTopic.title : "Pick a scenario to rehearse"}
            </h1>
            {headerTopic && (
              <p className="mt-1 text-white/70 max-w-2xl">{headerTopic.description}</p>
            )}
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {filteredScenarios.map((scenario, index) => (
            <button
              key={`${scenario.topicId}-${scenario.id}`}
              onClick={() => onTopicSelect?.(scenario)}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${
                palette[index % palette.length]
              } p-6 text-left shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent)] opacity-80" />
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-3xl transition group-hover:translate-x-2" />

              <div className="relative flex h-full flex-col gap-6">
                <div className="flex items-start justify-between">
                  <span className="text-5xl drop-shadow-sm">{scenario.topicIcon || "🎯"}</span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
                    {scenario.topicTitle}
                  </span>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold leading-tight">{scenario.title}</h2>
                  <p className="text-sm text-white/80">{scenario.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between text-sm font-semibold text-white/80">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                    Guided Coaching
                  </span>
                  <span className="transition group-hover:translate-x-1">Tap to begin →</span>
                </div>
              </div>
            </button>
          ))}
        </section>

        {!filteredScenarios.length && (
          <div className="mt-20 rounded-3xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur-lg">
            <p className="text-lg text-white/80">No scenarios found yet. Try a different topic.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeSelection;
