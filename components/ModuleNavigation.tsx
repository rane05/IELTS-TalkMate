import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
    Mic, BookOpen, PenTool, Headphones, Trophy, BookMarked,
    BarChart3, ArrowUpRight, Sparkles, Flame, Award, TrendingUp,
    CheckCircle2, Zap, Target, Star, Activity
} from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
    AreaChart, Area, XAxis
} from 'recharts';
import { SessionStats } from '../types';

export type ModuleName = 'speaking' | 'reading' | 'writing' | 'listening' | 'vocabulary' | 'mocktest' | 'resources' | 'analytics';

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR REACTIVE BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const CursorBlob: React.FC = () => {
    const mx = useMotionValue(0.5); const my = useMotionValue(0.5);
    const sx = useSpring(mx, { stiffness: 40, damping: 30 });
    const sy = useSpring(my, { stiffness: 40, damping: 30 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mx.set(e.clientX / window.innerWidth);
            my.set(e.clientY / window.innerHeight);
        };
        window.addEventListener('mousemove', move, { passive: true });
        return () => window.removeEventListener('mousemove', move);
    }, []);

    const x = useTransform(sx, v => `${v * 100}%`);
    const y = useTransform(sy, v => `${v * 100}%`);

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                background: 'radial-gradient(600px circle at var(--cx) var(--cy), rgba(99,102,241,0.06) 0%, transparent 60%)'
            }}
            animate={{}} // drives re-render
        >
            <motion.div
                className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2"
                style={{
                    top: y, left: x,
                    background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING PARTICLES
// ─────────────────────────────────────────────────────────────────────────────
const ParticleNetwork: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: 0, y: 0, radius: 150 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = window.innerWidth < 768 ? 40 : 80;
        const connectionDistance = 150;

        class Particle {
            x: number; y: number; vx: number; vy: number; size: number;
            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // Slower, smoother movement
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                // Movement
                this.x += this.vx;
                this.y += this.vy;

                // Bounce
                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

                // Mouse Repulsion
                const dx = mouse.current.x - this.x;
                const dy = mouse.current.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.current.radius) {
                    const forceDirectionX = dx / dist;
                    const forceDirectionY = dy / dist;
                    const force = (mouse.current.radius - dist) / mouse.current.radius;
                    const directionX = forceDirectionX * force * 3;
                    const directionY = forceDirectionY * force * 3;
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = 'rgba(99, 102, 241, 0.4)';
                ctx!.fill();
            }
        }

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw lines
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED SVG RING
// ─────────────────────────────────────────────────────────────────────────────
const Ring: React.FC<{ score: number; r?: number; stroke?: number; color?: string }> = ({
    score, r = 54, stroke = 8, color = 'url(#mainRingGrad)'
}) => {
    const c = 2 * Math.PI * r;
    return (
        <svg width={r * 2 + stroke * 2 + 4} height={r * 2 + stroke * 2 + 4}
            viewBox={`0 0 ${r * 2 + stroke * 2 + 4} ${r * 2 + stroke * 2 + 4}`}
            className="rotate-[-90deg]">
            <circle cx={r + stroke / 2 + 2} cy={r + stroke / 2 + 2} r={r}
                stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
            <motion.circle cx={r + stroke / 2 + 2} cy={r + stroke / 2 + 2} r={r}
                stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: c - (score / 100) * c }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            />
            <defs>
                <linearGradient id="mainRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#6366f1" />
                    <stop offset="50%"  stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="miniRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"  stopColor="#10b981" />
                    <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
            </defs>
        </svg>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const MagneticBtn: React.FC<{
    children: React.ReactNode; onClick?: () => void;
    className?: string; strength?: number;
}> = ({ children, onClick, className = '', strength = 0.35 }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const bx = useMotionValue(0); const by = useMotionValue(0);
    const sx = useSpring(bx, { stiffness: 250, damping: 18 });
    const sy = useSpring(by, { stiffness: 250, damping: 18 });

    const move = (e: React.MouseEvent) => {
        const r = ref.current!.getBoundingClientRect();
        bx.set((e.clientX - r.left - r.width  / 2) * strength);
        by.set((e.clientY - r.top  - r.height / 2) * strength);
    };
    const leave = () => { bx.set(0); by.set(0); };

    return (
        <motion.button ref={ref} onClick={onClick} onMouseMove={move} onMouseLeave={leave}
            style={{ x: sx, y: sy }} whileTap={{ scale: 0.96 }}
            className={`relative overflow-hidden ${className}`}
        >
            {children}
        </motion.button>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// PER-MODULE VISUAL ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────

// Waveform: Speaking
const WaveformVisual: React.FC<{ accent: string }> = ({ accent }) => (
    <div className="flex items-center gap-[3px] h-8">
        {[0.4, 0.7, 1, 0.85, 0.55, 0.9, 0.65, 0.45, 0.8].map((h, i) => (
            <motion.div key={i}
                className="w-1.5 rounded-full"
                style={{ background: accent }}
                animate={{ scaleY: [h, h * 0.4 + 0.1, h] }}
                transition={{ duration: 0.9 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }}
                initial={{ scaleY: h, height: 32 }}
            />
        ))}
    </div>
);

// Progress bar: Reading
const ProgressVisual: React.FC<{ value: number; accent: string; bg: string }> = ({ value, accent, bg }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between">
            <span className="text-[0.56rem] font-black uppercase tracking-widest" style={{ color: accent }}>Accuracy</span>
            <span className="text-[0.6rem] font-black" style={{ color: accent }}>{Math.round((value / 9) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: bg }}>
            <motion.div className="h-full rounded-full" style={{ background: accent }}
                initial={{ width: 0 }} animate={{ width: `${(value / 9) * 100}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} />
        </div>
    </div>
);

// Score arc: Writing (mini SVG arc)
const ScoreArcVisual: React.FC<{ value: number; accent: string }> = ({ value, accent }) => {
    const r = 22; const c = 2 * Math.PI * r;
    const pct = value / 9;
    return (
        <div className="flex items-center gap-3">
            <svg width="54" height="54" viewBox="0 0 54 54" className="rotate-[-90deg]">
                <circle cx="27" cy="27" r={r} stroke="rgba(0,0,0,0.06)" strokeWidth="5" fill="none" />
                <motion.circle cx="27" cy="27" r={r} stroke={accent} strokeWidth="5" fill="none"
                    strokeLinecap="round" strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: c - pct * c }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} />
            </svg>
            <div>
                <p className="text-[0.56rem] font-black uppercase tracking-widest opacity-50">Avg Band</p>
                <p className="text-lg font-black leading-none" style={{ color: accent }}>{value}</p>
            </div>
        </div>
    );
};

// EQ bars: Listening
const EQVisual: React.FC<{ accent: string }> = ({ accent }) => (
    <div className="flex items-end gap-[3px] h-7">
        {[5, 14, 22, 18, 28, 12, 20, 8, 16, 24].map((h, i) => (
            <motion.div key={i}
                className="w-1.5 rounded-sm"
                style={{ background: accent, height: h }}
                animate={{ height: [h, Math.max(4, h * 0.3), h] }}
                transition={{ duration: 0.7 + i * 0.06, repeat: Infinity, ease: 'easeInOut', delay: i * 0.06 }}
            />
        ))}
    </div>
);

// Flashcard stack: Vocabulary
const FlashcardVisual: React.FC<{ count?: number; accent: string }> = ({ count = 0, accent }) => (
    <div className="relative h-9 w-20">
        {[2, 1, 0].map(z => (
            <div key={z} className="absolute inset-0 rounded-lg border"
                style={{
                    background: z === 0 ? `${accent}18` : 'rgba(255,255,255,0.6)',
                    borderColor: z === 0 ? `${accent}40` : 'rgba(0,0,0,0.06)',
                    transform: `rotate(${(z - 1) * 4}deg) translateY(${(2 - z) * -2}px)`,
                    zIndex: z
                }}
            />
        ))}
        {count > 0 && (
            <span className="absolute inset-0 flex items-center justify-center text-[0.62rem] font-black z-10" style={{ color: accent }}>
                {count} words
            </span>
        )}
    </div>
);

// Exam checklist: Mock Tests
const ExamVisual: React.FC<{ accent: string }> = ({ accent }) => (
    <div className="space-y-1.5">
        {['Listening', 'Reading', 'Writing', 'Speaking'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
                <motion.div className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: i < 3 ? accent : 'rgba(0,0,0,0.12)', background: i < 3 ? accent : 'transparent' }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                >
                    {i < 3 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </motion.div>
                <span className="text-[0.6rem] font-bold" style={{ color: i < 3 ? accent : '#94a3b8' }}>{s}</span>
            </div>
        ))}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BENTO MODULE CARD
// ─────────────────────────────────────────────────────────────────────────────
interface ModuleCardProps {
    name: ModuleName; title: string; description: string; icon: React.ReactNode;
    color: string; gradient: string; onClick: () => void;
    stats?: { label: string; value: string | number };
    isNew?: boolean; delay?: number; size?: 'large' | 'medium' | 'compact';
    // Bento extras (all optional, non-breaking)
    accent?: string;      // hex accent color per module
    accentBg?: string;    // light bg tint
    vocabCount?: number;  // for vocabulary card
}

const MODULE_VISUALS: Record<ModuleName, { accent: string; accentBg: string; hoverShadow: string }> = {
    speaking:   { accent: '#3b82f6', accentBg: 'rgba(59,130,246,0.07)',  hoverShadow: '0 20px 60px rgba(59,130,246,0.14)'  },
    reading:    { accent: '#8b5cf6', accentBg: 'rgba(139,92,246,0.07)', hoverShadow: '0 20px 60px rgba(139,92,246,0.14)' },
    writing:    { accent: '#ec4899', accentBg: 'rgba(236,72,153,0.07)', hoverShadow: '0 20px 60px rgba(236,72,153,0.14)' },
    listening:  { accent: '#10b981', accentBg: 'rgba(16,185,129,0.07)', hoverShadow: '0 20px 60px rgba(16,185,129,0.14)' },
    vocabulary: { accent: '#f59e0b', accentBg: 'rgba(245,158,11,0.07)', hoverShadow: '0 20px 60px rgba(245,158,11,0.14)' },
    mocktest:   { accent: '#ef4444', accentBg: 'rgba(239,68,68,0.07)',  hoverShadow: '0 20px 60px rgba(239,68,68,0.14)'  },
    resources:  { accent: '#06b6d4', accentBg: 'rgba(6,182,212,0.07)',  hoverShadow: '0 20px 60px rgba(6,182,212,0.14)'  },
    analytics:  { accent: '#4f46e5', accentBg: 'rgba(79,70,229,0.07)',  hoverShadow: '0 20px 60px rgba(79,70,229,0.14)'  },
};

export const ModuleCard: React.FC<ModuleCardProps> = ({
    name, title, description, icon, gradient, onClick, stats, isNew, delay = 0, size = 'medium', vocabCount
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const mx = useMotionValue(0); const my = useMotionValue(0);
    const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 280, damping: 28 });
    const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 280, damping: 28 });

    const { accent, accentBg, hoverShadow } = MODULE_VISUALS[name];

    const move = (e: React.MouseEvent<HTMLDivElement>) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top)  / r.height - 0.5);
    };

    const isLarge   = size === 'large';
    const isCompact = size === 'compact';

    // Per-module inline visual
    const InlineVisual = () => {
        if (name === 'speaking')   return <WaveformVisual accent={accent} />;
        if (name === 'reading')    return <ProgressVisual value={Number(stats?.value ?? 6)} accent={accent} bg={accentBg} />;
        if (name === 'writing')    return <ScoreArcVisual value={Number(stats?.value ?? 6)} accent={accent} />;
        if (name === 'listening')  return <EQVisual accent={accent} />;
        if (name === 'vocabulary') return <FlashcardVisual count={vocabCount} accent={accent} />;
        if (name === 'mocktest')   return <ExamVisual accent={accent} />;
        return null;
    };

    const hasVisual = ['speaking','reading','writing','listening','vocabulary','mocktest'].includes(name);

    return (
        <motion.div
            ref={ref} onClick={onClick}
            onMouseMove={move}
            onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false); }}
            onMouseEnter={() => setHovered(true)}
            initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{
                rotateX: rx, rotateY: ry,
                transformStyle: 'preserve-3d', perspective: '900px',
                boxShadow: hovered ? hoverShadow : '0 2px 14px rgba(0,0,0,0.04)',
            }}
            whileHover={{ y: -7, scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative bg-white/70 backdrop-blur-2xl rounded-2xl border cursor-pointer overflow-hidden flex flex-col transition-all duration-500 h-full ${
                hovered ? 'border-transparent' : 'border-white/70'
            }`}
        >
            {/* Accent tint overlay on hover */}
            <div className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                style={{ background: accentBg, opacity: hovered ? 1 : 0 }} />

            {/* Accent glow border on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 transition-opacity duration-300 pointer-events-none"
                style={{ borderColor: accent, opacity: hovered ? 0.35 : 0 }} />

            {/* Inner top highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            <div className={`relative z-10 flex flex-col flex-1 ${isLarge ? 'p-7' : isCompact ? 'p-5' : 'p-6'}`}>

                {/* ── TOP: Icon + Badge ── */}
                <div className="flex items-start justify-between mb-5">
                    <motion.div
                        whileHover={{ scale: 1.18, rotate: 8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                        className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg flex items-center justify-center ${isLarge ? 'p-4' : 'p-3'}`}
                        style={{ boxShadow: hovered ? `0 8px 24px ${accent}30` : undefined }}
                    >
                        {React.cloneElement(icon as React.ReactElement, {
                            className: `${isLarge ? 'w-6 h-6' : 'w-5 h-5'} text-white`
                        })}
                    </motion.div>

                    {isNew && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: delay + 0.3 }}
                            className="flex items-center gap-1 text-[0.56rem] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest"
                            style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}
                        >
                            <Sparkles className="w-2.5 h-2.5" /> New
                        </motion.span>
                    )}
                </div>

                {/* ── MIDDLE: Title + Description + Visual ── */}
                <div className="flex-1 space-y-2">
                    <h3 className={`font-black text-slate-900 tracking-tight leading-snug transition-colors duration-300 ${isLarge ? 'text-xl' : isCompact ? 'text-base' : 'text-lg'}`}
                        style={{ color: hovered ? accent : undefined, fontFamily: 'Outfit, sans-serif' }}
                    >
                        {title}
                    </h3>

                    {!isCompact && (
                        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                    )}

                    {/* Per-module visual cue */}
                    {hasVisual && (
                        <div className={`${isCompact ? 'mt-2' : 'mt-4'}`}>
                            <InlineVisual />
                        </div>
                    )}
                </div>

                {/* ── BOTTOM: Metric + Arrow ── */}
                <div className="mt-auto pt-4 flex items-end justify-between border-t border-black/[0.04] mt-4">
                    {stats ? (
                        <div>
                            <p className="text-[0.54rem] font-black uppercase tracking-widest text-slate-400 leading-none">{stats.label}</p>
                            <p className="text-xl font-black leading-tight mt-0.5" style={{ color: accent }}>
                                {stats.value}
                            </p>
                        </div>
                    ) : (
                        <p className="text-[0.58rem] font-black uppercase tracking-widest text-slate-400">Explore</p>
                    )}

                    <motion.div
                        animate={{ x: hovered ? 2 : 0, y: hovered ? -2 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300"
                        style={{
                            borderColor: hovered ? accent : 'rgba(0,0,0,0.1)',
                            background: hovered ? accent : 'transparent',
                            color: hovered ? '#fff' : '#94a3b8',
                            boxShadow: hovered ? `0 4px 14px ${accent}40` : 'none',
                        }}
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
interface ModuleNavigationProps {
    onSelectModule: (m: ModuleName) => void;
    stats: SessionStats;
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ onSelectModule, stats }) => {
    const lvlPct = (stats.xp % 1000) / 10;

    // Radar chart data from module breakdown
    const radarData = [
        { skill: 'Speaking',   score: (stats.moduleBreakdown.speaking  / 9) * 100 },
        { skill: 'Reading',    score: (stats.moduleBreakdown.reading   / 9) * 100 },
        { skill: 'Writing',    score: (stats.moduleBreakdown.writing   / 9) * 100 },
        { skill: 'Listening',  score: (stats.moduleBreakdown.listening / 9) * 100 },
        { skill: 'Vocab',      score: stats.vocabularyScore ?? 70 },
        { skill: 'Grammar',    score: stats.grammarScore ?? 72 },
    ];

    // Mini sparkline data
    const sparkData = stats.recentAttempts.slice(-6).map(a => ({ v: (a.band / 9) * 100 }));

    const modules = [
        { name: 'speaking'   as ModuleName, size: 'large'   as const, title: 'Speaking',    description: 'AI examiner with live pronunciation feedback and grammar coaching', icon: <Mic />,       gradient: 'from-blue-500 to-indigo-600',    color: 'blue',   stats: { label: 'Last Band', value: stats.moduleBreakdown.speaking } },
        { name: 'reading'    as ModuleName, size: 'medium'  as const, title: 'Reading',     description: 'Academic passages with adaptive difficulty and timed comprehension', icon: <BookOpen />,  gradient: 'from-indigo-500 to-violet-600',  color: 'indigo', isNew: true, stats: { label: 'Accuracy',  value: stats.moduleBreakdown.reading } },
        { name: 'writing'    as ModuleName, size: 'medium'  as const, title: 'Writing',     description: 'Detailed AI grading and Band 9 rephrasing suggestions',            icon: <PenTool />,   gradient: 'from-violet-500 to-fuchsia-600', color: 'violet', isNew: true, stats: { label: 'Avg Band',  value: stats.moduleBreakdown.writing } },
        { name: 'listening'  as ModuleName, size: 'compact' as const, title: 'Listening',   description: 'Multi-speaker audio with transcript analysis',                    icon: <Headphones />,gradient: 'from-emerald-500 to-teal-600',   color: 'emerald', isNew: true, stats: { label: 'Speed',    value: stats.moduleBreakdown.listening } },
        { name: 'vocabulary' as ModuleName, size: 'compact' as const, title: 'Vocabulary',  description: 'Spaced-repetition wordbank for Band 8+',                          icon: <BookMarked />,gradient: 'from-amber-500 to-orange-600',   color: 'amber',  isNew: true },
        { name: 'mocktest'   as ModuleName, size: 'large'   as const, title: 'Mock Tests',  description: 'Full-length exam simulation with predictive band score report',    icon: <Trophy />,    gradient: 'from-rose-500 to-pink-600',      color: 'rose',   isNew: true },
        { name: 'resources'  as ModuleName, size: 'compact' as const, title: 'Study Kit',   description: 'Guides, templates, and downloadable resources',                   icon: <BookMarked />,gradient: 'from-cyan-500 to-blue-600',      color: 'cyan',   isNew: true },
        { name: 'analytics'  as ModuleName, size: 'compact' as const, title: 'Success Lab', description: 'Trends, readiness radar, and AI diagnostics',                    icon: <BarChart3 />, gradient: 'from-slate-600 to-slate-900',    color: 'slate' },
    ];

    return (
        <div className="relative min-h-screen" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
            <CursorBlob />
            <ParticleNetwork />

            {/* Static ambient blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-indigo-500/6 rounded-full blur-[140px] animate-blob" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-purple-500/6 rounded-full blur-[130px] animate-blob animation-delay-2000" />
                <div className="absolute top-[45%]  left-[30%]  w-[30%] h-[30%] bg-pink-500/4 rounded-full blur-[90px]  animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 max-w-[90rem] mx-auto px-5 md:px-10">

                {/* ══════════════════════════════════════════════════════════════
                    COMMAND CENTER
                ══════════════════════════════════════════════════════════════ */}
                <div className="pt-12 lg:pt-18 pb-16">

                    {/* Editorial kicker */}
                    <div className="flex items-center gap-4 mb-8">
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100">
                            <motion.span animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 1.1, repeat: Infinity }}>
                                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
                            </motion.span>
                            <span className="text-[0.62rem] font-black text-orange-700 uppercase tracking-widest">{stats.streak}-day streak</span>
                        </motion.div>
                        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="h-px flex-1 bg-gradient-to-r from-orange-100 to-transparent origin-left" />
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-slate-400">
                            Command Center
                        </motion.p>
                    </div>

                    {/* 3-column command center grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_300px] gap-5">

                        {/* ── Col 1: Readiness + Band ── */}
                        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-slate-950 rounded-[2rem] p-7 text-white relative overflow-hidden flex flex-col gap-6">

                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-[65px] -mr-10 -mt-10 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-600/15 rounded-full blur-[50px] -ml-6 -mb-6 pointer-events-none" />

                            <div className="relative z-10">
                                <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-slate-500 mb-4">Exam Readiness</p>

                                {/* Ring + score */}
                                <div className="flex items-center gap-5">
                                    <div className="relative flex items-center justify-center">
                                        <Ring score={stats.readinessScore} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.9, type: 'spring' }}
                                                className="text-3xl font-black leading-none">{stats.readinessScore}%
                                            </motion.p>
                                            <p className="text-[0.5rem] font-black text-indigo-400 uppercase tracking-widest">Ready</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[0.56rem] font-bold text-slate-500 uppercase tracking-widest">Predicted Band</p>
                                        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.1 }}
                                            className="text-4xl font-black leading-none">{stats.predictiveBand}
                                        </motion.p>
                                        <p className="text-[0.56rem] text-slate-500 font-bold uppercase tracking-widest">out of 9.0</p>
                                    </div>
                                </div>

                                {/* Module score bars */}
                                <div className="mt-6 space-y-2.5">
                                    {Object.entries(stats.moduleBreakdown).map(([k, v], i) => {
                                        const grads: Record<string, string> = {
                                            speaking: '#6366f1,#818cf8', writing: '#a855f7,#d8b4fe',
                                            reading: '#10b981,#6ee7b7', listening: '#f59e0b,#fcd34d'
                                        };
                                        return (
                                            <div key={k} className="flex items-center gap-2">
                                                <span className="text-[0.54rem] font-black uppercase tracking-widest text-slate-500 w-14 shrink-0">{k}</span>
                                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div className="h-full rounded-full"
                                                        style={{ background: `linear-gradient(90deg,${grads[k] || '#64748b,#94a3b8'})` }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(Number(v) / 9) * 100}%` }}
                                                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.6 + i * 0.08 }} />
                                                </div>
                                                <span className="text-[0.54rem] font-black text-white/60 w-8 text-right">{v}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sparkline trend */}
                            {sparkData.length > 2 && (
                                <div className="relative z-10 border-t border-white/6 pt-4">
                                    <p className="text-[0.54rem] font-black uppercase tracking-widest text-slate-600 mb-2">Score Trend</p>
                                    <div className="h-12">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                <defs>
                                                    <linearGradient id="sparkG" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.35} />
                                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2}
                                                    fill="url(#sparkG)" dot={false} isAnimationActive animationDuration={1200} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* ── Col 2: XP + Streak + Achievements ── */}
                        <div className="flex flex-col gap-5">

                            {/* Headline */}
                            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
                                <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-black text-slate-900 leading-[1.02] tracking-tight">
                                    Your IELTS<br />
                                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
                                        Success Lab.
                                    </span>
                                </h1>
                                <p className="text-slate-500 font-medium mt-2 text-[0.9rem]">
                                    AI-powered coaching across all four IELTS modules.
                                </p>
                            </motion.div>

                            {/* XP panel */}
                            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.28 }}
                                className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-base font-black text-slate-900 leading-none">Level {stats.level}</p>
                                        <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{1000 - (stats.xp % 1000)} XP to next</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <Zap className="w-3.5 h-3.5 text-indigo-500" />
                                        <span className="text-sm font-black text-indigo-600">{stats.xp} XP</span>
                                    </div>
                                </div>
                                {/* Animated XP bar */}
                                <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div className="absolute inset-y-0 left-0 rounded-full"
                                        style={{ background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)' }}
                                        initial={{ width: 0 }} animate={{ width: `${lvlPct}%` }}
                                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} />
                                    <motion.div className="absolute inset-y-0 w-14 bg-white/40 skew-x-[-20deg]"
                                        initial={{ left: '-4rem' }} animate={{ left: '110%' }}
                                        transition={{ duration: 1.3, delay: 1.7, ease: 'easeInOut' }} />
                                </div>
                            </motion.div>

                            {/* Achievement badges */}
                            <div className="flex flex-wrap gap-3">
                                {stats.badges.map((b, i) => (
                                    <motion.div key={b.id}
                                        initial={{ opacity: 0, scale: 0.75, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.42, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                        whileHover={{ y: -3, scale: 1.04 }}
                                        className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group cursor-default">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center group-hover:from-indigo-500 group-hover:to-violet-600 transition-all duration-300">
                                            <Award className="w-4 h-4 text-indigo-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 leading-none">{b.title}</p>
                                            <p className="text-[0.55rem] font-bold text-slate-400 uppercase tracking-widest">Unlocked</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quick CTA buttons */}
                            <div className="flex gap-3 mt-auto">
                                <MagneticBtn onClick={() => onSelectModule('speaking')}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow flex items-center justify-center gap-2 uppercase tracking-widest">
                                    <Mic className="w-4 h-4" /> Start Speaking
                                </MagneticBtn>
                                <MagneticBtn onClick={() => onSelectModule('mocktest')}
                                    className="px-5 py-3.5 bg-white/80 border border-slate-200 text-slate-700 rounded-xl font-black text-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                    <Trophy className="w-4 h-4" /> Mock Test
                                </MagneticBtn>
                            </div>
                        </div>

                        {/* ── Col 3: Radar Chart AI Panel ── */}
                        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-white/65 backdrop-blur-2xl border border-white/70 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">Skill Radar</p>
                                    <h3 className="text-base font-black text-slate-900 mt-0.5">AI Diagnostics</h3>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[0.58rem] font-black text-emerald-600 uppercase tracking-widest">
                                    <Activity className="w-2.5 h-2.5" /> Live
                                </div>
                            </div>

                            <div className="flex-1 min-h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                                        <PolarGrid stroke="rgba(99,102,241,0.1)" />
                                        <PolarAngleAxis dataKey="skill"
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }} />
                                        <Tooltip contentStyle={{
                                            borderRadius: '12px', border: 'none',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                            fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 11
                                        }} formatter={(v: number) => [`${v.toFixed(0)}%`, 'Score']} />
                                        <Radar dataKey="score" stroke="#6366f1" strokeWidth={2}
                                            fill="#6366f1" fillOpacity={0.12}
                                            isAnimationActive animationDuration={1400} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Target vs actual */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="bg-indigo-50/80 rounded-xl p-3 border border-indigo-100/60">
                                    <p className="text-[0.56rem] font-black text-indigo-500 uppercase tracking-widest">Target</p>
                                    <p className="text-xl font-black text-slate-900 leading-none mt-0.5">8.5</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                    <p className="text-[0.56rem] font-black text-slate-400 uppercase tracking-widest">Current</p>
                                    <p className="text-xl font-black text-slate-900 leading-none mt-0.5">{stats.predictiveBand}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    MASONRY MODULE GRID
                ══════════════════════════════════════════════════════════════ */}
                <div className="pb-24 space-y-6">

                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-end justify-between border-b border-slate-200/60 pb-5">
                        <div>
                            <h2 className="text-[1.55rem] font-black text-slate-900 tracking-tight">Focus Areas</h2>
                            <p className="text-[0.608rem] font-bold text-slate-400 uppercase tracking-[0.22em] mt-1">AI-Recommended · Level {stats.level}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[0.6rem] font-black text-emerald-700 uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" /> All Synced
                        </div>
                    </motion.div>

                    {/*
                        HANDCRAFTED BENTO LAYOUT (Asymmetric Visual Rhythm)
                        We intentionally break perfect horizontal alignment using offsets
                        and varied spacing (pl-10, mt-8, -mt-4) to feel editorial/premium.
                    */}
                    <div className="pt-2 pb-8">
                        {/* Row A: Speaking (spans 2) + Reading + Writing */}
                        {/* 
                          Speaking is slightly taller and drops down.
                          Writing is nudged up artificially.
                        */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start">
                            <div className="col-span-2 relative z-10 lg:translate-y-4">
                                <ModuleCard {...modules[0]} delay={0.04} onClick={() => onSelectModule(modules[0].name)} />
                            </div>
                            <div className="relative z-0">
                                <ModuleCard {...modules[1]} delay={0.09} onClick={() => onSelectModule(modules[1].name)} />
                            </div>
                            <div className="relative z-10 lg:-translate-y-6">
                                <ModuleCard {...modules[2]} delay={0.14} onClick={() => onSelectModule(modules[2].name)} />
                            </div>
                        </div>

                        {/* Row B: Listening + Vocab + Mock Test (spans 2) */}
                        {/*
                          Negative top margin pulls this row up into Row A's vertical space.
                          Vocab is pushed right. Mock test is bumped down.
                        */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start mt-6 lg:-mt-2">
                            <div className="relative z-20">
                                <ModuleCard {...modules[3]} delay={0.19} onClick={() => onSelectModule(modules[3].name)} />
                            </div>
                            <div className="relative z-10 lg:translate-y-3 lg:ml-2">
                                <ModuleCard {...modules[4]} delay={0.24} onClick={() => onSelectModule(modules[4].name)}
                                    vocabCount={stats.vocabularyBank?.length ?? 12} />
                            </div>
                            <div className="col-span-2 relative z-10 lg:translate-y-8">
                                <ModuleCard {...modules[5]} delay={0.29} onClick={() => onSelectModule(modules[5].name)} />
                            </div>
                        </div>

                        {/* Row C: Study Kit + Analytics */}
                        {/*
                          Pushed further right, leaving negative space on the left.
                          Different gap size.
                        */}
                        <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 mt-6 lg:mt-16 lg:pl-[25%]">
                            <div className="flex-1 max-w-[280px] relative z-0 lg:-translate-y-5">
                                <ModuleCard {...modules[6]} delay={0.34} onClick={() => onSelectModule(modules[6].name)} />
                            </div>
                            <div className="flex-1 max-w-[280px] relative z-10">
                                <ModuleCard {...modules[7]} delay={0.38} onClick={() => onSelectModule(modules[7].name)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    CTA
                ══════════════════════════════════════════════════════════════ */}
                <div className="pb-16">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 lg:p-14">

                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950" />
                        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-600/14 rounded-full blur-[110px] -mr-40 -mt-40" />
                        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-pink-600/10 rounded-full blur-[80px] -ml-14 -mb-14" />

                        {/* 3 light streaks at different positions/speeds */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[
                                { top: '24%', w: 56, dur: 4.1, delay: 0,   col: 'via-indigo-400/35' },
                                { top: '58%', w: 36, dur: 6.3, delay: 2.1, col: 'via-purple-400/25' },
                                { top: '78%', w: 48, dur: 5.0, delay: 3.5, col: 'via-pink-400/20'   },
                            ].map((s, i) => (
                                <motion.div key={i}
                                    className={`absolute h-px bg-gradient-to-r from-transparent ${s.col} to-transparent`}
                                    style={{ top: s.top, width: `${s.w * 4}px` }}
                                    animate={{ x: ['-150px', '120vw'] }}
                                    transition={{ duration: s.dur, repeat: Infinity, ease: 'linear', delay: s.delay }} />
                            ))}
                        </div>

                        {/* Left Content / Right Visual Split */}
                        <div className="relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
                            
                            {/* ── LEFT SIDE: Copy & Features ── */}
                            <div className="space-y-6">
                                {/* Label */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                    <span className="text-[0.6rem] font-black text-indigo-300 uppercase tracking-widest">Elite Track</span>
                                </div>
                                
                                {/* Headline & Description */}
                                <div>
                                    <h3 className="text-[clamp(2.2rem,4vw,3.5rem)] font-black text-white leading-[1.05] tracking-tight">
                                        Push your limits<br />
                                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">to Band 9.</span>
                                    </h3>
                                    <p className="text-slate-400 font-medium text-[0.95rem] leading-relaxed mt-4 max-w-lg">
                                        Unlock the full potential of your preparation with deeply personalized AI coaching and real-time exam simulations.
                                    </p>
                                </div>

                                {/* Feature List */}
                                <div className="space-y-3 pt-2">
                                    {[
                                        { text: 'AI examiner coaching', icon: React.createElement(Mic, { className: "w-3.5 h-3.5 text-indigo-400" }) },
                                        { text: 'Advanced mock simulations', icon: React.createElement(Trophy, { className: "w-3.5 h-3.5 text-purple-400" }) },
                                        { text: 'Real-time diagnostics', icon: React.createElement(Activity, { className: "w-3.5 h-3.5 text-pink-400" }) },
                                        { text: 'Daily challenge system', icon: React.createElement(Flame, { className: "w-3.5 h-3.5 text-orange-400" }) }
                                    ].map((f, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                                            className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                {f.icon}
                                            </div>
                                            <span className="text-[0.85rem] font-bold text-slate-300">{f.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* ── RIGHT SIDE: Readiness Ring & CTA ── */}
                            <div className="relative flex flex-col items-center justify-center min-h-[300px] mt-8 lg:mt-0">
                                
                                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                                    {/* Ambient glow behind ring */}
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-[50px] rounded-full" />
                                    
                                    {/* The animated SVG Ring */}
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 filter drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                                        <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                                        <motion.circle cx="50" cy="50" r="44" stroke="url(#eliteGradient)" strokeWidth="6" fill="none"
                                            strokeLinecap="round" strokeDasharray="276.46"
                                            initial={{ strokeDashoffset: 276.46 }}
                                            whileInView={{ strokeDashoffset: 276.46 - ((stats.readinessScore / 100) * 276.46) }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
                                        <defs>
                                            <linearGradient id="eliteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#818cf8" />
                                                <stop offset="50%" stopColor="#c084fc" />
                                                <stop offset="100%" stopColor="#f472b6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    
                                    {/* Center metrics */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <motion.p initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }} transition={{ delay: 1, type: "spring" }}
                                            className="text-4xl sm:text-5xl font-black text-white leading-none">
                                            {stats.readinessScore}<span className="text-2xl text-indigo-300">%</span>
                                        </motion.p>
                                        <p className="text-[0.55rem] font-bold text-indigo-200/80 uppercase tracking-[0.2em] mt-1">Readiness</p>
                                    </div>

                                    {/* Floating target badge */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }} transition={{ delay: 1.4 }}
                                        className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 shadow-2xl flex items-center gap-3 whitespace-nowrap">
                                        <div>
                                            <p className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest leading-none">Target Band</p>
                                            <p className="text-sm font-black text-white mt-0.5">8.5 <span className="text-indigo-400">/ 9.0</span></p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <Target className="w-3 h-3 text-indigo-300" />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Floating CTA Panel */}
                                <motion.div whileHover={{ y: -4 }}
                                    className="relative z-10 mt-10 w-full max-w-[280px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
                                    <h4 className="text-white font-black text-lg mb-1">Ready to start?</h4>
                                    <p className="text-slate-400 text-xs font-medium mb-5 leading-relaxed">Join 10,000+ students aiming for Band 7+ and above.</p>
                                    
                                    <MagneticBtn onClick={() => onSelectModule('mocktest')}
                                        className="w-full group relative overflow-hidden px-8 py-3.5 bg-white text-slate-900 rounded-xl font-black text-sm shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2">
                                        {/* Hover light sweep */}
                                        <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            Explore Elite
                                            <TrendingUp className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                                        </span>
                                    </MagneticBtn>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
