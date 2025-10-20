import React from 'react';
import { Play, Clock, Sparkles, TrendingUp, MessageCircle, Ear, Users, Zap } from 'lucide-react';
import { getSessionProgress } from './utils/storage';

function HomeScreen({ userData, onNavigate, darkMode, soundEffects }) {
  const sessions = [
    { id: 1, title: 'Small Talk Mastery', subtitle: 'Break the ice with confidence', category: 'Conversation Starters', duration: '15 min', level: 'Beginner', color: '#4A90E2', icon: <MessageCircle className="w-8 h-8" /> },
    { id: 2, title: 'Active Listening', subtitle: 'Master the art of truly hearing others', category: 'Communication', duration: '20 min', level: 'Intermediate', color: '#34D399', icon: <Ear className="w-8 h-8" /> },
    { id: 3, title: 'Body Language', subtitle: 'Read and project confident signals', category: 'Non-Verbal', duration: '18 min', level: 'Beginner', color: '#8B5CF6', icon: <Users className="w-8 h-8" /> },
    { id: 4, title: 'Confidence Amplifier', subtitle: 'Transform your social presence', category: 'Personal Growth', duration: '25 min', level: 'All Levels', color: '#14B8A6', icon: <Zap className="w-8 h-8" /> },
  ];

  const sessionsWithProgress = sessions.map(session => ({
    ...session,
    progress: getSessionProgress(session.id)
  }));

  const stats = [
    { label: 'Day Streak', value: String(userData?.streak || 0), icon: <Sparkles className="w-5 h-5" />, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Sessions', value: String(userData?.totalSessions || 0), icon: <Play className="w-5 h-5" />, gradient: 'from-blue-400 to-blue-500' },
    { label: 'Confidence', value: `${userData?.confidenceScore || 0}%`, icon: <TrendingUp className="w-5 h-5" />, gradient: 'from-purple-400 to-purple-500' }
  ];

  return (
    <div className="pb-24">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-end justify-center" style={{letterSpacing: '-2px'}}>
              <span className={`font-extrabold text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Social</span>
              <span className={`font-extrabold text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{marginRight: '6px'}}>C</span>
              <div className="flex flex-col items-center justify-end" style={{marginBottom: '7px', height: '62px', gap: '10px'}}>
                <div className="flex smile-eyes" style={{gap: '16px'}}>
                  <div className="rounded-full" style={{width: '7px', height: '7px', background: '#4A90E2'}}></div>
                  <div className="rounded-full" style={{width: '7px', height: '7px', background: '#4A90E2'}}></div>
                </div>
                <div className="smile-mouth" style={{
                  width: '35px',
                  height: '22px',
                  borderLeft: '5px solid #34D399',
                  borderRight: '5px solid #34D399',
                  borderBottom: '5px solid #34D399',
                  borderTop: 'none',
                  borderRadius: '0 0 17px 17px'
                }}></div>
              </div>
              <span className={`font-extrabold text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{marginLeft: '6px'}}>e</span>
            </div>

            <div className="text-right">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back,</div>
              <div className="font-bold text-2xl" style={{
                background: 'linear-gradient(to right, #60a5fa, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {userData?.userName || 'Alex'}
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <div className="relative rounded-3xl overflow-hidden" style={{height: '300px'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-400"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="mb-3">
                <span className="bg-emerald-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">FEATURED</span>
              </div>
              <h1 className="text-3xl font-bold mb-3 text-white">Master Small Talk</h1>
              <p className="text-base mb-4 opacity-90 max-w-2xl text-white">Learn conversation starters that work in any situation</p>
              <div className="flex items-center gap-4">
                <button onClick={() => onNavigate('practice', 1)} className="bg-white text-black font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors">
                  <Play className="w-5 h-5" fill="black" />
                  Start Session
                </button>
                <div className="text-sm opacity-90 text-white">15 min • Beginner</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className={`backdrop-blur-xl border rounded-2xl p-4 transition-all text-center ${
                darkMode ? 'bg-white/8 border-white/20 hover:bg-white/12' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
              }`}>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>{stat.value}</div>
                <div className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Continue Learning</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {sessionsWithProgress.map(session => (
              <div key={session.id} className={`backdrop-blur-xl border rounded-2xl overflow-hidden hover:border-white/30 transition-all cursor-pointer group flex-shrink-0 w-72 flex flex-col ${
                darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="p-5 flex items-center justify-between min-h-[90px]" style={{backgroundColor: `${session.color}DD`}}>
                  <div className="flex-1 pr-3">
                    <h3 className="text-lg font-bold mb-1 text-white">{session.title}</h3>
                    <p className="text-white/90 text-xs font-medium">{session.subtitle}</p>
                  </div>
                  <div className="text-white group-hover:scale-110 transition-transform flex-shrink-0">
                    {React.cloneElement(session.icon, { className: 'w-6 h-6' })}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{session.category}</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{session.level}</span>
                  </div>
                  <div className="flex-1"></div>
                  <button onClick={() => onNavigate('practice', session.id)} className="w-full bg-blue-500 text-white font-bold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-blue-600 transition-all text-sm mb-4">
                    <Play className="w-4 h-4" fill="white" />
                    {session.progress > 0 ? 'Continue' : 'Begin'}
                  </button>
                  {session.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Progress</span>
                        <span className="text-xs font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{session.progress}%</span>
                      </div>
                      <div className={`rounded-full h-2 overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                        <div className="h-full rounded-full" style={{width: `${session.progress}%`, backgroundColor: session.color}}></div>
                      </div>
                    </div>
                  )}
                  <div className={`flex items-center justify-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {session.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomeScreen;