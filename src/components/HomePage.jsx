import React from 'react';
import { Play, Bookmark, TrendingUp, Clock, Award } from 'lucide-react';

export default function HomePage({ userName, userData, navigateTo }) {
  return (
    <div>
      {/* Header */}
      <div style={{padding: '24px 24px 16px'}}>
        <div style={{maxWidth: '1024px', margin: '0 auto'}}>
          {/* Wordmark */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px'}}>
            <div style={{display: 'flex', alignItems: 'flex-end', letterSpacing: '-2px'}}>
              <span style={{fontWeight: '800', fontSize: '36px', color: 'white'}}>Social</span>
              <span style={{fontWeight: '800', fontSize: '36px', color: 'white', marginRight: '4px'}}>C</span>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '4px', height: '40px'}}>
                <div style={{display: 'flex', gap: '12px', marginBottom: '5px'}}>
                  <div style={{width: '6px', height: '6px', background: '#4A90E2', borderRadius: '50%'}}></div>
                  <div style={{width: '6px', height: '6px', background: '#4A90E2', borderRadius: '50%'}}></div>
                </div>
                <div style={{
                  width: '30px',
                  height: '20px',
                  borderLeft: '4.5px solid #34D399',
                  borderRight: '4.5px solid #34D399',
                  borderBottom: '4.5px solid #34D399',
                  borderTop: 'none',
                  borderRadius: '0 0 15px 15px'
                }}></div>
              </div>
              <span style={{fontWeight: '800', fontSize: '36px', color: 'white', marginLeft: '4px'}}>e</span>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '14px', color: '#9ca3af'}}>Welcome,</div>
              <div style={{fontWeight: '600'}}>{userName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{padding: '0 24px 32px'}}>
        <div style={{maxWidth: '1024px', margin: '0 auto'}}>
          <div style={{position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', height: '400px'}}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #34d399 100%)'
            }}></div>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px'}}>
              <div style={{marginBottom: '16px'}}>
                <span style={{background: '#34D399', color: 'black', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '9999px'}}>FEATURED</span>
              </div>
              <h1 style={{fontSize: '36px', fontWeight: '700', marginBottom: '12px'}}>Master Small Talk</h1>
              <p style={{fontSize: '18px', marginBottom: '24px', opacity: 0.9}}>Learn conversation starters that work in any situation</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <button 
                  onClick={() => navigateTo('session')}
                  style={{
                    background: 'white',
                    color: 'black',
                    fontWeight: '700',
                    padding: '12px 32px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                  <Play style={{width: '20px', height: '20px'}} fill="black" />
                  Start Session
                </button>
                <div style={{fontSize: '14px', opacity: 0.9}}>15 min • Beginner</div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px'}}>
            <div style={{background: '#18181b', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #27272a'}}>
              <div style={{fontSize: '30px', fontWeight: '700', color: '#34D399', marginBottom: '4px'}}>{userData.dayStreak}</div>
              <div style={{fontSize: '14px', color: '#9ca3af'}}>Day Streak</div>
            </div>
            <div style={{background: '#18181b', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #27272a'}}>
              <div style={{fontSize: '30px', fontWeight: '700', color: '#4A90E2', marginBottom: '4px'}}>{userData.totalSessions}</div>
              <div style={{fontSize: '14px', color: '#9ca3af'}}>Sessions</div>
            </div>
            <div style={{background: '#18181b', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #27272a'}}>
              <div style={{fontSize: '30px', fontWeight: '700', color: '#a855f7', marginBottom: '4px'}}>{userData.confidenceScore}%</div>
              <div style={{fontSize: '14px', color: '#9ca3af'}}>Confidence</div>
            </div>
          </div>

          {/* Continue Learning */}
          <div style={{marginBottom: '40px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px'}}>Continue Learning</h2>
            <div style={{background: '#18181b', borderRadius: '16px', overflow: 'hidden', border: '1px solid #27272a', cursor: 'pointer'}}>
              <div style={{display: 'flex'}}>
                <div style={{width: '192px', height: '128px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', flexShrink: 0}}></div>
                <div style={{padding: '24px', flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <div>
                      <h3 style={{fontWeight: '700', fontSize: '18px', marginBottom: '4px'}}>Active Listening Skills</h3>
                      <p style={{fontSize: '14px', color: '#9ca3af'}}>Unit 2: Reflective Responses</p>
                    </div>
                    <Bookmark style={{width: '20px', height: '20px', color: '#9ca3af'}} />
                  </div>
                  <div style={{marginTop: '16px'}}>
                    <div style={{background: '#27272a', borderRadius: '9999px', height: '8px', marginBottom: '8px'}}>
                      <div style={{background: '#34D399', height: '8px', borderRadius: '9999px', width: '45%'}}></div>
                    </div>
                    <div style={{fontSize: '12px', color: '#9ca3af'}}>45% complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browse Topics */}
          <div style={{marginBottom: '40px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px'}}>Browse by Topic</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              
              <div style={{position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '192px', cursor: 'pointer'}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}></div>
                <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px'}}>
                  <div>
                    <div style={{fontSize: '30px', marginBottom: '12px'}}>💬</div>
                    <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '4px'}}>Conversation Starters</h3>
                    <p style={{fontSize: '14px', opacity: 0.9}}>12 sessions</p>
                  </div>
                </div>
              </div>

              <div style={{position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '192px', cursor: 'pointer'}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #10b981, #059669)'}}></div>
                <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px'}}>
                  <div>
                    <div style={{fontSize: '30px', marginBottom: '12px'}}>👂</div>
                    <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '4px'}}>Active Listening</h3>
                    <p style={{fontSize: '14px', opacity: 0.9}}>8 sessions</p>
                  </div>
                </div>
              </div>

              <div style={{position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '192px', cursor: 'pointer'}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #a855f7, #9333ea)'}}></div>
                <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px'}}>
                  <div>
                    <div style={{fontSize: '30px', marginBottom: '12px'}}>🤝</div>
                    <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '4px'}}>Body Language</h3>
                    <p style={{fontSize: '14px', opacity: 0.9}}>15 sessions</p>
                  </div>
                </div>
              </div>

              <div style={{position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '192px', cursor: 'pointer'}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f97316, #dc2626)'}}></div>
                <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px'}}>
                  <div>
                    <div style={{fontSize: '30px', marginBottom: '12px'}}>💪</div>
                    <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '4px'}}>Confidence Building</h3>
                    <p style={{fontSize: '14px', opacity: 0.9}}>10 sessions</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px'}}>
            <button 
              onClick={() => navigateTo('progress')}
              style={{background: '#18181b', borderRadius: '12px', padding: '20px', border: '1px solid #27272a', cursor: 'pointer', textAlign: 'center'}}>
              <TrendingUp style={{width: '32px', height: '32px', margin: '0 auto 12px', color: '#4A90E2'}} />
              <div style={{fontWeight: '600', fontSize: '14px'}}>My Progress</div>
            </button>
            <div style={{background: '#18181b', borderRadius: '12px', padding: '20px', border: '1px solid #27272a', cursor: 'pointer', textAlign: 'center'}}>
              <Clock style={{width: '32px', height: '32px', margin: '0 auto 12px', color: '#34D399'}} />
              <div style={{fontWeight: '600', fontSize: '14px'}}>Recent Sessions</div>
            </div>
            <div style={{background: '#18181b', borderRadius: '12px', padding: '20px', border: '1px solid #27272a', cursor: 'pointer', textAlign: 'center'}}>
              <Award style={{width: '32px', height: '32px', margin: '0 auto 12px', color: '#a855f7'}} />
              <div style={{fontWeight: '600', fontSize: '14px'}}>Achievements</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
