import React from 'react';
import {
    Mic,
    BookOpen,
    PenTool,
    Headphones,
    Trophy,
    BookMarked,
    BarChart3,
    Settings,
    ChevronRight,
    Star,
    Zap,
    Target,
    Users,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';

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
    isNew,
    color
}) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 hover:border-indigo-500/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            {/* Hover Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500`}>
                        {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8 text-white' })}
                    </div>
                    {isNew && (
                        <div className="flex items-center gap-1.5 bg-indigo-500 text-white text-[0.65rem] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                            <Sparkles className="w-3 h-3" />
                            New
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                <div className="mt-auto pt-8 flex items-center justify-between">
                    {stats ? (
                        <div className="flex flex-col">
                            <span className="text-[0.65rem] uppercase tracking-wider font-bold text-slate-400">
                                {stats.label}
                            </span>
                            <span className="text-lg font-black text-indigo-600">
                                {stats.value}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            Start Training
                        </div>
                    )}

                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-5 h-5" />
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
            icon: <Mic />,
            gradient: 'from-blue-600 to-indigo-600',
            color: 'indigo',
            stats: stats.speaking ? {
                label: 'Performance',
                value: `Band ${stats.speaking.band}`
            } : undefined
        },
        {
            name: 'reading' as ModuleName,
            title: 'Reading',
            description: 'Practice with authentic passages, instant scoring, and detailed explanations',
            icon: <BookOpen />,
            gradient: 'from-indigo-600 to-violet-600',
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
            icon: <PenTool />,
            gradient: 'from-violet-600 to-fuchsia-600',
            color: 'green',
            stats: stats.writing ? {
                label: 'Proficiency',
                value: `Band ${stats.writing.band}`
            } : undefined,
            isNew: true
        },
        {
            name: 'listening' as ModuleName,
            title: 'Listening',
            description: 'All 4 sections with audio playback, transcripts, and answer checking',
            icon: <Headphones />,
            gradient: 'from-emerald-600 to-teal-600',
            color: 'orange',
            stats: stats.listening ? {
                label: 'Accuracy',
                value: `${stats.listening.score}%`
            } : undefined,
            isNew: true
        },
        {
            name: 'vocabulary' as ModuleName,
            title: 'Vocabulary',
            description: 'Flashcards, word lists, and games to build your IELTS vocabulary',
            icon: <BookMarked />,
            gradient: 'from-amber-600 to-orange-600',
            color: 'pink',
            stats: stats.vocabulary ? {
                label: 'Lexicon',
                value: `${stats.vocabulary.wordsLearned} Words`
            } : undefined,
            isNew: true
        },
        {
            name: 'mocktest' as ModuleName,
            title: 'Mock Tests',
            description: 'Full IELTS simulation with all 4 modules and comprehensive reports',
            icon: <Trophy />,
            gradient: 'from-rose-600 to-pink-600',
            color: 'amber',
            isNew: true
        },
        {
            name: 'resources' as ModuleName,
            title: 'Study Kit',
            description: 'Tips, strategies, sample answers, and downloadable materials',
            icon: <BookMarked />,
            gradient: 'from-cyan-600 to-blue-600',
            color: 'violet',
            isNew: true
        },
        {
            name: 'analytics' as ModuleName,
            title: 'Analytics',
            description: 'Detailed insights into your performance across all modules',
            icon: <BarChart3 />,
            gradient: 'from-slate-700 to-slate-900',
            color: 'teal'
        }
    ];

    const totalPractice = (stats.speaking?.sessions || 0) + (stats.reading?.attempts || 0) + (stats.writing?.attempts || 0) + (stats.listening?.attempts || 0);

    return (
        <div className="relative min-h-screen">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animation-delay-2000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-20">

                {/* Hero / Header Section */}
                <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest pl-2">Join 12k+ Active Learners</span>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                            Master Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Future.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                            The ultimate AI-powered environment for your IELTS journey. Personalized training, real-time feedback, and measurable results.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:border-indigo-500 transition-colors cursor-default">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-slate-900">{stats.speaking?.band || '7.5'}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Band Score</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:border-purple-500 transition-colors cursor-default">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-slate-900">{totalPractice}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Rank #{Math.max(1, 100 - totalPractice)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Training Modules</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Select a module to begin practice</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-widest pr-4 border-r border-slate-200">
                            Sorted by popularity
                        </div>
                        <button className="p-3 hover:bg-slate-100 rounded-xl transition-colors">
                            <Settings className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Dynamic Module Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                {/* Call to action foot bar */}
                <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-white leading-tight">
                                Ready for the <br /> <span className="text-indigo-400">Main Event?</span>
                            </h3>
                            <p className="text-slate-400 font-medium max-w-sm">
                                Take a full simulation and get your comprehensive performance report in 120 minutes.
                            </p>
                        </div>
                        <button
                            onClick={() => onSelectModule('mocktest')}
                            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-500/20 group/btn flex items-center gap-3"
                        >
                            Take Mock Test
                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
