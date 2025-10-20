import React, { useState, useEffect } from 'react';
import { Home, Target, TrendingUp, Settings } from 'lucide-react';
import { getUserData, saveUserData } from './socialcue/utils/storage';
import HomeScreen from './socialcue/HomeScreen';
import PracticeScreen from './socialcue/PracticeScreen';
import ProgressScreen from './socialcue/ProgressScreen';
import SettingsScreen from './socialcue/SettingsScreen';
import PracticeSession from './socialcue/PracticeSession';
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
    if (sid) setSessionId(sid);
    // Reload user data when navigating
    const data = getUserData();
    setUserData(data);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
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
        
        {currentScreen === 'practice' && sessionId && (
          <PracticeSession 
            sessionId={sessionId} 
            onNavigate={handleNavigate} 
            darkMode={darkMode} 
            gradeLevel={userData.grade || "5"} 
            soundEffects={soundEffects}
            autoReadText={autoReadText}
          />
        )}
        
        {currentScreen === 'practiceHome' && (
          <PracticeScreen 
            onNavigate={handleNavigate} 
            darkMode={darkMode} 
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