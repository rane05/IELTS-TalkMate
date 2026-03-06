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
    Sparkles,
    Flame,
    Award,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { SessionStats } from '../types';

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
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

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
    stats: SessionStats;
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ onSelectModule, stats }) => {
    const modules = [
        { name: 'speaking' as ModuleName, title: 'Speaking', description: 'AI interview simulation with real-time feedback', icon: <Mic />, gradient: 'from-blue-600 to-indigo-600', color: 'blue', stats: { label: 'Last Band', value: stats.moduleBreakdown.speaking } },
        { name: 'reading' as ModuleName, title: 'Reading', description: 'Academic passages with adaptive difficulty', icon: <BookOpen />, gradient: 'from-indigo-600 to-violet-600', color: 'indigo', isNew: true, stats: { label: 'Accuracy', value: stats.moduleBreakdown.reading } },
        { name: 'writing' as ModuleName, title: 'Writing', description: 'Detailed AI grading and Band 9 rephrasing', icon: <PenTool />, gradient: 'from-violet-600 to-fuchsia-600', color: 'violet', isNew: true, stats: { label: 'Consistency', value: stats.moduleBreakdown.writing } },
        { name: 'listening' as ModuleName, title: 'Listening', description: 'Authentic audio with transcript analysis', icon: <Headphones />, gradient: 'from-emerald-600 to-teal-600', color: 'emerald', isNew: true, stats: { label: 'Speed Score', value: stats.moduleBreakdown.listening } },
        { name: 'vocabulary' as ModuleName, title: 'Vocabulary', description: 'Spaced-repetition word bank for Band 8+', icon: <BookMarked />, gradient: 'from-amber-600 to-orange-600', color: 'amber', isNew: true },
        { name: 'mocktest' as ModuleName, title: 'Mock Tests', description: 'Full simulation with predictive reports', icon: <Trophy />, gradient: 'from-rose-600 to-pink-600', color: 'rose', isNew: true },
        { name: 'resources' as ModuleName, title: 'Study Kit', description: 'Strategy guides and downloadable materials', icon: <BookMarked />, gradient: 'from-cyan-600 to-blue-600', color: 'cyan', isNew: true },
        { name: 'analytics' as ModuleName, title: 'Success Lab', description: 'Deep performance trends and readiness radar', icon: <BarChart3 />, gradient: 'from-slate-700 to-slate-900', color: 'slate' }
    ];

    const levelProgress = (stats.xp % 1000) / 10; // XP per level = 1000

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animation-delay-2000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-20">

                {/* Hero / Quick Success Dashboard */}
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/50 rounded-full border border-indigo-100/50 backdrop-blur-sm">
                                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{stats.streak} DAY STREAK</span>
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                Success Lab <br /><span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Overview.</span>
                            </h1>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-slate-900">Level {stats.level}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{1000 - (stats.xp % 1000)} XP to next level</p>
                                </div>
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 font-black text-indigo-600">
                                    {stats.xp} Total XP
                                </div>
                            </div>
                            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${levelProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Badges Quick View */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {stats.badges.map((badge) => (
                                <div key={badge.id} className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-indigo-500 transition-colors">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div className="pr-4">
                                        <p className="text-sm font-black text-slate-900">{badge.title}</p>
                                        <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">Achievement</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Readiness Radar / Stat Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-10 -mt-10" />

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between font-black uppercase tracking-widest text-[0.65rem] text-slate-400">
                                <span>Exam Readiness</span>
                                <span className="text-indigo-400">Target: 8.5</span>
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="relative w-40 h-40 flex items-center justify-center bg-white/5 rounded-full border-4 border-indigo-500/30">
                                    <div className="absolute inset-4 rounded-full border-2 border-indigo-400/20" />
                                    <div className="text-center group">
                                        <p className="text-5xl font-black text-white group-hover:scale-110 transition-transform">{stats.readinessScore}%</p>
                                        <p className="text-[0.6rem] font-bold text-indigo-400 uppercase tracking-widest mt-1">Ready to Exam</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-300">Predicted Band</p>
                                    <p className="text-2xl font-black text-white">{stats.predictiveBand}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(stats.moduleBreakdown).map(([key, val]) => (
                                    <div key={key} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-[0.6rem] uppercase font-black text-slate-400">
                                            <span>{key}</span>
                                            <span className="text-white">Band {val}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r rounded-full transition-all duration-1000 ${key === 'speaking' ? 'from-indigo-500 to-blue-500' :
                                                    key === 'writing' ? 'from-purple-500 to-pink-500' :
                                                        key === 'reading' ? 'from-emerald-500 to-teal-500' :
                                                            'from-amber-500 to-orange-500'
                                                    }`}
                                                style={{ width: `${(val / 9) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="relative z-10 mt-8 w-full py-4 bg-indigo-600 rounded-2xl font-black hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 group">
                            Deep Analysis
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Modules Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Focus Areas</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">AI-Recommended for your Level {stats.level}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-100 items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> All Modules Synced
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {modules.map((module) => (
                        <ModuleCard
                            key={module.name}
                            name={module.name}
                            title={module.title}
                            description={module.description}
                            icon={module.icon}
                            color={module.color || 'indigo'}
                            gradient={module.gradient}
                            onClick={() => onSelectModule(module.name)}
                            stats={module.stats}
                            isNew={module.isNew}
                        />
                    ))}
                </div>

                {/* Foot CTA */}
                <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-white leading-tight">
                                Push your limits <br /> <span className="text-indigo-400">to Band 9.</span>
                            </h3>
                            <p className="text-slate-400 font-medium max-w-sm">
                                Join the advanced Elite track and get daily challenges mentored by AI examiner bots.
                            </p>
                        </div>
                        <button
                            onClick={() => onSelectModule('mocktest')}
                            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-500/20 group/btn flex items-center gap-3"
                        >
                            Explore Elite
                            <TrendingUp className="w-5 h-5 group-hover/btn:translate-y-[-2px] transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
