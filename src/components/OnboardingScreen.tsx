import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    role: '',
    name: '',
    gradeLevel: '',
    email: '',
    password: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [step]);

  const roles = [
    { 
      id: 'learner', 
      label: 'Learner', 
      description: 'I want to practice social skills'
    },
    { 
      id: 'parent', 
      label: 'Parent/Guardian', 
      description: 'I\'m here to support my learner'
    },
    { 
      id: 'teacher', 
      label: 'Teacher', 
      description: 'I want to help my learners'
    }
  ];

  const gradeLevels = [
    { id: 'k', label: 'Kindergarten' },
    { id: '1', label: '1st Grade' },
    { id: '2', label: '2nd Grade' },
    { id: '3', label: '3rd Grade' },
    { id: '4', label: '4th Grade' },
    { id: '5', label: '5th Grade' },
    { id: '6', label: '6th Grade' },
    { id: '7', label: '7th Grade' },
    { id: '8', label: '8th Grade' },
    { id: '9', label: '9th Grade' },
    { id: '10', label: '10th Grade' },
    { id: '11', label: '11th Grade' },
    { id: '12', label: '12th Grade' }
  ];

  const handleRoleSelect = (roleId) => {
    setUserData({ ...userData, role: roleId });
    if (roleId === 'learner') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleGradeSelect = (gradeId) => {
    setUserData({ ...userData, gradeLevel: gradeId });
    setStep(3);
  };

  const handleNameSubmit = () => {
    if (userData.name.trim()) {
      const finalData = { 
        ...userData, 
        gradeLevel: userData.gradeLevel || 'adult' 
      };
      onComplete(finalData);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div 
        className="max-w-2xl w-full relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div>
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-12">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="text-center mb-8">
                {/* Question with integrated wordmark */}
                <div className="flex items-end justify-center" style={{letterSpacing: '-1px'}}>
                  <span className="font-extrabold text-3xl text-white" style={{marginRight: '8px'}}>Who will be using</span>
                  <span className="font-extrabold text-3xl text-white">Social</span>
                  <span className="font-extrabold text-3xl text-white" style={{marginRight: '3px'}}>C</span>
                  <div className="flex flex-col items-center justify-end smile-container" style={{marginBottom: '1px', height: '32px', gap: '6px'}}>
                    <div className="flex smile-eyes" style={{gap: '10px'}}>
                      <div className="rounded-full" style={{width: '4px', height: '4px', background: '#4A90E2'}}></div>
                      <div className="rounded-full" style={{width: '4px', height: '4px', background: '#4A90E2'}}></div>
                    </div>
                    <div className="smile-mouth" style={{
                      width: '24px',
                      height: '15px',
                      borderLeft: '3px solid #34D399',
                      borderRight: '3px solid #34D399',
                      borderBottom: '3px solid #34D399',
                      borderTop: 'none',
                      borderRadius: '0 0 12px 12px'
                    }}></div>
                  </div>
                  <span className="font-extrabold text-3xl text-white" style={{marginLeft: '3px'}}>e</span>
                  <span className="font-extrabold text-3xl text-white" style={{marginLeft: '4px'}}>?</span>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                I am a...
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {roles.map((role, index) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group relative bg-gradient-to-br from-blue-500/50 to-emerald-400/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-blue-500/60 hover:to-emerald-400/60 border-2 border-blue-500/60 hover:border-blue-500"
                  >
                    <div className="text-lg font-bold mb-2">{role.label}</div>
                    <div className="text-sm text-gray-200">{role.description}</div>
                    <ArrowRight className="w-5 h-5 absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Grade Level Selection */}
        {step === 2 && userData.role === 'learner' && (
          <div>
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              ← Back
            </button>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-3">What grade are you in?</h2>
              <p className="text-gray-400 mb-8">This helps us customize scenarios and language for you</p>

              <div className="relative">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {gradeLevels.map(grade => (
                    <button
                      key={grade.id}
                      onClick={() => handleGradeSelect(grade.id)}
                      className="bg-zinc-800/80 rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-zinc-700 hover:border-blue-500"
                    >
                      <div className="text-sm font-bold">{grade.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Name Input */}
        {step === 3 && (
          <div>
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>

            <button
              onClick={() => setStep(userData.role === 'learner' ? 2 : 1)}
              className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              ← Back
            </button>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-3">
                {userData.role === 'learner' ? "What's your name?" : "What should we call you?"}
              </h2>
              <p className="text-gray-400 mb-8">We'll use this to personalize your experience</p>

              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Enter your name"
                autoFocus
                className="w-full bg-black/40 border-2 border-white/20 rounded-2xl px-6 py-4 text-lg mb-6 focus:border-blue-500 focus:outline-none transition-colors"
              />

              <button
                onClick={handleNameSubmit}
                disabled={!userData.name.trim()}
                className={`w-full font-bold px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300 ${
                  userData.name.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-400 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
                    : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
                {userData.name.trim() && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes smileWiggle {
          0%, 100% { 
            transform: translateY(0) scaleY(1);
          }
          50% { 
            transform: translateY(-2px) scaleY(1.1);
          }
        }
        
        @keyframes eyeBlink {
          0%, 90%, 100% { 
            transform: scaleY(1);
          }
          95% { 
            transform: scaleY(0.1);
          }
        }

        .smile-mouth {
          animation: smileWiggle 3s ease-in-out infinite;
          transform-origin: top center;
        }
        
        .smile-eyes > div {
          animation: eyeBlink 6s ease-in-out infinite;
        }
        
        .smile-eyes > div:nth-child(2) {
          animation-delay: 0.15s;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4A90E2;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34D399;
        }
      `}</style>
    </div>
  );
}