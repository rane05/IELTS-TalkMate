import { MockTestPackage } from '../types/mocktest';

export const MOCK_TEST_PACKAGES: MockTestPackage[] = [
    {
        id: 'mock-1',
        title: 'IELTS Academic - Premium Mock 01',
        description: 'A complete simulation of the IELTS Academic computer-delivered test with AI scoring.',
        modules: {
            listeningId: 'L-001',
            readingId: 'R-001',
            writingId: 'W-001',
            speakingId: 'S-001'
        },
        difficulty: 'Medium'
    },
    {
        id: 'mock-2',
        title: 'IELTS General - Premium Mock 01',
        description: 'Full simulation for General Training candidates with latest question patterns.',
        modules: {
            listeningId: 'L-002',
            readingId: 'R-002',
            writingId: 'W-002',
            speakingId: 'S-002'
        },
        difficulty: 'Easy'
    }
];
