import React from 'react';
import {
    Trophy,
    Target,
    Clock,
    ChevronRight,
    Download,
    Share2,
    CheckCircle2,
    AlertCircle
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
    const overallBand = ((listeningBand + readingBand + writingBand) / 3).toFixed(1);

    const modules = [
        { name: 'Listening', band: listeningBand, score: '28/40', color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { name: 'Reading', band: readingBand, score: '32/40', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { name: 'Writing', band: writingBand, score: 'AI Evaluated', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { name: 'Speaking', band: 'Not Attempted', score: '--', color: 'text-gray-400', bg: 'bg-gray-500/10' },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight">Examination Results</h1>
                    <p className="text-xl text-gray-400">Great job! Here is your performance breakdown.</p>
                </div>

                {/* Score Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                    <div className="text-center md:text-left space-y-2 relative z-10">
                        <span className="text-indigo-200 uppercase tracking-widest font-bold">Overall Band Score</span>
                        <div className="text-9xl font-black text-white leading-none">{overallBand}</div>
                        <p className="text-indigo-100/70 text-lg max-w-xs">
                            Your performance corresponds to a 'Good User' level (CEFR C1).
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10 w-full md:w-auto">
                        {modules.map((m, i) => (
                            <div key={i} className={`${m.bg} backdrop-blur-md rounded-3xl p-6 border border-white/5 space-y-1 min-w-[160px]`}>
                                <p className="text-white/60 text-sm font-medium">{m.name}</p>
                                <p className={`text-2xl font-bold ${m.color}`}>{m.band}</p>
                                <p className="text-white/30 text-xs">{m.score}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* In-depth Analysis Placeholder */}
                <div className="bg-[#1e293b] rounded-3xl p-8 border border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">In-depth Analysis</h2>
                        <button className="flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                            <Download className="w-5 h-5" />
                            Download Report (PDF)
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                <h3 className="font-bold text-lg">Strengths</h3>
                            </div>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>• High accuracy in Multiple Choice questions in Reading.</li>
                                <li>• Good understanding of academic terminology in Listening.</li>
                                <li>• Strong coherence in Task 1 Writing structure.</li>
                            </ul>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-orange-400" />
                                <h3 className="font-bold text-lg">Areas for Improvement</h3>
                            </div>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>• Vocabulary range in Writing could be more academic (Lexical Resource).</li>
                                <li>• Spelling errors in Listening Section 1.</li>
                                <li>• Time management in Reading (spent too long on Passage 2).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <button
                        onClick={onBackToDashboard}
                        className="px-12 py-5 bg-white text-[#0f172a] text-xl font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:scale-[1.02]"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
