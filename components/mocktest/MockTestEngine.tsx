import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Layout,
    CheckCircle2,
    AlertCircle,
    Play,
    ClipboardList
} from 'lucide-react';
import { MockTestPackage, MockTestSession, MockTestSectionResult } from '../../types/mocktest';
import { ListeningTestComponent } from '../listening/ListeningTest';
import { ReadingTest } from '../reading/ReadingTest';
import { WritingEditor } from '../writing/WritingEditor';
import { analyzeWriting } from '../../services/writingService';

import { ACADEMIC_LISTENING_TESTS } from '../../data/listeningData';
import { ACADEMIC_READING_PASSAGES } from '../../data/readingData';
import { ACADEMIC_WRITING_PROMPTS } from '../../data/writingData';

interface MockTestEngineProps {
    testPackage: MockTestPackage;
    onComplete: (results: MockTestSession) => void;
    onCancel: () => void;
}

type TestPhase = 'instructions' | 'listening' | 'reading' | 'writing' | 'speaking_intro' | 'completed';

export const MockTestEngine: React.FC<MockTestEngineProps> = ({ testPackage, onComplete, onCancel }) => {
    const [phase, setPhase] = useState<TestPhase>('instructions');
    const [session, setSession] = useState<MockTestSession>({
        id: Date.now().toString(),
        startTime: Date.now(),
        status: 'in_progress',
        currentModule: 'listening',
        results: {}
    });

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Resolve Test Data
    const listeningData = ACADEMIC_LISTENING_TESTS.find(t => t.id === testPackage.modules.listeningId) || ACADEMIC_LISTENING_TESTS[0];
    const readingData = ACADEMIC_READING_PASSAGES.find(p => p.id === testPackage.modules.readingId) || ACADEMIC_READING_PASSAGES[0];
    const writingData = ACADEMIC_WRITING_PROMPTS.find(p => p.id === testPackage.modules.writingId) || ACADEMIC_WRITING_PROMPTS[0];

    useEffect(() => {
        let timer: any;
        if (isTimerRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            handleTimeUp();
        }
        return () => clearInterval(timer);
    }, [isTimerRunning, timeLeft]);

    const handleTimeUp = () => {
        console.log('Time is up!');
        nextPhase();
    };

    const startModule = (modulePhase: TestPhase, durationMinutes: number) => {
        setPhase(modulePhase);
        setTimeLeft(durationMinutes * 60);
        setIsTimerRunning(true);
    };

    const nextPhase = () => {
        setIsTimerRunning(false);
        if (phase === 'instructions') {
            startModule('listening', 30);
        } else if (phase === 'listening') {
            startModule('reading', 60);
        } else if (phase === 'reading') {
            startModule('writing', 60);
        } else if (phase === 'writing') {
            setPhase('speaking_intro');
        }
    };

    const handleModuleComplete = (module: 'listening' | 'reading' | 'writing', result: any) => {
        setSession(prev => ({
            ...prev,
            results: {
                ...prev.results,
                [module]: {
                    module,
                    band: 0,
                    score: 0,
                    total: 40,
                    timeSpent: 0,
                    ...result
                }
            }
        }));
        nextPhase();
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const renderHeader = () => (
        <nav className="bg-[#1e293b] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-white font-bold leading-tight">{testPackage.title}</h2>
                    <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">
                        Phase: {phase.replace('_', ' ')}
                    </p>
                </div>
            </div>

            {isTimerRunning && (
                <div className={`flex items-center gap-3 px-6 py-2 rounded-2xl border font-mono text-xl font-bold transition-all ${timeLeft < 300 ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-white'
                    }`}>
                    <Clock className="w-5 h-5" />
                    {formatTime(timeLeft)}
                </div>
            )}

            <button
                onClick={onCancel}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                Quit Test
            </button>
        </nav>
    );

    const renderInstructions = () => (
        <div className="max-w-3xl mx-auto mt-20 p-12 bg-[#1e293b] rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center space-y-6">
                <div className="inline-flex p-4 bg-indigo-500/20 rounded-full mb-4">
                    <Play className="w-12 h-12 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-extrabold text-white">Ready to start?</h1>
                <p className="text-gray-400 text-lg">
                    You are about to begin the full computer-delivered IELTS simulation.
                    Please ensure you are in a quiet environment and have your headphones ready for the Listening section.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left py-8">
                    {[
                        { label: 'Listening', value: '30 Minutes', icon: CheckCircle2 },
                        { label: 'Reading', value: '60 Minutes', icon: CheckCircle2 },
                        { label: 'Writing', value: '60 Minutes', icon: CheckCircle2 },
                        { label: 'Total Environment', value: 'Strict Timing', icon: AlertCircle }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <item.icon className="w-5 h-5 text-indigo-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">{item.label}</p>
                                <p className="text-white font-semibold">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-6">
                    <button
                        onClick={nextPhase}
                        className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all active:scale-[0.98]"
                    >
                        Begin Examination
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSpeakingIntro = () => (
        <div className="max-w-3xl mx-auto mt-20 p-12 bg-[#1e293b] rounded-3xl border border-white/10 shadow-2xl text-center space-y-8">
            <div className="inline-flex p-4 bg-emerald-500/20 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-extrabold text-white">Written Sections Completed</h1>
            <p className="text-gray-400 text-lg">
                Congratulations! You have finished the Listening, Reading, and Writing sections.
                Your responses have been saved and are ready for evaluation.
            </p>
            <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20">
                <p className="text-indigo-300 font-medium">
                    The Speaking module is conducted face-to-face or via video call in the real exam.
                    You can now proceed to see your results for the completed sections.
                </p>
            </div>
            <button
                onClick={() => onComplete(session)}
                className="w-full py-5 bg-emerald-600 text-white text-xl font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20"
            >
                Finish & View Results
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {phase !== 'instructions' && phase !== 'speaking_intro' && renderHeader()}

            <main className="container mx-auto pb-20 px-4">
                {phase === 'instructions' && renderInstructions()}

                {phase === 'listening' && (
                    <div className="mt-8 animate-fade-in">
                        <ListeningTestComponent
                            test={listeningData}
                            onComplete={(answers, timeSpent) => handleModuleComplete('listening', { score: 25, timeSpent })}
                            onCancel={onCancel}
                        />
                    </div>
                )}

                {phase === 'reading' && (
                    <div className="mt-8 animate-fade-in">
                        <ReadingTest
                            passage={readingData}
                            onComplete={(answers, timeSpent) => handleModuleComplete('reading', { score: 30, timeSpent })}
                            onCancel={onCancel}
                        />
                    </div>
                )}

                {phase === 'writing' && (
                    <div className="mt-8 animate-fade-in">
                        <WritingEditor
                            prompt={writingData}
                            onSubmit={(content, wordCount, timeSpent) => handleModuleComplete('writing', { content, wordCount, timeSpent })}
                            onCancel={onCancel}
                        />
                    </div>
                )}

                {phase === 'speaking_intro' && renderSpeakingIntro()}
            </main>
        </div>
    );
};
