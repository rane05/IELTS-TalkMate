import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    personality, isListening, isThinking, isSpeaking, examinerText, fluencyScore, fillerCount
}) => {
    const [blink, setBlink] = useState(false);
    const [waveHeights, setWaveHeights] = useState<number[]>(Array(9).fill(4));

    // Blinking effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, Math.random() * 3000 + 2000);
        return () => clearInterval(interval);
    }, []);

    // Waveform animation when speaking
    useEffect(() => {
        if (!isSpeaking) { setWaveHeights(Array(9).fill(4)); return; }
        const interval = setInterval(() => {
            setWaveHeights(Array(9).fill(0).map(() => Math.random() * 38 + 8));
        }, 120);
        return () => clearInterval(interval);
    }, [isSpeaking]);

    const eyeColor = isSpeaking ? '#6366f1' : isThinking ? '#f59e0b' : isListening ? '#10b981' : '#334155';
    const eyeGlow = isSpeaking ? '0 0 20px rgba(99,102,241,0.85)' : isThinking ? '0 0 20px rgba(245,158,11,0.85)' : isListening ? '0 0 20px rgba(16,185,129,0.85)' : 'none';
    const auraColor = isSpeaking ? 'rgba(99,102,241,0.25)' : isThinking ? 'rgba(245,158,11,0.18)' : isListening ? 'rgba(16,185,129,0.22)' : 'transparent';

    return (
        <div className="flex flex-col items-center space-y-8 w-full max-w-3xl mx-auto py-8" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>

            {/* ── Bot head container ── */}
            <div className="relative">
                {/* Platform glow shadow */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-indigo-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-indigo-400/35 rounded-full blur-md" />

                <motion.div
                    animate={{
                        y: isSpeaking ? -10 : isThinking ? 4 : 0,
                        rotate: isSpeaking ? -2 : isThinking ? 1.5 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                    className="relative w-64 h-72"
                >
                    {/* Aura glow */}
                    <motion.div
                        animate={{ scale: isSpeaking ? 1.12 : isListening ? 1.06 : 1, opacity: isSpeaking || isListening || isThinking ? 1 : 0.35 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 rounded-[4rem] blur-[80px]"
                        style={{ background: auraColor }}
                    />

                    {/* Ring around head when speaking */}
                    {isSpeaking && (
                        <motion.div
                            className="absolute inset-[-8px] rounded-[5rem] border-2 border-indigo-400/40"
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                        />
                    )}

                    {/* Head shell */}
                    <motion.div
                        animate={{ borderColor: isSpeaking ? '#818cf8' : isThinking ? '#fbbf24' : '#cbd5e1' }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full bg-gradient-to-b from-slate-200 to-slate-400 rounded-[5rem] border-4 p-8 shadow-2xl flex flex-col items-center justify-between"
                    >
                        {/* Metallic top reflection */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-t from-transparent to-white/40 rounded-[4rem] pointer-events-none" />

                        {/* Visor */}
                        <div className="w-full h-24 bg-slate-900 rounded-[2.5rem] border-2 border-slate-700/50 flex items-center justify-center gap-8 px-6 shadow-inner relative overflow-hidden">
                            {/* Scanning line */}
                            {(isListening || isThinking) && (
                                <motion.div
                                    className={`absolute h-px w-full ${isThinking ? 'bg-amber-400/30' : 'bg-emerald-400/30'}`}
                                    animate={{ y: [-40, 40, -40] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                            )}

                            {/* Eyes */}
                            <div className="flex gap-10 relative z-10">
                                {[0, 1].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ backgroundColor: eyeColor, boxShadow: eyeGlow }}
                                        transition={{ duration: 0.3 }}
                                        className="w-10 h-10 rounded-full relative flex items-center justify-center overflow-hidden"
                                    >
                                        {/* Blink eyelid */}
                                        <motion.div
                                            animate={{ height: blink ? '100%' : '0%' }}
                                            transition={{ duration: 0.1 }}
                                            className="w-full bg-slate-900 absolute left-0 top-0 z-20"
                                        />
                                        {/* Pupil */}
                                        <motion.div
                                            animate={{
                                                scale: isSpeaking ? 1.1 : 1,
                                                x: isThinking ? 2 : 0,
                                                y: isThinking ? -2 : 0,
                                            }}
                                            className="w-3 h-3 bg-white rounded-full opacity-60"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Waveform mouth */}
                        <div className="w-full flex items-center justify-center gap-1 h-16 relative">
                            {isThinking ? (
                                <div className="flex gap-2">
                                    {[0, 1, 2].map(n => (
                                        <motion.div
                                            key={n}
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: n * 0.18 }}
                                            className="w-2 h-2 bg-amber-400 rounded-full"
                                        />
                                    ))}
                                </div>
                            ) : (
                                Array.from({ length: 9 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: waveHeights[i] }}
                                        transition={{ duration: 0.1 }}
                                        className="w-2 rounded-full"
                                        style={{
                                            background: isSpeaking ? '#6366f1' : '#334155',
                                            boxShadow: isSpeaking ? '0 0 8px rgba(99,102,241,0.4)' : 'none',
                                            minHeight: 4,
                                        }}
                                    />
                                ))
                            )}
                        </div>

                        {/* Personality chip */}
                        <motion.div
                            animate={{ scale: isSpeaking ? 1.12 : 1, borderColor: isSpeaking ? '#818cf8' : '#475569' }}
                            className="absolute -bottom-4 bg-slate-800 text-indigo-300 text-[0.58rem] font-black px-4 py-1.5 rounded-xl border-2 shadow-xl flex items-center gap-2 uppercase tracking-[0.2em]"
                        >
                            <Cpu className="w-3 h-3" />
                            {personality} AI-X1
                        </motion.div>
                    </motion.div>

                    {/* HUD floating panels */}
                    <AnimatePresence>
                        {(isSpeaking || isThinking) && (
                            <motion.div
                                initial={{ opacity: 0, x: 18 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 18 }}
                                className="absolute -right-[5.5rem] top-10 flex flex-col gap-3"
                            >
                                <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <Activity className={`w-4 h-4 ${isSpeaking ? 'text-indigo-400' : 'text-emerald-400'}`} />
                                    <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: '80%' }}
                                            className={`h-full ${isSpeaking ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                                        />
                                    </div>
                                </div>
                                <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <Brain className={`w-4 h-4 ${isThinking ? 'text-amber-400' : 'text-violet-400'}`} />
                                    <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: isThinking ? ['60%', '100%', '60%'] : '60%' }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className={`h-full ${isThinking ? 'bg-amber-500' : 'bg-violet-500'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* ── Speech bubble + metrics ── */}
            <div className="w-full space-y-5">

                {/* Speech bubble */}
                <div className="relative group">
                    <motion.div
                        animate={{ opacity: isSpeaking ? 0.35 : 0.15 }}
                        className={`absolute -inset-1 rounded-[2.5rem] blur ${isSpeaking ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    />
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-xl border border-slate-100/80 min-h-[100px] flex items-center justify-center text-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={examinerText}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.35 }}
                                className="text-xl font-medium text-slate-700 leading-relaxed italic"
                            >
                                "{examinerText}"
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Live metric panels */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Fluency */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[0.58rem] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-amber-400" /> Fluency
                            </span>
                            <span className="text-xs font-black text-slate-200">{fluencyScore}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${fluencyScore}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Hesitation */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[0.58rem] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                <MessageSquare className="w-3 h-3 text-rose-400" /> Hesitation
                            </span>
                            <span className="text-xs font-black text-slate-200">{fillerCount} fillers</span>
                        </div>
                        <div className="flex gap-1.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ backgroundColor: i < fillerCount ? '#ef4444' : 'rgba(255,255,255,0.05)' }}
                                    transition={{ duration: 0.3 }}
                                    className="h-2 flex-1 rounded-full"
                                    style={{ boxShadow: i < fillerCount ? '0 0 8px rgba(239,68,68,0.5)' : 'none' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
