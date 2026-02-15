import React, { useState } from 'react';
import { ReadingPassage, ReadingTestType } from '../../types/reading';
import { BookOpen, Clock, Target, TrendingUp, Play, Award } from 'lucide-react';

interface ReadingDashboardProps {
    onStartTest: (passage: ReadingPassage) => void;
    onViewResults: () => void;
    stats?: {
        totalAttempts: number;
        averageScore: number;
        averageTime: number;
    };
}

// Sample passages (in real app, these would come from a database)
const SAMPLE_PASSAGES: ReadingPassage[] = [
    {
        id: 'academic-1',
        title: 'The Impact of Climate Change on Marine Ecosystems',
        content: `Climate change is having profound effects on marine ecosystems worldwide. Rising ocean temperatures are causing coral bleaching events to become more frequent and severe. Coral reefs, which support approximately 25% of all marine species, are particularly vulnerable to these temperature changes.

The warming of ocean waters is also affecting the distribution of fish populations. Many species are migrating towards the poles in search of cooler waters, disrupting traditional fishing grounds and local economies. This shift in marine biodiversity has significant implications for both ecological balance and human communities that depend on fishing.

Furthermore, ocean acidification, caused by increased absorption of atmospheric carbon dioxide, is making it difficult for shellfish and other calcifying organisms to build their shells and skeletons. This process threatens the entire marine food web, as many of these organisms form the base of the ocean's food chain.

Scientists are working to understand these changes and develop strategies to protect marine ecosystems. Conservation efforts include establishing marine protected areas, reducing pollution, and working to mitigate climate change through reduced greenhouse gas emissions. However, the scale of the challenge requires global cooperation and immediate action.`,
        testType: ReadingTestType.ACADEMIC,
        difficulty: 'medium',
        wordCount: 185,
        topic: 'Environment',
        timeLimit: 20,
        questions: [
            {
                id: 'q1',
                type: 'MULTIPLE_CHOICE' as any,
                question: 'According to the passage, what percentage of marine species do coral reefs support?',
                options: ['15%', '20%', '25%', '30%'],
                correctAnswer: '25%',
                explanation: 'The passage states that coral reefs "support approximately 25% of all marine species".'
            },
            {
                id: 'q2',
                type: 'TRUE_FALSE_NOT_GIVEN' as any,
                question: 'Fish populations are moving towards the equator due to warming waters.',
                correctAnswer: 'FALSE',
                explanation: 'The passage states that fish are "migrating towards the poles in search of cooler waters", not towards the equator.'
            },
            {
                id: 'q3',
                type: 'TRUE_FALSE_NOT_GIVEN' as any,
                question: 'Ocean acidification makes it harder for shellfish to build shells.',
                correctAnswer: 'TRUE',
                explanation: 'The passage explicitly states that ocean acidification is "making it difficult for shellfish and other calcifying organisms to build their shells and skeletons".'
            },
            {
                id: 'q4',
                type: 'SENTENCE_COMPLETION' as any,
                question: 'Conservation efforts include establishing marine protected areas, reducing pollution, and working to mitigate ___________.',
                correctAnswer: 'climate change',
                explanation: 'The passage mentions "working to mitigate climate change through reduced greenhouse gas emissions".'
            }
        ]
    },
    {
        id: 'academic-2',
        title: 'The History of Artificial Intelligence',
        content: `Artificial Intelligence (AI) has evolved from a theoretical concept to a transformative technology that shapes modern life. The field was officially born in 1956 at the Dartmouth Conference, where researchers first coined the term "artificial intelligence" and outlined ambitious goals for creating machines that could think like humans.

Early AI research focused on symbolic reasoning and problem-solving. Researchers developed programs that could play chess, prove mathematical theorems, and understand natural language. However, these early systems were limited by the computing power available at the time and struggled with tasks that humans found easy, such as recognizing faces or understanding context.

The 1980s and 1990s saw the rise of machine learning, a paradigm shift that enabled computers to learn from data rather than following explicitly programmed rules. This approach proved more successful for many real-world applications, from spam filtering to voice recognition.

In recent years, deep learning has revolutionized AI capabilities. Neural networks with many layers can now achieve human-level performance on tasks like image recognition, language translation, and game playing. These advances have been driven by three factors: the availability of large datasets, powerful graphics processors, and improved algorithms.`,
        testType: ReadingTestType.ACADEMIC,
        difficulty: 'hard',
        wordCount: 195,
        topic: 'Technology',
        timeLimit: 20,
        questions: [
            {
                id: 'q1',
                type: 'MULTIPLE_CHOICE' as any,
                question: 'When was the term "artificial intelligence" first coined?',
                options: ['1950', '1956', '1960', '1980'],
                correctAnswer: '1956',
                explanation: 'The passage states that the field "was officially born in 1956 at the Dartmouth Conference, where researchers first coined the term".'
            },
            {
                id: 'q2',
                type: 'TRUE_FALSE_NOT_GIVEN' as any,
                question: 'Early AI systems were better at recognizing faces than playing chess.',
                correctAnswer: 'FALSE',
                explanation: 'The passage indicates that early systems could play chess but "struggled with tasks that humans found easy, such as recognizing faces".'
            },
            {
                id: 'q3',
                type: 'MATCHING_HEADINGS' as any,
                question: 'Which paragraph discusses the recent advances in AI?',
                correctAnswer: 'Paragraph 4',
                explanation: 'The fourth paragraph discusses deep learning and recent revolutionary advances in AI.'
            }
        ]
    },
    {
        id: 'general-1',
        title: 'Community Garden Guidelines',
        content: `Welcome to the Riverside Community Garden! We are delighted to have you join our growing community of gardeners. Please read the following guidelines carefully to ensure everyone enjoys a positive experience.

Plot Allocation: Each member is assigned one plot measuring 3x4 meters. Plots are allocated on a first-come, first-served basis. If you wish to request a specific location, please contact the garden coordinator.

Maintenance: Members are responsible for maintaining their plots and keeping them weed-free. Overgrown plots may be reassigned after two written warnings. Common areas should be kept tidy by all members.

Watering: Water is available from the communal taps located at the north and south ends of the garden. Please water your plants during early morning or evening hours to conserve water. Do not leave hoses running unattended.

Organic Practices: We encourage organic gardening methods. The use of chemical pesticides and herbicides is strictly prohibited. Compost bins are available for members to use.

Community Events: We host monthly workshops on various gardening topics and seasonal social events. Participation is encouraged but not mandatory. Check the notice board for upcoming events.`,
        testType: ReadingTestType.GENERAL_TRAINING,
        difficulty: 'easy',
        wordCount: 180,
        topic: 'Community',
        timeLimit: 20,
        questions: [
            {
                id: 'q1',
                type: 'MULTIPLE_CHOICE' as any,
                question: 'What are the dimensions of each garden plot?',
                options: ['2x3 meters', '3x4 meters', '4x5 meters', '3x3 meters'],
                correctAnswer: '3x4 meters',
                explanation: 'The passage clearly states "Each member is assigned one plot measuring 3x4 meters".'
            },
            {
                id: 'q2',
                type: 'TRUE_FALSE_NOT_GIVEN' as any,
                question: 'Chemical pesticides are allowed in the garden.',
                correctAnswer: 'FALSE',
                explanation: 'The passage states "The use of chemical pesticides and herbicides is strictly prohibited".'
            },
            {
                id: 'q3',
                type: 'SHORT_ANSWER' as any,
                question: 'How many warnings are given before a plot is reassigned?',
                correctAnswer: 'two',
                explanation: 'The passage mentions "Overgrown plots may be reassigned after two written warnings".'
            }
        ]
    }
];

export const ReadingDashboard: React.FC<ReadingDashboardProps> = ({
    onStartTest,
    onViewResults,
    stats = { totalAttempts: 0, averageScore: 0, averageTime: 0 }
}) => {
    const [selectedType, setSelectedType] = useState<ReadingTestType | 'ALL'>('ALL');
    const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

    const filteredPassages = SAMPLE_PASSAGES.filter(passage => {
        const typeMatch = selectedType === 'ALL' || passage.testType === selectedType;
        const difficultyMatch = selectedDifficulty === 'all' || passage.difficulty === selectedDifficulty;
        return typeMatch && difficultyMatch;
    });

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Reading Module
                    </h1>
                </div>
                <p className="text-gray-600 text-lg">
                    Practice with authentic IELTS passages and get instant feedback
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-6 h-6" />
                        <span className="text-sm text-blue-100">Total Attempts</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.totalAttempts}</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-6 h-6" />
                        <span className="text-sm text-green-100">Average Score</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.averageScore}%</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6" />
                        <span className="text-sm text-purple-100">Avg Time</span>
                    </div>
                    <div className="text-4xl font-bold">{Math.round(stats.averageTime)}m</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Tests</h3>
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                        <div className="flex gap-2">
                            {['ALL', ReadingTestType.ACADEMIC, ReadingTestType.GENERAL_TRAINING].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type as any)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedType === type
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {type === 'ALL' ? 'All' : type.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                        <div className="flex gap-2">
                            {['all', 'easy', 'medium', 'hard'].map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setSelectedDifficulty(diff as any)}
                                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${selectedDifficulty === diff
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Passages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPassages.map((passage) => (
                    <div
                        key={passage.id}
                        className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-blue-300 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${passage.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                    passage.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {passage.difficulty.toUpperCase()}
                            </div>
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                {passage.testType === ReadingTestType.ACADEMIC ? 'Academic' : 'General'}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {passage.title}
                        </h3>

                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span>{passage.wordCount} words</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{passage.timeLimit} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                <span>{passage.questions.length} questions</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {passage.topic}
                            </span>
                        </div>

                        <button
                            onClick={() => onStartTest(passage)}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                            <Play className="w-5 h-5" />
                            Start Test
                        </button>
                    </div>
                ))}
            </div>

            {filteredPassages.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No passages match your filters</p>
                </div>
            )}

            {/* View Results Button */}
            {stats.totalAttempts > 0 && (
                <div className="text-center">
                    <button
                        onClick={onViewResults}
                        className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-4 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all inline-flex items-center gap-2"
                    >
                        <TrendingUp className="w-5 h-5" />
                        View All Results
                    </button>
                </div>
            )}
        </div>
    );
};
