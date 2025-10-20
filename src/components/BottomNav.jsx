import React from 'react';
import { Home, BarChart3, User } from 'lucide-react';

export default function BottomNav({ currentScreen, navigateTo }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#18181b',
      borderTop: '1px solid #27272a',
      padding: '16px 0'
    }}>
      <div style={{maxWidth: '1024px', margin: '0 auto', padding: '0 24px'}}>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: currentScreen === item.id ? '#4A90E2' : '#9ca3af',
                transition: 'color 0.2s'
              }}>
              <item.icon style={{width: '24px', height: '24px'}} />
              <span style={{fontSize: '12px', fontWeight: '600'}}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
