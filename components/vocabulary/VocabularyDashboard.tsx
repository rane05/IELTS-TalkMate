import React, { useState } from 'react';
import { BookMarked, Flame, Target, TrendingUp, Play, Award, Brain } from 'lucide-react';
import { VocabularyTopic } from '../../types/vocabulary';

interface VocabularyDashboardProps {
    onStartFlashcards: (topic: VocabularyTopic) => void;
    onViewWordList: (topic: VocabularyTopic) => void;
    stats?: {
        totalWords: number;
        masteredWords: number;
        currentStreak: number;
        dailyGoal: number;
    };
}

const VOCABULARY_TOPICS: VocabularyTopic[] = [
    {
        id: 'education',
        name: 'Education',
        description: 'Academic vocabulary for discussing schools, universities, and learning',
        wordCount: 50,
        icon: '🎓'
    },
    {
        id: 'environment',
        name: 'Environment',
        description: 'Words related to climate, nature, and environmental issues',
        wordCount: 45,
        icon: '🌍'
    },
    {
        id: 'technology',
        name: 'Technology',
        description: 'Modern tech vocabulary for digital age discussions',
        wordCount: 40,
        icon: '💻'
    },
    {
        id: 'health',
        name: 'Health & Fitness',
        description: 'Medical and wellness vocabulary',
        wordCount: 35,
        icon: '🏥'
    },
    {
        id: 'business',
        name: 'Business & Work',
        description: 'Professional and workplace terminology',
        wordCount: 42,
        icon: '💼'
    },
    {
        id: 'culture',
        name: 'Culture & Society',
        description: 'Social and cultural vocabulary',
        wordCount: 38,
        icon: '🎭'
    },
    {
        id: 'travel',
        name: 'Travel & Tourism',
        description: 'Vocabulary for describing places and journeys',
        wordCount: 30,
        icon: '✈️'
    },
    {
        id: 'academic',
        name: 'Academic Writing',
        description: 'Formal academic vocabulary and linking words',
        wordCount: 55,
        icon: '📚'
    }
];

export const VocabularyDashboard: React.FC<VocabularyDashboardProps> = ({
    onStartFlashcards,
    onViewWordList,
    stats = { totalWords: 0, masteredWords: 0, currentStreak: 0, dailyGoal: 10 }
}) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

    const progress = stats.totalWords > 0 ? (stats.masteredWords / stats.totalWords) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl">
                        <BookMarked className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        Vocabulary Builder
                    </h1>
                </div>
                <p className="text-gray-600 text-lg">
                    Master IELTS vocabulary with interactive flashcards and spaced repetition
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <BookMarked className="w-6 h-6" />
                        <span className="text-sm text-pink-100">Total Words</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.totalWords}</div>
                    <div className="text-sm text-pink-100 mt-1">{stats.masteredWords} mastered</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Flame className="w-6 h-6" />
                        <span className="text-sm text-orange-100">Current Streak</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.currentStreak}</div>
                    <div className="text-sm text-orange-100 mt-1">days in a row</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-6 h-6" />
                        <span className="text-sm text-green-100">Daily Goal</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.dailyGoal}</div>
                    <div className="text-sm text-green-100 mt-1">words per day</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-6 h-6" />
                        <span className="text-sm text-purple-100">Progress</span>
                    </div>
                    <div className="text-4xl font-bold">{Math.round(progress)}%</div>
                    <div className="text-sm text-purple-100 mt-1">mastery rate</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Your Learning Journey</h3>
                    <span className="text-sm text-gray-600">{stats.masteredWords} / {stats.totalWords} words</span>
                </div>
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Review</h3>
                    <p className="text-gray-600 text-sm mb-4">Review words you've learned with spaced repetition</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                        Start Review
                    </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Learn New Words</h3>
                    <p className="text-gray-600 text-sm mb-4">Discover and learn new vocabulary from topics</p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                        Explore Topics
                    </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Practice Test</h3>
                    <p className="text-gray-600 text-sm mb-4">Test your vocabulary knowledge with quizzes</p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                        Take Quiz
                    </button>
                </div>
            </div>

            {/* Topics Grid */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vocabulary Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VOCABULARY_TOPICS.map((topic) => (
                        <div
                            key={topic.id}
                            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-pink-300 transition-all group cursor-pointer"
                        >
                            <div className="text-5xl mb-4">{topic.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                                {topic.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {topic.description}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">{topic.wordCount} words</span>
                                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">
                                    Popular
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onStartFlashcards(topic)}
                                    className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                                >
                                    Flashcards
                                </button>
                                <button
                                    onClick={() => onViewWordList(topic)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all text-sm"
                                >
                                    Word List
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Study Tips */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-200 p-8">
                <h3 className="text-2xl font-bold text-pink-900 mb-4">Vocabulary Learning Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                        <div className="text-2xl">📝</div>
                        <div>
                            <h4 className="font-bold text-pink-900 mb-1">Use Context</h4>
                            <p className="text-sm text-pink-700">Learn words in sentences, not isolation. Context helps memory!</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">🔄</div>
                        <div>
                            <h4 className="font-bold text-pink-900 mb-1">Spaced Repetition</h4>
                            <p className="text-sm text-pink-700">Review words at increasing intervals for long-term retention.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">🎯</div>
                        <div>
                            <h4 className="font-bold text-pink-900 mb-1">Daily Practice</h4>
                            <p className="text-sm text-pink-700">Consistency beats intensity. Study 10 words daily!</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">✍️</div>
                        <div>
                            <h4 className="font-bold text-pink-900 mb-1">Active Usage</h4>
                            <p className="text-sm text-pink-700">Use new words in your speaking and writing practice.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
