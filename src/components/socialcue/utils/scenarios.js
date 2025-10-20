// Practice Session scenarios
const scenarios = {
    1: {
      id: 1,
      title: {
        'k2': 'Making Friends',
        '3-5': 'Small Talk Mastery',
        '6-8': 'Conversation Skills',
        '9-12': 'Social Communication'
      },
      color: '#4A90E2',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      situations: [
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
          imageAlt: 'Students at lunch',
          context: {
            'k2': "You notice a classmate sitting by themselves at lunch. You'd like to be friendly and sit with them.",
            '3-5': "You're in the cafeteria and see someone from your class sitting alone. You're thinking about joining them.",
            '6-8': "During lunch, you notice someone new sitting by themselves. You'd like to introduce yourself.",
            '9-12': "At lunch, you see an acquaintance sitting alone. You're considering starting a conversation."
          },
          prompt: {
            'k2': "What would be a kind way to start?",
            '3-5': "How might you begin this conversation?",
            '6-8': "What would be a friendly approach?",
            '9-12': "How would you start this interaction?"
          },
          options: [
            {
              text: {
                'k2': "Hi! Can I sit with you? I like your backpack!",
                '3-5': "Hey! Mind if I sit here? I noticed we're working on the same science project.",
                '6-8': "Hey, is this seat taken? I noticed we have history class together.",
                '9-12': "Mind if I join you? I wanted to ask what you thought about today's discussion."
              },
              feedback: {
                'k2': "That's wonderful! You asked permission nicely and shared a compliment. When we notice something we like about someone and tell them, it helps both people feel good!",
                '3-5': "Excellent choice! You asked permission respectfully and found something you both have in common. Finding shared interests is one of the best ways to start conversations.",
                '6-8': "Really well done! You were polite by asking about the seat first, and mentioning your shared class creates an easy conversation starter.",
                '9-12': "That's a great approach! You showed respect by asking permission, and referencing the class discussion demonstrates genuine interest."
              },
              proTip: null,
              isGood: true,
              points: 10
            },
            {
              text: {
                'k2': "Why don't you have any friends?",
                '3-5': "Why are you sitting alone? Don't you have any friends?",
                '6-8': "Are you always by yourself?",
                '9-12': "No one wanted to sit with you?"
              },
              feedback: {
                'k2': "Let's think about this together. When we ask questions like this, it might make the other person feel sad. Instead, we want to make people feel welcome and happy!",
                '3-5': "I understand you're curious, but this question could hurt their feelings. There are many reasons someone might be sitting alone. Let's focus on making them feel welcome instead.",
                '6-8': "This approach could make them feel uncomfortable. People sit alone for many reasons, and it's not our place to make assumptions.",
                '9-12': "This question makes an assumption that could be hurtful. Let's approach with openness and respect."
              },
              proTip: {
                'k2': "Here's a helpful tip: Try saying 'Hi, I'm [your name]! Want to be friends?' with a smile. This makes everyone feel comfortable!",
                '3-5': "Here's something to remember: Instead of asking why someone is alone, try 'What are you reading?' This shows interest without making assumptions.",
                '6-8': "A better approach: Lead with genuine curiosity like 'Want some company?' This shows friendliness while respecting their space.",
                '9-12': "Consider this: Opening with 'Mind if I sit?' respects their autonomy while conveying interest."
              },
              isGood: false,
              points: 0
            },
            {
              text: {
                'k2': "*Just sit down without saying hi*",
                '3-5': "*Sit down without saying anything*",
                '6-8': "*Sit nearby without acknowledging them*",
                '9-12': "*Take a seat without verbal acknowledgment*"
              },
              feedback: {
                'k2': "Remember, it's important to say hello and let someone know you'd like to sit with them. Even a simple 'Hi!' and a smile can make someone feel welcome and happy.",
                '3-5': "It's important to greet people when we join them. Even a simple 'Hello!' shows respect and lets them know you're friendly.",
                '6-8': "When we share space with someone, a verbal greeting shows respect and awareness. Even a brief 'Hey' with eye contact signals that you're approachable.",
                '9-12': "Acknowledging someone verbally when entering their space demonstrates social awareness and respect."
              },
              proTip: {
                'k2': "Here's what works well: Before you sit down, look at them, smile, and say 'Hi!' in a friendly voice. Smiles and friendly greetings help people feel comfortable!",
                '3-5': "Try this next time: Say 'Hi, I'm [your name]!' as you approach. This simple introduction opens the door for conversation.",
                '6-8': "Remember this: A simple 'Hey' with eye contact and a smile goes a long way. It signals you're open to talking.",
                '9-12': "Keep this in mind: Verbal acknowledgment like 'Hey, how's it going?' establishes rapport and shows emotional intelligence."
              },
              isGood: false,
              points: 0
            }
          ]
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
          imageAlt: 'Children playing together',
          context: {
            'k2': "Your new friend mentions they like dinosaurs. You like dinosaurs too!",
            '3-5': "The person you're talking with mentions they enjoy playing video games. You play games too!",
            '6-8': "They mention they're interested in photography. You've been curious about photography as well.",
            '9-12': "They bring up their interest in indie music. You're also familiar with the genre."
          },
          prompt: {
            'k2': "What could you say to keep the conversation going?",
            '3-5': "How might you continue this conversation?",
            '6-8': "What would be a good way to build on this?",
            '9-12': "How could you deepen this conversation?"
          },
          options: [
            {
              text: {
                'k2': "Cool! What's your favorite dinosaur? Mine is T-Rex!",
                '3-5': "Oh cool! What games do you play? I've been into Minecraft lately.",
                '6-8': "That's awesome! What kind of photography? I've been trying landscape shots.",
                '9-12': "Nice! What artists are you into? I've been exploring some underground acts lately."
              },
              feedback: {
                'k2': "That's wonderful! You showed excitement about their interest AND shared your own favorite. Now you both have something fun to talk about together!",
                '3-5': "Excellent work! You validated their interest and shared your own experience. This creates a balanced conversation where both people get to share.",
                '6-8': "Really well done! You acknowledged their interest with enthusiasm and contributed your own perspective. This creates space for genuine exchange of ideas.",
                '9-12': "That's an excellent response! You demonstrated both knowledge and curiosity while inviting them to share more."
              },
              proTip: null,
              isGood: true,
              points: 10
            },
            {
              text: {
                'k2': "Dinosaurs are silly!",
                '3-5': "Video games are boring. Sports are better.",
                '6-8': "Photography is kind of basic now. Everyone does that.",
                '9-12': "Indie music is just unsuccessful mainstream music."
              },
              feedback: {
                'k2': "Let's think about this. When someone shares something they love, and we say something negative about it, it can hurt their feelings. Everyone has different interests!",
                '3-5': "I understand you might prefer other activities, but when we dismiss what someone else enjoys, it can make them feel bad. Everyone's interests are valid.",
                '6-8': "This kind of response can shut down conversation and make the other person feel judged. Showing respect for someone's interests doesn't mean you have to share them.",
                '9-12': "Dismissing someone's passion can damage the connection you're trying to build. Respect doesn't require agreement—it requires openness."
              },
              proTip: {
                'k2': "Here's something helpful: If you don't share the same interest, that's okay! You can say 'That's cool! Tell me about it!' Questions show you care.",
                '3-5': "Try this approach: Even if you're not interested in the same thing, ask 'What do you like about that?' This shows respect.",
                '6-8': "Remember this: Showing curiosity about unfamiliar interests demonstrates emotional maturity. Try 'That's interesting—what draws you to that?'",
                '9-12': "Consider this perspective: Asking 'What appeals to you about that?' demonstrates respect and can lead to unexpected insights."
              },
              isGood: false,
              points: 0
            }
          ]
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
          imageAlt: 'Friends saying goodbye',
          context: {
            'k2': "You've had a nice time playing together, and now it's time to go.",
            '3-5': "You've been having a good conversation, and now you need to head to your next class.",
            '6-8': "The conversation has gone well, but you need to leave for your next commitment.",
            '9-12': "You've had a meaningful conversation, but you need to transition to your next activity."
          },
          prompt: {
            'k2': "What's a nice way to say goodbye?",
            '3-5': "How would you wrap up this conversation?",
            '6-8': "What would be an appropriate way to conclude?",
            '9-12': "How would you end this interaction positively?"
          },
          options: [
            {
              text: {
                'k2': "I had fun! Can we play again tomorrow?",
                '3-5': "It was nice talking! Want to hang out again?",
                '6-8': "This was great—we should definitely talk more. See you?",
                '9-12': "I really enjoyed this. We should continue this sometime—catch you later?"
              },
              feedback: {
                'k2': "That's perfect! You said something kind about your time together AND asked to meet again. This shows you enjoyed being with them and want to continue the friendship!",
                '3-5': "Wonderful! You acknowledged the positive experience and suggested future interaction. This leaves the conversation on a positive note.",
                '6-8': "Excellent conclusion! You affirmed that you valued the interaction and left the door open for future connection.",
                '9-12': "That's a very thoughtful way to end! You validated the conversation's worth and expressed interest in continuing the connection."
              },
              proTip: null,
              isGood: true,
              points: 10
            },
            {
              text: {
                'k2': "*Walk away without saying bye*",
                '3-5': "*Look at your phone and leave*",
                '6-8': "*Gradually disengage without words*",
                '9-12': "*Check phone and drift away*"
              },
              feedback: {
                'k2': "Remember, it's important to say goodbye! A friendly 'Bye!' and a wave shows you care about your friend.",
                '3-5': "A simple goodbye shows you valued the conversation. It's an important way to show respect.",
                '6-8': "Verbal closure shows respect and social awareness. Even a brief farewell makes a difference.",
                '9-12': "Explicit closure demonstrates emotional intelligence and respect for the interaction you shared."
              },
              proTip: {
                'k2': "Here's what helps: Always wave and say 'See you later!' with a smile. It makes friends happy!",
                '3-5': "Try this: A simple 'See you around!' makes a big difference. It shows you care about the connection.",
                '6-8': "Remember: Brief farewell maintains grace. Even just 'Got to go, but this was cool!' works well.",
                '9-12': "Keep in mind: Explicit closure shows maturity. 'I need to run, but let's continue this' maintains the connection."
              },
              isGood: false,
              points: 0
            }
          ]
        }
      ]
    }
  };
  
  export default scenarios;