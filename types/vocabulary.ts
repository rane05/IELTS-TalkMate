export interface VocabularyWord {
    id: string;
    word: string;
    definition: string;
    example: string;
    synonyms: string[];
    antonyms?: string[];
    partOfSpeech: string;
    topic: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    pronunciation?: string;
    learnedDate?: number;
    reviewCount: number;
    lastReviewed?: number;
    mastered: boolean;
}

export interface VocabularyTopic {
    id: string;
    name: string;
    description: string;
    wordCount: number;
    icon: string;
}

export interface FlashcardSession {
    id: string;
    topic: string;
    startTime: number;
    endTime?: number;
    wordsReviewed: number;
    correctAnswers: number;
    newWordsMastered: number;
}

export interface VocabularyStats {
    totalWords: number;
    masteredWords: number;
    learningWords: number;
    newWords: number;
    dailyGoal: number;
    currentStreak: number;
    longestStreak: number;
    totalReviews: number;
    recentSessions: FlashcardSession[];
}
