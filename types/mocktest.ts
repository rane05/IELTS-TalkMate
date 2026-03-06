export type MockTestStatus = 'idle' | 'in_progress' | 'completed';

export interface MockTestSectionResult {
    module: 'listening' | 'reading' | 'writing' | 'speaking';
    band: number;
    score: number;
    total: number;
    feedback?: string;
    timeSpent: number;
}

export interface MockTestSession {
    id: string;
    startTime: number;
    endTime?: number;
    status: MockTestStatus;
    currentModule: 'listening' | 'reading' | 'writing' | 'speaking' | 'none';
    results: Partial<Record<'listening' | 'reading' | 'writing' | 'speaking', MockTestSectionResult>>;
}

export interface MockTestPackage {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    modules: {
        listeningId?: string;
        readingId?: string;
        writingId?: string;
        speakingId?: string;
    };
}
