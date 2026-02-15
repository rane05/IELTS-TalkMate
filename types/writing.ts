export enum WritingTaskType {
    TASK_1_ACADEMIC = 'TASK_1_ACADEMIC',
    TASK_1_GENERAL = 'TASK_1_GENERAL',
    TASK_2 = 'TASK_2'
}

export enum Task1AcademicType {
    LINE_GRAPH = 'LINE_GRAPH',
    BAR_CHART = 'BAR_CHART',
    PIE_CHART = 'PIE_CHART',
    TABLE = 'TABLE',
    DIAGRAM = 'DIAGRAM',
    MAP = 'MAP',
    PROCESS = 'PROCESS'
}

export enum Task1GeneralType {
    FORMAL_LETTER = 'FORMAL_LETTER',
    SEMI_FORMAL_LETTER = 'SEMI_FORMAL_LETTER',
    INFORMAL_LETTER = 'INFORMAL_LETTER'
}

export interface WritingPrompt {
    id: string;
    taskType: WritingTaskType;
    title: string;
    prompt: string;
    imageUrl?: string; // For Task 1 Academic charts/diagrams
    task1Type?: Task1AcademicType | Task1GeneralType;
    minWords: number;
    timeLimit: number; // in minutes
    modelAnswer?: string;
    bandScore?: number; // For model answer
}

export interface WritingFeedback {
    taskAchievement: {
        score: number;
        comments: string[];
        strengths: string[];
        improvements: string[];
    };
    coherenceCohesion: {
        score: number;
        comments: string[];
        strengths: string[];
        improvements: string[];
    };
    lexicalResource: {
        score: number;
        comments: string[];
        advancedVocabulary: string[];
        repetitiveWords: string[];
        suggestions: string[];
    };
    grammaticalRange: {
        score: number;
        comments: string[];
        complexSentences: number;
        errors: Array<{
            text: string;
            correction: string;
            explanation: string;
        }>;
    };
    overallBand: number;
    wordCount: number;
    estimatedTime: number;
}

export interface WritingAttempt {
    id: string;
    promptId: string;
    taskType: WritingTaskType;
    content: string;
    wordCount: number;
    startTime: number;
    submitTime: number;
    timeSpent: number; // in seconds
    feedback?: WritingFeedback;
    bandScore?: number;
}

export interface WritingStats {
    totalAttempts: number;
    task1Attempts: number;
    task2Attempts: number;
    averageBand: number;
    averageWordCount: number;
    averageTime: number;
    recentAttempts: WritingAttempt[];
    strongAreas: string[];
    weakAreas: string[];
}
