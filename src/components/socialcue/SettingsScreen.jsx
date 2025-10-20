import React, { useState, useEffect } from 'react';
import { getUserData, STORAGE_KEY } from './utils/storage';

function SettingsScreen({ userData, darkMode, onToggleDarkMode, soundEffects, onToggleSoundEffects, autoReadText, onToggleAutoReadText, notifications, onToggleNotifications, onLogout }) {
  const [localDarkMode, setLocalDarkMode] = useState(darkMode);
  const [localSoundEffects, setLocalSoundEffects] = useState(soundEffects);
  const [localAutoReadText, setLocalAutoReadText] = useState(autoReadText);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [name, setName] = useState(userData?.userName || 'Alex');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setLocalDarkMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    setLocalSoundEffects(soundEffects);
  }, [soundEffects]);

  useEffect(() => {
    setLocalAutoReadText(autoReadText);
  }, [autoReadText]);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleToggleDarkMode = () => {
    const newValue = !localDarkMode;
    setLocalDarkMode(newValue);
    onToggleDarkMode(newValue);
  };

  const handleToggleSoundEffects = () => {
    const newValue = !localSoundEffects;
    setLocalSoundEffects(newValue);
    onToggleSoundEffects(newValue);
  };

  const handleToggleAutoReadText = () => {
    const newValue = !localAutoReadText;
    setLocalAutoReadText(newValue);
    onToggleAutoReadText(newValue);
  };

  const handleToggleNotifications = () => {
    const newValue = !localNotifications;
    setLocalNotifications(newValue);
    onToggleNotifications(newValue);
  };

  const handleSaveProfile = () => {
    const currentData = getUserData();
    currentData.userName = name;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    alert('Profile updated! ✅');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      onLogout(); // Call the prop to trigger logout in parent
    }
  };

  return (
    <div className="pb-24 px-6 py-8">
      <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
      
      <div className={`backdrop-blur-xl border rounded-2xl p-6 mb-6 ${
        darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h2>
        <div className="space-y-4">
          <div>
            <label className={`text-sm block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${
                darkMode 
                  ? 'bg-black/40 border-white/20 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
            />
          </div>
          <div>
            <label className={`text-sm block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</label>
            <input 
              type="email" 
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${
                darkMode 
                  ? 'bg-black/40 border-white/20 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
            />
          </div>
          <button 
            onClick={handleSaveProfile}
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className={`backdrop-blur-xl border rounded-2xl p-6 mb-6 ${
        darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Preferences</h2>
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
            darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
          }`} onClick={handleToggleDarkMode}>
            <div>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</div>
              <div className={darkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Use dark theme for the app</div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${localDarkMode ? 'bg-emerald-500' : 'bg-gray-400'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localDarkMode ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
          <div className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
            darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
          }`} onClick={handleToggleNotifications}>
            <div>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</div>
              <div className={darkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Get reminded to practice</div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${localNotifications ? 'bg-emerald-500' : 'bg-gray-400'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localNotifications ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
          <div className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
            darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
          }`} onClick={handleToggleSoundEffects}>
            <div>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sound Effects</div>
              <div className={darkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Play sounds during sessions</div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${localSoundEffects ? 'bg-emerald-500' : 'bg-gray-400'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localSoundEffects ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
          <div className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
            darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
          }`} onClick={handleToggleAutoReadText}>
            <div>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto-Read Text</div>
              <div className={darkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Automatically read scenarios aloud</div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${localAutoReadText ? 'bg-emerald-500' : 'bg-gray-400'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localAutoReadText ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`backdrop-blur-xl border rounded-2xl p-6 ${
        darkMode ? 'bg-white/8 border-white/20' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>About</h2>
        <div className="space-y-3">
          <button 
            onClick={() => alert('Privacy Policy - Coming soon!')}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>Privacy Policy</span>
          </button>
          <button 
            onClick={() => alert('Terms of Service - Coming soon!')}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>Terms of Service</span>
          </button>
          <button 
            onClick={() => alert('Help & Support - Contact us at support@socialcue.app')}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>Help & Support</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left p-4 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all font-bold"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;