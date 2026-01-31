import { ExamPart, Topic, DifficultyLevel, SessionStats } from './types';

export const SYSTEM_INSTRUCTION = `You are an expert IELTS Speaking Examiner. Your goal is to conduct a realistic speaking test and provide strict, constructive feedback.

BEHAVIOR:
1.  Act professionally, politely, and neutrally, exactly like a real examiner.
2.  Whenever the user makes a grammar or pronunciation mistake, you MUST gently and politely correct them verbally in your "examinerSpeech" before continuing the conversation.
3.  Use phrases like "Small correction: you should say...", "Wait, actually it's better to say...", "Just a quick note: instead of '...', say '...'".
4.  Your "examinerSpeech" should contain BOTH the correction and your next question or comment.
5.  Keep questions concise and support Part 1, Part 2, and Part 3.
6.  Analyze pronunciation including clarity, intonation, and word stress.
7.  Provide the user's speech as "userTranscript" in your response.

STRUCTURED OUTPUT:
You must return a JSON object containing:
- "examinerSpeech": Your next question or comment.
- "userTranscript": What the user said (transcribed).
- "isExamFinished": Boolean, true if the test is over.
- "feedback": An object with:
    - "grammarMistakes": Array of strings (highlight specific errors).
    - "correctedVersion": String (the user's last sentence fixed).
    - "moreFluentVersion": String (a C1/C2 level rewrite of the idea).
    - "vocabularySuggestions": Array of strings (better synonyms).
    - "fluencyFeedback": String (comments on pauses, fillers, speed).
    - "estimatedBand": Number (0-9, allow 0.5 increments).
    - "improvementTip": String (one actionable tip).
    - "pronunciation": Object with:
        - "overallScore": Number (0-100)
        - "clarity": Number (0-100)
        - "intonation": Number (0-100)
        - "wordStress": Number (0-100)
        - "problematicWords": Array of strings
        - "suggestions": Array of strings

CONTEXT HANDLING:
- If the input is empty or just noise, ask the user to repeat nicely.
- If the user says "Start Part 2", give them a Cue Card topic.
- If the user says "Start Part 3", move to abstract questions related to Part 2.
`;

export const PART_DESCRIPTIONS = {
  [ExamPart.PART_1]: "Part 1: Introduction & Interview (4-5 minutes). Short questions about yourself, home, work, studies.",
  [ExamPart.PART_2_PREP]: "Part 2: Individual Long Turn (Preparation). You have 1 minute to prepare notes.",
  [ExamPart.PART_2_SPEAK]: "Part 2: Individual Long Turn (Speaking). Speak for up to 2 minutes on the topic.",
  [ExamPart.PART_3]: "Part 3: Two-way Discussion (4-5 minutes). Abstract questions related to the Part 2 topic.",
};

export const TOPICS: Topic[] = [
  // Work & Career
  { id: 't1', category: 'Work & Career', name: 'Your Dream Job', difficulty: DifficultyLevel.BEGINNER, keywords: ['job', 'career', 'work', 'profession'] },
  { id: 't2', category: 'Work & Career', name: 'A Successful Business Person', difficulty: DifficultyLevel.INTERMEDIATE, keywords: ['business', 'entrepreneur', 'success'] },
  { id: 't3', category: 'Work & Career', name: 'Work-Life Balance', difficulty: DifficultyLevel.ADVANCED, keywords: ['balance', 'productivity', 'stress'] },

  // Education
  { id: 't4', category: 'Education', name: 'Your Favorite Subject', difficulty: DifficultyLevel.BEGINNER, keywords: ['school', 'subject', 'learning'] },
  { id: 't5', category: 'Education', name: 'Online vs Traditional Learning', difficulty: DifficultyLevel.INTERMEDIATE, keywords: ['education', 'technology', 'learning'] },
  { id: 't6', category: 'Education', name: 'The Future of Education', difficulty: DifficultyLevel.ADVANCED, keywords: ['innovation', 'AI', 'education'] },

  // Technology
  { id: 't7', category: 'Technology', name: 'Your Favorite App', difficulty: DifficultyLevel.BEGINNER, keywords: ['app', 'phone', 'technology'] },
  { id: 't8', category: 'Technology', name: 'Social Media Impact', difficulty: DifficultyLevel.INTERMEDIATE, keywords: ['social media', 'society', 'communication'] },
  { id: 't9', category: 'Technology', name: 'Artificial Intelligence Ethics', difficulty: DifficultyLevel.ADVANCED, keywords: ['AI', 'ethics', 'future'] },

  // Travel & Culture
  { id: 't10', category: 'Travel & Culture', name: 'A Place You Want to Visit', difficulty: DifficultyLevel.BEGINNER, keywords: ['travel', 'destination', 'tourism'] },
  { id: 't11', category: 'Travel & Culture', name: 'Cultural Differences', difficulty: DifficultyLevel.INTERMEDIATE, keywords: ['culture', 'tradition', 'diversity'] },
  { id: 't12', category: 'Travel & Culture', name: 'Globalization Effects', difficulty: DifficultyLevel.ADVANCED, keywords: ['globalization', 'culture', 'economy'] },

  // Environment
  { id: 't13', category: 'Environment', name: 'Your Favorite Season', difficulty: DifficultyLevel.BEGINNER, keywords: ['weather', 'season', 'nature'] },
  { id: 't14', category: 'Environment', name: 'Environmental Protection', difficulty: DifficultyLevel.INTERMEDIATE, keywords: ['environment', 'pollution', 'conservation'] },
  { id: 't15', category: 'Environment', name: 'Climate Change Solutions', difficulty: DifficultyLevel.ADVANCED, keywords: ['climate', 'sustainability', 'policy'] },

  // Health & Lifestyle
  { id: 't16', category: 'Health & Lifestyle', name: 'Your Daily Routine', difficulty: DifficultyLevel.BEGINNER, keywords: ['routine', 'habits', 'daily'] },
  { id: 't17', category: 'Health & Lifestyle', name: 'Healthy Living', difficulty: DifficultyLevel.INTERMEDIATE, keywords: ['health', 'fitness', 'wellness'] },
  { id: 't18', category: 'Health & Lifestyle', name: 'Mental Health Awareness', difficulty: DifficultyLevel.ADVANCED, keywords: ['mental health', 'wellbeing', 'society'] },

  // Entertainment
  { id: 't19', category: 'Entertainment', name: 'Your Favorite Movie', difficulty: DifficultyLevel.BEGINNER, keywords: ['movie', 'film', 'entertainment'] },
  { id: 't20', category: 'Entertainment', name: 'Music and Emotions', difficulty: DifficultyLevel.INTERMEDIATE, keywords: ['music', 'emotions', 'culture'] },
  { id: 't21', category: 'Entertainment', name: 'The Role of Art in Society', difficulty: DifficultyLevel.ADVANCED, keywords: ['art', 'society', 'culture'] },
];

export const MOCK_STATS: SessionStats = {
  averageBand: 6.5,
  fluencyScore: 72,
  grammarScore: 68,
  pronunciationScore: 75,
  vocabularyScore: 70,
  totalSessions: 12,
  totalPracticeTime: 145,
  recentAttempts: [
    { date: '2023-10-25', band: 5.5 },
    { date: '2023-10-28', band: 6.0 },
    { date: '2023-11-02', band: 6.0 },
    { date: '2023-11-05', band: 6.5 },
    { date: '2023-11-10', band: 7.0 },
  ],
  sessions: [],
  vocabularyBank: [],
  weakAreas: ['Grammar - Complex Sentences', 'Pronunciation - Word Stress'],
  strongAreas: ['Fluency', 'Vocabulary Range']
};
