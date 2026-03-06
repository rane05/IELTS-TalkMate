import { ListeningTest, ListeningQuestionType } from '../types/listening';

export const ACADEMIC_LISTENING_TESTS: ListeningTest[] = [
    {
        id: 'L-001',
        title: 'Academic Orientation - Science Faculty',
        description: 'An orientation session for new students in the Science department.',
        difficulty: 'medium',
        duration: 1200, // 20 mins
        sections: [
            {
                id: 'L1-S1',
                title: 'Section 1: Course Requirements',
                audioUrl: '/audio/academic-orientation.mp3',
                questions: [
                    {
                        id: 'L1-Q1',
                        type: ListeningQuestionType.MULTIPLE_CHOICE,
                        question: 'Which building is the Science Faculty located in?',
                        options: ['North Hall', 'West Wing', 'The Pavilion', 'Tech Tower'],
                        correctAnswer: 'The Pavilion',
                        points: 1
                    },
                    {
                        id: 'L1-Q2',
                        type: ListeningQuestionType.FILL_IN_BLANK,
                        question: 'Students must submit their lab reports by ___ PM on Fridays.',
                        correctAnswer: '5',
                        points: 1
                    }
                ]
            }
        ],
        totalQuestions: 40,
        passingScore: 24
    }
];
