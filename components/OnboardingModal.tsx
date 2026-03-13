import React, { useState } from 'react';
import { Sparkles, Target, BookOpen, Clock, ArrowRight, CheckCircle2, ChevronRight, Brain, Zap, Shield } from 'lucide-react';
import { User, DifficultyLevel, RoutineItem } from '../types';

interface OnboardingModalProps {
    user: User;
    onComplete: (updatedUser: User) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [englishLevel, setEnglishLevel] = useState<DifficultyLevel>(DifficultyLevel.INTERMEDIATE);
    const [targetBand, setTargetBand] = useState(user.targetBand || 7.0);
    const [isGenerating, setIsGenerating] = useState(false);

    const levels = [
        {
            id: DifficultyLevel.BEGINNER,
            label: 'Beginner',
            desc: 'New to IELTS, basic English knowledge',
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            color: 'from-amber-500/10 to-amber-600/10',
            borderColor: 'border-amber-200'
        },
        {
            id: DifficultyLevel.INTERMEDIATE,
            label: 'Intermediate',
            desc: 'Comfortable with basics, want B2/C1 level',
            icon: <Brain className="w-5 h-5 text-indigo-500" />,
            color: 'from-indigo-500/10 to-indigo-600/10',
            borderColor: 'border-indigo-200'
        },
        {
            id: DifficultyLevel.ADVANCED,
            label: 'Advanced',
            desc: 'Fluent speaker, aiming for Band 8.5-9.0',
            icon: <Shield className="w-5 h-5 text-emerald-500" />,
            color: 'from-emerald-500/10 to-emerald-600/10',
            borderColor: 'border-emerald-200'
        }
    ];

    const generateRoutine = (level: DifficultyLevel): RoutineItem[] => {
        const baseRoutine = [
            { day: 'Monday', tasks: ['Listening: Part 1 & 2', 'Vocab: Education & Technology'] },
            { day: 'Tuesday', tasks: ['Reading: Passage 1', 'Writing: Task 1 (Bar Charts)'] },
            { day: 'Wednesday', tasks: ['Speaking: Part 1 (Hobbies)', 'Listening: Part 3'] },
            { day: 'Thursday', tasks: ['Writing: Task 2 Structure', 'Reading: Passage 2'] },
            { day: 'Friday', tasks: ['Full Speaking Mock Test', 'Vocab: Environment'] },
            { day: 'Saturday', tasks: ['Writing: Full Essay Task 2', 'Reading: Passage 3'] },
            { day: 'Sunday', tasks: ['Rest & Review', 'Weekly Goal Setting'] },
        ];

        if (level === DifficultyLevel.BEGINNER) {
            return baseRoutine.map(r => ({
                ...r,
                tasks: r.tasks.map(t => 'Focus on Foundation: ' + t)
            }));
        }

        if (level === DifficultyLevel.ADVANCED) {
            return baseRoutine.map(r => ({
                ...r,
                tasks: r.tasks.map(t => 'Mastery: ' + t + ' (Time-strict)')
            }));
        }

        return baseRoutine;
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setIsGenerating(true);
            setTimeout(() => {
                const routine = generateRoutine(englishLevel);
                onComplete({
                    ...user,
                    targetBand,
                    englishLevel,
                    routine
                });
                setIsGenerating(false);
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500" />

            <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-700">

                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

                <div className="flex flex-col md:flex-row min-h-[600px]">
                    {/* Left Panel: Context */}
                    <div className="w-full md:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                                <Sparkles className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-black mb-4 leading-tight">Welcome, {user.name.split(' ')[0]}!</h2>
                            <p className="text-slate-400 text-lg font-medium">Let's craft your winning strategy for the IELTS exam.</p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= 1 ? 'bg-indigo-600 border-indigo-600' : 'border-slate-700'}`}>
                                    {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Targets</p>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Ambition Level</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= 2 ? 'bg-indigo-600 border-indigo-600' : 'border-slate-700'}`}>
                                    {step > 2 ? <CheckCircle2 className="w-6 h-6" /> : '2'}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">English Level</p>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Current Skills</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Selections */}
                    <div className="flex-1 p-12 md:p-16 flex flex-col justify-center relative overflow-y-auto">
                        {isGenerating ? (
                            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl animate-ping" />
                                    <div className="relative bg-white border-2 border-indigo-500 w-full h-full rounded-3xl flex items-center justify-center">
                                        <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">Analyzing your Profile...</h3>
                                    <p className="text-slate-500 font-medium italic">Our AI is generating your personalized {targetBand} routine.</p>
                                </div>
                                <div className="max-w-xs mx-auto space-y-3">
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 animate-progress" />
                                    </div>
                                    <div className="flex justify-between text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Calibrating Modules</span>
                                        <span>87%</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                                {step === 1 ? (
                                    <div className="space-y-10">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[0.65rem] font-bold uppercase tracking-wider mb-4">
                                                <Target className="w-3 h-3" /> Step 01
                                            </div>
                                            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Set Your Target Band</h3>
                                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                                Higher targets require more rigorous practice modules. Choose wisely.
                                            </p>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-end justify-between px-4">
                                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Current Target</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-6xl font-black text-indigo-600 tracking-tighter">{targetBand}</span>
                                                    <span className="text-lg font-bold text-slate-300">/ 9.0</span>
                                                </div>
                                            </div>
                                            <div className="px-4">
                                                <input
                                                    type="range"
                                                    min="4.0"
                                                    max="9.0"
                                                    step="0.5"
                                                    value={targetBand}
                                                    onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                                                    className="w-full h-3 bg-indigo-50 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700 transition-all"
                                                />
                                                <div className="grid grid-cols-6 mt-4 text-[0.65rem] font-black text-slate-300 uppercase tracking-tighter">
                                                    <span className="text-left">4.0</span>
                                                    <span className="text-center">5.0</span>
                                                    <span className="text-center">6.0</span>
                                                    <span className="text-center">7.0</span>
                                                    <span className="text-center">8.0</span>
                                                    <span className="text-right">9.0</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleNext}
                                            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 group active:scale-[0.98]"
                                        >
                                            Next Milestone
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[0.65rem] font-bold uppercase tracking-wider mb-4">
                                                <Zap className="w-3 h-3" /> Step 02
                                            </div>
                                            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Current English Level</h3>
                                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                                We'll adjust the difficulty of tasks based on your current comfort level.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {levels.map((level) => (
                                                <button
                                                    key={level.id}
                                                    onClick={() => setEnglishLevel(level.id)}
                                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 group relative overflow-hidden ${englishLevel === level.id
                                                            ? `border-indigo-600 bg-indigo-50 ring-4 ring-indigo-500/10`
                                                            : `border-slate-100 hover:border-indigo-200 hover:bg-slate-50`
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-5 relative z-10">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${englishLevel === level.id ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-100 text-slate-400 group-hover:rotate-6'
                                                            }`}>
                                                            {level.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h4 className={`text-lg font-black ${englishLevel === level.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                                    {level.label}
                                                                </h4>
                                                                {englishLevel === level.id && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
                                                            </div>
                                                            <p className={`text-sm font-medium ${englishLevel === level.id ? 'text-indigo-600/70' : 'text-slate-400'}`}>
                                                                {level.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="px-8 py-6 rounded-[2rem] border-2 border-slate-100 font-black text-slate-400 hover:bg-slate-50 transition-all active:scale-[0.98]"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="flex-1 bg-indigo-600 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 group active:scale-[0.98]"
                                            >
                                                Finalize Strategy
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 87%; }
                }
                .animate-progress {
                    animation: progress 2s ease-out forwards;
                }
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #4f46e5;
                    border-radius: 50%;
                    border: 4px solid white;
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    background: #4338ca;
                }
            `}</style>
        </div>
    );
};
