import React from 'react';
import { User, Award } from 'lucide-react';

export default function ProfileScreen({ userName, userData, setUserName, navigateTo }) {
  return (
    <div style={{padding: '24px'}}>
      <div style={{maxWidth: '1024px', margin: '0 auto'}}>
        <h1 style={{fontSize: '36px', fontWeight: '700', marginBottom: '32px'}}>Profile</h1>

        {/* User Info */}
        <div style={{background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a', marginBottom: '24px', textAlign: 'center'}}>
          <div style={{
            width: '96px',
            height: '96px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4A90E2, #34D399)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '700'
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 style={{fontSize: '24px', fontWeight: '700', marginBottom: '4px'}}>{userName}</h2>
          <div style={{color: '#9ca3af'}}>Member since October 2025</div>
        </div>

        {/* Settings Options */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <div style={{background: '#18181b', borderRadius: '16px', padding: '20px', border: '1px solid #27272a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px'}}>
            <User style={{width: '24px', height: '24px', color: '#4A90E2'}} />
            <span style={{fontWeight: '600', flex: 1}}>Edit Profile</span>
            <span style={{color: '#9ca3af'}}>›</span>
          </div>
          <div style={{background: '#18181b', borderRadius: '16px', padding: '20px', border: '1px solid #27272a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px'}}>
            <Award style={{width: '24px', height: '24px', color: '#4A90E2'}} />
            <span style={{fontWeight: '600', flex: 1}}>Achievements</span>
            <span style={{color: '#9ca3af'}}>›</span>
          </div>
        </div>

      </div>
    </div>
  );
}
