import React from 'react';
import { Play, BookOpen, Mic, PenTool, Headset, Trophy, Clock, ChevronRight, Sparkles, ShieldCheck, Target } from 'lucide-react';
import { MockTestPackage } from '../../types/mocktest';
import { MOCK_TEST_PACKAGES } from '../../data/mockTestData';

interface MockTestDashboardProps {
    onStartFullTest: (pkg: MockTestPackage) => void;
    onStartModuleTest: (module: 'listening' | 'reading' | 'writing' | 'speaking') => void;
    stats: {
        completedTests: number;
        averageBand: number;
        bestModule: string;
    };
}


export const MockTestDashboard: React.FC<MockTestDashboardProps> = ({ onStartFullTest, onStartModuleTest, stats }) => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/30">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span>Advanced Simulation Engine</span>
                            </div>
                            <h1 className="text-5xl font-extrabold tracking-tight">IELTS Mock Test Center</h1>
                            <p className="text-xl text-indigo-100 max-w-xl">
                                Experience the most authentic computer-delivered IELTS simulation.
                                Get instant AI-powered feedback across all four modules.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                                <button
                                    onClick={() => onStartFullTest(MOCK_TEST_PACKAGES[0])}
                                    className="group flex items-center gap-3 px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:scale-105"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Start Full Mock Test
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl font-bold hover:bg-white/20 transition-all">
                                    View Test History
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                            {[
                                { icon: Trophy, label: 'Avg. Band', value: stats.averageBand.toFixed(1), color: 'text-yellow-400' },
                                { icon: ShieldCheck, label: 'Tests Done', value: stats.completedTests, color: 'text-emerald-400' },
                                { icon: Clock, label: 'Practice Time', value: '12h 45m', color: 'text-blue-400' },
                                { icon: Target, label: 'Best Module', value: stats.bestModule, color: 'text-rose-400' }
                            ].map((stat, i) => (
                                <div key={i} className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/15 transition-all">
                                    <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Module Quick Access */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold px-2">Modular Practice</h2>
                        <p className="text-indigo-400 font-medium">Focus on specific skills</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { id: 'listening', title: 'Listening', icon: Headset, color: 'from-orange-500 to-red-600', desc: '4 Sections, 40 Questions' },
                            { id: 'reading', title: 'Reading', icon: BookOpen, color: 'from-blue-500 to-indigo-600', desc: '3 Passages, 60 Minutes' },
                            { id: 'writing', title: 'Writing', icon: PenTool, color: 'from-emerald-500 to-teal-600', desc: '2 Tasks, 60 Minutes' },
                            { id: 'speaking', title: 'Speaking', icon: Mic, color: 'from-purple-500 to-pink-600', desc: '3 Parts, 15 Minutes' }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => onStartModuleTest(m.id as any)}
                                className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all text-left"
                            >
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${m.color} shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                                    <m.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{m.title}</h3>
                                <p className="text-indigo-300 mb-6">{m.desc}</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    Practice Now <ChevronRight className="w-4 h-4" />
                                </div>

                                {/* Hover background glow */}
                                <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity`}></div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Full Test Packages */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold px-2">Exam Simulations</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {MOCK_TEST_PACKAGES.map((pkg) => (
                            <div key={pkg.id} className="group relative bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl">
                                <div className="p-8 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold">{pkg.title}</h3>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pkg.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    pkg.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-rose-500/20 text-rose-400'
                                                    }`}>
                                                    {pkg.difficulty}
                                                </span>
                                                <span className="text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    ~2h 45m
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30">
                                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        {pkg.description}
                                    </p>
                                    <div className="pt-6 flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                            {[Headset, BookOpen, PenTool, Mic].map((Icon, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                                                    <Icon className="w-4 h-4 text-indigo-400" />
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => onStartFullTest(pkg)}
                                            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all active:scale-95"
                                        >
                                            Begin Exam
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
