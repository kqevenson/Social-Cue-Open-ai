import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

// Practice Scenarios Database
const SCENARIOS = [
  {
    id: 1,
    title: "Lunch Table",
    description: "You're eating lunch and a classmate sits next to you",
    difficulty: "Beginner",
    topic: "Conversation Starters",
    exchanges: [
      {
        character: "Hey! Mind if I sit here?",
        options: [
          {
            text: "Sure! I'm just finishing my sandwich.",
            feedback: "Great! You welcomed them and shared what you're doing.",
            type: "good"
          },
          {
            text: "*Shrug and look away*",
            feedback: "Try responding with words. Even a simple 'yes' or 'sure' helps start a conversation.",
            type: "improve"
          },
          {
            text: "I guess so.",
            feedback: "This works, but sounds a bit reluctant. Try being more welcoming!",
            type: "okay"
          }
        ]
      },
      {
        character: "Thanks! What are you working on?",
        options: [
          {
            text: "Just some homework. Do you have Mr. Johnson for math?",
            feedback: "Perfect! You answered and asked a related question back.",
            type: "good"
          },
          {
            text: "Homework.",
            feedback: "Too short! Try adding a question to keep the conversation going.",
            type: "improve"
          },
          {
            text: "Math homework. It's really hard.",
            feedback: "Good! You gave details. Could you ask them something too?",
            type: "okay"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Playground",
    description: "Someone asks to join your game",
    difficulty: "Beginner",
    topic: "Active Listening",
    exchanges: [
      {
        character: "Can I play with you?",
        options: [
          {
            text: "Sure! We're playing tag. Want to be it first?",
            feedback: "Excellent! You welcomed them and explained the game.",
            type: "good"
          },
          {
            text: "I'm busy.",
            feedback: "This might hurt their feelings. Try including them or explaining nicely.",
            type: "improve"
          },
          {
            text: "Okay, I guess.",
            feedback: "You agreed, but try being more enthusiastic and welcoming!",
            type: "okay"
          }
        ]
      },
      {
        character: "Cool! I've never played tag this way before.",
        options: [
          {
            text: "Let me show you! It's easy once you get it.",
            feedback: "Perfect! You're being patient and helpful.",
            type: "good"
          },
          {
            text: "It's not hard.",
            feedback: "This sounds dismissive. Try being more encouraging!",
            type: "improve"
          },
          {
            text: "You'll figure it out.",
            feedback: "Could be better! Offer to help explain the rules.",
            type: "okay"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Group Project",
    description: "Your teacher assigns you to work with new classmates",
    difficulty: "Intermediate",
    topic: "Body Language",
    exchanges: [
      {
        character: "I guess we're partners. I'm Sarah.",
        options: [
          {
            text: "Nice to meet you, Sarah! I'm excited to work together.",
            feedback: "Great energy! You sound positive and friendly.",
            type: "good"
          },
          {
            text: "Hi.",
            feedback: "Too brief! Add your name and show interest in the project.",
            type: "improve"
          },
          {
            text: "Yeah, I'm Alex. What should we do first?",
            feedback: "Good! You introduced yourself and got down to business.",
            type: "okay"
          }
        ]
      },
      {
        character: "I was thinking we could split the work. What are you good at?",
        options: [
          {
            text: "I like drawing. Maybe I could do the poster? What about you?",
            feedback: "Perfect! You shared your strength and asked about theirs.",
            type: "good"
          },
          {
            text: "I don't know.",
            feedback: "Try to think of something you're comfortable with!",
            type: "improve"
          },
          {
            text: "I'll do the poster.",
            feedback: "You chose a task, but remember to ask what they'd like to do too!",
            type: "okay"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Art Class",
    description: "Someone compliments your drawing",
    difficulty: "Beginner",
    topic: "Confidence Building",
    exchanges: [
      {
        character: "Wow, your drawing is really good!",
        options: [
          {
            text: "Thank you! I've been practicing. Do you like to draw?",
            feedback: "Excellent! You accepted the compliment and showed interest in them.",
            type: "good"
          },
          {
            text: "It's not that good.",
            feedback: "Don't put yourself down! It's okay to say thank you.",
            type: "improve"
          },
          {
            text: "Thanks. I like drawing animals.",
            feedback: "Good! You could also ask them about their interests.",
            type: "okay"
          }
        ]
      },
      {
        character: "Yeah! I'm trying to get better. Any tips?",
        options: [
          {
            text: "Start with simple shapes. That's how I learned!",
            feedback: "Perfect! You're being helpful without showing off.",
            type: "good"
          },
          {
            text: "Just practice a lot.",
            feedback: "True, but try giving more specific helpful advice!",
            type: "improve"
          },
          {
            text: "I watch YouTube tutorials. They help a lot.",
            feedback: "Good suggestion! You're sharing what works for you.",
            type: "okay"
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "After School",
    description: "Someone asks if you want to hang out",
    difficulty: "Intermediate",
    topic: "Conversation Starters",
    exchanges: [
      {
        character: "Want to come over and play video games after school?",
        options: [
          {
            text: "That sounds fun! Let me ask my parents first.",
            feedback: "Great response! You showed interest and mentioned checking with parents.",
            type: "good"
          },
          {
            text: "Maybe.",
            feedback: "Too vague! Say yes (if interested) or explain why not.",
            type: "improve"
          },
          {
            text: "I'll ask my mom. What games do you have?",
            feedback: "Perfect! You're being responsible and showing interest.",
            type: "okay"
          }
        ]
      },
      {
        character: "We have Mario Kart and Minecraft. What do you like?",
        options: [
          {
            text: "I love both! Maybe we can play Minecraft and build something together?",
            feedback: "Excellent! You expressed enthusiasm and suggested a plan.",
            type: "good"
          },
          {
            text: "Either is fine.",
            feedback: "Share your preference! It helps plan the playdate.",
            type: "improve"
          },
          {
            text: "Mario Kart is cool. I'm not very good though.",
            feedback: "Honest! It's okay to say you're learning - friends help each other.",
            type: "okay"
          }
        ]
      }
    ]
  }
];

export default function SessionScreen({ navigateTo, completeSession }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentExchange, setCurrentExchange] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    goodChoices: 0,
    okayChoices: 0,
    improveChoices: 0
  });
  const [sessionComplete, setSessionComplete] = useState(false);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentExchange(0);
    setFeedback(null);
    setSessionStats({ goodChoices: 0, okayChoices: 0, improveChoices: 0 });
  };

  const handleChooseOption = (option) => {
    setFeedback(option);
    
    // Update stats
    setSessionStats(prev => ({
      ...prev,
      goodChoices: prev.goodChoices + (option.type === 'good' ? 1 : 0),
      okayChoices: prev.okayChoices + (option.type === 'okay' ? 1 : 0),
      improveChoices: prev.improveChoices + (option.type === 'improve' ? 1 : 0)
    }));
  };

  const handleNextExchange = () => {
    if (currentExchange < selectedScenario.exchanges.length - 1) {
      setCurrentExchange(currentExchange + 1);
      setFeedback(null);
    } else {
      // Session complete
      completeSession();
      setSessionComplete(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedScenario(null);
    setCurrentExchange(0);
    setFeedback(null);
    setSessionComplete(false);
    setSessionStats({ goodChoices: 0, okayChoices: 0, improveChoices: 0 });
  };

  // Scenario Selection Screen
  if (!selectedScenario && !sessionComplete) {
    return (
      <div style={{padding: '24px', paddingBottom: '100px'}}>
        <div style={{maxWidth: '1024px', margin: '0 auto'}}>
          <button 
            onClick={() => navigateTo('home')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '32px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
            <ArrowLeft style={{width: '20px', height: '20px'}} />
            Back to Home
          </button>

          <h1 style={{fontSize: '36px', fontWeight: '700', marginBottom: '8px'}}>Choose a Scenario</h1>
          <p style={{fontSize: '18px', color: '#9ca3af', marginBottom: '32px'}}>
            Pick a situation to practice your social skills
          </p>

          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '16px'}}>
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                style={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3f3f46'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#27272a'}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: '700', color: 'white'}}>{scenario.title}</h3>
                  <span style={{
                    background: '#27272a',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '9999px'
                  }}>
                    {scenario.difficulty}
                  </span>
                </div>
                <p style={{color: '#9ca3af', fontSize: '16px', marginBottom: '12px'}}>
                  {scenario.description}
                </p>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{
                    background: 'linear-gradient(135deg, #3b82f6, #34d399)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '9999px'
                  }}>
                    {scenario.topic}
                  </span>
                  <span style={{color: '#9ca3af', fontSize: '14px'}}>
                    {scenario.exchanges.length} exchanges
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Session Complete Screen
  if (sessionComplete) {
    const total = sessionStats.goodChoices + sessionStats.okayChoices + sessionStats.improveChoices;
    const score = Math.round(((sessionStats.goodChoices * 2 + sessionStats.okayChoices) / (total * 2)) * 100);

    return (
      <div style={{padding: '24px', paddingBottom: '100px'}}>
        <div style={{maxWidth: '1024px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{background: '#18181b', borderRadius: '16px', padding: '48px', border: '1px solid #27272a'}}>
            <div style={{fontSize: '64px', marginBottom: '16px'}}>🎉</div>
            <h1 style={{fontSize: '36px', fontWeight: '700', marginBottom: '16px'}}>Session Complete!</h1>
            <p style={{fontSize: '18px', color: '#9ca3af', marginBottom: '32px'}}>
              You practiced: {selectedScenario.title}
            </p>

            {/* Stats */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px'}}>
              <div style={{background: '#27272a', borderRadius: '12px', padding: '16px'}}>
                <div style={{fontSize: '32px', fontWeight: '700', color: '#34D399', marginBottom: '4px'}}>
                  {sessionStats.goodChoices}
                </div>
                <div style={{fontSize: '12px', color: '#9ca3af'}}>Great</div>
              </div>
              <div style={{background: '#27272a', borderRadius: '12px', padding: '16px'}}>
                <div style={{fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px'}}>
                  {sessionStats.okayChoices}
                </div>
                <div style={{fontSize: '12px', color: '#9ca3af'}}>Good</div>
              </div>
              <div style={{background: '#27272a', borderRadius: '12px', padding: '16px'}}>
                <div style={{fontSize: '32px', fontWeight: '700', color: '#f97316', marginBottom: '4px'}}>
                  {sessionStats.improveChoices}
                </div>
                <div style={{fontSize: '12px', color: '#9ca3af'}}>To Improve</div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #34d399)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <div style={{fontSize: '48px', fontWeight: '700', marginBottom: '8px'}}>
                {score}%
              </div>
              <div style={{fontSize: '16px', opacity: 0.9}}>Overall Score</div>
            </div>

            <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
              <button 
                onClick={handleTryAgain}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #34d399)',
                  color: 'white',
                  fontWeight: '700',
                  padding: '12px 32px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>
                Try Another Scenario
              </button>
              <button 
                onClick={() => navigateTo('home')}
                style={{
                  background: '#27272a',
                  color: 'white',
                  fontWeight: '700',
                  padding: '12px 32px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Practice Session Screen
  const exchange = selectedScenario.exchanges[currentExchange];

  return (
    <div style={{padding: '24px', paddingBottom: '100px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <button 
          onClick={() => setSelectedScenario(null)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}>
          <ArrowLeft style={{width: '20px', height: '20px'}} />
          Back to Scenarios
        </button>

        {/* Scenario Info */}
        <div style={{marginBottom: '32px'}}>
          <h1 style={{fontSize: '32px', fontWeight: '700', marginBottom: '8px'}}>{selectedScenario.title}</h1>
          <p style={{color: '#9ca3af', fontSize: '16px', marginBottom: '16px'}}>
            {selectedScenario.description}
          </p>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <div style={{
              background: '#27272a',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              Exchange {currentExchange + 1} of {selectedScenario.exchanges.length}
            </div>
          </div>
        </div>

        {/* Character Speech */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{display: 'flex', gap: '16px'}}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #34d399)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👤
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: '600', marginBottom: '8px', color: '#9ca3af', fontSize: '14px'}}>
                Classmate says:
              </div>
              <p style={{fontSize: '18px', lineHeight: '1.6'}}>
                {exchange.character}
              </p>
            </div>
          </div>
        </div>

        {/* Response Options */}
        {!feedback && (
          <div>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>
              How do you respond?
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {exchange.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChooseOption(option)}
                  style={{
                    background: '#18181b',
                    border: '2px solid #27272a',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '16px',
                    color: 'white',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.background = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272a';
                    e.currentTarget.style.background = '#18181b';
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div>
            <div style={{
              background: feedback.type === 'good' ? 'rgba(52, 211, 153, 0.1)' : 
                         feedback.type === 'improve' ? 'rgba(249, 115, 22, 0.1)' : 
                         'rgba(59, 130, 246, 0.1)',
              border: `2px solid ${
                feedback.type === 'good' ? '#34D399' : 
                feedback.type === 'improve' ? '#f97316' : 
                '#3b82f6'
              }`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
                {feedback.type === 'good' && <CheckCircle style={{width: '24px', height: '24px', color: '#34D399', flexShrink: 0}} />}
                {feedback.type === 'improve' && <AlertCircle style={{width: '24px', height: '24px', color: '#f97316', flexShrink: 0}} />}
                {feedback.type === 'okay' && <Lightbulb style={{width: '24px', height: '24px', color: '#3b82f6', flexShrink: 0}} />}
                <div style={{flex: 1}}>
                  <div style={{
                    fontWeight: '700',
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: feedback.type === 'good' ? '#34D399' : 
                           feedback.type === 'improve' ? '#f97316' : 
                           '#3b82f6'
                  }}>
                    {feedback.type === 'good' ? 'Great Choice!' : 
                     feedback.type === 'improve' ? 'Could Be Better' : 
                     'Good Try!'}
                  </div>
                  <p style={{fontSize: '16px', lineHeight: '1.6', color: '#d1d5db'}}>
                    {feedback.feedback}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextExchange}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #34d399)',
                color: 'white',
                fontWeight: '700',
                padding: '12px 32px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                width: '100%'
              }}>
              {currentExchange < selectedScenario.exchanges.length - 1 ? 'Continue' : 'Finish Session'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}