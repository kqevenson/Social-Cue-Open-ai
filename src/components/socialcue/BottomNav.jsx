import React from 'react';

function BottomNav({ currentScreen, onNavigate, darkMode, navItems }) {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 ${
      darkMode ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-around py-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || 
                           (currentScreen === 'practice' && item.id === 'practice') || 
                           (currentScreen === 'practiceHome' && item.id === 'practice');
            return (
              <button 
                key={item.id} 
                onClick={() => onNavigate(item.id === 'practice' ? 'practiceHome' : item.id)} 
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                  isActive ? 'bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30' : 
                  darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-400' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-xs font-bold ${isActive ? 'text-emerald-400' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;