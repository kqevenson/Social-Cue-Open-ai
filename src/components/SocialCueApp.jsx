import React, { useState, useEffect } from 'react';
import { Home, Target, TrendingUp, Settings, BookOpen } from 'lucide-react';
import { getUserData, saveUserData } from './socialcue/utils/storage';
import { lessonApiService } from '../services/lessonApi';
import HomeScreen from './socialcue/HomeScreen';
import PracticeScreen from './socialcue/PracticeScreen';
import ProgressScreen from './socialcue/ProgressScreen';
import SettingsScreen from './socialcue/SettingsScreen';
import PracticeSession from './socialcue/PracticeSession';
import AILessonSession from './socialcue/AILessonSession';
import AIPracticeSession from './AIPracticeSession';
import LessonsScreen from './socialcue/LessonsScreen';
import BottomNav from './socialcue/BottomNav';

function SocialCueApp({ onLogout }) {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userData, setUserData] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [autoReadText, setAutoReadText] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sessionId, setSessionId] = useState(1);

  useEffect(() => {
    const data = getUserData();
    console.log('SocialCueApp loaded userData:', data);
    setUserData(data);
    
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
    
    const savedSoundEffects = localStorage.getItem('soundEffects');
    if (savedSoundEffects !== null) setSoundEffects(savedSoundEffects === 'true');
    
    const savedAutoReadText = localStorage.getItem('autoReadText');
    if (savedAutoReadText !== null) setAutoReadText(savedAutoReadText === 'true');
    
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
  }, []);

  const toggleDarkMode = (value) => {
    setDarkMode(value);
    localStorage.setItem('darkMode', value.toString());
  };

  const toggleSoundEffects = (value) => {
    setSoundEffects(value);
    localStorage.setItem('soundEffects', value.toString());
  };

  const toggleAutoReadText = (value) => {
    setAutoReadText(value);
    localStorage.setItem('autoReadText', value.toString());
  };

  const toggleNotifications = (value) => {
    setNotifications(value);
    localStorage.setItem('notifications', value.toString());
  };

  const handleNavigate = (screen, sid) => {
    setCurrentScreen(screen);
    if (sid) {
      setSessionId(sid);
      // Set topicName based on sessionId
      const topicMap = {
        1: 'Small Talk Basics',
        2: 'Active Listening', 
        3: 'Reading Body Language',
        4: 'Building Confidence',
        5: 'Conflict Resolution',
        6: 'Teamwork',
        7: 'Empathy',
        8: 'Assertiveness'
      };
      const topicName = topicMap[sid] || 'Social Skills';
      
      // Update user data with topicName
      const currentData = getUserData();
      const updatedData = { ...currentData, topicName };
      saveUserData(updatedData);
      setUserData(updatedData);
    } else {
      // Reload user data when navigating (but preserve topicName if it exists)
      const data = getUserData();
      setUserData(data);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!userData) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
        {currentScreen === 'home' && (
          <HomeScreen 
            userData={userData} 
            onNavigate={handleNavigate} 
            darkMode={darkMode} 
            soundEffects={soundEffects}
          />
        )}
        
        {currentScreen === 'lessons' && (
          <LessonsScreen 
            userData={userData} 
            onNavigate={handleNavigate} 
            darkMode={darkMode} 
          />
        )}
        
        {currentScreen === 'practice' && sessionId && (
          <PracticeSession 
            sessionId={sessionId} 
            onNavigate={handleNavigate} 
            darkMode={darkMode} 
            gradeLevel={userData.grade || "5"} 
            soundEffects={soundEffects}
            autoReadText={autoReadText}
            topicName={userData.topicName}
          />
        )}
        
        {currentScreen === 'practiceHome' && (
          <PracticeScreen 
            onNavigate={handleNavigate} 
            darkMode={darkMode} 
          />
        )}
        
        {currentScreen === 'ai-practice' && (
          <AIPracticeSession 
            category="AI Practice" 
            gradeLevel={userData.gradeLevel || "6-8"} 
            onComplete={() => handleNavigate('home')}
          />
        )}
        
        {currentScreen === 'progress' && (
          <ProgressScreen 
            userData={userData} 
            darkMode={darkMode} 
          />
        )}
        
        {currentScreen === 'settings' && (
          <SettingsScreen 
            userData={userData} 
            darkMode={darkMode} 
            onToggleDarkMode={toggleDarkMode} 
            soundEffects={soundEffects} 
            onToggleSoundEffects={toggleSoundEffects}
            autoReadText={autoReadText}
            onToggleAutoReadText={toggleAutoReadText}
            notifications={notifications}
            onToggleNotifications={toggleNotifications}
            onLogout={onLogout}
          />
        )}
      </div>

      <BottomNav 
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        navItems={navItems}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; }
      `}</style>
    </div>
  );
}

export default SocialCueApp;