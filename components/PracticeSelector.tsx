import React from 'react';
import { PracticeMode, DifficultyLevel, Topic, ExaminerPersonality } from '../types';
import { TOPICS } from '../constants';
import { BookOpen, Zap, Target, Filter, User } from 'lucide-react';

interface PracticeSelectorProps {
    onStart: (mode: PracticeMode, topic?: Topic, difficulty?: DifficultyLevel, personality?: ExaminerPersonality) => void;
    onCancel: () => void;
}

export const PracticeSelector: React.FC<PracticeSelectorProps> = ({ onStart, onCancel }) => {
    const [selectedMode, setSelectedMode] = React.useState<PracticeMode>(PracticeMode.FULL_TEST);
    const [selectedDifficulty, setSelectedDifficulty] = React.useState<DifficultyLevel>(DifficultyLevel.INTERMEDIATE);
    const [selectedPersonality, setSelectedPersonality] = React.useState<ExaminerPersonality>(ExaminerPersonality.PROFESSIONAL);
    const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
    const [selectedTopic, setSelectedTopic] = React.useState<Topic | undefined>();

    const categories = ['All', ...Array.from(new Set(TOPICS.map(t => t.category)))];

    const filteredTopics = TOPICS.filter(t =>
        (selectedCategory === 'All' || t.category === selectedCategory) &&
        t.difficulty === selectedDifficulty
    );

    const handleStart = () => {
        onStart(selectedMode, selectedTopic, selectedDifficulty, selectedPersonality);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900">Start Your Practice</h2>
                        <p className="text-gray-500">Choose your practice mode and preferences</p>
                    </div>

                    {/* Practice Mode Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Practice Mode
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { mode: PracticeMode.FULL_TEST, label: 'Full Test', icon: '🎯', desc: '11-14 min' },
                                { mode: PracticeMode.PART_1_ONLY, label: 'Part 1 Only', icon: '👋', desc: '4-5 min' },
                                { mode: PracticeMode.PART_2_ONLY, label: 'Part 2 Only', icon: '🎤', desc: '3-4 min' },
                                { mode: PracticeMode.PART_3_ONLY, label: 'Part 3 Only', icon: '💬', desc: '4-5 min' },
                                { mode: PracticeMode.GRAMMAR_COACH, label: 'Grammar Coach', icon: '✍️', desc: 'Real-time help' },
                            ].map(({ mode, label, icon, desc }) => (
                                <button
                                    key={mode}
                                    onClick={() => setSelectedMode(mode)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedMode === mode
                                        ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105'
                                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{icon}</div>
                                    <div className="font-semibold text-sm text-gray-900">{label}</div>
                                    <div className="text-xs text-gray-500 mt-1">{desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { level: DifficultyLevel.BEGINNER, label: 'Beginner', color: 'green' },
                                { level: DifficultyLevel.INTERMEDIATE, label: 'Intermediate', color: 'yellow' },
                                { level: DifficultyLevel.ADVANCED, label: 'Advanced', color: 'red' },
                            ].map(({ level, label, color }) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedDifficulty(level)}
                                    className={`p-3 rounded-xl border-2 transition-all ${selectedDifficulty === level
                                        ? `border-${color}-600 bg-${color}-50 shadow-lg`
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-semibold text-sm">{label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Personality Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Examiner Personality
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: ExaminerPersonality.ENCOURAGING, label: 'Encouraging', icon: '😊', desc: 'Friendly & Supportive' },
                                { id: ExaminerPersonality.PROFESSIONAL, label: 'Professional', icon: '👔', desc: 'Standard Examiner' },
                                { id: ExaminerPersonality.STRICT, label: 'Strict', icon: '🧐', desc: 'Formal & Serious' },
                            ].map(({ id, label, icon, desc }) => (
                                <button
                                    key={id}
                                    onClick={() => setSelectedPersonality(id)}
                                    className={`p-3 rounded-xl border-2 transition-all text-left ${selectedPersonality === id
                                        ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                        : 'border-gray-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{icon}</span>
                                        <div className="font-semibold text-sm">{label}</div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1 line-clamp-1">{desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic Selection (for Part 2) */}
                    {(selectedMode === PracticeMode.FULL_TEST || selectedMode === PracticeMode.PART_2_ONLY) && (
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Topic (Optional - AI will choose if not selected)
                            </label>

                            {/* Category Filter */}
                            <div className="flex gap-2 flex-wrap">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Topic Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2">
                                <button
                                    onClick={() => setSelectedTopic(undefined)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${!selectedTopic
                                        ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                                        : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <div className="font-semibold text-sm text-gray-900">🎲 Random Topic</div>
                                    <div className="text-xs text-gray-500 mt-1">Let AI choose for you</div>
                                </button>
                                {filteredTopics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => setSelectedTopic(topic)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedTopic?.id === topic.id
                                            ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                                            : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                    >
                                        <div className="font-semibold text-sm text-gray-900">{topic.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{topic.category}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStart}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Start Practice 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
