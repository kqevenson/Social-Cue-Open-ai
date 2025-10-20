import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ProgressScreen({ userData, navigateTo }) {
  const maxSessions = Math.max(...userData.weeklyData.map(d => d.sessions));

  return (
    <div style={{padding: '24px'}}>
      <div style={{maxWidth: '1024px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{marginBottom: '32px'}}>
          <button 
            onClick={() => navigateTo('home')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
            <ArrowLeft style={{width: '20px', height: '20px'}} />
            Back to Home
          </button>
          <h1 style={{fontSize: '36px', fontWeight: '700'}}>Your Progress</h1>
        </div>

        {/* Stats Overview */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px'}}>
          <div style={{background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a'}}>
            <div style={{fontSize: '14px', color: '#9ca3af', marginBottom: '8px'}}>Total Sessions</div>
            <div style={{fontSize: '48px', fontWeight: '700', color: '#4A90E2', marginBottom: '4px'}}>{userData.totalSessions}</div>
            <div style={{fontSize: '12px', color: '#34D399'}}>+3 this week</div>
          </div>
          <div style={{background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a'}}>
            <div style={{fontSize: '14px', color: '#9ca3af', marginBottom: '8px'}}>Current Streak</div>
            <div style={{fontSize: '48px', fontWeight: '700', color: '#34D399', marginBottom: '4px'}}>{userData.dayStreak}</div>
            <div style={{fontSize: '12px', color: '#9ca3af'}}>days in a row</div>
          </div>
        </div>

        {/* Week Chart */}
        <div style={{background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a', marginBottom: '32px'}}>
          <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '24px'}}>This Week</h3>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', height: '160px'}}>
            {userData.weeklyData.map((day, i) => (
              <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '100%', background: '#27272a', borderRadius: '8px 8px 0 0', position: 'relative', height: '120px'}}>
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      background: 'linear-gradient(180deg, #4A90E2, #34D399)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s ease',
                      height: `${(day.sessions / maxSessions) * 100}%`
                    }}
                  ></div>
                </div>
                <div style={{fontSize: '12px', color: '#9ca3af'}}>{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Breakdown */}
        <div style={{background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a'}}>
          <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '24px'}}>Skill Levels</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {userData.skills.map((skill, i) => (
              <div key={i}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px'}}>
                  <span style={{fontWeight: '600'}}>{skill.name}</span>
                  <span style={{color: '#9ca3af'}}>{skill.level}%</span>
                </div>
                <div style={{background: '#27272a', borderRadius: '9999px', height: '8px'}}>
                  <div 
                    style={{
                      background: skill.color,
                      height: '8px',
                      borderRadius: '9999px',
                      width: `${skill.level}%`,
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
