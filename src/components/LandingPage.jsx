import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, MessageCircle, Brain, Users, Sparkles, Check, Star } from 'lucide-react';

function LandingPage({ onGetStarted }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, #4A90E2 0%, transparent 50%),
                       radial-gradient(circle at 20% 80%, #34D399 0%, transparent 50%)`,
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      />

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero Wordmark */}
          <div className="flex items-end justify-center mb-8" style={{letterSpacing: '-2px'}}>
            <span className="font-extrabold text-7xl md:text-8xl text-white">Social</span>
            <span className="font-extrabold text-7xl md:text-8xl text-white" style={{marginRight: '6px'}}>C</span>
            <div className="flex flex-col items-center justify-end" style={{marginBottom: '7px', height: '80px', gap: '14px'}}>
              <div className="flex smile-eyes" style={{gap: '24px'}}>
                <div className="rounded-full" style={{width: '10px', height: '10px', background: '#4A90E2'}}></div>
                <div className="rounded-full" style={{width: '10px', height: '10px', background: '#4A90E2'}}></div>
              </div>
              <div className="smile-mouth" style={{
                width: '42px',
                height: '26px',
                borderLeft: '6px solid #34D399',
                borderRight: '6px solid #34D399',
                borderBottom: '6px solid #34D399',
                borderTop: 'none',
                borderRadius: '0 0 21px 21px'
              }}></div>
            </div>
            <span className="font-extrabold text-7xl md:text-8xl text-white" style={{marginLeft: '6px'}}>e</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Master Social Situations with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Real-Time AI Coaching
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Build confidence, read social cues, and connect authentically—guided by AI that understands you.
          </p>

          <button 
            onClick={handleGetStarted}
            className="group bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold px-12 py-5 rounded-full flex items-center gap-3 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 mx-auto"
          >
            <Play className="w-6 h-6" fill="white" />
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-gray-400 mt-6 text-sm">No credit card required • 7-day free trial</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">SocialCue</span> Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Practice Scenarios</h3>
              <p className="text-gray-300">
                Role-play realistic social situations in a safe, judgment-free environment. Learn at your own pace.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-emerald-500/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Coaching</h3>
              <p className="text-gray-300">
                Get instant, personalized feedback on your responses. Understand what works and why.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Track Progress</h3>
              <p className="text-gray-300">
                Watch your confidence grow with detailed analytics and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Transform Your Social Confidence
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Build Real Skills</h3>
                    <p className="text-gray-400">Practice makes perfect. Our scenarios prepare you for real-world interactions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Personalized Learning</h3>
                    <p className="text-gray-400">AI adapts to your grade level and learning style for maximum effectiveness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Safe Environment</h3>
                    <p className="text-gray-400">No judgment, no pressure. Learn and grow at your own pace.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 p-8 backdrop-blur border border-white/10">
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="font-bold">Practice Scenario</div>
                        <div className="text-sm text-gray-400">Starting a conversation</div>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm">
                      "Hey, is this seat taken?"
                    </div>
                  </div>
                  <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-bold text-emerald-400 mb-1">Great approach!</div>
                        <div className="text-gray-300">You were polite and showed respect for their space.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative px-6 py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Real People. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Real Results.</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "I used to dread networking events. Now I actually look forward to them! SocialCue has completely transformed how I approach conversations."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500"></div>
                <div>
                  <p className="font-bold">Sarah M.</p>
                  <p className="text-sm text-gray-400">Marketing Professional</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "As someone with social anxiety, this app has been a game-changer. The real-time support gives me the confidence I need to engage."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                <div>
                  <p className="font-bold">James T.</p>
                  <p className="text-sm text-gray-400">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Level Up Your Social Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of people building genuine connections with confidence.
          </p>
          <button 
            onClick={handleGetStarted}
            className="group bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold px-12 py-5 rounded-full flex items-center gap-3 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 mx-auto"
          >
            <Play className="w-6 h-6" fill="white" />
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">Features</li>
                <li className="hover:text-white cursor-pointer transition">Pricing</li>
                <li className="hover:text-white cursor-pointer transition">How It Works</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">About</li>
                <li className="hover:text-white cursor-pointer transition">Blog</li>
                <li className="hover:text-white cursor-pointer transition">Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">Help Center</li>
                <li className="hover:text-white cursor-pointer transition">Community</li>
                <li className="hover:text-white cursor-pointer transition">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">Privacy</li>
                <li className="hover:text-white cursor-pointer transition">Terms</li>
                <li className="hover:text-white cursor-pointer transition">Security</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 pt-8 border-t border-white/10">
            <p>&copy; 2025 SocialCue. All rights reserved.</p>
          </div>
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
      `}</style>
    </div>
  );
}

export default LandingPage;