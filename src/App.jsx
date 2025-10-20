import React, { useState } from 'react';
import LandingPage from './landing-page/LandingPage';
import OnboardingScreen from './components/OnboardingScreen';

export default function SocialCueApp() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userData, setUserData] = useState(null);

  // Handle navigation flow
  if (currentScreen === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentScreen('onboarding')} />;
  }

  if (currentScreen === 'onboarding') {
    return (
      <OnboardingScreen 
        onComplete={(data) => {
          setUserData(data);
          console.log('User data:', data);
        }} 
      />
    );
  }

  // Show completion placeholder
  return (
    <div style={{
      minHeight: '100vh', 
      background: '#000', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{fontSize: '2rem', fontWeight: 'bold'}}>
        Complete! Welcome {userData?.name}
      </h1>
      <p style={{color: '#9ca3af'}}>
        Your onboarding data: {JSON.stringify(userData, null, 2)}
      </p>
      <button 
        onClick={() => setCurrentScreen('landing')}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #3b82f6, #34d399)',
          color: 'white',
          fontWeight: '600',
          borderRadius: '9999px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        Start Over
      </button>
    </div>
  );
}