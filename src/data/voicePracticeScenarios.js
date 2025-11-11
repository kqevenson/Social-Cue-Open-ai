// src/data/voicePracticeScenarios.js

export const topics = [
  {
    id: 'entering-group-conversations',
    title: 'Entering Group Conversations',
    icon: '👥',
    description: 'Practicing how to join group conversations respectfully and confidently.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-enter-1',
          title: 'Playground Talk',
          prompt: 'You see a group of kids talking about their favorite animals. What can you say to join in?',
          guidance: 'Try saying "I like elephants! What animals do you like?"',
        },
        {
          id: 'k2-enter-2',
          title: 'Art Time',
          prompt: 'During art, some kids are talking about what they\'re drawing. How do you join their chat?',
          guidance: 'You could say "That looks cool! I\'m drawing a rainbow."',
        },
        {
          id: 'k2-enter-3',
          title: 'Snack Circle',
          prompt: 'Kids are chatting about their snacks. What can you say to be part of it?',
          guidance: 'Try saying "I have apples! What do you have?"',
        },
      ],
      '3-5': [
        {
          id: '35-enter-1',
          title: 'Group Project Intro',
          prompt: 'You\'re walking up to a group talking about a group project. What\'s a good way to join?',
          guidance: 'You might say "Hey, can I help with anything?"',
        },
        {
          id: '35-enter-2',
          title: 'Recess Games',
          prompt: 'Some kids are talking about the game they\'re playing. How do you jump in?',
          guidance: 'Try "Hi! What game is this? Can I play too?"',
        },
        {
          id: '35-enter-3',
          title: 'Lunch Table Topic',
          prompt: 'A group is chatting about a movie. What\'s a respectful way to add your voice?',
          guidance: 'You could say "I saw that too! My favorite part was..."',
        },
      ],
      '6-8': [
        {
          id: '68-enter-1',
          title: 'Elective Class Group',
          prompt: 'You walk over to a group discussing a class project. What can you say to join naturally?',
          guidance: 'Try: "Hey, is this the robotics topic group? or "Mind if I jump in?"',
        },
        {
          id: '68-enter-2',
          title: 'Hallway Hangout',
          prompt: 'Friends are chatting in the hallway. You\'d like to join. What\'s a smooth way in?',
          guidance: 'Try: "What are you guys talking about?" with a friendly tone.',
        },
        {
          id: '68-enter-3',
          title: 'Group Chat IRL',
          prompt: 'Everyone\'s talking about last night\'s episode. How do you step into the convo?',
          guidance: 'You could say "I missed the first part! What happened?" or "I had a totally different take..."',
        },
      ],
      '9-12': [
        {
          id: '912-enter-1',
          title: 'Class Debate Circle',
          prompt: 'You overhear a debate on a book you\'ve read too. What\'s a respectful way to contribute?',
          guidance: 'Try: "Interesting point—have you considered this perspective?"',
        },
        {
          id: '912-enter-2',
          title: 'Club Meeting Vibes',
          prompt: 'You walk into a club meeting already in discussion. How do you join in?',
          guidance: 'Say: "Sorry I\'m late—can someone catch me up real quick?"',
        },
        {
          id: '912-enter-3',
          title: 'Campus Corner Chat',
          prompt: 'A group is discussing music. You want in. How do you approach it?',
          guidance: 'Try: "Hey, mind if I join this convo? I\'ve got some strong takes on that album."',
        },
      ],
    },
  },
  {
    id: 'disagreeing-respectfully',
    title: 'Disagreeing Respectfully',
    icon: '🤔',
    description: 'Helping students learn how to express disagreement while still being kind and thoughtful.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-disagree-1',
          title: 'Favorite Color Clash',
          prompt: 'Your friend says blue is the best color, but you like red. What can you say?',
          guidance: 'Try: "I like red best, but blue is cool too!"',
        },
        {
          id: 'k2-disagree-2',
          title: 'Game Time Choice',
          prompt: 'Your classmate wants to play tag, but you want to play hide-and-seek. What can you say?',
          guidance: 'You might say: "Can we do both? Hide-and-seek first, then tag?"',
        },
        {
          id: 'k2-disagree-3',
          title: 'Snack Debate',
          prompt: 'Someone says apples are yummier than bananas, but you disagree. How do you reply?',
          guidance: 'Try: "I like bananas more, but apples are good too."',
        },
      ],
      '3-5': [
        {
          id: '35-disagree-1',
          title: 'Group Idea Differences',
          prompt: 'You\'re working on a project and someone suggests an idea you don\'t agree with. What do you say?',
          guidance: 'Try: "That\'s interesting—what if we also tried it this way?"',
        },
        {
          id: '35-disagree-2',
          title: 'Recess Rules',
          prompt: 'A classmate explains a rule for a game that you think is wrong. What\'s a respectful way to disagree?',
          guidance: 'You could say: "Hmm, I thought it was played like this—should we check together?"',
        },
        {
          id: '35-disagree-3',
          title: 'Book Opinions',
          prompt: 'Your friend says a book was boring, but you loved it. How do you respond?',
          guidance: 'Try: "That\'s fair. I actually really liked it because..."',
        },
      ],
      '6-8': [
        {
          id: '68-disagree-1',
          title: 'Debate Team Disagreement',
          prompt: 'Someone on your team makes a point you think is weak. What\'s a tactful way to raise your concern?',
          guidance: 'Say: "I see where you\'re going—what if we backed it up with this stat instead?"',
        },
        {
          id: '68-disagree-2',
          title: 'Group Text Argument',
          prompt: 'Friends are disagreeing over text and you have a different view. How can you share it calmly?',
          guidance: 'Try: "I hear both of you. My take is..."',
        },
        {
          id: '68-disagree-3',
          title: 'Project Role Conflict',
          prompt: 'A teammate says you should be the one doing the presentation, but you think someone else should. What can you say?',
          guidance: 'Try: "I think ____ would actually be great at presenting. I\'m happy to support behind the scenes."',
        },
      ],
      '9-12': [
        {
          id: '912-disagree-1',
          title: 'Social Media Post',
          prompt: 'You see a peer post something you strongly disagree with. How can you respond respectfully?',
          guidance: 'Try: "Hey, I saw your post and had a different take. Mind if I share?"',
        },
        {
          id: '912-disagree-2',
          title: 'Class Discussion',
          prompt: 'Someone makes a comment in class you don\'t agree with. How do you speak up without shutting them down?',
          guidance: 'Say: "I have a different view—can I share it?" or "That\'s an interesting angle. I was thinking..."',
        },
        {
          id: '912-disagree-3',
          title: 'Friend Group Conflict',
          prompt: 'Two friends are disagreeing and ask what you think. How do you share your opinion respectfully?',
          guidance: 'Try: "I get both sides. Here\'s what I\'m seeing..."',
        },
      ],
    },
  },
  {
    id: 'staying-on-topic',
    title: 'Staying on Topic',
    description: 'Practicing how to follow conversations and contribute relevant responses.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-topic-1',
          title: 'Animal Talk',
          prompt: 'Your friend says, "I love cats." What could you say to keep the conversation going?',
          guidance: 'Try: "Me too! I pet one yesterday."',
        },
        {
          id: 'k2-topic-2',
          title: 'Toy Discussion',
          prompt: 'Someone says, "My favorite toy is a truck." What should you say next to stay on topic?',
          guidance: 'Say: "Cool! I have a red truck at home."',
        },
        {
          id: 'k2-topic-3',
          title: 'Snack Chat',
          prompt: 'A classmate says, "I had a banana at lunch." What\'s a good reply that matches?',
          guidance: 'Try: "Yum! I had an apple."',
        },
      ],
      '3-5': [
        {
          id: '35-topic-1',
          title: 'Class Trip Conversation',
          prompt: 'Your friend says, "I liked the science museum." How do you stay on topic?',
          guidance: 'Say: "Same! The dinosaur skeletons were awesome."',
        },
        {
          id: '35-topic-2',
          title: 'Video Game Talk',
          prompt: 'Your friend says, "I beat level 5 last night!" What\'s a good response?',
          guidance: 'Try: "Nice! That level was hard for me."',
        },
        {
          id: '35-topic-3',
          title: 'Birthday Plans',
          prompt: 'A classmate says, "I\'m having a party this weekend." How do you respond?',
          guidance: 'Say: "That\'s exciting! What kind of party is it?"',
        },
      ],
      '6-8': [
        {
          id: '68-topic-1',
          title: 'Classroom Project Talk',
          prompt: 'Someone says, "I\'m doing my project on climate change." How do you keep the convo focused?',
          guidance: 'Say: "That\'s a great topic. Are you including sea level rise?"',
        },
        {
          id: '68-topic-2',
          title: 'TV Show Chat',
          prompt: 'Your friend says, "Did you see the latest episode?" What do you say to stay in the conversation?',
          guidance: 'Try: "Yeah! That ending was wild."',
        },
        {
          id: '68-topic-3',
          title: 'New Teacher Talk',
          prompt: 'Someone says, "Our new math teacher is strict." What\'s a related comment?',
          guidance: 'Say: "I noticed that too. But I like how she explains things."',
        },
      ],
      '9-12': [
        {
          id: '912-topic-1',
          title: 'Politics Discussion',
          prompt: 'A peer says, "I think voting age should be 16." What\'s a relevant follow-up?',
          guidance: 'Try: "Interesting. What do you think would change if that happened?"',
        },
        {
          id: '912-topic-2',
          title: 'College Talk',
          prompt: 'Someone says, "I\'m thinking of applying to UCLA." How do you stay on track?',
          guidance: 'Say: "That\'s a great school. Are you looking at other UC campuses too?"',
        },
        {
          id: '912-topic-3',
          title: 'Music Banter',
          prompt: 'A group is talking about hip-hop. What\'s a relevant way to join in?',
          guidance: 'Try: "Did you hear Kendrick\'s latest album? or "I think Nas is underrated."',
        },
      ],
    },
  },
  {
    id: 'active-listening',
    title: 'Active Listening',
    description: 'Practicing how to show you\'re listening with your body, eyes, and words.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-listen-1',
          title: 'Story Time',
          prompt: 'Your teacher is reading a story. How do you show you\'re listening?',
          guidance: 'Sit still, look at the book, and nod or smile.',
        },
        {
          id: 'k2-listen-2',
          title: 'Friend\'s Turn',
          prompt: 'Your friend is telling you about their weekend. What can you do?',
          guidance: 'Look at them, don\'t interrupt, and say "Wow!" or "Cool!" after.',
        },
        {
          id: 'k2-listen-3',
          title: 'Circle Time',
          prompt: 'Another student is sharing their idea. What should you do while they talk?',
          guidance: 'Keep your body calm, look at them, and wait until they\'re done.',
        },
      ],
      '3-5': [
        {
          id: '35-listen-1',
          title: 'Partner Share',
          prompt: 'Your partner is telling you about their science project. How do you show interest?',
          guidance: 'Face them, nod, and say things like "That\'s interesting!" or "Tell me more."',
        },
        {
          id: '35-listen-2',
          title: 'Class Discussion',
          prompt: 'During a class discussion, a student is explaining their answer. What should you do?',
          guidance: 'Track the speaker with your eyes and think about what they\'re saying.',
        },
        {
          id: '35-listen-3',
          title: 'Friend Problem',
          prompt: 'A friend is upset and talking to you about it. What\'s a good way to listen?',
          guidance: 'Show empathy with your face, nod, and say "I\'m really sorry that happened."',
        },
      ],
      '6-8': [
        {
          id: '68-listen-1',
          title: 'Peer Feedback',
          prompt: 'You\'re giving peer feedback in art class. Your classmate speaks first. How do you listen actively?',
          guidance: 'Make eye contact, avoid interrupting, and repeat key parts of what they said.',
        },
        {
          id: '68-listen-2',
          title: 'Group Work',
          prompt: 'Your group is deciding who does what. How do you show you\'re listening and care?',
          guidance: 'Face them, ask follow-up questions, and use phrases like "I hear you saying..."',
        },
        {
          id: '68-listen-3',
          title: 'Lunch Conversation',
          prompt: 'A friend is telling a story at lunch. What\'s a sign you\'re truly listening?',
          guidance: 'Keep your eyes on them, nod, and laugh or react to what they say.',
        },
      ],
      '9-12': [
        {
          id: '912-listen-1',
          title: 'Classroom Debate',
          prompt: 'In a debate, someone gives a strong point. How do you respond as a good listener?',
          guidance: 'Don\'t interrupt, paraphrase their point when replying, and stay calm.',
        },
        {
          id: '912-listen-2',
          title: 'Difficult Conversation',
          prompt: 'A friend opens up about something serious. What does active listening look like?',
          guidance: 'Maintain eye contact, don\'t rush to fix it—just say "That makes sense" or "I get that."',
        },
        {
          id: '912-listen-3',
          title: 'Interview Practice',
          prompt: 'You\'re practicing interview skills. What\'s a way to show you\'re listening?',
          guidance: 'Lean forward slightly, nod occasionally, and summarize what they just said.',
        },
      ],
    },
  },
  {
    id: 'taking-turns-speaking',
    title: 'Taking Turns Speaking',
    description: 'Practicing how to wait, speak, and listen in conversations with others.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-turns-1',
          title: 'Classroom Sharing',
          prompt: 'During show-and-tell, everyone wants to talk. What do you do when it\'s not your turn?',
          guidance: 'Keep your hands in your lap and wait quietly until the teacher calls on you.',
        },
        {
          id: 'k2-turns-2',
          title: 'Snack Table Chat',
          prompt: 'You\'re talking with friends at snack. What do you do when someone else starts talking?',
          guidance: 'Listen with your eyes and wait until they finish before you speak.',
        },
        {
          id: 'k2-turns-3',
          title: 'Story Time Questions',
          prompt: 'You have a question while your teacher is reading. What should you do?',
          guidance: 'Raise your hand and wait your turn without shouting out.',
        },
      ],
      '3-5': [
        {
          id: '35-turns-1',
          title: 'Group Project Talk',
          prompt: 'Your group is sharing ideas. How do you make sure everyone gets to speak?',
          guidance: 'Take turns, don\'t interrupt, and say "What do you think?" to include others.',
        },
        {
          id: '35-turns-2',
          title: 'Table Discussion',
          prompt: 'At lunch, your table is chatting. Someone keeps interrupting. What can you do?',
          guidance: 'Model turn-taking by pausing, then saying "I think it\'s your turn now."',
        },
        {
          id: '35-turns-3',
          title: 'Class Game Rules',
          prompt: 'You and friends are deciding game rules. What\'s a way to take turns talking?',
          guidance: 'Say "Let\'s each share one idea and take turns" before starting.',
        },
      ],
      '6-8': [
        {
          id: '68-turns-1',
          title: 'Class Discussion',
          prompt: 'The class is discussing a new topic. You want to speak. What\'s the best way?',
          guidance: 'Raise your hand or wait for a pause, then contribute respectfully.',
        },
        {
          id: '68-turns-2',
          title: 'Conflict Resolution',
          prompt: 'You\'re resolving a disagreement with a classmate. How do you take turns fairly?',
          guidance: 'Say "You go first, I\'ll listen, then I\'d like to share my side."',
        },
        {
          id: '68-turns-3',
          title: 'Club Meeting Debate',
          prompt: 'Your club is having a spirited debate. How do you join in without interrupting?',
          guidance: 'Wait for a speaker to finish, then say "Can I add something to that?"',
        },
      ],
      '9-12': [
        {
          id: '912-turns-1',
          title: 'Seminar Discussion',
          prompt: 'You\'re in a seminar where everyone has strong opinions. How do you take turns speaking?',
          guidance: 'Let others finish their point, then raise your hand or say "Can I add to that?"',
        },
        {
          id: '912-turns-2',
          title: 'Team Decision-Making',
          prompt: 'Your team is deciding on a project direction. How do you make sure all voices are heard?',
          guidance: 'Say "Let\'s go one by one so everyone has a say" and model good turn-taking.',
        },
        {
          id: '912-turns-3',
          title: 'Job Interview Roleplay',
          prompt: 'You\'re practicing interviews. The interviewer talks a lot—how do you respond politely?',
          guidance: 'Wait for a pause, then say "Thanks for sharing that—may I respond to your question now?"',
        },
      ],
    },
  },
  {
    id: 'expressing-emotions-respectfully',
    title: 'Expressing Emotions Respectfully',
    description: 'Learning how to express feelings in healthy, respectful ways.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-emotions-1',
          title: 'Frustrated with Blocks',
          prompt: 'You can\'t build your tower and feel frustrated. What can you say?',
          guidance: 'Try "I\'m feeling frustrated. Can you help me?"',
        },
        {
          id: 'k2-emotions-2',
          title: 'Happy Drawing',
          prompt: 'You finished your drawing and feel proud. What can you say to share that?',
          guidance: 'Say "Look what I made! I worked really hard on it."',
        },
        {
          id: 'k2-emotions-3',
          title: 'Upset at Recess',
          prompt: 'Your friend didn\'t let you play. How can you tell them how you feel?',
          guidance: 'Say "That made me feel left out. Can I play next time?"',
        },
      ],
      '3-5': [
        {
          id: '35-emotions-1',
          title: 'Nervous Before a Test',
          prompt: 'You feel nervous before a quiz. How can you talk about it?',
          guidance: 'Try "I\'m a little nervous—can we go over the review sheet together?"',
        },
        {
          id: '35-emotions-2',
          title: 'Excited About a Win',
          prompt: 'Your team won the game! How do you share your excitement respectfully?',
          guidance: 'Say "I\'m so excited we won! Great job, everyone!" instead of bragging.',
        },
        {
          id: '35-emotions-3',
          title: 'Feeling Disappointed',
          prompt: 'You didn\'t get picked for a part in the play. What can you say?',
          guidance: 'Say "I\'m disappointed, but I\'ll try again next time."',
        },
      ],
      '6-8': [
        {
          id: '68-emotions-1',
          title: 'Embarrassed in Class',
          prompt: 'You gave a wrong answer and feel embarrassed. How can you respond?',
          guidance: 'Say "Oops, I got that one wrong. I\'ll try again." with confidence.',
        },
        {
          id: '68-emotions-2',
          title: 'Angry at a Friend',
          prompt: 'A friend broke a promise. You\'re angry. How do you talk about it?',
          guidance: 'Say "I was really upset when that happened. Can we talk about it?"',
        },
        {
          id: '68-emotions-3',
          title: 'Excited for a Trip',
          prompt: 'You\'re excited about an upcoming trip. How do you share that?',
          guidance: 'Say "I can\'t wait for the trip! What are you most excited about?"',
        },
      ],
      '9-12': [
        {
          id: '912-emotions-1',
          title: 'Stressed with Homework',
          prompt: 'You\'re overwhelmed with work. How can you express that to your teacher?',
          guidance: 'Say "I\'m feeling really stressed—can we talk about an extension?"',
        },
        {
          id: '912-emotions-2',
          title: 'Apologizing to a Friend',
          prompt: 'You got into an argument with a friend. What can you say to express regret?',
          guidance: 'Say "I\'m sorry for how I reacted. I was feeling really upset."',
        },
        {
          id: '912-emotions-3',
          title: 'Proud of a Big Win',
          prompt: 'You won an award. How do you express your pride without putting others down?',
          guidance: 'Say "I\'m really proud of this—it means a lot. Everyone worked so hard!"',
        },
      ],
    },
  },
  {
    id: 'giving-and-receiving-feedback',
    title: 'Giving and Receiving Feedback',
    description: 'Practicing how to give and receive feedback kindly and constructively.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-feedback-1',
          title: 'Nice Drawing!',
          prompt: 'Your friend shows you their picture. What can you say?',
          guidance: 'Try "I like your colors! Maybe you could add more stars?"',
        },
        {
          id: 'k2-feedback-2',
          title: 'Getting Help with Blocks',
          prompt: 'A friend says your block tower is wobbly. What do you say?',
          guidance: 'Say "Thanks! Do you know how to make it stronger?"',
        },
        {
          id: 'k2-feedback-3',
          title: 'Sharing Ideas in Class',
          prompt: 'Your classmate gives you an idea. How can you respond kindly?',
          guidance: 'Say "Thanks, I\'ll try that! even if you do it differently.',
        },
      ],
      '3-5': [
        {
          id: '35-feedback-1',
          title: 'Peer Editing',
          prompt: 'Your classmate asks for help with their story. How do you give feedback?',
          guidance: 'Say "I liked your beginning! Maybe add more detail at the end."',
        },
        {
          id: '35-feedback-2',
          title: 'Teacher Feedback',
          prompt: 'Your teacher gave you advice on your project. How do you respond?',
          guidance: 'Say "Thanks! I\'ll work on that part you mentioned."',
        },
        {
          id: '35-feedback-3',
          title: 'Group Work Suggestions',
          prompt: 'You think your group could improve something. How do you bring it up?',
          guidance: 'Try "What if we added this part—what do you think?"',
        },
      ],
      '6-8': [
        {
          id: '68-feedback-1',
          title: 'Receiving Peer Feedback',
          prompt: 'Your classmate says your presentation was confusing. How do you respond?',
          guidance: 'Say "Thanks for the feedback—can you tell me which part?"',
        },
        {
          id: '68-feedback-2',
          title: 'Giving Constructive Criticism',
          prompt: 'Your friend asks what you think of their video. You see room for improvement. What do you say?',
          guidance: 'Say "I liked your transitions! Maybe the ending could be clearer?"',
        },
        {
          id: '68-feedback-3',
          title: 'Class Reflection',
          prompt: 'You\'re giving feedback on a class activity. How do you keep it respectful?',
          guidance: 'Say "I liked when we worked in teams. I think it could be better if we had more time."',
        },
      ],
      '9-12': [
        {
          id: '912-feedback-1',
          title: 'Critique in Class',
          prompt: 'You\'re reviewing a peer\'s art. How do you give helpful feedback?',
          guidance: 'Say "The color choices are great—have you thought about changing the layout?"',
        },
        {
          id: '912-feedback-2',
          title: 'Receiving Feedback Gracefully',
          prompt: 'You\'re given tough feedback on an essay. How do you respond?',
          guidance: 'Say "Thanks, that\'s helpful. I\'ll rework my intro." instead of getting defensive.',
        },
        {
          id: '912-feedback-3',
          title: 'Team Collaboration',
          prompt: 'You disagree with your group\'s approach. How do you share that?',
          guidance: 'Say "I see where you\'re coming from—can I suggest a slightly different angle?"',
        },
      ],
    },
  },
  {
    id: 'resolving-conflicts',
    title: 'Resolving Conflicts',
    description: 'Practicing how to handle disagreements and problems with others respectfully and calmly.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-conflict-1',
          title: 'Toy Trouble',
          prompt: 'You and your friend both want the same toy. What can you do?',
          guidance: 'Try: "Let\'s take turns!" or "Do you want to play with something else together?"',
        },
        {
          id: 'k2-conflict-2',
          title: 'Line Leader',
          prompt: 'You both want to be line leader today. What could you say?',
          guidance: 'Try: "You can go first today, and I\'ll go first tomorrow."',
        },
        {
          id: 'k2-conflict-3',
          title: 'Accidental Bump',
          prompt: 'Your friend bumps into you and you fall. What do you do?',
          guidance: 'Say: "That hurt, but I know it was an accident. Let\'s be careful."',
        },
      ],
      '3-5': [
        {
          id: '35-conflict-1',
          title: 'Group Project Disagreement',
          prompt: 'You and your partner want to do different ideas for the project. What can you say?',
          guidance: 'Try: "Let\'s make a list of both ideas and pick what works best."',
        },
        {
          id: '35-conflict-2',
          title: 'Friendship Misunderstanding',
          prompt: 'Your friend is mad you didn\'t sit by them at lunch. What can you say?',
          guidance: 'Try: "I didn\'t mean to upset you—can we talk about it?"',
        },
        {
          id: '35-conflict-3',
          title: 'Fair Play Problem',
          prompt: 'Someone says you didn\'t follow the rules. What can you do?',
          guidance: 'Say: "Let\'s go over the rules together and figure it out."',
        },
      ],
      '6-8': [
        {
          id: '68-conflict-1',
          title: 'Group Chat Drama',
          prompt: 'A message you sent upset someone. They responded angrily. What\'s a good first step?',
          guidance: 'Try: "Sorry, I didn\'t mean it that way. Can we talk about it in person?"',
        },
        {
          id: '68-conflict-2',
          title: 'Class Debate Clash',
          prompt: 'A classmate dismisses your opinion. You feel disrespected. How do you handle it?',
          guidance: 'Say: "I see your point, but I\'d appreciate if you let me finish too."',
        },
        {
          id: '68-conflict-3',
          title: 'Friendship Fallout',
          prompt: 'You and a friend are giving each other the silent treatment. How do you restart the conversation?',
          guidance: 'Try: "I miss hanging out. Can we talk and fix things?"',
        },
      ],
      '9-12': [
        {
          id: '912-conflict-1',
          title: 'Differing Opinions in Class',
          prompt: 'A peer challenges your point strongly. How can you respond without escalating?',
          guidance: 'Say: "That\'s a valid viewpoint. I\'d like to explain mine too if that\'s okay."',
        },
        {
          id: '912-conflict-2',
          title: 'Team Argument',
          prompt: 'Two group members are arguing and not listening. What can you do as the mediator?',
          guidance: 'Say: "Let\'s take a step back and let everyone speak one at a time."',
        },
        {
          id: '912-conflict-3',
          title: 'Personal Disagreement',
          prompt: 'A conflict with a friend is affecting your focus. What\'s a mature way to handle it?',
          guidance: 'Say: "Can we talk after school? I\'d like to work things out."',
        },
      ],
    },
  },
  {
    id: 'making-friendships',
    title: 'Making and Maintaining Friendships',
    description: 'Practicing how to start, grow, and sustain healthy friendships.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-friends-1',
          title: 'New Friend at School',
          prompt: 'You see someone new sitting alone. What can you say?',
          guidance: 'Try: "Hi! Want to play with me?" or "My name\'s [Name]—what\'s yours?"',
        },
        {
          id: 'k2-friends-2',
          title: 'Sharing is Caring',
          prompt: 'You brought stickers and your friend wants one. What do you do?',
          guidance: 'Say: "Sure! You can have one too."',
        },
        {
          id: 'k2-friends-3',
          title: 'Friend Feeling Sad',
          prompt: 'Your friend looks sad. What can you do to show you care?',
          guidance: 'Try: "Are you okay?" or "Want to talk or play something fun?"',
        },
      ],
      '3-5': [
        {
          id: '35-friends-1',
          title: 'Joining a Club',
          prompt: 'You want to join a school club and make friends. What can you say to start?',
          guidance: 'Try: "Hey, I\'m new to this—can I join you guys?"',
        },
        {
          id: '35-friends-2',
          title: 'Keeping in Touch',
          prompt: 'Your friend is going on vacation. How can you stay connected?',
          guidance: 'Say: "Text me while you\'re gone! I\'ll miss you."',
        },
        {
          id: '35-friends-3',
          title: 'Supporting a Friend',
          prompt: 'Your friend is nervous about a test. How can you help?',
          guidance: 'Try: "Want to study together?" or "You\'ve got this—I believe in you."',
        },
      ],
      '6-8': [
        {
          id: '68-friends-1',
          title: 'Starting a Conversation',
          prompt: 'You sit near someone in class who seems cool. How do you start talking?',
          guidance: 'Try: "Hey, did you understand that last assignment?" or "Cool shirt—what band is that?"',
        },
        {
          id: '68-friends-2',
          title: 'Friendship Maintenance',
          prompt: 'You haven\'t talked to a friend in a while. How do you reach out?',
          guidance: 'Say: "Hey! I\'ve been meaning to text—want to catch up?"',
        },
        {
          id: '68-friends-3',
          title: 'Apologizing',
          prompt: 'You hurt a friend\'s feelings by accident. What can you say?',
          guidance: 'Try: "I\'m really sorry—I didn\'t mean to hurt you. Can we talk about it?"',
        },
      ],
      '9-12': [
        {
          id: '912-friends-1',
          title: 'Deepening Friendships',
          prompt: 'You want to grow closer with a classmate you really click with. What\'s a good move?',
          guidance: 'Say: "Want to hang out this weekend? I feel like we always have great convos."',
        },
        {
          id: '912-friends-2',
          title: 'Navigating Changes',
          prompt: 'You and a friend are growing apart. How do you bring it up honestly?',
          guidance: 'Try: "I\'ve noticed we\'re not as close—do you feel that too?"',
        },
        {
          id: '912-friends-3',
          title: 'Friend Burnout',
          prompt: 'You need space from a friend who\'s overwhelming you. What\'s a kind way to say it?',
          guidance: 'Say: "I care about you a lot, but I need a little space right now. Hope you understand."',
        },
      ],
    },
  },
  {
    id: 'asking-for-help',
    title: 'Asking for Help or Support',
    icon: '📚',
    description: 'Practice asking for help respectfully from classmates, teachers, or other trusted adults.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-help-1',
          title: 'Tying Your Shoes',
          prompt: 'You\'re trying to tie your shoes but can\'t. What do you say?',
          guidance: 'Say: "Can you help me tie my shoes, please?"',
        },
        {
          id: 'k2-help-2',
          title: 'Reach the Crayons',
          prompt: 'The crayons are too high. How do you ask for help?',
          guidance: 'Try: "Can you help me get the crayons up there?"',
        },
        {
          id: 'k2-help-3',
          title: 'Need the Bathroom',
          prompt: 'You need to go to the bathroom. What should you do?',
          guidance: 'Say: "Excuse me, can I please go to the bathroom?"',
        },
      ],
      '3-5': [
        {
          id: '35-help-1',
          title: 'Classwork Confusion',
          prompt: 'You don\'t understand the instructions for your assignment. What do you say?',
          guidance: 'Say: "I\'m a little confused—can you explain that again, please?"',
        },
        {
          id: '35-help-2',
          title: 'Asking a Friend',
          prompt: 'You forgot your pencil. What can you ask a classmate?',
          guidance: 'Try: "Hey, can I borrow a pencil for this assignment?"',
        },
        {
          id: '35-help-3',
          title: 'Feeling Left Out',
          prompt: 'You\'re feeling left out at recess. How do you ask for support?',
          guidance: 'Say: "Can I join you guys?" or "I don\'t want to be alone right now."',
        },
      ],
      '6-8': [
        {
          id: '68-help-1',
          title: 'Studying Struggles',
          prompt: 'You\'re struggling with your math homework. How do you ask a teacher or peer?',
          guidance: 'Try: "I\'ve been trying this for a while and I\'m stuck—can you walk me through it?"',
        },
        {
          id: '68-help-2',
          title: 'Friendship Trouble',
          prompt: 'You had an argument with a friend. How do you ask a trusted adult for support?',
          guidance: 'Say: "I\'m not sure what to do—can I talk to you about a friendship issue?"',
        },
        {
          id: '68-help-3',
          title: 'Mental Health Check',
          prompt: 'You\'ve been feeling overwhelmed. How do you reach out for help?',
          guidance: 'Try: "Lately I\'ve been really stressed. Can we talk?"',
        },
      ],
      '9-12': [
        {
          id: '912-help-1',
          title: 'Advocating in Class',
          prompt: 'You need more time for a project. How do you ask your teacher?',
          guidance: 'Say: "I\'m struggling to meet the deadline—can I get an extension?"',
        },
        {
          id: '912-help-2',
          title: 'Friendship Boundaries',
          prompt: 'Your friend is dealing with a lot and venting to you daily. It\'s becoming too much. How do you ask for space?',
          guidance: 'Try: "I want to be there for you, but I\'m feeling really overwhelmed too—can we take a break from talking about this?"',
        },
        {
          id: '912-help-3',
          title: 'Emotional Check-in',
          prompt: 'You\'ve been feeling low for days. What\'s a way to tell someone you trust?',
          guidance: 'Say: "I haven\'t been feeling like myself lately. I think I need someone to talk to."',
        },
      ],
    },
  },
  {
    id: 'responding-to-conflict',
    title: 'Responding to Conflict or Disagreement',
    icon: '🛡️',
    description: 'Learn how to handle conflicts, disagreements, or misunderstandings calmly and respectfully.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-conflict-1',
          title: 'Toy Trouble',
          prompt: 'You and a friend both want the same toy. What can you say?',
          guidance: 'Try: "Let\'s take turns" or "You can go first, then me."',
        },
        {
          id: 'k2-conflict-2',
          title: 'Snack Swap',
          prompt: 'A classmate says they don\'t want to trade snacks anymore. What do you say?',
          guidance: 'Say: "That\'s okay. Maybe next time."',
        },
        {
          id: 'k2-conflict-3',
          title: 'Accidental Bump',
          prompt: 'Someone bumps into you during playtime. What do you do?',
          guidance: 'Say: "That hurt a little, but I know it was an accident."',
        },
      ],
      '3-5': [
        {
          id: '35-conflict-1',
          title: 'Group Project Disagreement',
          prompt: 'You and your partner disagree on how to present your project. What do you say?',
          guidance: 'Try: "Let\'s hear both ideas and pick what works best together."',
        },
        {
          id: '35-conflict-2',
          title: 'Friend Leaves You Out',
          prompt: 'You feel left out at recess. How do you bring it up?',
          guidance: 'Say: "I felt a little left out. Can I join next time?"',
        },
        {
          id: '35-conflict-3',
          title: 'Accused of Something',
          prompt: 'Someone says you said something you didn\'t. What can you say?',
          guidance: 'Say: "I didn\'t say that, but I\'d like to understand what happened."',
        },
      ],
      '6-8': [
        {
          id: '68-conflict-1',
          title: 'Friend Misunderstanding',
          prompt: 'A friend misunderstood a text you sent. How do you clear it up?',
          guidance: 'Say: "That wasn\'t my intention—I\'m sorry if it came across that way."',
        },
        {
          id: '68-conflict-2',
          title: 'Group Argument',
          prompt: 'Your group starts arguing during a project. How do you help resolve it?',
          guidance: 'Try: "Let\'s all take a breath—maybe we can find a middle ground."',
        },
        {
          id: '68-conflict-3',
          title: 'Locker Room Disagreement',
          prompt: 'A peer makes a rude comment after gym. How can you respond calmly?',
          guidance: 'Say: "That wasn\'t cool. Let\'s just respect each other."',
        },
      ],
      '9-12': [
        {
          id: '912-conflict-1',
          title: 'Political Disagreement in Class',
          prompt: 'You and a classmate strongly disagree on a topic. What do you say to keep it respectful?',
          guidance: 'Say: "I see where you\'re coming from—here\'s my perspective."',
        },
        {
          id: '912-conflict-2',
          title: 'Friend Argument over Text',
          prompt: 'A conversation over text escalated into a fight. How do you de-escalate?',
          guidance: 'Try: "Can we talk in person? I\'d rather clear this up face to face."',
        },
        {
          id: '912-conflict-3',
          title: 'Disagreement with a Teacher',
          prompt: 'You disagree with how a teacher graded your work. What\'s a respectful way to bring it up?',
          guidance: 'Say: "Could I talk to you about my grade? I want to understand how you evaluated it."',
        },
      ],
    },
  },
  {
    id: 'handling-peer-pressure',
    title: 'Handling Peer Pressure',
    icon: '⚡',
    description: 'Practice responding with confidence when someone pressures you to do something.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-peer-1',
          title: 'Copying Answers',
          prompt: 'A classmate asks you to copy your work. What should you say?',
          guidance: 'Say: "I can help you understand it, but I can\'t give you my answers."',
        },
        {
          id: 'k2-peer-2',
          title: 'Running in Hallway',
          prompt: 'Your friend wants to run in the hallway. You know that\'s not safe. What do you do?',
          guidance: 'Say: "Let\'s walk. We could get in trouble."',
        },
        {
          id: 'k2-peer-3',
          title: 'Skipping Clean-Up',
          prompt: 'Others are skipping clean-up time and ask you to do the same. What do you say?',
          guidance: 'Say: "I want to help clean up so we can all finish faster."',
        },
      ],
      '3-5': [
        {
          id: '35-peer-1',
          title: 'Making Fun of Others',
          prompt: 'Friends are laughing at another student and want you to join. What can you say?',
          guidance: 'Say: "That\'s not nice—I don\'t want to make fun of anyone."',
        },
        {
          id: '35-peer-2',
          title: 'Skipping Homework',
          prompt: 'A classmate dares you to skip your homework. How do you respond?',
          guidance: 'Say: "I\'d rather do my homework—I don\'t want to fall behind."',
        },
        {
          id: '35-peer-3',
          title: 'Daring Game',
          prompt: 'Someone dares you to break a rule. How do you say no?',
          guidance: 'Say: "That\'s not worth getting in trouble over."',
        },
      ],
      '6-8': [
        {
          id: '68-peer-1',
          title: 'Cheating on a Test',
          prompt: 'Friends tell you to cheat on a test because "everyone is doing it." What do you say?',
          guidance: 'Say: "I don\'t want to risk getting caught. I\'ll do it my way."',
        },
        {
          id: '68-peer-2',
          title: 'Group Think Pressure',
          prompt: 'Everyone agrees on something you disagree with. What can you do?',
          guidance: 'Say: "I have a different opinion, and that\'s okay."',
        },
        {
          id: '68-peer-3',
          title: 'Being Dared in Public',
          prompt: 'You\'re dared to do something embarrassing. How do you stand your ground?',
          guidance: 'Say: "I\'m not comfortable with that. Let\'s do something else."',
        },
      ],
      '9-12': [
        {
          id: '912-peer-1',
          title: 'Substance Offer',
          prompt: 'At a party, someone offers you something you don\'t want to take. What do you say?',
          guidance: 'Say: "Nah, I\'m good—just here to chill."',
        },
        {
          id: '912-peer-2',
          title: 'Friend Pressure in Relationship',
          prompt: 'A friend is pressuring you to go further in a relationship than you want. What do you say?',
          guidance: 'Say: "I\'m not ready for that—and if you care about me, you\'ll respect that."',
        },
        {
          id: '912-peer-3',
          title: 'Cutting Class',
          prompt: 'Friends suggest cutting class. How do you respond?',
          guidance: 'Say: "I\'ve got stuff I don\'t want to miss—catch you after."',
        },
      ],
    },
  },
  {
    id: 'expressing-emotions-needs',
    title: 'Expressing Emotions and Needs',
    description: 'Helping students recognize and communicate their feelings and needs clearly.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-emotion-1',
          title: 'Feeling Sad',
          prompt: 'You feel sad because you didn\'t get picked. What can you say to your teacher?',
          guidance: 'Say: "I feel sad. Can I have a turn next time?"',
        },
        {
          id: 'k2-emotion-2',
          title: 'Too Loud',
          prompt: 'The room is too loud and it\'s hurting your ears. What can you say?',
          guidance: 'Say: "It\'s too noisy. Can we use quiet voices?"',
        },
        {
          id: 'k2-emotion-3',
          title: 'Need Help',
          prompt: 'You\'re having trouble with a task. What do you say?',
          guidance: 'Say: "I need help, please."',
        },
      ],
      '3-5': [
        {
          id: '35-emotion-1',
          title: 'Frustrated with a Game',
          prompt: 'You\'re playing a game and you feel frustrated. What can you do?',
          guidance: 'Say: "I\'m getting frustrated—can we take a break?"',
        },
        {
          id: '35-emotion-2',
          title: 'Need Personal Space',
          prompt: 'Someone is standing too close. How do you express your need for space?',
          guidance: 'Say: "Can you please give me a little more space?"',
        },
        {
          id: '35-emotion-3',
          title: 'Feeling Left Out',
          prompt: 'You feel left out during group work. What can you say?',
          guidance: 'Say: "I\'d like to be part of this. Can I help with something?"',
        },
      ],
      '6-8': [
        {
          id: '68-emotion-1',
          title: 'Feeling Overwhelmed',
          prompt: 'You\'re overwhelmed with homework and stress. What\'s a healthy way to express this?',
          guidance: 'Say: "I\'m feeling really overwhelmed. Can we talk about ways to manage this?"',
        },
        {
          id: '68-emotion-2',
          title: 'Setting Boundaries',
          prompt: 'A friend keeps texting during your focus time. What can you say?',
          guidance: 'Say: "I need time to focus right now—can I text you later?"',
        },
        {
          id: '68-emotion-3',
          title: 'Disagreeing Respectfully',
          prompt: 'You strongly disagree with a peer. How do you express that clearly?',
          guidance: 'Say: "I see it differently, and here\'s why..."',
        },
      ],
      '9-12': [
        {
          id: '912-emotion-1',
          title: 'Emotional Check-In',
          prompt: 'You\'re struggling emotionally and want to let a teacher know. What can you say?',
          guidance: 'Say: "I\'m having a tough time today. Can I check in with you later?"',
        },
        {
          id: '912-emotion-2',
          title: 'Asserting a Need',
          prompt: 'You need extra time on an assignment due to personal stress. How do you ask?',
          guidance: 'Say: "I\'ve had a hard week. Is there any chance for an extension?"',
        },
        {
          id: '912-emotion-3',
          title: 'Expressing Discomfort',
          prompt: 'You\'re uncomfortable with something a classmate said. What\'s a respectful way to express that?',
          guidance: 'Say: "That comment didn\'t sit right with me. Can we talk about it?"',
        },
      ],
    },
  },
  {
    id: 'giving-receiving-feedback',
    title: 'Giving and Receiving Feedback',
    description: 'Practicing how to offer kind, helpful feedback and how to accept it gracefully.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-feedback-1',
          title: 'Nice Words on Art',
          prompt: 'Your friend shows you a drawing. How can you give kind feedback?',
          guidance: 'Say: "I like your colors! Maybe you can add a sun too."',
        },
        {
          id: 'k2-feedback-2',
          title: 'Hearing Feedback',
          prompt: 'Your teacher says you should try to write more letters. How do you respond?',
          guidance: 'Say: "Okay, I\'ll try that!"',
        },
        {
          id: 'k2-feedback-3',
          title: 'Helping a Friend',
          prompt: 'Your friend is trying to build a tower but it keeps falling. What feedback can you give?',
          guidance: 'Say: "Maybe try putting the big blocks on the bottom!"',
        },
      ],
      '3-5': [
        {
          id: '35-feedback-1',
          title: 'Peer Writing Review',
          prompt: 'A classmate reads your story and gives suggestions. How do you respond?',
          guidance: 'Say: "Thanks! I didn\'t think of that—good idea."',
        },
        {
          id: '35-feedback-2',
          title: 'Giving Ideas Kindly',
          prompt: 'Your partner\'s science project needs improvement. What\'s a kind way to give feedback?',
          guidance: 'Say: "It\'s a great start. Maybe try adding a chart to explain it more."',
        },
        {
          id: '35-feedback-3',
          title: 'Feeling Defensive',
          prompt: 'Someone gives you feedback you don\'t agree with. What can you say?',
          guidance: 'Say: "Thanks for the feedback. I\'ll think about it."',
        },
      ],
      '6-8': [
        {
          id: '68-feedback-1',
          title: 'Group Project Critique',
          prompt: 'You need to suggest changes in a group project. How do you do that helpfully?',
          guidance: 'Say: "What if we tweak the intro so it\'s more attention-grabbing?"',
        },
        {
          id: '68-feedback-2',
          title: 'Taking Feedback',
          prompt: 'Your teacher says your essay needs a stronger argument. What\'s a mature response?',
          guidance: 'Say: "Got it—I\'ll work on clarifying my points. Thanks."',
        },
        {
          id: '68-feedback-3',
          title: 'Tensions in Feedback',
          prompt: 'A classmate says your idea might not work. You disagree. What do you say?',
          guidance: 'Say: "I see your point—can we test both ideas and decide together?"',
        },
      ],
      '9-12': [
        {
          id: '912-feedback-1',
          title: 'Critiquing in Class',
          prompt: 'You\'re giving feedback on a peer\'s presentation. How do you offer it constructively?',
          guidance: 'Say: "You explained your point well—maybe just slow down a bit."',
        },
        {
          id: '912-feedback-2',
          title: 'Handling Criticism',
          prompt: 'You receive tough feedback in front of the class. What\'s a grounded response?',
          guidance: 'Say: "Thanks for the input. I\'ll work on improving that."',
        },
        {
          id: '912-feedback-3',
          title: 'Team Collaboration',
          prompt: 'Your team keeps ignoring your suggestions. How do you express your thoughts respectfully?',
          guidance: 'Say: "Can I share something? I think my idea might help us move forward."',
        },
      ],
    },
  },
  {
    id: 'starting-ending-conversations',
    title: 'Starting and Ending Conversations',
    description: 'Practicing how to begin and wrap up conversations in respectful, age-appropriate ways.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-convo-1',
          title: 'Saying Hello',
          prompt: 'You want to say hi to someone new at school. What do you say?',
          guidance: 'Try: "Hi! I\'m [your name]. What\'s your name?"',
        },
        {
          id: 'k2-convo-2',
          title: 'Goodbye After Play',
          prompt: 'It\'s time to go after playing with a friend. What can you say to end the conversation?',
          guidance: 'Say: "That was fun! Bye, see you later!"',
        },
        {
          id: 'k2-convo-3',
          title: 'Starting with a Compliment',
          prompt: 'You like someone\'s backpack and want to talk to them. What do you say?',
          guidance: 'Say: "Cool backpack! I like the color."',
        },
      ],
      '3-5': [
        {
          id: '35-convo-1',
          title: 'Joining New Friends',
          prompt: 'You want to start talking to a new group. What\'s a good way to start?',
          guidance: 'Say: "Hi, I\'m new here. Mind if I sit with you?"',
        },
        {
          id: '35-convo-2',
          title: 'Ending a Chat Politely',
          prompt: 'You need to go but you\'re in the middle of a conversation. What can you say?',
          guidance: 'Say: "It was great talking! I have to go now—see you later!"',
        },
        {
          id: '35-convo-3',
          title: 'Bringing Up a Topic',
          prompt: 'You want to talk to someone about a game you like. What\'s a way to start?',
          guidance: 'Say: "Do you play Minecraft? It\'s my favorite game!"',
        },
      ],
      '6-8': [
        {
          id: '68-convo-1',
          title: 'Classroom Partner Intro',
          prompt: 'You\'ve just been paired with a new partner in class. What do you say?',
          guidance: 'Say: "Hey, I\'m [name]. Nice to meet you. Want to start with this section?"',
        },
        {
          id: '68-convo-2',
          title: 'Wrapping Up Respectfully',
          prompt: 'You\'re ending a group chat at lunch. What\'s a polite exit?',
          guidance: 'Say: "I gotta run to class. Catch you guys later!"',
        },
        {
          id: '68-convo-3',
          title: 'Starting Small Talk',
          prompt: 'You\'re in a waiting area with someone from another class. How can you start a convo?',
          guidance: 'Say: "Hey, what class are you waiting for?" or "Cool shoes—where\'d you get them?"',
        },
      ],
      '9-12': [
        {
          id: '912-convo-1',
          title: 'Meeting Someone New',
          prompt: 'You\'re at a club meeting and meet someone new. How do you start a convo?',
          guidance: 'Say: "Hey, I haven\'t seen you at this meeting before—what brings you here?"',
        },
        {
          id: '912-convo-2',
          title: 'Exiting a Conversation Smoothly',
          prompt: 'You need to leave a conversation to get to class. What\'s a casual exit?',
          guidance: 'Say: "Great talking—let\'s catch up later!" or "I\'ll see you in chem!"',
        },
        {
          id: '912-convo-3',
          title: 'Starting with Shared Interests',
          prompt: 'You\'re next to someone wearing a band tee you like. What\'s a good icebreaker?',
          guidance: 'Say: "Love that shirt—do you listen to their new album?"',
        },
      ],
    },
  },
  {
    id: 'interrupting-politely',
    title: 'Interrupting Politely',
    description: 'Practicing how to get someone\'s attention or speak up without being disruptive.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-interrupt-1',
          title: 'Needing Help',
          prompt: 'You need help during class, but the teacher is talking. What should you do?',
          guidance: 'Raise your hand and wait. Say: "Excuse me, can you help me when you\'re free?"',
        },
        {
          id: 'k2-interrupt-2',
          title: 'Bathroom Break',
          prompt: 'You really need to go to the bathroom during story time. What do you say?',
          guidance: 'Whisper: "Excuse me, may I please use the bathroom?"',
        },
        {
          id: 'k2-interrupt-3',
          title: 'Parent on Phone',
          prompt: 'Your parent is on the phone and you want to ask something. What should you do?',
          guidance: 'Tap them gently and wait, or say: "Excuse me" and wait for a pause.',
        },
      ],
      '3-5': [
        {
          id: '35-interrupt-1',
          title: 'Group Talk Entry',
          prompt: 'A group is talking, but you have something important to add. How do you say it politely?',
          guidance: 'Say: "Sorry to interrupt—can I add something real quick?"',
        },
        {
          id: '35-interrupt-2',
          title: 'Asking a Question in Class',
          prompt: 'The teacher is explaining something and you\'re confused. What do you do?',
          guidance: 'Raise your hand. When called on, say: "Sorry to interrupt, I have a question."',
        },
        {
          id: '35-interrupt-3',
          title: 'Friend Talking',
          prompt: 'You need to tell your friend something, but they\'re talking. What do you do?',
          guidance: 'Wait, then say: "Hey, I didn\'t want to interrupt, but..."',
        },
      ],
      '6-8': [
        {
          id: '68-interrupt-1',
          title: 'Stepping In During Discussion',
          prompt: 'A class debate is going on, and you want to share your point. What\'s a respectful way?',
          guidance: 'Say: "Can I jump in for a sec?" or "Can I add something to that?"',
        },
        {
          id: '68-interrupt-2',
          title: 'Interrupting a Teacher',
          prompt: 'You need to leave early during a lesson. How do you interrupt politely?',
          guidance: 'Raise your hand or say quietly: "Excuse me, I need to leave early today."',
        },
        {
          id: '68-interrupt-3',
          title: 'Talking to a Busy Adult',
          prompt: 'You need to ask a question but the adult is speaking with someone else. What do you do?',
          guidance: 'Wait until there\'s a pause, then say: "Sorry to interrupt, do you have a minute?"',
        },
      ],
      '9-12': [
        {
          id: '912-interrupt-1',
          title: 'Joining a Conversation',
          prompt: 'You want to add to a discussion without cutting someone off. What\'s a good way?',
          guidance: 'Say: "Before we move on, can I add one quick thing?"',
        },
        {
          id: '912-interrupt-2',
          title: 'During Group Work',
          prompt: 'Two classmates are deep in discussion, but you have a suggestion. How do you chime in?',
          guidance: 'Say: "Sorry—mind if I jump in with a thought?"',
        },
        {
          id: '912-interrupt-3',
          title: 'Correcting Politely',
          prompt: 'Someone says something inaccurate. What\'s a polite way to correct them?',
          guidance: 'Say: "I think it might be a little different—can I share what I know?"',
        },
      ],
    },
  },
  {
    id: 'giving-receiving-compliments',
    title: 'Giving and Receiving Compliments',
    description: 'Practicing how to share kind words and respond to compliments respectfully.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-compliment-1',
          title: 'Nice Drawing',
          prompt: 'You like your friend\'s drawing. What can you say?',
          guidance: 'Try: "I love your picture! It\'s so colorful!"',
        },
        {
          id: 'k2-compliment-2',
          title: 'Compliment Response',
          prompt: 'Someone says your shoes are cool. How do you reply?',
          guidance: 'Say: "Thank you!" with a smile.',
        },
        {
          id: 'k2-compliment-3',
          title: 'Kind Words at Recess',
          prompt: 'You want to tell someone they\'re good at playing tag. What do you say?',
          guidance: 'Try: "You\'re really fast! You\'re great at this game!"',
        },
      ],
      '3-5': [
        {
          id: '35-compliment-1',
          title: 'Classmate\'s Presentation',
          prompt: 'You liked your classmate\'s project. What\'s a good compliment?',
          guidance: 'Say: "I liked how you explained your topic. It was really clear!"',
        },
        {
          id: '35-compliment-2',
          title: 'Receiving a Compliment',
          prompt: 'Someone compliments your outfit. What\'s a respectful response?',
          guidance: 'Say: "Thanks! That\'s really nice of you to say."',
        },
        {
          id: '35-compliment-3',
          title: 'Group Work Compliment',
          prompt: 'A partner did a great job. How do you let them know?',
          guidance: 'Say: "That was a great idea you had—it really helped us!"',
        },
      ],
      '6-8': [
        {
          id: '68-compliment-1',
          title: 'Friendly Praise',
          prompt: 'You want to compliment a classmate\'s presentation. What\'s appropriate?',
          guidance: 'Try: "You were super confident and clear—great job!"',
        },
        {
          id: '68-compliment-2',
          title: 'Receiving Sincerely',
          prompt: 'Someone compliments your hair. How should you respond?',
          guidance: 'Say: "Thanks! I appreciate that."',
        },
        {
          id: '68-compliment-3',
          title: 'Peer Encouragement',
          prompt: 'Your lab partner had a great idea. How can you compliment them?',
          guidance: 'Say: "That solution was really smart. Nice thinking!"',
        },
      ],
      '9-12': [
        {
          id: '912-compliment-1',
          title: 'Meaningful Compliment',
          prompt: 'You admire someone\'s writing in class. How do you say it respectfully?',
          guidance: 'Try: "I really liked your writing style—it was powerful."',
        },
        {
          id: '912-compliment-2',
          title: 'Responding with Grace',
          prompt: 'A peer says you did a great job in a performance. What do you say?',
          guidance: 'Say: "Thanks, that means a lot coming from you."',
        },
        {
          id: '912-compliment-3',
          title: 'Encouraging a Friend',
          prompt: 'Your friend did well on a hard test. How do you lift them up?',
          guidance: 'Say: "You worked so hard—you totally earned that grade."',
        },
      ],
    },
  },
  {
    id: 'handling-rejection-left-out',
    title: 'Handling Rejection or Being Left Out',
    description: 'Helping students navigate tough social moments with emotional regulation and self-respect.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-reject-1',
          title: 'Not Invited to Play',
          prompt: 'Some kids are playing and say "not right now" when you ask to join. What do you do?',
          guidance: 'Take a deep breath. Say: "Okay, maybe later" and find another fun thing to do.',
        },
        {
          id: 'k2-reject-2',
          title: 'Partner Picked Someone Else',
          prompt: 'Your friend picks someone else to sit with. How can you handle it?',
          guidance: 'Say: "That\'s okay, I\'ll find another spot" and sit with someone else.',
        },
        {
          id: 'k2-reject-3',
          title: 'Didn\'t Get Chosen',
          prompt: 'You didn\'t get picked for a game. What can you do to feel better?',
          guidance: 'Remind yourself: "It\'s okay. I\'ll cheer for my friends and try next time."',
        },
      ],
      '3-5': [
        {
          id: '35-reject-1',
          title: 'Not Invited to Group',
          prompt: 'A group forms without you. What\'s a positive way to respond?',
          guidance: 'Think: "Maybe next time," and find a different group or start your own activity.',
        },
        {
          id: '35-reject-2',
          title: 'Friend Says No',
          prompt: 'You ask a friend to hang out and they say they can\'t. What do you do?',
          guidance: 'Say: "No worries! Maybe another time" and do something you enjoy.',
        },
        {
          id: '35-reject-3',
          title: 'Being Excluded',
          prompt: 'You find out about a party you weren\'t invited to. What can you tell yourself?',
          guidance: 'Remind yourself: "It doesn\'t mean they don\'t like me. I still have people who care."',
        },
      ],
      '6-8': [
        {
          id: '68-reject-1',
          title: 'Feeling Left Out',
          prompt: 'Your group hangs out without you. How do you respond in a healthy way?',
          guidance: 'Say: "It stings, but I won\'t let it ruin my day. I\'ll make other plans."',
        },
        {
          id: '68-reject-2',
          title: 'Rejected in a Game or Team',
          prompt: 'You didn\'t get chosen for a spot. What\'s a mature way to respond?',
          guidance: 'Say: "Congrats to them. I\'ll keep practicing for next time."',
        },
        {
          id: '68-reject-3',
          title: 'Friend Avoiding You',
          prompt: 'A friend is ignoring you. What do you do?',
          guidance: 'Give them space. You might say: "Hey, I\'ve noticed some distance—want to talk?"',
        },
      ],
      '9-12': [
        {
          id: '912-reject-1',
          title: 'Didn\'t Make the Team',
          prompt: 'You didn\'t get selected. What do you tell yourself?',
          guidance: '"I\'m disappointed, but I\'ll use this as motivation to grow."',
        },
        {
          id: '912-reject-2',
          title: 'Romantic Rejection',
          prompt: 'You told someone how you feel and they don\'t feel the same. What now?',
          guidance: 'Say: "Thanks for being honest. I respect that" and give yourself space to heal.',
        },
        {
          id: '912-reject-3',
          title: 'Left Out of Plans',
          prompt: 'You saw friends made plans without you. How do you handle it?',
          guidance: 'Reflect: "I can feel sad, but I won\'t let it define my worth."',
        },
      ],
    },
  },
  {
    id: 'respecting-personal-space',
    title: 'Respecting Personal Space',
    description: 'Understanding boundaries and learning how to navigate physical proximity with respect.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-space-1',
          title: 'Too Close in Line',
          prompt: 'You\'re standing in line and bump into the person in front. What should you do?',
          guidance: 'Say: "Oops, sorry!" and take a small step back.',
        },
        {
          id: 'k2-space-2',
          title: 'Friend Feels Squished',
          prompt: 'You sit really close and your friend looks uncomfortable. What can you do?',
          guidance: 'Ask: "Is this too close?" and move over if they say yes.',
        },
        {
          id: 'k2-space-3',
          title: 'During Story Time',
          prompt: 'Everyone\'s sitting together and you\'re wiggling too much. What should you remember?',
          guidance: 'Try to keep your hands and feet to yourself so everyone is comfortable.',
        },
      ],
      '3-5': [
        {
          id: '35-space-1',
          title: 'Crowded Circle',
          prompt: 'You join a circle group and there\'s not much room. What\'s a good move?',
          guidance: 'Ask: "Is there space for me here?" before sitting down.',
        },
        {
          id: '35-space-2',
          title: 'Respecting Boundaries',
          prompt: 'A friend says "please give me space." What do you do?',
          guidance: 'Step back and say: "Of course, thanks for telling me."',
        },
        {
          id: '35-space-3',
          title: 'During Games',
          prompt: 'You\'re playing tag and someone says you\'re being too rough. How do you adjust?',
          guidance: 'Say: "Sorry about that. I\'ll be gentler."',
        },
      ],
      '6-8': [
        {
          id: '68-space-1',
          title: 'Personal Bubble',
          prompt: 'You\'re joking around with friends and someone says "that\'s too close." How do you respond?',
          guidance: 'Say: "Got it!" and give them more room right away.',
        },
        {
          id: '68-space-2',
          title: 'Body Language Cue',
          prompt: 'You notice someone leaning away as you talk. What might that mean?',
          guidance: 'It could mean they want more space—take a step back and check in.',
        },
        {
          id: '68-space-3',
          title: 'Respect in Crowded Spaces',
          prompt: 'You\'re in a hallway and someone brushes past. What\'s a polite response?',
          guidance: 'Say: "Excuse me" or "Sorry!" even if it was an accident.',
        },
      ],
      '9-12': [
        {
          id: '912-space-1',
          title: 'Social Awareness',
          prompt: 'You\'re in a conversation and someone keeps backing up. How do you adjust?',
          guidance: 'Respect their space—step back a little and keep eye contact instead.',
        },
        {
          id: '912-space-2',
          title: 'Cultural Differences',
          prompt: 'Different cultures have different ideas of personal space. How do you navigate that?',
          guidance: 'Be observant and ask politely if you\'re unsure: "Let me know if I\'m too close."',
        },
        {
          id: '912-space-3',
          title: 'Public Settings',
          prompt: 'You\'re on a bus and someone\'s taking up lots of room. What should you do?',
          guidance: 'Say nothing unless needed, and adjust your seat to keep mutual comfort.',
        },
      ],
    },
  },
  {
    id: 'asking-questions',
    title: 'Asking Questions to Learn More',
    description: 'Practicing how to ask thoughtful questions to show curiosity and stay engaged.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-ask-1',
          title: 'Animal Curiosity',
          prompt: 'A classmate says they have a pet turtle. What can you ask?',
          guidance: 'Try asking "What\'s your turtle\'s name?" or "What does it eat?"',
        },
        {
          id: 'k2-ask-2',
          title: 'Show and Tell',
          prompt: 'Someone shows their toy car. You want to know more. What do you say?',
          guidance: 'You could ask "Where did you get it?" or "Does it go fast?"',
        },
        {
          id: 'k2-ask-3',
          title: 'New Game',
          prompt: 'Friends are playing a new game. What question can help you learn the rules?',
          guidance: 'Try "How do you play?" or "Can you show me what to do first?"',
        },
      ],
      '3-5': [
        {
          id: '35-ask-1',
          title: 'Science Questions',
          prompt: 'Someone talks about volcanoes. You\'re curious. What could you ask?',
          guidance: 'You might ask "Have you seen one in real life?" or "What makes them erupt?"',
        },
        {
          id: '35-ask-2',
          title: 'New Student',
          prompt: 'A new student says they\'re from another state. What could you ask?',
          guidance: 'Try "What\'s your favorite thing from there?" or "Is it different from here?"',
        },
        {
          id: '35-ask-3',
          title: 'Book Talk',
          prompt: 'A friend is reading a cool book. What can you ask to learn more?',
          guidance: 'You could ask "What\'s it about?" or "Why do you like it?"',
        },
      ],
      '6-8': [
        {
          id: '68-ask-1',
          title: 'Class Presentation',
          prompt: 'Someone presents on a hobby you don\'t know much about. What could you ask?',
          guidance: 'Try "How did you get into that?" or "What\'s the hardest part?"',
        },
        {
          id: '68-ask-2',
          title: 'Passion Project',
          prompt: 'A peer shares about their project. You want to show interest. What do you ask?',
          guidance: 'Ask "What inspired you to pick that topic?" or "What did you learn from it?"',
        },
        {
          id: '68-ask-3',
          title: 'Culture Conversation',
          prompt: 'Someone mentions a tradition from their culture. What\'s a respectful question?',
          guidance: 'Try "Can you tell me more about that?" or "What\'s your favorite part?"',
        },
      ],
      '9-12': [
        {
          id: '912-ask-1',
          title: 'College Plans',
          prompt: 'Someone is talking about where they want to apply. What could you ask?',
          guidance: 'Try "What do you want to study?" or "Why that school?"',
        },
        {
          id: '912-ask-2',
          title: 'Deep Dive Topic',
          prompt: 'Your classmate is an expert on something you\'re not. How do you engage?',
          guidance: 'Ask "What got you interested in that?" or "What\'s something surprising about it?"',
        },
        {
          id: '912-ask-3',
          title: 'Career Chat',
          prompt: 'Someone talks about their dream job. What question shows real interest?',
          guidance: 'Try "What makes you excited about that path?" or "Do you have a role model in that field?"',
        },
      ],
    },
  },
  {
    id: 'offering-help',
    title: 'Offering Help or Support',
    icon: '🤝',
    description: 'Learning to notice when someone needs help and offering it kindly and respectfully.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-help-1',
          title: 'Dropped Crayons',
          prompt: 'You see someone drop their crayons. What can you say or do?',
          guidance: 'You might say "I can help you pick them up!" and start gathering them.',
        },
        {
          id: 'k2-help-2',
          title: 'Zipper Trouble',
          prompt: 'A friend is struggling with their backpack zipper. What\'s a kind offer?',
          guidance: 'Try "Do you want help with that?"',
        },
        {
          id: 'k2-help-3',
          title: 'Puzzle Frustration',
          prompt: 'A classmate is having trouble with a puzzle. How can you support them?',
          guidance: 'Say "Want me to help you find a piece?"',
        },
      ],
      '3-5': [
        {
          id: '35-help-1',
          title: 'Group Work Buddy',
          prompt: 'Your partner seems confused about the instructions. How can you help?',
          guidance: 'Offer "Want me to read them out loud?" or "I can explain what I got."',
        },
        {
          id: '35-help-2',
          title: 'New Student Tour',
          prompt: 'A new student looks lost. What can you say to be helpful?',
          guidance: 'Try "Want me to walk with you to class?"',
        },
        {
          id: '35-help-3',
          title: 'Struggling Reader',
          prompt: 'A classmate stumbles while reading aloud. What can you do?',
          guidance: 'Say "You got this!" or wait until later and check in kindly.',
        },
      ],
      '6-8': [
        {
          id: '68-help-1',
          title: 'Missed Notes',
          prompt: 'A peer was out sick and asks about what they missed. How do you help?',
          guidance: 'Offer "Want my notes?" or "I can tell you what we did."',
        },
        {
          id: '68-help-2',
          title: 'Locker Spill',
          prompt: 'You see someone drop all their stuff in the hallway. What can you say or do?',
          guidance: 'Jump in with "Need a hand?" or start helping right away.',
        },
        {
          id: '68-help-3',
          title: 'Emotional Support',
          prompt: 'A friend seems upset during lunch. What\'s a kind way to show you care?',
          guidance: 'Try "Do you want to talk?" or just sit with them and listen.',
        },
      ],
      '9-12': [
        {
          id: '912-help-1',
          title: 'Late Partner',
          prompt: 'Your project partner forgot their part. What\'s a supportive way to handle it?',
          guidance: 'Say "Let\'s figure out how we can catch up together."',
        },
        {
          id: '912-help-2',
          title: 'Test Stress',
          prompt: 'Someone mentions they\'re nervous before a test. What can you offer?',
          guidance: 'Try "Want to study together later?" or "You\'ve got this—I believe in you."',
        },
        {
          id: '912-help-3',
          title: 'Club Support',
          prompt: 'A classmate is planning an event and seems overwhelmed. What could you say?',
          guidance: 'Offer "Need help setting up flyers or something?"',
        },
      ],
    },
  },
  {
    id: 'keeping-conversations-going',
    title: 'Keeping a Conversation Going',
    icon: '💬',
    description: 'Developing skills to keep conversations going with thoughtful questions and observations.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-topic-1',
          title: 'Animal Talk',
          prompt: 'Your friend says, "I love cats." What could you say to keep the conversation going?',
          guidance: 'Try: "Me too! I pet one yesterday."',
        },
        {
          id: 'k2-topic-2',
          title: 'Toy Discussion',
          prompt: 'Someone says, "My favorite toy is a truck." What should you say next to stay on topic?',
          guidance: 'Say: "Cool! I have a red truck at home."',
        },
        {
          id: 'k2-topic-3',
          title: 'Snack Chat',
          prompt: 'A classmate says, "I had a banana at lunch." What\'s a good reply that matches?',
          guidance: 'Try: "Yum! I had an apple."',
        },
      ],
      '3-5': [
        {
          id: '35-topic-1',
          title: 'Class Trip Conversation',
          prompt: 'Your friend says, "I liked the science museum." How do you stay on topic?',
          guidance: 'Say: "Same! The dinosaur skeletons were awesome."',
        },
        {
          id: '35-topic-2',
          title: 'Video Game Talk',
          prompt: 'Your friend says, "I beat level 5 last night!" What\'s a good response?',
          guidance: 'Try: "Nice! That level was hard for me."',
        },
        {
          id: '35-topic-3',
          title: 'Birthday Plans',
          prompt: 'A classmate says, "I\'m having a party this weekend." How do you respond?',
          guidance: 'Say: "That\'s exciting! What kind of party is it?"',
        },
      ],
      '6-8': [
        {
          id: '68-topic-1',
          title: 'Classroom Project Talk',
          prompt: 'Someone says, "I\'m doing my project on climate change." How do you keep the convo focused?',
          guidance: 'Say: "That\'s a great topic. Are you including sea level rise?"',
        },
        {
          id: '68-topic-2',
          title: 'TV Show Chat',
          prompt: 'Your friend says, "Did you see the latest episode?" What do you say to stay in the conversation?',
          guidance: 'Try: "Yeah! That ending was wild."',
        },
        {
          id: '68-topic-3',
          title: 'New Teacher Talk',
          prompt: 'Someone says, "Our new math teacher is strict." What\'s a related comment?',
          guidance: 'Say: "I noticed that too. But I like how she explains things."',
        },
      ],
      '9-12': [
        {
          id: '912-topic-1',
          title: 'Politics Discussion',
          prompt: 'A peer says, "I think voting age should be 16." What\'s a relevant follow-up?',
          guidance: 'Try: "Interesting. What do you think would change if that happened?"',
        },
        {
          id: '912-topic-2',
          title: 'College Talk',
          prompt: 'Someone says, "I\'m thinking of applying to UCLA." How do you stay on track?',
          guidance: 'Say: "That\'s a great school. Are you looking at other UC campuses too?"',
        },
        {
          id: '912-topic-3',
          title: 'Music Banter',
          prompt: 'A group is talking about hip-hop. What\'s a relevant way to join in?',
          guidance: 'Try: "Did you hear Kendrick\'s latest album? or "I think Nas is underrated."',
        },
      ],
    },
  },
  {
    id: 'joining-group-activities',
    title: 'Joining Group Activities',
    icon: '🎯',
    description: 'Build confidence in joining group activities, games, or conversations already in progress.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-enter-1',
          title: 'Playground Talk',
          prompt: 'You see a group of kids talking about their favorite animals. What can you say to join in?',
          guidance: 'Try saying "I like elephants! What animals do you like?"',
        },
        {
          id: 'k2-enter-2',
          title: 'Art Time',
          prompt: 'During art, some kids are talking about what they\'re drawing. How do you join their chat?',
          guidance: 'You could say "That looks cool! I\'m drawing a rainbow."',
        },
        {
          id: 'k2-enter-3',
          title: 'Snack Circle',
          prompt: 'Kids are chatting about their snacks. What can you say to be part of it?',
          guidance: 'Try saying "I have apples! What do you have?"',
        },
      ],
      '3-5': [
        {
          id: '35-enter-1',
          title: 'Group Project Intro',
          prompt: 'You\'re walking up to a group talking about a group project. What\'s a good way to join?',
          guidance: 'You might say "Hey, can I help with anything?"',
        },
        {
          id: '35-enter-2',
          title: 'Recess Games',
          prompt: 'Some kids are talking about the game they\'re playing. How do you jump in?',
          guidance: 'Try "Hi! What game is this? Can I play too?"',
        },
        {
          id: '35-enter-3',
          title: 'Lunch Table Topic',
          prompt: 'A group is chatting about a movie. What\'s a respectful way to add your voice?',
          guidance: 'You could say "I saw that too! My favorite part was..."',
        },
      ],
      '6-8': [
        {
          id: '68-enter-1',
          title: 'Elective Class Group',
          prompt: 'You walk over to a group discussing a class project. What can you say to join naturally?',
          guidance: 'Try: "Hey, is this the robotics topic group? or "Mind if I jump in?"',
        },
        {
          id: '68-enter-2',
          title: 'Hallway Hangout',
          prompt: 'Friends are chatting in the hallway. You\'d like to join. What\'s a smooth way in?',
          guidance: 'Try: "What are you guys talking about?" with a friendly tone.',
        },
        {
          id: '68-enter-3',
          title: 'Group Chat IRL',
          prompt: 'Everyone\'s talking about last night\'s episode. How do you step into the convo?',
          guidance: 'You could say "I missed the first part! What happened?" or "I had a totally different take..."',
        },
      ],
      '9-12': [
        {
          id: '912-enter-1',
          title: 'Class Debate Circle',
          prompt: 'You overhear a debate on a book you\'ve read too. What\'s a respectful way to contribute?',
          guidance: 'Try: "Interesting point—have you considered this perspective?"',
        },
        {
          id: '912-enter-2',
          title: 'Club Meeting Vibes',
          prompt: 'You walk into a club meeting already in discussion. How do you join in?',
          guidance: 'Say: "Sorry I\'m late—can someone catch me up real quick?"',
        },
        {
          id: '912-enter-3',
          title: 'Campus Corner Chat',
          prompt: 'A group is discussing music. You want in. How do you approach it?',
          guidance: 'Try: "Hey, mind if I join this convo? I\'ve got some strong takes on that album."',
        },
      ],
    },
  },
  {
    id: 'making-friends',
    title: 'Making and Maintaining Friendships',
    icon: '🌟',
    description: 'Explore skills for making new friends, keeping conversations going, and being supportive.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-friends-1',
          title: 'New Friend at School',
          prompt: 'You see someone new sitting alone. What can you say?',
          guidance: 'Try: "Hi! Want to play with me?" or "My name\'s [Name]—what\'s yours?"',
        },
        {
          id: 'k2-friends-2',
          title: 'Sharing is Caring',
          prompt: 'You brought stickers and your friend wants one. What do you do?',
          guidance: 'Say: "Sure! You can have one too."',
        },
        {
          id: 'k2-friends-3',
          title: 'Friend Feeling Sad',
          prompt: 'Your friend looks sad. What can you do to show you care?',
          guidance: 'Try: "Are you okay?" or "Want to talk or play something fun?"',
        },
      ],
      '3-5': [
        {
          id: '35-friends-1',
          title: 'Joining a Club',
          prompt: 'You want to join a school club and make friends. What can you say to start?',
          guidance: 'Try: "Hey, I\'m new to this—can I join you guys?"',
        },
        {
          id: '35-friends-2',
          title: 'Keeping in Touch',
          prompt: 'Your friend is going on vacation. How can you stay connected?',
          guidance: 'Say: "Text me while you\'re gone! I\'ll miss you."',
        },
        {
          id: '35-friends-3',
          title: 'Supporting a Friend',
          prompt: 'Your friend is nervous about a test. How can you help?',
          guidance: 'Try: "Want to study together?" or "You\'ve got this—I believe in you."',
        },
      ],
      '6-8': [
        {
          id: '68-friends-1',
          title: 'Starting a Conversation',
          prompt: 'You sit near someone in class who seems cool. How do you start talking?',
          guidance: 'Try: "Hey, did you understand that last assignment?" or "Cool shirt—what band is that?"',
        },
        {
          id: '68-friends-2',
          title: 'Friendship Maintenance',
          prompt: 'You haven\'t talked to a friend in a while. How do you reach out?',
          guidance: 'Say: "Hey! I\'ve been meaning to text—want to catch up?"',
        },
        {
          id: '68-friends-3',
          title: 'Apologizing',
          prompt: 'You hurt a friend\'s feelings by accident. What can you say?',
          guidance: 'Try: "I\'m really sorry—I didn\'t mean to hurt you. Can we talk about it?"',
        },
      ],
      '9-12': [
        {
          id: '912-friends-1',
          title: 'Deepening Friendships',
          prompt: 'You want to grow closer with a classmate you really click with. What\'s a good move?',
          guidance: 'Say: "Want to hang out this weekend? I feel like we always have great convos."',
        },
        {
          id: '912-friends-2',
          title: 'Navigating Changes',
          prompt: 'You and a friend are growing apart. How do you bring it up honestly?',
          guidance: 'Try: "I\'ve noticed we\'re not as close—do you feel that too?"',
        },
        {
          id: '912-friends-3',
          title: 'Friend Burnout',
          prompt: 'You need space from a friend who\'s overwhelming you. What\'s a kind way to say it?',
          guidance: 'Say: "I care about you a lot, but I need a little space right now. Hope you understand."',
        },
      ],
    },
  },
  {
    id: 'supportive-conversations',
    title: 'Supportive Conversations',
    icon: '💗',
    description: 'Learn how to support others who are having a tough time or feeling left out.',
    gradeBands: {
      'K-2': [
        {
          id: 'k2-friends-1',
          title: 'New Friend at School',
          prompt: 'You see someone new sitting alone. What can you say?',
          guidance: 'Try: "Hi! Want to play with me?" or "My name\'s [Name]—what\'s yours?"',
        },
        {
          id: 'k2-friends-2',
          title: 'Sharing is Caring',
          prompt: 'You brought stickers and your friend wants one. What do you do?',
          guidance: 'Say: "Sure! You can have one too."',
        },
        {
          id: 'k2-friends-3',
          title: 'Friend Feeling Sad',
          prompt: 'Your friend looks sad. What can you do to show you care?',
          guidance: 'Try: "Are you okay?" or "Want to talk or play something fun?"',
        },
      ],
      '3-5': [
        {
          id: '35-friends-1',
          title: 'Joining a Club',
          prompt: 'You want to join a school club and make friends. What can you say to start?',
          guidance: 'Try: "Hey, I\'m new to this—can I join you guys?"',
        },
        {
          id: '35-friends-2',
          title: 'Keeping in Touch',
          prompt: 'Your friend is going on vacation. How can you stay connected?',
          guidance: 'Say: "Text me while you\'re gone! I\'ll miss you."',
        },
        {
          id: '35-friends-3',
          title: 'Supporting a Friend',
          prompt: 'Your friend is nervous about a test. How can you help?',
          guidance: 'Try: "Want to study together?" or "You\'ve got this—I believe in you."',
        },
      ],
      '6-8': [
        {
          id: '68-friends-1',
          title: 'Starting a Conversation',
          prompt: 'You sit near someone in class who seems cool. How do you start talking?',
          guidance: 'Try: "Hey, did you understand that last assignment?" or "Cool shirt—what band is that?"',
        },
        {
          id: '68-friends-2',
          title: 'Friendship Maintenance',
          prompt: 'You haven\'t talked to a friend in a while. How do you reach out?',
          guidance: 'Say: "Hey! I\'ve been meaning to text—want to catch up?"',
        },
        {
          id: '68-friends-3',
          title: 'Apologizing',
          prompt: 'You hurt a friend\'s feelings by accident. What can you say?',
          guidance: 'Try: "I\'m really sorry—I didn\'t mean to hurt you. Can we talk about it?"',
        },
      ],
      '9-12': [
        {
          id: '912-friends-1',
          title: 'Deepening Friendships',
          prompt: 'You want to grow closer with a classmate you really click with. What\'s a good move?',
          guidance: 'Say: "Want to hang out this weekend? I feel like we always have great convos."',
        },
        {
          id: '912-friends-2',
          title: 'Navigating Changes',
          prompt: 'You and a friend are growing apart. How do you bring it up honestly?',
          guidance: 'Try: "I\'ve noticed we\'re not as close—do you feel that too?"',
        },
        {
          id: '912-friends-3',
          title: 'Friend Burnout',
          prompt: 'You need space from a friend who\'s overwhelming you. What\'s a kind way to say it?',
          guidance: 'Say: "I care about you a lot, but I need a little space right now. Hope you understand."',
        },
      ],
    },
  },
];

export const getScenarioIntroKey = (topicId) => {
  if (!topicId) return null;
  return topicId;
};

// Utility function to get topics list
export function getTopicList() {
  return topics.map((t) => ({ id: t.id, title: t.title }));
}


// Utility to get grade band from grade number
export function getGradeBandFromGrade(grade) {
  const numeric = typeof grade === 'number' ? grade : parseInt(grade, 10);
  const g = Number.isFinite(numeric) ? numeric : 5;
  if (g >= 0 && g <= 2) return 'K-2';
  if (g >= 3 && g <= 5) return '3-5';
  if (g >= 6 && g <= 8) return '6-8';
  if (g >= 9 && g <= 12) return '9-12';
  return '3-5';
}


// Utility to get scenarios for given topic + grade
export function getScenariosForTopic(topicId, grade) {
  const band = getGradeBandFromGrade(grade);
  const topic = topics.find((t) => t.id === topicId);
  if (!topic || !topic.gradeBands?.[band]) return [];
  return topic.gradeBands[band];
}

export const getGradeBand = (gradeLevel) => getGradeBandFromGrade(gradeLevel);

const FALLBACK_ICONS = ['🗣️', '🤝', '🎯', '💬', '🤗', '🎓'];

const CONTEXT_TEMPLATES = {
  'K-2': (topic) => `Let's pretend we're ${topic.toLowerCase()} right now.`,
  '3-5': (topic) => `Imagine you're in a ${topic.toLowerCase()} moment at school.`,
  '6-8': (topic) => `Picture yourself navigating ${topic.toLowerCase()} with classmates.`,
  '9-12': (topic) => `Think about a real situation where you're handling ${topic.toLowerCase()}.`
};

const QUESTION_TEMPLATES = {
  'K-2': (topic) => `What could you say first during ${topic.toLowerCase()}?`,
  '3-5': (topic) => `What's the first thing you might say when you're ${topic.toLowerCase()}?`,
  '6-8': (topic) => `How would you start the conversation while ${topic.toLowerCase()}?`,
  '9-12': (topic) => `What's a confident opener you'd use when ${topic.toLowerCase()}?`
};

const GUIDANCE_TEMPLATES = {
  'K-2': (topic) => `Keep it kind and simple—smile and share something about ${topic.toLowerCase()}.`,
  '3-5': (topic) => `Use friendly words and show interest so ${topic.toLowerCase()} feels easy.`,
  '6-8': (topic) => `Stay relaxed, be specific, and show you’re engaged while ${topic.toLowerCase()}.`,
  '9-12': (topic) => `Use confident, respectful language to keep ${topic.toLowerCase()} collaborative.`
};

const FALLBACK_TOPIC_TITLES = {
  'entering-group-conversations': 'Entering Group Conversations',
  'disagreeing-respectfully': 'Disagreeing Respectfully',
  'group-projects': 'Group Projects',
  'active-listening': 'Active Listening',
  'confidence-building': 'Confidence Building',
  'peacemaking': 'Conflict Resolution'
};

export function resolveTopicByIdOrName(topicLike) {
  if (!topicLike) return null;
  const normalized = String(topicLike).trim().toLowerCase();
  return (
    topics.find(
      (topic) =>
        topic.id.toLowerCase() === normalized ||
        topic.title.toLowerCase() === normalized
    ) || null
  );
}

export function deriveTopicTitle(topicLike) {
  const topic = resolveTopicByIdOrName(topicLike);
  if (topic) {
    return { topic, topicTitle: topic.title };
  }

  if (!topicLike) {
    return { topic: null, topicTitle: 'this social skill' };
  }

  const normalized = String(topicLike)
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return { topic: null, topicTitle: 'this social skill' };
  }

  const fromFallback = FALLBACK_TOPIC_TITLES[topicLike];
  if (fromFallback) {
    return { topic: null, topicTitle: fromFallback };
  }

  const titled = normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return { topic: null, topicTitle: titled };
}

const pickRandom = (arr = []) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);

const buildContextLine = (topicTitle, gradeBand) => {
  const generator = CONTEXT_TEMPLATES[gradeBand] || CONTEXT_TEMPLATES['6-8'];
  return generator(topicTitle);
};

const buildQuestionLine = (topicTitle, gradeBand) => {
  const generator = QUESTION_TEMPLATES[gradeBand] || QUESTION_TEMPLATES['6-8'];
  return generator(topicTitle);
};

const buildGuidanceLine = (topicTitle, gradeBand) => {
  const generator = GUIDANCE_TEMPLATES[gradeBand] || GUIDANCE_TEMPLATES['6-8'];
  return generator(topicTitle);
};

export function generateScenarioForTopic(topicLike, gradeLevel, options = {}) {
  const { topic, topicTitle } = deriveTopicTitle(topicLike);
  const gradeBand = getGradeBandFromGrade(gradeLevel);
  const gradeValue =
    typeof gradeLevel === 'number' ? gradeLevel : parseInt(gradeLevel, 10) || 6;

  const templates = topic?.gradeBands?.[gradeBand] || [];
  const template = options.forceFirst ? templates[0] : pickRandom(templates);

  const contextLine =
    template?.context ||
    (template?.prompt && template.prompt.replace(/\?+.*/, '').trim()) ||
    buildContextLine(topicTitle, gradeBand);

  const questionLine =
    template?.prompt ||
    template?.question ||
    buildQuestionLine(topicTitle, gradeBand);

  const guidanceLine =
    template?.guidance || buildGuidanceLine(topicTitle, gradeBand);

  const icon =
    topic?.icon ||
    (typeof options.icon === 'string' ? options.icon : pickRandom(FALLBACK_ICONS));

  return {
    id: template?.id || `${topic?.id || 'topic'}-${gradeBand}-${Date.now()}`,
    title:
      template?.title ||
      `${topicTitle.replace(/Practice$/i, '').trim()} Practice`,
    description: contextLine,
    contextLine,
    prompt: questionLine,
    warmupQuestion: questionLine,
    guidance: guidanceLine,
    setupPrompt: guidanceLine,
    topicId: topic?.id || (typeof topicLike === 'string' ? topicLike : null),
    topicTitle,
    topic: topicTitle,
    icon,
    gradeBand,
    gradeLevel: gradeValue,
    estimatedDuration: template?.estimatedDuration || topic?.estimatedDuration || 5,
    characterRole: template?.characterRole || topic?.defaultRole || 'peer',
    learningObjectives: template?.learningObjectives || [],
    notes: template?.notes || null
  };
}
