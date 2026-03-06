import React from 'react';
import {
    Trophy,
    Target,
    Clock,
    ChevronRight,
    Download,
    Share2,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    Sparkles,
    Zap,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { MockTestSession } from '../../types/mocktest';

interface MockTestResultsProps {
    session: MockTestSession;
    onBackToDashboard: () => void;
}

export const MockTestResults: React.FC<MockTestResultsProps> = ({ session, onBackToDashboard }) => {
    // mock band calculation
    const listeningBand = session.results.listening?.band || 6.5;
    const readingBand = session.results.reading?.band || 7.0;
    const writingBand = session.results.writing?.band || 6.0;
    const speakingBand = session.results.speaking?.band || 7.5;
    const overallBand = ((listeningBand + readingBand + writingBand + speakingBand) / 4).toFixed(1);

    const modules = [
        { name: 'Listening', band: listeningBand, score: '28/40', color: 'emerald', progress: 75, gradient: 'from-emerald-500 to-teal-500' },
        { name: 'Reading', band: readingBand, score: '32/40', color: 'blue', progress: 80, gradient: 'from-blue-500 to-indigo-500' },
        { name: 'Writing', band: writingBand, score: 'Expert Grade', color: 'violet', progress: 65, gradient: 'from-violet-500 to-fuchsia-500' },
        { name: 'Speaking', band: speakingBand, score: 'Fluent', color: 'amber', progress: 85, gradient: 'from-amber-500 to-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] animation-delay-2000" />
            </div>

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-indigo-300 text-xs font-black uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" />
                            AI Powered Analysis
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                            Performance <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Master Report</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                            <Download className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                            <Share2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Main Score Hero */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Overall Band */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[3.5rem] p-12 relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl mb-6">
                                <Trophy className="w-10 h-10 text-yellow-300" />
                            </div>
                            <span className="text-indigo-200 text-sm font-black uppercase tracking-widest mb-2">Predicted IELTS Band</span>
                            <div className="text-[10rem] font-black leading-none drop-shadow-2xl">
                                {overallBand}
                            </div>
                            <div className="mt-8 flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/10">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <span className="font-bold">Top 15% of Candidates</span>
                            </div>
                        </div>
                    </div>

                    {/* Module Breakdowns */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((m, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 hover:border-white/20 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 bg-${m.color}-500/20 rounded-2xl`}>
                                        <Zap className={`w-5 h-5 text-${m.color}-400`} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{m.name}</div>
                                        <div className="text-3xl font-black">Band {m.band}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                        <span>Accuracy</span>
                                        <span>{m.progress}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${m.gradient} rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                                            style={{ width: `${m.progress}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium pt-2 italic">
                                        "{m.score} detected across all subsections"
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights & Readiness */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Exam Readiness */}
                    <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-white/5 p-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl">
                                <BarChart3 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">Readiness Radar</h3>
                                <p className="text-slate-500 text-sm">Deep analysis of skill proficiency</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-slate-400">
                                        <span>Contextual Grammar</span>
                                        <span className="text-white">92%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full">
                                        <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-slate-400">
                                        <span>Lexical Variety</span>
                                        <span className="text-white">78%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full">
                                        <div className="h-full w-[78%] bg-indigo-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-slate-400">
                                        <span>Response Cohesion</span>
                                        <span className="text-white">65%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full">
                                        <div className="h-full w-[65%] bg-purple-500 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                                <h4 className="font-black text-xs uppercase tracking-widest text-indigo-400">AI Examiner's Verdict</h4>
                                <p className="text-slate-300 leading-relaxed text-sm italic">
                                    "Your performance in Reading and Speaking is exceptional, showing Band 8+ potential.
                                    However, focus on complex sentence structures in Writing Task 2 is needed to push
                                    your Writing band from 6.0 to 7.5."
                                </p>
                                <div className="pt-4 flex items-center gap-2 text-xs font-black text-indigo-300">
                                    <Target className="w-4 h-4" />
                                    RECOMMENDED NEXT: WRITING MASTERCLASS
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Critical Improvements */}
                    <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 to-slate-950 rounded-[3rem] border border-white/5 p-10 space-y-8">
                        <h3 className="text-2xl font-black">Success Plan</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Time Optimization', desc: 'Spend max 15m on Part 1', color: 'orange' },
                                { title: 'Synonym Range', desc: 'Avoid repeating "increase"', color: 'indigo' },
                                { title: 'Spelling Precision', desc: 'Review Section 1 dictations', color: 'emerald' }
                            ].map((item, i) => (
                                <div key={i} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                                    <div className={`p-2 bg-${item.color}-500/20 rounded-xl mt-1`}>
                                        <ChevronRight className={`w-4 h-4 text-${item.color}-400`} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black mb-1">{item.title}</div>
                                        <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                            Boost My Score
                        </button>
                    </div>
                </div>

                {/* Return Button */}
                <div className="flex justify-center pt-8">
                    <button
                        onClick={onBackToDashboard}
                        className="group flex items-center gap-3 px-12 py-6 bg-white text-slate-900 text-xl font-black rounded-3xl hover:bg-indigo-50 transition-all shadow-2xl hover:scale-[1.02]"
                    >
                        Back to Command Center
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
