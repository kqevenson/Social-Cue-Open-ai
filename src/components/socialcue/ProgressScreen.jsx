import React from 'react';
import { Sparkles, Play, TrendingUp, Award, Target, Users, Zap } from 'lucide-react';

function ProgressScreen({ userData, darkMode }) {
  return (
    <div className="pb-24 px-6 py-8">
      <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Progress</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`backdrop-blur-xl border rounded-2xl p-6 text-center ${
          darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-2">
            {userData?.streak || 0}
          </div>
          <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Day Streak</div>
        </div>
        <div className={`backdrop-blur-xl border rounded-2xl p-6 text-center ${
          darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">
            {userData?.totalSessions || 0}
          </div>
          <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Sessions</div>
        </div>
        <div className={`backdrop-blur-xl border rounded-2xl p-6 text-center ${
          darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent mb-2">
            {userData?.confidenceScore || 0}%
          </div>
          <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Confidence</div>
        </div>
      </div>

      <div className={`backdrop-blur-xl border rounded-2xl p-6 mb-6 ${
        darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
        <div className="space-y-3">
          {[
            { title: 'Active Listening Deep Dive', time: '2 hours ago', progress: 45 },
            { title: 'Small Talk Mastery', time: 'Yesterday', progress: 100 },
            { title: 'Body Language Decoded', time: '2 days ago', progress: 30 }
          ].map((activity, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${
              darkMode ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex-1">
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.title}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activity.time}</div>
              </div>
              <div className="text-emerald-400 font-bold">{activity.progress}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`backdrop-blur-xl border rounded-2xl p-6 ${
        darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <Sparkles className="w-8 h-8" />, title: 'Week Streak', unlocked: true, color: '#F59E0B' },
            { icon: <Award className="w-8 h-8" />, title: 'First Session', unlocked: true, color: '#34D399' },
            { icon: <Target className="w-8 h-8" />, title: '10 Sessions', unlocked: true, color: '#4A90E2' },
            { icon: <TrendingUp className="w-8 h-8" />, title: '50 Sessions', unlocked: false, color: '#8B5CF6' },
            { icon: <Zap className="w-8 h-8" />, title: 'Perfect Week', unlocked: false, color: '#EC4899' },
            { icon: <Users className="w-8 h-8" />, title: 'Master', unlocked: false, color: '#14B8A6' }
          ].map((achievement, i) => (
            <div key={i} className={`p-4 rounded-xl text-center ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-emerald-500/30' 
                : darkMode ? 'bg-white/5 opacity-50' : 'bg-gray-100 opacity-60'
            }`}>
              <div className="flex items-center justify-center mb-2" style={{ color: achievement.unlocked ? achievement.color : '#9ca3af' }}>
                {achievement.icon}
              </div>
              <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{achievement.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressScreen;