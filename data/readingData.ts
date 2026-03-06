import { ReadingPassage, ReadingTestType } from '../types/reading';

export const ACADEMIC_READING_PASSAGES: ReadingPassage[] = [
    {
        id: 'R-001',
        title: 'The Evolution of Human Language',
        content: `The origin of human language is a subject that has fascinated scholars for centuries. Unlike other forms of animal communication, human language is characterized by its recursive structure and its ability to convey abstract concepts. Some researchers argue that language evolved as a byproduct of increased brain size, while others suggest it was a specific adaptation for social cooperation.
        
        Early theories often focused on the idea of 'imitation', where early humans mimicked the sounds of nature. However, modern linguistics, spearheaded by figures like Noam Chomsky, suggests a 'universal grammar'—an innate biological capacity for language. Recent archaeological finds of complex tools and art dating back 100,000 years provide indirect evidence of the symbolic thinking required for language.
        
        The role of the FOXP2 gene has also been highlighted. Mutations in this gene are known to cause severe speech and language impairments, suggesting it played a crucial role in the evolution of the vocal apparatus and the neural circuits involved in speech production. As we continue to sequence ancient DNA, our understanding of when and how these genetic changes occurred will undoubtedly deepen.`,
        testType: ReadingTestType.ACADEMIC,
        difficulty: 'medium',
        wordCount: 210,
        topic: 'Anthropology',
        timeLimit: 20,
        questions: [
            {
                id: 'R1-Q1',
                type: 'MULTIPLE_CHOICE' as any,
                question: 'What distinguishes human language from animal communication according to the text?',
                options: ['Volume', 'Recursive structure', 'Speed', 'Physical gestures'],
                correctAnswer: 'Recursive structure'
            },
            {
                id: 'R1-Q2',
                type: 'TRUE_FALSE_NOT_GIVEN' as any,
                question: 'Noam Chomsky believes language is an acquired skill rather than an innate one.',
                correctAnswer: 'FALSE'
            },
            {
                id: 'R1-Q3',
                type: 'SENTENCE_COMPLETION' as any,
                question: 'The __________ gene is associated with speech and language impairments.',
                correctAnswer: 'FOXP2'
            }
        ]
    }
];

export const GENERAL_READING_PASSAGES: ReadingPassage[] = [
    // Add if needed
];
