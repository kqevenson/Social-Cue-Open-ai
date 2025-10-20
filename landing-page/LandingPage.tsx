import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle, MessageCircle, Brain, Target, BarChart3, Users, Award, Star, Quote, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Interactive Scenarios",
      description: "Practice real-world conversations with AI-powered scenarios that adapt to your skill level and learning pace.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Brain,
      title: "AI-Powered Feedback",
      description: "Get instant, personalized feedback on your responses with detailed explanations and improvement suggestions.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Personalized Coaching",
      description: "AI coach that learns your patterns and provides targeted advice to help you overcome specific social challenges.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics, skill assessments, and milestone celebrations.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with other learners, share experiences, and get support from peers on similar journeys.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Unlock badges, complete challenges, and celebrate your social skill milestones with gamified learning.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      avatar: "SC",
      rating: 5,
      text: "SocialCue helped me overcome my anxiety about networking events. The interactive scenarios felt so real, and the AI feedback was incredibly helpful. I went from avoiding conversations to leading team meetings!"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Manager",
      avatar: "MR",
      rating: 5,
      text: "As someone who struggled with public speaking, this platform was a game-changer. The personalized coaching helped me identify my specific challenges and gave me practical tools to improve. Now watching me present, you'd never know I used to panic!"
    },
    {
      name: "Emma Thompson",
      role: "College Student",
      avatar: "ET",
      rating: 5,
      text: "I was really shy and had trouble making friends in college. SocialCue's scenarios helped me practice conversations in a safe environment. The progress tracking kept me motivated, and now I'm much more confident in social situations."
    },
    {
      name: "David Kim",
      role: "Sales Professional",
      avatar: "DK",
      rating: 5,
      text: "The AI-powered feedback is incredible. It caught subtle things I was doing wrong that I never noticed. My sales conversations have improved dramatically, and I've built much better relationships with clients."
    },
    {
      name: "Lisa Johnson",
      role: "Teacher",
      avatar: "LJ",
      rating: 5,
      text: "I used to dread parent-teacher conferences because I felt awkward talking to parents. SocialCue helped me practice these conversations and gave me confidence. Now I actually look forward to meeting with parents!"
    },
    {
      name: "Alex Rivera",
      role: "Entrepreneur",
      avatar: "AR",
      rating: 5,
      text: "Starting a business requires so much networking and pitching. SocialCue helped me refine my communication skills and build confidence when talking to investors. The scenarios were so realistic and helpful."
    }
  ];

  const benefits = [
    "Start practicing immediately",
    "No credit card required",
    "Access to all features",
    "Cancel anytime"
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">Social</span>
                <div className="relative">
                  <span className="text-2xl font-black text-white">C</span>
                  <div className="absolute -top-1 left-0 w-full h-6 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-emerald-500 rounded-full -ml-2"></div>
                  </div>
                  <div className="absolute -bottom-1 left-0 w-8 h-4 border-l-3 border-r-3 border-b-3 border-emerald-500 rounded-b-full"></div>
                </div>
                <span className="text-2xl font-black text-white">e</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Sign In
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-full hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800">
              <div className="py-6 space-y-4">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <button className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2">
                    Sign In
                  </button>
                  <button className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-full hover:from-blue-700 hover:to-emerald-600 transition-all duration-300">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl font-black text-white tracking-tight">Social</span>
              <div className="relative mx-2">
                <span className="text-6xl font-black text-white">C</span>
                <div className="absolute -top-2 left-0 w-full h-8 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-emerald-500 rounded-full -ml-3"></div>
                </div>
                <div className="absolute -bottom-2 left-0 w-12 h-6 border-l-4 border-r-4 border-b-4 border-emerald-500 rounded-b-full"></div>
              </div>
              <span className="text-6xl font-black text-white">e</span>
            </div>
            <p className="text-xl text-gray-400 font-medium">Master the art of social connection</p>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Build Social Skills
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Through Practice
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Interactive scenarios, AI-powered feedback, and personalized coaching to help you 
            navigate any social situation with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-full text-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <div className="flex items-center gap-3">
                <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                Start Practicing Free
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
            </button>
            
            <button className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-full text-lg hover:border-gray-400 hover:bg-gray-800 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-black"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-black"></div>
                <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-black"></div>
                <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-black"></div>
              </div>
              <span className="text-sm">Join 10,000+ learners</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <span className="text-sm">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Master Social Skills
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with proven learning methods 
              to help you build confidence in any social situation.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-300 border border-gray-700 hover:border-gray-600"
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-gray-800 rounded-full px-8 py-4 border border-gray-700">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">All features included in free plan</span>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-การใช้ bg-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-6 py-3 mb-8">
              <Quote className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Real Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Loved by Thousands of
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Social Learners
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how SocialCue has transformed the social confidence of people from all walks of life.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Quote className="w-8 h-8 text-blue-400" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-300 leading-relaxed mb-6 text-lg">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">10,000+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">4.9/5</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">95%</div>
              <div className="text-gray-400">Report Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">50+</div>
              <div className="text-gray-400">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main CTA */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Social Confidence?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of learners who are already building stronger relationships, 
              advancing their careers, and living more confidently.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-full text-xl hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                <div className="flex items-center gap-4">
                  <span>Start Your Free Journey</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
              </button>
            </div>

            {/* Benefits List */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-106" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400 mb-16">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🔒</span>
                </div>
                <span className="text-lg">100% Secure & Private</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <span className="text-lg">Instant Access</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🎯</span>
                </div>
                <span className="text-lg">Proven Results</span>
              </div>
            </div>
          </div>

          {/* Final Message */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Don't let social anxiety hold you back anymore
              </h3>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Every conversation is an opportunity to grow. Every interaction is a chance to connect. 
                With SocialCue, you'll have the tools and confidence to make the most of every social moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-full text-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105">
                  Get Started Now - It's Free
                </button>
                <button className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-full text-lg hover:border-gray-400 hover:bg-gray-700 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Social Proof Numbers */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">2M+</div>
              <div className="text-gray-400">Conversations Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">98%</div>
              <div className="text-gray-400">User Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">24/7</div>
              <div className="text-gray-400">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">Free</div>
              <div className="text-gray-400">Forever Plan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-black text-white">Social</span>
                <div className="relative">
                  <span className="text-2xl font-black text-white">C</span>
                  <div className="absolute -top-1 left-0 w-full h-6 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-emerald-500 rounded-full -ml-2"></div>
                  </div>
                  <div className="absolute -bottom-1 left-0 w-8 h-4 border-l-3 border-r-3 border-b-3 border-emerald-500 rounded-b-full"></div>
                </div>
                <span className="text-2xl font-black text-white">e</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Master the art of social connection through AI-powered practice scenarios and personalized coaching.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-white">📱</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-white">🐦</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-white">📘</span>
                </div>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SocialCue. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with ❤️ for better social connections</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}