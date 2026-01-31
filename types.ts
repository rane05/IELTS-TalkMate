export enum ExamPart {
  IDLE = 'IDLE',
  PART_1 = 'PART_1',
  PART_2_PREP = 'PART_2_PREP',
  PART_2_SPEAK = 'PART_2_SPEAK',
  PART_3 = 'PART_3',
  COMPLETED = 'COMPLETED'
}

export enum PracticeMode {
  FULL_TEST = 'FULL_TEST',
  PART_1_ONLY = 'PART_1_ONLY',
  PART_2_ONLY = 'PART_2_ONLY',
  PART_3_ONLY = 'PART_3_ONLY',
  GRAMMAR_COACH = 'GRAMMAR_COACH'
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum ExaminerPersonality {
  ENCOURAGING = 'ENCOURAGING',
  STRICT = 'STRICT',
  PROFESSIONAL = 'PROFESSIONAL'
}

export interface Topic {
  id: string;
  category: string;
  name: string;
  difficulty: DifficultyLevel;
  keywords: string[];
}

export interface PronunciationData {
  overallScore: number; // 0-100
  clarity: number;
  intonation: number;
  wordStress: number;
  problematicWords: string[];
  suggestions: string[];
}

export interface FeedbackData {
  grammarMistakes: string[];
  correctedVersion: string;
  moreFluentVersion: string;
  vocabularySuggestions: string[];
  fluencyFeedback: string;
  estimatedBand: number;
  improvementTip: string;
  fillerWordCount?: number;
  pronunciation?: PronunciationData;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'examiner';
  text?: string;
  audioUrl?: string; // For user audio playback
  feedback?: FeedbackData;
  timestamp: number;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
  learnedDate: number;
  reviewCount: number;
}

export interface SessionHistory {
  id: string;
  date: number;
  mode: PracticeMode;
  topic?: Topic;
  duration: number; // seconds
  conversation: ConversationTurn[];
  averageBand: number;
  grammarScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  vocabularyScore: number;
  completedParts: ExamPart[];
  scratchpadNotes?: string;
}

export interface SessionStats {
  averageBand: number;
  fluencyScore: number; // 0-100 derived
  grammarScore: number; // 0-100 derived
  pronunciationScore: number;
  vocabularyScore: number;
  totalSessions: number;
  totalPracticeTime: number; // minutes
  recentAttempts: { date: string; band: number }[];
  sessions: SessionHistory[];
  vocabularyBank: VocabularyItem[];
  weakAreas: string[];
  strongAreas: string[];
}

export interface ExaminerResponse {
  examinerSpeech: string;
  feedback: FeedbackData;
  isExamFinished: boolean;
  userTranscript?: string; // What the user said (STT)
}