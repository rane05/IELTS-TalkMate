import React, { useEffect, useState } from 'react';
import { Mic, MicOff, MessageSquare, Sparkles, Zap, Cpu, Activity, Brain } from 'lucide-react';

interface VirtualExaminerProps {
    personality: string;
    isListening: boolean;
    isThinking: boolean;
    isSpeaking: boolean;
    examinerText: string;
    fluencyScore: number;
    fillerCount: number;
}

export const VirtualExaminer: React.FC<VirtualExaminerProps> = ({
    personality,
    isListening,
    isThinking,
    isSpeaking,
    examinerText,
    fluencyScore,
    fillerCount
}) => {
    const [blink, setBlink] = useState(false);

    // Random blinking effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, Math.random() * 3000 + 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center space-y-10 w-full max-w-3xl mx-auto py-10">
            {/* The Robo-Examiner Container */}
            <div className="relative">
                {/* Holographic Platform Base */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-indigo-500/20 rounded-[100%] blur-xl animate-pulse" />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-indigo-500/40 rounded-[100%] blur-md" />

                {/* Main Robo Head */}
                <div className={`relative w-64 h-72 transition-all duration-700 ease-in-out ${isSpeaking ? 'translate-y-[-10px] rotate-[-2deg]' :
                    isThinking ? 'translate-y-[5px] rotate-[2deg]' : 'translate-y-0'
                    }`}>

                    {/* Glowing Aura */}
                    <div className={`absolute inset-0 rounded-[4rem] blur-[80px] transition-all duration-1000 ${isSpeaking ? 'bg-indigo-500/30 opacity-100 scale-110' :
                        isThinking ? 'bg-amber-500/20 opacity-100 scale-95' :
                            isListening ? 'bg-emerald-500/30 opacity-100 scale-105' : 'bg-slate-500/10 opacity-50'
                        }`} />

                    {/* The Head Shell */}
                    <div className={`relative w-full h-full bg-gradient-to-b from-slate-200 to-slate-400 rounded-[5rem] border-4 p-8 shadow-2xl flex flex-col items-center justify-between transition-all duration-500 ${isSpeaking ? 'border-indigo-400 shadow-indigo-500/20' :
                        isThinking ? 'border-amber-400/50' : 'border-slate-300'
                        }`}>
                        {/* Metallic Top Reflection */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-t from-transparent to-white/40 rounded-[4rem] pointer-events-none" />

                        {/* Visor Area */}
                        <div className="w-full h-24 bg-slate-900 rounded-[2.5rem] border-2 border-slate-700/50 flex items-center justify-center gap-8 px-6 shadow-inner relative overflow-hidden">
                            {/* Scanning Line (only when thinking/listening) */}
                            {(isListening || isThinking) && (
                                <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isThinking ? 'via-amber-500/20' : 'via-emerald-500/20'} to-transparent h-1/2 w-full animate-[scan_1.5s_infinite]`} />
                            )}

                            {/* Eyes */}
                            <div className="flex gap-10 relative z-10">
                                {[0, 1].map((i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full transition-all duration-300 relative flex items-center justify-center overflow-hidden ${isSpeaking ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]' :
                                        isThinking ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]' :
                                            isListening ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'bg-slate-700'
                                        }`}>
                                        {/* Eyelid (Blink) */}
                                        <div className={`w-full bg-slate-900 absolute left-0 z-20 transition-all duration-150 ${blink ? 'h-full top-0' : 'h-0 top-0'}`} />

                                        {/* Pupil / Expression */}
                                        <div className={`w-3 h-3 bg-white rounded-full opacity-60 transition-transform duration-500 ${isSpeaking ? 'scale-110' :
                                            isThinking ? 'translate-y-[-2px] translate-x-[2px]' : ''
                                            }`} />

                                        {/* Expressive Overlay (V-shape eyes for happy/speaking) */}
                                        {isSpeaking && (
                                            <div className="absolute inset-0 border-[6px] border-indigo-500 rounded-full scale-125" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audio Waveform Mouth */}
                        <div className="w-full flex items-center justify-center gap-1.5 h-16 relative">
                            {isThinking && (
                                <div className="absolute inset-x-0 flex justify-center">
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map(n => (
                                            <div key={n} className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: `${n * 0.2}s` }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!isThinking && Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 rounded-full transition-all duration-150 ${isSpeaking ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-700 h-2'
                                        }`}
                                    style={{
                                        height: isSpeaking ? `${Math.random() * 40 + 15}px` : '4px',
                                        transitionDelay: `${i * 0.05}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Personality Logic Chip */}
                        <div className={`absolute -bottom-4 bg-slate-800 text-indigo-300 text-[0.6rem] font-black px-4 py-2 rounded-xl border-2 border-slate-600 shadow-xl flex items-center gap-2 uppercase tracking-[0.2em] transition-all ${isSpeaking ? 'scale-110 border-indigo-500' : ''}`}>
                            <Cpu className="w-3 h-3" />
                            {personality} AI-X1
                        </div>
                    </div>

                    {/* Hovering HUD Elements */}
                    <div className={`absolute -right-20 top-10 flex flex-col gap-4 transition-all duration-1000 ${isSpeaking || isThinking ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                            <Activity className={`w-4 h-4 ${isSpeaking ? 'text-indigo-400' : 'text-emerald-400'}`} />
                            <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${isSpeaking ? 'bg-indigo-500' : 'bg-emerald-500'} w-[80%] animate-pulse`} />
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                            <Brain className={`w-4 h-4 ${isThinking ? 'text-amber-400' : 'text-violet-400'}`} />
                            <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${isThinking ? 'bg-amber-500 animate-[pulse_1s_infinite]' : 'bg-violet-500'} w-[60%]`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transcription / Interaction Block */}
            <div className="w-full space-y-6">
                {/* Speech Bubble Refined */}
                <div className="relative group">
                    <div className={`absolute -inset-1 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 ${isSpeaking ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                    <div className="relative bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 min-h-[120px] flex items-center justify-center text-center">
                        <p className="text-xl font-medium text-slate-700 leading-relaxed italic">
                            "{examinerText}"
                        </p>
                    </div>
                </div>

                {/* Predictive Metrices Display */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-amber-400" /> Fluency Confidence
                            </span>
                            <span className="text-xs font-bold text-slate-300">{fluencyScore}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-1000" style={{ width: `${fluencyScore}%` }} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                <MessageSquare className="w-3 h-3 text-red-400" /> Hesitation Index
                            </span>
                            <span className="text-xs font-bold text-slate-300">{fillerCount} Detected</span>
                        </div>
                        <div className="flex gap-1.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className={`h-2 flex-1 rounded-full ${i < fillerCount ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-white/5'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
                @keyframes brain-slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-slide {
                    animation: brain-slide 2s linear infinite;
                }
            `}</style>
        </div>
    );
};
