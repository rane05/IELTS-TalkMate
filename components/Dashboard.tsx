import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { SessionStats } from '../types';
import { MOCK_STATS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Trophy, Book, Activity, History, TrendingUp, TrendingDown, Volume2, BookOpen, Mic, Zap, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

interface DashboardProps {
  onStartPractice: () => void;
  onStartGrammarCoach?: () => void;
  onViewHistory?: () => void;
  stats?: SessionStats;
}

// ── Counter animation ─────────────────────────────────────────────
const AnimCount: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1100, 1);
      setN(Number((1 - (1 - p) ** 3) * to).toFixed(1) as unknown as number);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);

  return <span ref={ref}>{n}{suffix}</span>;
};

// ── Stat card — intentionally different border-radii per card ─────
const CARDS = [
  { key: 'averageBand',       label: 'Avg Band',     icon: Trophy,   grad: 'from-indigo-600 to-purple-600', suffix: '',   br: 'rounded-[1.5rem]' },
  { key: 'fluencyScore',      label: 'Fluency',       icon: Activity, grad: 'from-emerald-500 to-teal-600',  suffix: '%',  br: 'rounded-[2rem]' },
  { key: 'grammarScore',      label: 'Grammar',       icon: Book,     grad: 'from-blue-500 to-indigo-500',   suffix: '%',  br: 'rounded-[1.25rem]' },
  { key: 'pronunciationScore',label: 'Pronunciation', icon: Volume2,  grad: 'from-violet-500 to-fuchsia-500',suffix: '%',  br: 'rounded-[1.75rem]' },
  { key: 'vocabularyScore',   label: 'Vocabulary',    icon: BookOpen, grad: 'from-amber-500 to-orange-500',  suffix: '%',  br: 'rounded-[2rem]' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  onStartPractice, onStartGrammarCoach, onViewHistory, stats = MOCK_STATS
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-9" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>

      {/* ── Header — left-aligned (no centre symmetry) ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2 pl-0.5"
      >
        <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-slate-400">Speaking Module</p>
        <h1 className="text-[2.4rem] font-black tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your IELTS Progress
          </span>
        </h1>
        <p className="text-slate-500 font-medium text-[0.9rem]">Track improvement across sessions.</p>
        {/* Inline session chips — deliberately small + left-aligned */}
        <div className="flex gap-2 pt-1 flex-wrap">
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[0.72rem] font-black text-indigo-600">
            {stats.totalSessions} sessions
          </span>
          <span className="px-3 py-1 bg-violet-50 border border-violet-100 rounded-lg text-[0.72rem] font-black text-violet-600">
            {stats.totalPracticeTime} min
          </span>
        </div>
      </motion.div>

      {/* ── Stat grid — 5 cards with subtly different radii & staggered sizes ── */}
      {/* Not a symmetric 5-col — use 2-3 cols at sm, 5 at lg, with padding offset */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {CARDS.map(({ key, label, icon: Icon, grad, suffix, br }, i) => {
          const val = (stats as any)[key] as number;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.82, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.03 }}
              className={`relative p-4 text-white overflow-hidden flex flex-col items-center justify-center gap-2 cursor-default ${br} col-span-1 ${i === 4 ? 'md:col-span-1 col-span-2' : ''}`}
              style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops, #000))`, backgroundImage: `linear-gradient(135deg, ${grad.replace('from-', '').replace('to-', '')})` }}
            >
              {/* Use inline gradient via className instead */}
              <div className={`absolute inset-0 bg-gradient-to-br ${grad} ${br}`} />
              <div className="relative z-10 flex flex-col items-center justify-center gap-2 w-full">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black tracking-tight">
                  <AnimCount to={val} suffix={suffix} />
                </span>
                <span className="text-[0.58rem] font-black uppercase tracking-widest opacity-80">{label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Strengths & Weaknesses — different widths (60/40 split) ── */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4">
        <motion.div
          initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 rounded-2xl border border-emerald-100/80 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Strengths</h3>
          </div>
          <div className="space-y-2">
            {stats.strongAreas.map((area, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.07 }}
                className="flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                <span className="text-sm text-emerald-800 font-medium">{area}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 rounded-2xl border border-amber-100/80 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Focus Areas</h3>
          </div>
          <div className="space-y-2">
            {stats.weakAreas.map((area, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                <span className="text-sm text-amber-800 font-medium">{area}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Chart + CTA — asymmetric 3/2 split (not 50/50) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">

        {/* Area chart — more dynamic than line chart */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="bg-white/75 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-sm p-5 pb-4"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Band Score Progress</h3>
              <p className="text-[0.62rem] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Last {stats.recentAttempts.length} sessions</p>
            </div>
            <div className="flex items-center gap-1 text-[0.62rem] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
              <TrendingUp className="w-3 h-3" /> Trend
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.recentAttempts} margin={{ left: -24, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }} />
                <YAxis domain={[0, 9]} hide />
                <Tooltip contentStyle={{
                  borderRadius: '12px', border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 12
                }} />
                <Area type="monotone" dataKey="band"
                  stroke="url(#lineGrad)" strokeWidth={2.5} fill="url(#areaGrad)"
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2.5, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#a855f7' }}
                  isAnimationActive animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CTA — not a centred box, text is left-aligned + button bottom-right */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="relative bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border border-indigo-100/60 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-[50px] -mr-8 -mt-8 pointer-events-none" />

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Ready to practice?</h3>
              <p className="text-slate-500 text-[0.82rem] mt-1 leading-relaxed">AI-powered sessions, graded in real time.</p>
            </div>
          </div>

          <div className="space-y-2.5 mt-5">
            <motion.button onClick={onStartPractice}
              whileHover={{ scale: 1.03, y: -1.5 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-shadow text-[0.8rem] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" /> Start Practice
            </motion.button>

            {onStartGrammarCoach && (
              <motion.button onClick={onStartGrammarCoach}
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 bg-white/80 backdrop-blur border border-emerald-200 text-emerald-700 font-black rounded-xl text-[0.78rem] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-emerald-400 transition-colors"
              >
                <Book className="w-3.5 h-3.5" /> Grammar Coach
              </motion.button>
            )}

            {onViewHistory && (
              <motion.button onClick={onViewHistory}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-2 text-slate-500 font-bold text-[0.75rem] flex items-center justify-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <History className="w-3.5 h-3.5" /> View History
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Vocabulary bank — flush left, irregular wrap ── */}
      {stats.vocabularyBank.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white/75 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900">Vocabulary Bank</h3>
            <span className="ml-auto px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[0.62rem] font-black rounded-full">{stats.vocabularyBank.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.vocabularyBank.slice(0, 10).map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * i }}
                whileHover={{ y: -2, scale: 1.05 }}
                className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[0.78rem] font-bold border border-indigo-100 hover:bg-indigo-100 transition-all cursor-pointer"
                title={item.definition}
              >
                {item.word}
              </motion.div>
            ))}
            {stats.vocabularyBank.length > 10 && (
              <div className="px-3.5 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[0.78rem] font-bold">
                +{stats.vocabularyBank.length - 10}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
