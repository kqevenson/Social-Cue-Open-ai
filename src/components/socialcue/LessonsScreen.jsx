import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Star, Target, Users, Heart, Zap, Shield, ArrowRight, CheckCircle, PlayCircle, RotateCcw } from 'lucide-react';
import { getAllLessonProgress, getLessonProgressStats, clearLessonProgress } from '../../firebaseHelpers';
import { getUserData, saveUserData } from './utils/storage';
import ProgressCircle from './progress/ProgressCircle';
import ProgressBar from './progress/ProgressBar';
import StatusBadge from './progress/StatusBadge';
import ProgressStats from './progress/ProgressStats';
import CelebrationAnimation from './progress/CelebrationAnimation';

function LessonsScreen({ userData, onNavigate, darkMode }) {
  const [lessonProgress, setLessonProgress] = useState([]);
  const [progressStats, setProgressStats] = useState(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [progressError, setProgressError] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const [lessons, setLessons] = useState([
    {
      id: 'small-talk',
      title: 'Small Talk Mastery',
      topic: 'Small Talk Basics',
      description: 'Learn to start conversations and keep them flowing naturally',
      duration: '10-15 min',
      difficulty: 'Beginner',
      icon: Users,
      topics: ['Starting conversations', 'Finding common ground', 'Ending politely'],
      points: 50
    },
    {
      id: 'active-listening',
      title: 'Active Listening',
      topic: 'Active Listening',
      description: 'Develop skills to truly hear and understand others',
      duration: '12-18 min',
      difficulty: 'Intermediate',
      icon: Heart,
      topics: ['Paying attention', 'Asking good questions', 'Showing empathy'],
      points: 75
    },
    {
      id: 'body-language',
      title: 'Body Language',
      topic: 'Reading Body Language',
      description: 'Understand and use nonverbal communication effectively',
      duration: '15-20 min',
      difficulty: 'Intermediate',
      icon: Target,
      topics: ['Reading cues', 'Posture and gestures', 'Eye contact'],
      points: 60
    },
    {
      id: 'confidence-building',
      title: 'Building Confidence',
      topic: 'Building Confidence',
      description: 'Develop self-assurance in social situations',
      duration: '20-25 min',
      difficulty: 'Advanced',
      icon: Shield,
      topics: ['Positive self-talk', 'Overcoming fears', 'Assertiveness'],
      points: 100
    },
    {
      id: 'conflict-resolution',
      title: 'Conflict Resolution',
      topic: 'Conflict Resolution',
      description: 'Learn to handle disagreements and find solutions',
      duration: '18-22 min',
      difficulty: 'Advanced',
      icon: Zap,
      topics: ['Staying calm', 'Finding compromise', 'Apologizing'],
      points: 90
    }
  ]);

  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    // Load completed lessons from localStorage or Firebase
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading completed lessons:', error);
      }
    }
  }, []);

  const handleStartLesson = (lessonId) => {
    console.log('Starting lesson:', lessonId);
    
    if (!lessonId) {
      console.error('Lesson ID is undefined');
      return;
    }
    
    // Check if this lesson was just completed to trigger celebration
    const progress = getLessonProgressData(lessonId);
    if (progress && progress.status === 'completed') {
      setShowCelebration(true);
    }
    
    // Navigate to practice session with the lesson topic
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) {
      console.error('Lesson not found:', lessonId);
      return;
    }
    
    if (!lesson.topic) {
      console.error('Lesson topic is missing for lesson:', lessonId);
      return;
    }
    
    console.log('Starting lesson with topic:', lesson.topic);
    
    // Map lesson ID to session ID for PracticeSession and pass topicName
    const sessionIdMap = {
      'small-talk': 1,
      'active-listening': 2,
      'body-language': 3,
      'confidence-building': 4,
      'conflict-resolution': 5
    };
    
    // Update user data with the correct topicName before navigating
    const userData = getUserData();
    const updatedUserData = { ...userData, topicName: lesson.topic };
    saveUserData(updatedUserData);
    
    onNavigate('practice', sessionIdMap[lessonId] || 1);
  };

  const handleRestartLesson = async (lessonId) => {
    try {
      const userData = getUserData();
      const learnerId = userData.userId || `guest_${Date.now()}`;
      const lesson = lessons.find(l => l.id === lessonId);
      
      if (lesson) {
        // Clear lesson progress
        await clearLessonProgress(learnerId, lesson.topic);
        
        // Reload progress data
        await loadProgressData();
        
        console.log(`🔄 Restarted lesson: ${lesson.topic}`);
      }
    } catch (error) {
      console.error('Error restarting lesson:', error);
    }
  };

  const isCompleted = (lessonId) => completedLessons.includes(lessonId);

  // Load lesson progress on component mount (non-blocking)
  useEffect(() => {
    const loadLessonProgress = async () => {
      try {
        setIsLoadingProgress(true);
        setProgressError(null);
        
        const userData = getUserData();
        const learnerId = userData.userId || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('📚 Loading lesson progress for learner:', learnerId);
        
        // Load all lesson progress with timeout
        const progressPromise = getAllLessonProgress(learnerId);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Progress loading timeout')), 5000)
        );
        
        const progress = await Promise.race([progressPromise, timeoutPromise]);
        setLessonProgress(progress);
        
        // Load progress statistics
        const stats = await getLessonProgressStats(learnerId);
        setProgressStats(stats);
        
        console.log('📊 Lesson progress loaded successfully:', { progress, stats });
        
        // Try to sync any backup progress
        try {
          const backupProgress = JSON.parse(localStorage.getItem('lessonProgressBackup') || '[]');
          if (backupProgress.length > 0) {
            console.log('🔄 Found backup progress, attempting to sync...');
            // The sync will happen in PracticeSession when user starts a lesson
          }
        } catch (error) {
          console.error('❌ Error checking backup progress:', error);
        }
      } catch (error) {
        console.error('❌ Error loading lesson progress:', error);
        console.log('🔄 Progress loading failed, continuing without progress data');
        
        // Set fallback values instead of error state
        setLessonProgress([]);
        setProgressStats({
          totalLessons: lessons.length,
          completedLessons: 0,
          inProgressLessons: 0,
          notStartedLessons: lessons.length,
          completionPercentage: 0,
          totalPointsEarned: 0,
          averageScore: 0
        });
        
        // Set a warning message but don't block the UI
        setProgressError('Progress unavailable - showing lessons without progress data');
        
        // Retry loading in background after 3 seconds
        setTimeout(() => {
          console.log('🔄 Retrying progress load in background...');
          loadLessonProgress();
        }, 3000);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadLessonProgress();
  }, []);

  // Get progress for a specific lesson
  const getLessonProgressData = (lessonId) => {
    return lessonProgress.find(p => 
      (p.lessonTopic || '').toLowerCase().replace(/\s+/g, '-') === lessonId ||
      (p.lessonTopic || '').toLowerCase().includes((lessonId || '').toLowerCase())
    );
  };

  // Get lesson status and button text
  const getLessonStatus = (lessonId) => {
    // If progress loading failed, show all lessons as not started
    if (progressError) {
      return {
        status: 'not_started',
        buttonText: 'Start Lesson',
        buttonIcon: PlayCircle,
        statusColor: 'bg-gray-600',
        statusText: 'Not Started',
        progressPercentage: 0,
        currentStep: 1,
        totalSteps: 3,
        stepsCompleted: []
      };
    }

    const progress = getLessonProgressData(lessonId);
    
    if (!progress) {
      return {
        status: 'not_started',
        buttonText: 'Start Lesson',
        buttonIcon: PlayCircle,
        statusColor: 'bg-gray-600',
        statusText: 'Not Started',
        progressPercentage: 0,
        currentStep: 1,
        totalSteps: 3,
        stepsCompleted: []
      };
    }
    
    if (progress.status === 'completed') {
      return {
        status: 'completed',
        buttonText: 'Review Lesson',
        buttonIcon: RotateCcw,
        statusColor: 'bg-green-600',
        statusText: 'Completed',
        progressPercentage: 100,
        currentStep: 3,
        totalSteps: 3,
        stepsCompleted: [1, 2, 3],
        completedAt: progress.completedAt
      };
    }
    
    if (progress.status === 'in_progress') {
      const stepsCompleted = progress.stepsCompleted || [];
      const progressPercentage = Math.round((stepsCompleted.length / 3) * 100);
      
      return {
        status: 'in_progress',
        buttonText: 'Continue Lesson',
        buttonIcon: PlayCircle,
        statusColor: 'bg-blue-600',
        statusText: `Step ${progress.currentStep} of 3`,
        progressPercentage,
        currentStep: progress.currentStep || 1,
        totalSteps: 3,
        stepsCompleted
      };
    }
    
    return {
      status: 'not_started',
      buttonText: 'Start Lesson',
      buttonIcon: PlayCircle,
      statusColor: 'bg-gray-600',
      statusText: 'Not Started',
      progressPercentage: 0,
      currentStep: 1,
      totalSteps: 3,
      stepsCompleted: []
    };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Show loading state only if we don't have lessons data
  if (!lessons || lessons.length === 0) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading lessons...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No blocking error state - lessons will always show

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <CelebrationAnimation 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Lessons</h1>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Personalized social skills lessons powered by AI, tailored to your grade level and learning style.
          </p>
        </div>

        {/* Progress Warning Banner */}
        {progressError && (
          <div className={`mb-6 p-4 rounded-2xl border ${darkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className={`font-semibold ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                  Progress Unavailable
                </h3>
                <p className={`text-sm ${darkMode ? 'text-orange-200' : 'text-orange-600'}`}>
                  {progressError}. You can still start and continue lessons.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isLoadingProgress ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                ) : (
                  <button
                    onClick={() => {
                      setProgressError(null);
                      setIsLoadingProgress(true);
                      // Retry loading progress
                      setTimeout(() => {
                        window.location.reload();
                      }, 100);
                    }}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      darkMode 
                        ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                        : 'bg-orange-200 text-orange-700 hover:bg-orange-300'
                    }`}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Stats */}
        {!progressError && (
          <ProgressStats 
            stats={progressStats} 
            darkMode={darkMode}
            animated={true}
          />
        )}

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            const completed = isCompleted(lesson.id);
            const lessonStatus = getLessonStatus(lesson.id);
            const StatusIcon = lessonStatus.buttonIcon;
            
            return (
              <div
                key={lesson.id}
                className={`p-4 sm:p-6 rounded-2xl border transition-all hover:scale-105 cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-white/10' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                } ${lessonStatus.status === 'completed' ? 'ring-2 ring-emerald-500/50' : ''} ${
                  lessonStatus.status === 'in_progress' ? 'ring-1 ring-blue-500/30' : ''
                }`}
                onClick={() => handleStartLesson(lesson.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStartLesson(lesson.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${lesson.title} lesson - ${lessonStatus.statusText}. Click to ${(lessonStatus.buttonText || '').toLowerCase()}.`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <StatusBadge 
                    status={lessonStatus.status} 
                    size="sm" 
                    animated={true}
                  />
                  
                  {/* Restart Button */}
                  {(lessonStatus.status === 'in_progress' || lessonStatus.status === 'completed') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestartLesson(lesson.id);
                      }}
                      className={`p-1 rounded-full transition-all hover:scale-110 ${
                        darkMode 
                          ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title="Restart Lesson"
                      aria-label="Restart lesson"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Progress Circle */}
                <div className="absolute top-4 left-4">
                  <ProgressCircle 
                    progress={lessonStatus.progressPercentage}
                    status={lessonStatus.status}
                    size="sm"
                    animated={true}
                  />
                </div>

                <div className="flex items-start justify-between mb-4 pt-8">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{lesson.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  {lessonStatus.status === 'completed' && (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-sm font-bold">+{lesson.points}</span>
                    </div>
                  )}
                </div>

                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {lesson.description}
                </p>

                <div className="mb-4">
                  <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    TOPICS COVERED:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {lesson.topics.map((topic, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <ProgressBar 
                    progress={lessonStatus.progressPercentage}
                    status={lessonStatus.status}
                    height="sm"
                    showSteps={lessonStatus.status === 'in_progress'}
                    currentStep={lessonStatus.currentStep}
                    totalSteps={lessonStatus.totalSteps}
                    animated={true}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {lessonStatus.status === 'completed' ? 'Completed' : `${lesson.points} points`}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">
                      {lessonStatus.buttonText}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className={`mt-8 p-4 rounded-2xl border ${darkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <div>
              <h4 className="font-bold text-blue-400 mb-1">Personalized Learning</h4>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Each lesson is generated specifically for your grade level and learning style. 
                Start any lesson to begin your personalized learning journey!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonsScreen;
