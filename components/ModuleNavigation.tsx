import React from 'react';
import { Mic, BookOpen, PenTool, Headphones, Trophy, BookMarked, BarChart3, Settings } from 'lucide-react';

export type ModuleName = 'speaking' | 'reading' | 'writing' | 'listening' | 'vocabulary' | 'mocktest' | 'resources' | 'analytics';

interface ModuleCardProps {
    name: ModuleName;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
    onClick: () => void;
    stats?: {
        label: string;
        value: string | number;
    };
    isNew?: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
    title,
    description,
    icon,
    gradient,
    onClick,
    stats,
    isNew
}) => {
    return (
        <div
            onClick={onClick}
            className={`relative bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />
            </div>

            {/* New Badge */}
            {isNew && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    NEW
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/90 text-sm mb-4 leading-relaxed">{description}</p>

                {stats && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                        <span className="text-white/80 text-xs">{stats.label}: </span>
                        <span className="text-white font-bold">{stats.value}</span>
                    </div>
                )}

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/30 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ModuleNavigationProps {
    onSelectModule: (module: ModuleName) => void;
    stats?: {
        speaking?: { sessions: number; band: number };
        reading?: { attempts: number; score: number };
        writing?: { attempts: number; band: number };
        listening?: { attempts: number; score: number };
        vocabulary?: { wordsLearned: number };
    };
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ onSelectModule, stats = {} }) => {
    const modules = [
        {
            name: 'speaking' as ModuleName,
            title: 'Speaking',
            description: 'AI-powered speaking practice with real-time feedback and band score estimation',
            icon: <Mic className="w-8 h-8 text-white" />,
            gradient: 'from-indigo-500 to-purple-600',
            color: 'indigo',
            stats: stats.speaking ? {
                label: 'Sessions',
                value: `${stats.speaking.sessions} (Band ${stats.speaking.band})`
            } : undefined
        },
        {
            name: 'reading' as ModuleName,
            title: 'Reading',
            description: 'Practice with authentic passages, instant scoring, and detailed explanations',
            icon: <BookOpen className="w-8 h-8 text-white" />,
            gradient: 'from-blue-500 to-cyan-600',
            color: 'blue',
            stats: stats.reading ? {
                label: 'Avg Score',
                value: `${stats.reading.score}%`
            } : undefined,
            isNew: true
        },
        {
            name: 'writing' as ModuleName,
            title: 'Writing',
            description: 'Task 1 & 2 practice with AI feedback on grammar, coherence, and vocabulary',
            icon: <PenTool className="w-8 h-8 text-white" />,
            gradient: 'from-green-500 to-emerald-600',
            color: 'green',
            stats: stats.writing ? {
                label: 'Avg Band',
                value: stats.writing.band
            } : undefined,
            isNew: true
        },
        {
            name: 'listening' as ModuleName,
            title: 'Listening',
            description: 'All 4 sections with audio playback, transcripts, and answer checking',
            icon: <Headphones className="w-8 h-8 text-white" />,
            gradient: 'from-orange-500 to-red-600',
            color: 'orange',
            stats: stats.listening ? {
                label: 'Avg Score',
                value: `${stats.listening.score}%`
            } : undefined,
            isNew: true
        },
        {
            name: 'vocabulary' as ModuleName,
            title: 'Vocabulary',
            description: 'Flashcards, word lists, and games to build your IELTS vocabulary',
            icon: <BookMarked className="w-8 h-8 text-white" />,
            gradient: 'from-pink-500 to-rose-600',
            color: 'pink',
            stats: stats.vocabulary ? {
                label: 'Words Learned',
                value: stats.vocabulary.wordsLearned
            } : undefined,
            isNew: true
        },
        {
            name: 'mocktest' as ModuleName,
            title: 'Mock Tests',
            description: 'Full IELTS simulation with all 4 modules and comprehensive reports',
            icon: <Trophy className="w-8 h-8 text-white" />,
            gradient: 'from-amber-500 to-yellow-600',
            color: 'amber',
            isNew: true
        },
        {
            name: 'resources' as ModuleName,
            title: 'Study Resources',
            description: 'Tips, strategies, sample answers, and downloadable materials',
            icon: <BookMarked className="w-8 h-8 text-white" />,
            gradient: 'from-violet-500 to-purple-600',
            color: 'violet',
            isNew: true
        },
        {
            name: 'analytics' as ModuleName,
            title: 'Analytics',
            description: 'Detailed insights into your performance across all modules',
            icon: <BarChart3 className="w-8 h-8 text-white" />,
            gradient: 'from-teal-500 to-cyan-600',
            color: 'teal'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    IELTS Complete Platform
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Master all four IELTS modules with AI-powered feedback, comprehensive practice materials, and detailed analytics
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border-2 border-indigo-200">
                        <span className="text-indigo-600 font-semibold">🎯 All 4 Modules</span>
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200">
                        <span className="text-purple-600 font-semibold">🤖 AI-Powered</span>
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-full border-2 border-pink-200">
                        <span className="text-pink-600 font-semibold">📊 Detailed Analytics</span>
                    </div>
                </div>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module) => (
                    <ModuleCard
                        key={module.name}
                        name={module.name}
                        title={module.title}
                        description={module.description}
                        icon={module.icon}
                        color={module.color}
                        gradient={module.gradient}
                        onClick={() => onSelectModule(module.name)}
                        stats={module.stats}
                        isNew={module.isNew}
                    />
                ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Overall Progress</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">
                            {(stats.speaking?.sessions || 0) + (stats.reading?.attempts || 0) + (stats.writing?.attempts || 0) + (stats.listening?.attempts || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Practice Sessions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">
                            {stats.speaking?.band || 0}
                        </div>
                        <div className="text-sm text-gray-600">Current Band Score</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-pink-600 mb-2">
                            {stats.vocabulary?.wordsLearned || 0}
                        </div>
                        <div className="text-sm text-gray-600">Words Learned</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            4/4
                        </div>
                        <div className="text-sm text-gray-600">Modules Available</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
