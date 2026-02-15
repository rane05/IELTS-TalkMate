import { VocabularyWord } from '../types/vocabulary';

export const SAMPLE_VOCABULARY: Record<string, VocabularyWord[]> = {
    education: [
        {
            id: 'edu1',
            word: 'curriculum',
            definition: 'The subjects comprising a course of study in a school or college',
            example: 'The school has recently updated its curriculum to include more technology courses.',
            synonyms: ['syllabus', 'program', 'course'],
            partOfSpeech: 'noun',
            topic: 'education',
            difficulty: 'intermediate',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'edu2',
            word: 'pedagogy',
            definition: 'The method and practice of teaching, especially as an academic subject',
            example: 'Modern pedagogy emphasizes student-centered learning approaches.',
            synonyms: ['teaching', 'instruction', 'education'],
            partOfSpeech: 'noun',
            topic: 'education',
            difficulty: 'advanced',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'edu3',
            word: 'literacy',
            definition: 'The ability to read and write',
            example: 'Improving literacy rates is a key goal for developing nations.',
            synonyms: ['reading ability', 'education'],
            antonyms: ['illiteracy'],
            partOfSpeech: 'noun',
            topic: 'education',
            difficulty: 'beginner',
            reviewCount: 0,
            mastered: false
        }
    ],
    environment: [
        {
            id: 'env1',
            word: 'sustainable',
            definition: 'Able to be maintained at a certain rate or level without depleting natural resources',
            example: 'The company is committed to sustainable business practices.',
            synonyms: ['renewable', 'viable', 'maintainable'],
            partOfSpeech: 'adjective',
            topic: 'environment',
            difficulty: 'intermediate',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'env2',
            word: 'biodiversity',
            definition: 'The variety of plant and animal life in a particular habitat',
            example: 'Rainforests are known for their incredible biodiversity.',
            synonyms: ['biological diversity', 'variety'],
            partOfSpeech: 'noun',
            topic: 'environment',
            difficulty: 'advanced',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'env3',
            word: 'pollution',
            definition: 'The presence of harmful substances in the environment',
            example: 'Air pollution in major cities has become a serious health concern.',
            synonyms: ['contamination', 'impurity'],
            partOfSpeech: 'noun',
            topic: 'environment',
            difficulty: 'beginner',
            reviewCount: 0,
            mastered: false
        }
    ],
    technology: [
        {
            id: 'tech1',
            word: 'innovation',
            definition: 'A new method, idea, or product',
            example: 'Technological innovation has transformed how we communicate.',
            synonyms: ['advancement', 'breakthrough', 'development'],
            partOfSpeech: 'noun',
            topic: 'technology',
            difficulty: 'intermediate',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'tech2',
            word: 'obsolete',
            definition: 'No longer produced or used; out of date',
            example: 'Many traditional technologies have become obsolete in the digital age.',
            synonyms: ['outdated', 'antiquated', 'archaic'],
            antonyms: ['modern', 'current'],
            partOfSpeech: 'adjective',
            topic: 'technology',
            difficulty: 'advanced',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'tech3',
            word: 'automation',
            definition: 'The use of machines or computers to do work that was previously done by people',
            example: 'Automation has increased efficiency in manufacturing.',
            synonyms: ['mechanization', 'computerization'],
            partOfSpeech: 'noun',
            topic: 'technology',
            difficulty: 'intermediate',
            reviewCount: 0,
            mastered: false
        }
    ],
    academic: [
        {
            id: 'acad1',
            word: 'furthermore',
            definition: 'In addition; besides (used to introduce a fresh consideration)',
            example: 'The policy is expensive. Furthermore, it is ineffective.',
            synonyms: ['moreover', 'additionally', 'besides'],
            partOfSpeech: 'adverb',
            topic: 'academic',
            difficulty: 'intermediate',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'acad2',
            word: 'consequently',
            definition: 'As a result; therefore',
            example: 'The company failed to adapt; consequently, it went bankrupt.',
            synonyms: ['therefore', 'thus', 'hence'],
            partOfSpeech: 'adverb',
            topic: 'academic',
            difficulty: 'intermediate',
            reviewCount: 0,
            mastered: false
        },
        {
            id: 'acad3',
            word: 'substantial',
            definition: 'Of considerable importance, size, or worth',
            example: 'There has been substantial progress in medical research.',
            synonyms: ['significant', 'considerable', 'sizable'],
            antonyms: ['insignificant', 'minor'],
            partOfSpeech: 'adjective',
            topic: 'academic',
            difficulty: 'advanced',
            reviewCount: 0,
            mastered: false
        }
    ]
};
