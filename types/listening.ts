export enum ListeningSection {
    SECTION_1 = 'SECTION_1', // Conversation in everyday context
    SECTION_2 = 'SECTION_2', // Monologue in everyday context
    SECTION_3 = 'SECTION_3', // Conversation in educational/training context
    SECTION_4 = 'SECTION_4'  // Monologue on academic subject
}

export enum ListeningQuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    FILL_IN_BLANK = 'FILL_IN_BLANK',
    FORM_COMPLETION = 'FORM_COMPLETION',
    NOTE_COMPLETION = 'NOTE_COMPLETION',
    TABLE_COMPLETION = 'TABLE_COMPLETION',
    FLOW_CHART_COMPLETION = 'FLOW_CHART_COMPLETION',
    SENTENCE_COMPLETION = 'SENTENCE_COMPLETION',
    SHORT_ANSWER = 'SHORT_ANSWER',
    MATCHING = 'MATCHING',
    MAP_LABELING = 'MAP_LABELING',
    DIAGRAM_LABELING = 'DIAGRAM_LABELING'
}

export interface ListeningQuestion {
    id: string;
    type: ListeningQuestionType;
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation?: string;
    timestamp?: number; // When in audio this question is answered (in seconds)
    points?: number; // Points for this question
}

export interface ListeningTestSection {
    id: string;
    title: string;
    audioUrl: string;
    questions: ListeningQuestion[];
}

export interface ListeningTest {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    duration: number; // in seconds
    sections: ListeningTestSection[];
    totalQuestions: number;
    passingScore: number;
}

export interface ListeningAttempt {
    id: string;
    testId: string;
    section: ListeningSection;
    startTime: number;
    endTime?: number;
    answers: Record<string, string>;
    score: number;
    totalQuestions: number;
    playCount: number; // How many times audio was played
}

export interface ListeningStats {
    totalAttempts: number;
    averageScore: number;
    strongSections: ListeningSection[];
    weakSections: ListeningSection[];
    strongQuestionTypes: ListeningQuestionType[];
    weakQuestionTypes: ListeningQuestionType[];
    recentAttempts: ListeningAttempt[];
}
