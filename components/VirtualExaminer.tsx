import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Zap, Cpu, Activity, Brain, Sparkles, Heart, Target, Disc, Radio, ShieldCheck, Terminal, Fingerprint, Layers } from 'lucide-react';

interface VirtualExaminerProps {
    personality: string;
    isListening: boolean;
    isThinking: boolean;
    isSpeaking: boolean;
    examinerText: string;
    fluencyScore: number;
    fillerCount: number;
    targetBand?: number;
    gesture?: 'greet' | 'wave' | 'none';
}

export const VirtualExaminer: React.FC<VirtualExaminerProps> = ({
    personality,
    isListening,
    isThinking,
    isSpeaking,
    examinerText,
    fluencyScore,
    fillerCount,
    targetBand,
    gesture = 'none'
}) => {
    const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
    const [mouthScale, setMouthScale] = useState(0.2);
    const [blink, setBlink] = useState(false);
    const mouthIntervalRef = useRef<any>(null);

    // Advanced Eye & Blink Simulation
    useEffect(() => {
        const moveEyes = () => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 3;
            setEyePos({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            });
        };

        const handleBlink = () => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        };

        const eyeInt = setInterval(() => {
            if (Math.random() > 0.6) moveEyes();
        }, 1200);

        const blinkInt = setInterval(() => {
            if (Math.random() > 0.8) handleBlink();
        }, 3000);

        return () => {
            clearInterval(eyeInt);
            clearInterval(blinkInt);
        };
    }, []);

    // Precision Mouth Animation
    useEffect(() => {
        if (isSpeaking) {
            mouthIntervalRef.current = setInterval(() => {
                setMouthScale(0.3 + Math.random() * 0.9);
            }, 70);
        } else {
            if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
            setMouthScale(0.15);
        }
        return () => clearInterval(mouthIntervalRef.current);
    }, [isSpeaking]);

    return (
        <div className="flex flex-col items-center space-y-16 w-full max-w-6xl mx-auto py-16">

            {/* The Professional AI Nexus */}
            <div className="relative group">

                {/* Orbital Background Rings */}
                <div className="absolute inset-[-60px] border border-indigo-500/10 rounded-full animate-spin-slow opacity-20" />
                <div className="absolute inset-[-100px] border border-slate-500/5 rounded-full animate-spin-reverse opacity-10" />

                {/* Reactive Kinetic Aura */}
                <div className={`absolute -inset-28 rounded-full blur-[140px] transition-all duration-1000 ${isSpeaking ? 'bg-indigo-600/25 scale-125' :
                    isThinking ? 'bg-amber-500/15 scale-110' :
                        isListening ? 'bg-emerald-600/20 scale-115' :
                            'bg-slate-500/5'
                    }`} />

                {/* Character Main Chassis */}
                <div className={`relative w-80 h-80 md:w-[26rem] md:h-[26rem] transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) ${isSpeaking ? 'translate-y-[-10px]' :
                    isThinking ? 'scale-98' :
                        'animate-float-refined'
                    }`}>

                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_45px_80px_rgba(0,0,0,0.15)] overflow-visible">
                        <defs>
                            <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f8fafc" />
                                <stop offset="50%" stopColor="#cbd5e1" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                            <linearGradient id="innerFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0f172a" />
                                <stop offset="100%" stopColor="#1e293b" />
                            </linearGradient>
                            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </radialGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="1.5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* ARMS / HANDS GESTURES LAYER */}
                        <g className="gestures">
                            {/* Left Arm/Hand */}
                            <g className={`transition-all duration-700 origin-[40px_180px] ${gesture === 'greet' ? 'animate-greet-left' : gesture === 'wave' ? 'animate-wave-left' : 'opacity-0'}`}>
                                <path d="M40 180 L20 140 Q15 130 25 125 L35 130" fill="none" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
                                <circle cx="35" cy="130" r="10" fill="url(#chromeGradient)" />
                                <path d="M35 125 Q45 115 35 105" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                            </g>

                            {/* Right Arm/Hand */}
                            <g className={`transition-all duration-700 origin-[160px_180px] ${gesture === 'greet' ? 'animate-greet-right' : gesture === 'wave' ? 'animate-wave-right' : 'opacity-0'}`}>
                                <path d="M160 180 L180 140 Q185 130 175 125 L165 130" fill="none" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
                                <circle cx="165" cy="130" r="10" fill="url(#chromeGradient)" />
                                <path d="M165 125 Q155 115 165 105" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                            </g>
                        </g>

                        {/* Shoulders / Torso Bridge */}
                        <path
                            d="M30 195 Q100 165 170 195 L170 200 L30 200 Z"
                            fill="#0f172a"
                            className="transition-all duration-700"
                        />
                        <path
                            d="M35 190 Q100 160 165 190"
                            fill="none"
                            stroke="rgba(99,102,241,0.2)"
                            strokeWidth="1"
                        />

                        {/* Sleek Humanoid Head Shell */}
                        <path
                            d="M60 45 Q100 25 140 45 L145 130 Q100 160 55 130 Z"
                            fill="url(#chromeGradient)"
                            stroke="#ffffff"
                            strokeWidth="0.5"
                        />

                        {/* Metallic Side Panels (Sensors) */}
                        <path d="M55 70 Q45 90 55 110" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                        <path d="M145 70 Q155 90 145 110" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

                        {/* Internal Face Plate */}
                        <path
                            d="M72 65 Q100 58 128 65 L132 120 Q100 135 68 120 Z"
                            fill="url(#innerFaceGrad)"
                            className="opacity-95"
                        />

                        {/* The Eyes: Advanced Orbital Sensors */}
                        <g transform={`translate(${eyePos.x}, ${eyePos.y})`} filter="url(#glow)">
                            {/* Left Eye */}
                            <g transform="translate(85, 90)">
                                <circle r="12" fill="rgba(15, 23, 42, 0.8)" />
                                {blink ? (
                                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#6366f1" strokeWidth="2" />
                                ) : (
                                    <>
                                        <circle r="6" fill="#1e293b" stroke="#6366f1" strokeWidth="0.5" />
                                        <circle r="3" fill="#6366f1" className={isListening ? 'animate-pulse' : ''} />
                                        <circle cx="-1.5" cy="-1.5" r="1" fill="#fff" />
                                        <circle r="8" fill="url(#eyeGlow)" className="opacity-40" />
                                    </>
                                )}
                            </g>

                            {/* Right Eye */}
                            <g transform="translate(115, 90)">
                                <circle r="12" fill="rgba(15, 23, 42, 0.8)" />
                                {blink ? (
                                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#6366f1" strokeWidth="2" />
                                ) : (
                                    <>
                                        <circle r="6" fill="#1e293b" stroke="#6366f1" strokeWidth="0.5" />
                                        <circle r="3" fill="#6366f1" className={isListening ? 'animate-pulse' : ''} />
                                        <circle cx="-1.5" cy="-1.5" r="1" fill="#fff" />
                                        <circle r="8" fill="url(#eyeGlow)" className="opacity-40" />
                                    </>
                                )}
                            </g>
                        </g>

                        {/* Mouth: Haptic Kinetic Line */}
                        <g transform={`translate(100, 128) scale(1, ${mouthScale})`}>
                            <path
                                d="M-18 0 Q0 6 18 0"
                                fill="none"
                                stroke={isSpeaking ? "#818cf8" : "#334155"}
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="transition-colors duration-300"
                            />
                            {isSpeaking && (
                                <path
                                    d="M-12 2 Q0 8 12 2"
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="1"
                                    className="opacity-50"
                                />
                            )}
                        </g>

                        {/* Forehead Logic Core */}
                        <rect x="94" y="52" width="12" height="4" rx="2" fill={isThinking ? "#fbbf24" : "#1e293b"} className="transition-colors duration-500" />
                        <circle cx="100" cy="54" r="1.5" fill={isThinking ? "#fff" : "#6366f1"} className="animate-pulse" />
                    </svg>

                    {/* Matrix Processing Overlay */}
                    {isThinking && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-40">
                            <div className="w-[60%] h-[40%] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#6366f1_3px,#6366f1_4px)] animate-scan-matrix" />
                        </div>
                    )}
                </div>

                {/* Left Control Column */}
                <div className="absolute -left-20 top-12 flex flex-col gap-6">
                    <div className={`group/icon p-5 bg-white/10 backdrop-blur-3xl rounded-[1.5rem] border border-white/20 shadow-2xl transition-all duration-700 ${isListening ? 'border-emerald-500/50 scale-110' : 'opacity-40'}`}>
                        <Radio className={`w-6 h-6 ${isListening ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                        <span className="absolute left-16 bottom-1/2 translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-[0.5rem] font-black rounded-lg opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Input Hook</span>
                    </div>
                    <div className={`group/icon p-5 bg-white/10 backdrop-blur-3xl rounded-[1.5rem] border border-white/20 shadow-2xl transition-all duration-700 ${isThinking ? 'border-amber-500/50 scale-110' : 'opacity-40'}`}>
                        <Cpu className={`w-6 h-6 ${isThinking ? 'text-amber-400 animate-spin-slow' : 'text-slate-400'}`} />
                        <span className="absolute left-16 bottom-1/2 translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-[0.5rem] font-black rounded-lg opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Synaptic Sync</span>
                    </div>
                </div>

                {/* Right Control Column */}
                <div className="absolute -right-20 top-12 flex flex-col gap-6">
                    <div className={`group/icon p-5 bg-white/10 backdrop-blur-3xl rounded-[1.5rem] border border-white/20 shadow-2xl transition-all duration-700 ${isSpeaking ? 'border-indigo-500/50 scale-110' : 'opacity-40'}`}>
                        <Terminal className={`w-6 h-6 ${isSpeaking ? 'text-indigo-400 animate-bounce' : 'text-slate-400'}`} />
                        <span className="absolute right-16 bottom-1/2 translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-[0.5rem] font-black rounded-lg opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Voice Buffer</span>
                    </div>
                    <div className="group/icon p-5 bg-white/10 backdrop-blur-3xl rounded-[1.5rem] border border-white/20 shadow-2xl opacity-40">
                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                        <span className="absolute right-16 bottom-1/2 translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-[0.5rem] font-black rounded-lg opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Protocol Safe</span>
                    </div>
                </div>

                {/* Professional Identity Hologram */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 group-hover:scale-105 transition-all duration-500">
                    <div className="relative p-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent rounded-[2rem]">
                        <div className="relative bg-slate-950/90 backdrop-blur-3xl px-12 py-4 rounded-[2rem] border border-white/5 shadow-3xl flex items-center gap-6">
                            <div className="relative">
                                <Fingerprint className="w-8 h-8 text-indigo-500/50" />
                                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[0.6rem] font-black text-indigo-400 uppercase tracking-[0.4em]">Expert System</span>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                                </div>
                                <span className="text-sm font-black text-white tracking-[0.2em] uppercase">PROF. AETHERA v3.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Communication Bridge */}
            <div className={`w-full transition-all duration-1000 max-w-5xl ${isSpeaking || isListening ? 'scale-100 opacity-100' : 'scale-95 opacity-60'}`}>
                <div className="relative">
                    {/* Multi-layered Glass Card */}
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-[4rem] blur-2xl" />
                    <div className="relative bg-white/30 backdrop-blur-[60px] border-2 border-white/80 rounded-[4rem] p-12 md:p-16 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">

                        {/* Interactive UI Decorations */}
                        <div className="absolute top-10 left-10 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <div className="w-2 h-2 rounded-full bg-slate-100" />
                        </div>
                        <Layers className="absolute -bottom-10 -right-10 w-48 h-48 text-indigo-500/5" />

                        <p className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.1] tracking-tight italic text-center max-w-4xl selection:bg-indigo-500 selection:text-white">
                            "{examinerText}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Precision Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full px-4">
                {/* Metric Alpha */}
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/70 shadow-2xl group/card hover:translate-y-[-8px] transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-600/20 group-hover/card:scale-110 transition-transform">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Vector Clarity</h4>
                                <h3 className="text-xl font-black text-slate-900">Bio-Metric Fluency</h3>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-4xl font-black text-indigo-600">{fluencyScore}%</span>
                            <span className="text-[0.55rem] font-bold text-emerald-500 uppercase tracking-widest">Optimal Range</span>
                        </div>
                    </div>
                    <div className="relative h-4 bg-slate-100/50 rounded-full overflow-hidden border border-white/50">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                            style={{ width: `${fluencyScore}%` }}
                        />
                    </div>
                </div>

                {/* Metric Beta */}
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/70 shadow-2xl group/card hover:translate-y-[-8px] transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-rose-600 text-white rounded-[1.5rem] shadow-lg shadow-rose-600/20 group-hover/card:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Processing Laps</h4>
                                <h3 className="text-xl font-black text-slate-900">Hesitation Profile</h3>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-4xl font-black text-rose-600">{fillerCount}</span>
                            <span className="text-[0.55rem] font-bold text-rose-400 uppercase tracking-widest">Instance Detected</span>
                        </div>
                    </div>
                    <div className="flex gap-2.5">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-4 flex-1 rounded-full transition-all duration-500 ${i < fillerCount ? 'bg-rose-500 shadow-lg shadow-rose-500/30' : 'bg-slate-200/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Tactical Goal Integration */}
            {targetBand && (
                <div className="w-full bg-slate-950 rounded-[4rem] p-10 md:p-12 border border-white/10 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[160px] -mr-[20rem] -mt-[20rem]" />
                    <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-900/10 rounded-full blur-[120px] -ml-[15rem] -mb-[15rem]" />

                    <div className="flex items-center gap-10 relative z-10">
                        <div className="relative group/hex">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 scale-150 rotate-45 group-hover/hex:rotate-90 transition-transform duration-1000" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-800 rounded-[2rem] flex items-center justify-center shadow-2xl border-2 border-white/10 group-hover/hex:rotate-6 transition-transform">
                                <Target className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-[0.7rem] font-black text-indigo-400 uppercase tracking-[0.5em]">Candidate Roadmap</span>
                                <div className="h-px w-24 bg-indigo-500/30" />
                            </div>
                            <h3 className="text-5xl font-black text-white tracking-tighter">Targeting Band {targetBand}</h3>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-5 relative z-10 w-full md:w-auto">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="relative h-3 w-64 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                    style={{ width: `${Math.min(100, (fluencyScore / 9) * 110)}%` }}
                                />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest whitespace-nowrap">Readiness Vector</span>
                        </div>
                        <p className="text-[0.7rem] font-bold text-slate-500 italic uppercase tracking-[0.3em] max-w-sm text-center md:text-right leading-relaxed">Evaluation protocols automatically calibrated for Band {targetBand}+ excellence.</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes float-refined {
                    0%, 100% { transform: translateY(0) rotate(0) scale(1.0); }
                    33% { transform: translateY(-15px) rotate(0.8deg) scale(1.01); }
                    66% { transform: translateY(-8px) rotate(-0.5deg) scale(0.99); }
                }
                @keyframes scan-matrix {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes wave-left {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-20deg); }
                    75% { transform: rotate(20deg); }
                }
                @keyframes wave-right {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(20deg); }
                    75% { transform: rotate(-20deg); }
                }
                @keyframes greet-left {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(-15deg); }
                }
                @keyframes greet-right {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(15deg); }
                }
                .animate-wave-left { animation: wave-left 2s ease-in-out infinite; }
                .animate-wave-right { animation: wave-right 2s ease-in-out infinite; }
                .animate-greet-left { animation: greet-left 3s ease-in-out infinite; }
                .animate-greet-right { animation: greet-right 3s ease-in-out infinite; }
                .animate-float-refined {
                    animation: float-refined 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .animate-scan-matrix {
                    animation: scan-matrix 4s linear infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 25s linear infinite;
                }
                svg {
                    overflow: visible;
                }
            `}</style>
        </div>
    );
};
