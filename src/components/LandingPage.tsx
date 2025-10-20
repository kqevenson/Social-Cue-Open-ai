import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Brain, TrendingUp, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Coaching",
      description: "Real-time feedback that adapts to your unique learning style",
      color: "#3b82f6"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Safe Practice Space",
      description: "Build confidence in a judgment-free environment",
      color: "#34d399"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Watch your social skills grow with detailed insights",
      color: "#a855f7"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Learners" },
    { value: "94%", label: "Confidence Boost" },
    { value: "500+", label: "Practice Scenarios" }
  ];

  const testimonials = [
    {
      text: "Social Cue helped me feel comfortable starting conversations. I never thought I'd enjoy networking events!",
      author: "Sarah M.",
      role: "College Student",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      text: "As a parent, I'm amazed at how much my daughter's confidence has grown. She's making friends and speaking up in class.",
      author: "Michael R.",
      role: "Parent",
      gradient: "from-emerald-400 to-blue-500"
    },
    {
      text: "The practice scenarios are so realistic. I use what I learn here every day at work.",
      author: "Jamie L.",
      role: "Young Professional",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + scrollY * 0.1}% ${50 + scrollY * 0.05}%, #4A90E2 0%, transparent 50%),
                       radial-gradient(circle at ${20 - scrollY * 0.08}% ${80 - scrollY * 0.06}%, #34D399 0%, transparent 50%)`,
          transition: 'background 0.3s ease-out'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div 
            style={{
              opacity: 1,
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Hero Wordmark */}
            <div className="flex items-end justify-center mb-8" style={{letterSpacing: '-2px'}}>
              <span className="font-extrabold text-7xl md:text-8xl text-white">Social</span>
              <span className="font-extrabold text-7xl md:text-8xl text-white" style={{marginRight: '6px'}}>C</span>
              <div className="flex flex-col items-center justify-end" style={{marginBottom: '9px', height: '80px', gap: '14px'}}>
                <div className="flex smile-eyes" style={{gap: '28px'}}>
                  <div className="rounded-full" style={{width: '12px', height: '12px', background: '#4A90E2'}}></div>
                  <div className="rounded-full" style={{width: '12px', height: '12px', background: '#4A90E2'}}></div>
                </div>
                <div className="smile-mouth" style={{
                  width: '60px',
                  height: '37px',
                  borderLeft: '8px solid #34D399',
                  borderRight: '8px solid #34D399',
                  borderBottom: '8px solid #34D399',
                  borderTop: 'none',
                  borderRadius: '0 0 30px 30px'
                }}></div>
              </div>
              <span className="font-extrabold text-7xl md:text-8xl text-white" style={{marginLeft: '6px'}}>e</span>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Real-time coaching for real-world connection
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                onClick={() => navigate('/home')}
                className="group bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold px-8 py-4 rounded-full flex items-center gap-3 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <Play className="w-6 h-6" fill="white" />
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="font-bold px-8 py-4 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Floating Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {stats.map((stat, i) => (
                <div 
                  key={i}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-4xl mx-auto">
            <div 
              className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700 shadow-2xl"
              style={{
                transform: `translateY(${scrollY * -0.1}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="bg-black rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-transparent border border-blue-500/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-2">AI Coach</div>
                    <div className="text-left">Try asking: "What did you do this weekend?"</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-xl p-4 ml-8">
                    <div className="text-sm text-gray-400 mb-2">You</div>
                    <div className="text-left">Great start! Now listen for their response...</div>
                  </div>

                  <div className="flex justify-center gap-2 py-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div 
              className="absolute -left-8 top-1/4 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl px-6 py-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">Confidence +15%</span>
              </div>
            </div>

            <div 
              className="absolute -right-8 top-1/3 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-6 py-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                <span className="text-sm font-semibold">7 Day Streak!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-32 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Practice in safe, realistic scenarios designed by social skills experts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="group relative bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-zinc-600 transition-all duration-500 hover:scale-105"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `${feature.color}20`,
                    border: `2px solid ${feature.color}40`
                  }}
                >
                  <div style={{color: feature.color}}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Loved by Thousands</h2>
            <p className="text-xl text-gray-400">Real stories from real learners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 h-full">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} mb-6`}></div>
                <p className="text-lg mb-6 leading-relaxed">{testimonial.text}</p>
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-blue-600 to-emerald-500 rounded-[3rem] p-16 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">Ready to Feel Confident?</h2>
              <p className="text-xl mb-10 opacity-90">
                Join thousands of learners building real social skills
              </p>
              <button 
                onClick={() => navigate('/home')}
                className="group bg-white text-black font-bold px-10 py-5 rounded-full text-lg flex items-center gap-3 mx-auto hover:shadow-2xl hover:shadow-white/40 transition-all duration-300 hover:scale-110"
              >
                Start Your Journey Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <p className="text-sm mt-6 opacity-75">No credit card required • 7-day free trial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Social Cue. Real-time coaching for real-world connection.</p>
        </div>
      </footer>

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

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #4A90E2;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #34D399;
        }
      `}</style>
    </div>
  );
}