import React from 'react';
import { CheckCircle, Lightbulb, Target, ArrowRight, Trophy, Star } from 'lucide-react';

export default function LessonSummary({ lesson, pointsEarned, onComplete }) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Lesson Complete!</h1>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto"></div>
        </div>

        {/* Points Earned */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-3xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-yellow-400">Points Earned</h2>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-2">+{pointsEarned}</div>
          <p className="text-lg text-gray-300">Great job completing the lesson!</p>
        </div>

        {/* What You Learned */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-400">What You Learned</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {lesson.summary.whatYouLearned}
              </p>
            </div>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Lightbulb className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Key Takeaway</h2>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                <p className="text-xl text-blue-300 font-semibold leading-relaxed">
                  "{lesson.summary.keyTakeaway}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real World Challenge */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Target className="w-8 h-8 text-purple-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Your Challenge</h2>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                <p className="text-lg text-purple-300 leading-relaxed">
                  {lesson.summary.realWorldChallenge}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Topic */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-300">Ready for More?</h2>
            <p className="text-lg text-gray-400 mb-4">Next recommended topic:</p>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-2xl p-4">
              <p className="text-xl font-bold text-blue-400">{lesson.summary.nextTopic}</p>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        <div className="text-center mb-8">
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            Complete Lesson
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500">Step 4 of 4: Complete!</p>
        </div>
      </div>
    </div>
  );
}

