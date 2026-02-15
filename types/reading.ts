export enum ReadingQuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    TRUE_FALSE_NOT_GIVEN = 'TRUE_FALSE_NOT_GIVEN',
    YES_NO_NOT_GIVEN = 'YES_NO_NOT_GIVEN',
    MATCHING_HEADINGS = 'MATCHING_HEADINGS',
    SENTENCE_COMPLETION = 'SENTENCE_COMPLETION',
    SUMMARY_COMPLETION = 'SUMMARY_COMPLETION',
    MATCHING_INFORMATION = 'MATCHING_INFORMATION',
    MATCHING_FEATURES = 'MATCHING_FEATURES',
    SHORT_ANSWER = 'SHORT_ANSWER'
}

export enum ReadingTestType {
    ACADEMIC = 'ACADEMIC',
    GENERAL_TRAINING = 'GENERAL_TRAINING'
}

export interface ReadingQuestion {
    id: string;
    type: ReadingQuestionType;
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer: string | string[];
    explanation?: string;
    paragraphReference?: string;
}

export interface ReadingPassage {
    id: string;
    title: string;
    content: string;
    testType: ReadingTestType;
    difficulty: 'easy' | 'medium' | 'hard';
    wordCount: number;
    topic: string;
    questions: ReadingQuestion[];
    timeLimit: number; // in minutes
}

export interface ReadingAttempt {
    id: string;
    passageId: string;
    startTime: number;
    endTime?: number;
    answers: Record<string, string>;
    score: number;
    totalQuestions: number;
    timeSpent: number; // in seconds
    readingSpeed: number; // words per minute
}

export interface ReadingStats {
    totalAttempts: number;
    averageScore: number;
    averageTime: number;
    strongQuestionTypes: ReadingQuestionType[];
    weakQuestionTypes: ReadingQuestionType[];
    recentAttempts: ReadingAttempt[];
}
