import React, { useState } from 'react';
import { ListeningTest } from '../../types/listening';
import { Headphones, Clock, BarChart3, Play } from 'lucide-react';

interface ListeningDashboardProps {
    onStartTest: (test: ListeningTest) => void;
    onViewResults: () => void;
    stats?: {
        totalAttempts: number;
        averageScore: number;
        averageTime: number;
    };
}

const SAMPLE_TESTS: ListeningTest[] = [
    {
        id: 'listen1',
        title: 'University Lecture: Climate Science',
        description: 'An academic lecture about climate change and its effects on ecosystems',
        difficulty: 'medium',
        duration: 600, // 10 minutes
        sections: [
            {
                id: 'sec1',
                title: 'Section 1: Introduction',
                audioUrl: '/audio/climate-intro.mp3', // Placeholder
                questions: [
                    {
                        id: 'q1',
                        type: 'MULTIPLE_CHOICE',
                        question: 'What is the main topic of the lecture?',
                        options: ['Climate change effects', 'Weather patterns', 'Ocean currents', 'Solar energy'],
                        correctAnswer: 'Climate change effects',
                        points: 1
                    },
                    {
                        id: 'q2',
                        type: 'FILL_IN_BLANK',
                        question: 'The professor mentions that global temperatures have risen by ___ degrees in the last century.',
                        correctAnswer: '1.5',
                        points: 1
                    }
                ]
            }
        ],
        totalQuestions: 40,
        passingScore: 24
    },
    {
        id: 'listen2',
        title: 'Conversation: Housing Application',
        description: 'A conversation between a student and university housing officer',
        difficulty: 'easy',
        duration: 480,
        sections: [
            {
                id: 'sec1',
                title: 'Section 1: Conversation',
                audioUrl: '/audio/housing-conversation.mp3',
                questions: [
                    {
                        id: 'q1',
                        type: 'MULTIPLE_CHOICE',
                        question: 'Why is the student visiting the housing office?',
                        options: ['To apply for housing', 'To report a problem', 'To pay rent', 'To cancel application'],
                        correctAnswer: 'To apply for housing',
                        points: 1
                    }
                ]
            }
        ],
        totalQuestions: 40,
        passingScore: 24
    },
    {
        id: 'listen3',
        title: 'Academic Discussion: Technology in Education',
        description: 'A panel discussion about the role of technology in modern education',
        difficulty: 'hard',
        duration: 720,
        sections: [
            {
                id: 'sec1',
                title: 'Section 1: Panel Introduction',
                audioUrl: '/audio/tech-education.mp3',
                questions: [
                    {
                        id: 'q1',
                        type: 'MULTIPLE_CHOICE',
                        question: 'How many panelists are participating in the discussion?',
                        options: ['2', '3', '4', '5'],
                        correctAnswer: '4',
                        points: 1
                    }
                ]
            }
        ],
        totalQuestions: 40,
        passingScore: 24
    }
];

export const ListeningDashboard: React.FC<ListeningDashboardProps> = ({
    onStartTest,
    onViewResults,
    stats = { totalAttempts: 0, averageScore: 0, averageTime: 0 }
}) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

    const filteredTests = SAMPLE_TESTS.filter(test =>
        selectedDifficulty === 'all' || test.difficulty === selectedDifficulty
    );

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl">
                        <Headphones className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Listening Practice
                    </h1>
                </div>
                <p className="text-gray-600 text-lg">
                    Improve your listening skills with authentic IELTS-style audio materials
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600">Total Attempts</span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">{stats.totalAttempts}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600">Average Score</span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">{stats.averageScore}%</div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600">Avg. Time</span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">{Math.round(stats.averageTime)}m</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Tests</h3>
                <div className="flex gap-3 flex-wrap">
                    {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                        <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty as any)}
                            className={`px-6 py-2 rounded-xl font-semibold transition-all ${selectedDifficulty === difficulty
                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tests Grid */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Tests</h2>
                <div className="grid grid-cols-1 gap-6">
                    {filteredTests.map((test) => (
                        <div
                            key={test.id}
                            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-orange-300 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Headphones className="w-6 h-6 text-orange-600" />
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                            {test.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{test.description}</p>

                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(test.difficulty)}`}>
                                            {test.difficulty.toUpperCase()}
                                        </span>
                                        <span className="text-sm text-gray-600 flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {Math.round(test.duration / 60)} minutes
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {test.totalQuestions} questions
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {test.sections.length} sections
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onStartTest(test)}
                                    className="ml-4 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <Play className="w-5 h-5" />
                                    Start Test
                                </button>
                            </div>

                            {/* Sections Preview */}
                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Test Sections:</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {test.sections.map((section, idx) => (
                                        <span key={section.id} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm">
                                            {idx + 1}. {section.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Listening Tips */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200 p-8">
                <h3 className="text-2xl font-bold text-orange-900 mb-4">Listening Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                        <div className="text-2xl">🎧</div>
                        <div>
                            <h4 className="font-bold text-orange-900 mb-1">Use Quality Headphones</h4>
                            <p className="text-sm text-orange-700">Good audio quality helps you catch every detail</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">📝</div>
                        <div>
                            <h4 className="font-bold text-orange-900 mb-1">Take Notes</h4>
                            <p className="text-sm text-orange-700">Write down key information as you listen</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">👀</div>
                        <div>
                            <h4 className="font-bold text-orange-900 mb-1">Read Questions First</h4>
                            <p className="text-sm text-orange-700">Know what to listen for before the audio starts</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">🔄</div>
                        <div>
                            <h4 className="font-bold text-orange-900 mb-1">Practice Regularly</h4>
                            <p className="text-sm text-orange-700">Consistent practice improves comprehension</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Past Results */}
            {stats.totalAttempts > 0 && (
                <div className="text-center">
                    <button
                        onClick={onViewResults}
                        className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all"
                    >
                        View Past Results
                    </button>
                </div>
            )}
        </div>
    );
};
