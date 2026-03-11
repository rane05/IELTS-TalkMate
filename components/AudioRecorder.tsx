import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2, Zap, AudioWaveform } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
  disabled: boolean;
}

// Band score label based on estimated confidence
const getBandLabel = (vol: number): { band: string; label: string; color: string } => {
  if (vol > 85) return { band: '7.5–9.0', label: 'Excellent Fluency',   color: '#10b981' };
  if (vol > 65) return { band: '6.0–7.5', label: 'Good Fluency',        color: '#6366f1' };
  if (vol > 40) return { band: '5.0–6.0', label: 'Fair — Keep Going',   color: '#f59e0b' };
  if (vol > 15) return { band: '4.0–5.0', label: 'Speak More Clearly',  color: '#f97316' };
  return            { band: '—',        label: 'Waiting for Speech',   color: '#94a3b8' };
};

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete, isProcessing, disabled
}) => {
  const [isRecording,  setIsRecording]  = useState(false);
  const [volume,       setVolume]       = useState(0);     // 0-100
  const [isSpeaking,   setIsSpeaking]   = useState(false); // threshold detect
  const [barHeights,   setBarHeights]   = useState<number[]>(Array(28).fill(2));
  const [silenceSecs,  setSilenceSecs]  = useState(0);

  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const chunksRef         = useRef<Blob[]>([]);
  const audioCtxRef       = useRef<AudioContext | null>(null);
  const analyserRef       = useRef<AnalyserNode | null>(null);
  const rafRef            = useRef<number | null>(null);
  const silenceTimer      = useRef<NodeJS.Timeout | null>(null);
  const speakingBuffer    = useRef<number[]>([]);

  // ── Core recording logic ──────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        onRecordingComplete(new Blob(chunksRef.current, { type: 'audio/wav' }));
        stopAnalyser();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startAnalyser(stream);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  // ── Analyser: waveform bars + volume + speech detection ───────
  const startAnalyser = (stream: MediaStream) => {
    audioCtxRef.current   = new (window.AudioContext || (window as any).webkitAudioContext)();
    const src             = audioCtxRef.current.createMediaStreamSource(stream);
    analyserRef.current   = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize        = 128;
    analyserRef.current.smoothingTimeConstant = 0.75;
    src.connect(analyserRef.current);

    const bufLen  = analyserRef.current.frequencyBinCount;
    const data    = new Uint8Array(bufLen);

    const BARS        = 28;
    const SPEAK_THOLD = 22; // RMS threshold → "speaking"
    let silenceMs     = 0;

    const draw = () => {
      if (!analyserRef.current) return;
      rafRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(data);

      // RMS volume
      let sum = 0;
      for (let i = 0; i < bufLen; i++) sum += (data[i] / 255) ** 2;
      const rms = Math.sqrt(sum / bufLen) * 100;
      setVolume(Math.min(100, +(rms).toFixed(1)));

      // Speaking detection: hold for 200ms above threshold
      if (rms > SPEAK_THOLD) {
        silenceMs = 0;
        setIsSpeaking(true);
      } else {
        silenceMs += 16;
        if (silenceMs > 600) setIsSpeaking(false);
      }

      // Bar heights: sample freq bands with slight centre weighting
      const step   = Math.floor(bufLen / BARS);
      const newBars = Array.from({ length: BARS }, (_, i) => {
        const centre = Math.abs(i - BARS / 2) / (BARS / 2); // 0=edge, 1=centre
        const amp    = data[i * step] / 255;
        const minH   = 2;
        const maxH   = 52 + centre * 20; // centre bars can grow taller
        return minH + amp * maxH;
      });
      setBarHeights(newBars);
    };

    draw();
  };

  const stopAnalyser = () => {
    if (rafRef.current)       cancelAnimationFrame(rafRef.current);
    if (audioCtxRef.current)  audioCtxRef.current.close();
    setBarHeights(Array(28).fill(2));
    setVolume(0);
    setIsSpeaking(false);
  };

  const bandInfo = getBandLabel(volume);

  const barGrad = (idx: number, h: number) => {
    if (!isRecording) return '#e2e8f0';
    const centre = Math.abs(idx - 14) / 14; // 0 = centre, 1 = edge
    const r = Math.round(99  + (168 - 99)  * centre);
    const g = Math.round(102 + (85  - 102) * centre);
    const b = Math.round(241 + (246 - 241) * centre);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>

      {/* ── Band Score Indicator ──────────────────────────────── */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            key="bandindicator"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md rounded-2xl border px-5 py-3.5 flex items-center justify-between gap-4"
            style={{ borderColor: `${bandInfo.color}30`, background: `${bandInfo.color}09` }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: isSpeaking ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 0.4, repeat: isSpeaking ? Infinity : 0 }}
                className="w-2 h-2 rounded-full"
                style={{ background: bandInfo.color,
                         boxShadow: isSpeaking ? `0 0 10px ${bandInfo.color}` : 'none' }}
              />
              <span className="text-[0.62rem] font-black uppercase tracking-widest"
                style={{ color: bandInfo.color }}>
                {isSpeaking ? '● Speaking' : '○ Silence'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[0.58rem] font-bold text-slate-400 uppercase tracking-widest leading-none">Est. Band</p>
              <p className="text-base font-black leading-tight" style={{ color: bandInfo.color }}>
                {bandInfo.band}
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[0.58rem] font-bold text-slate-400 uppercase tracking-widest leading-none">Signal</p>
              <p className="text-sm font-black text-slate-700 leading-tight">{bandInfo.label}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Animated Waveform Visualiser ─────────────────────── */}
      <div className="relative w-full max-w-md h-[80px] rounded-2xl overflow-hidden border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm">

        {/* Bar visualiser */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-4">
          {barHeights.map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: h, opacity: isRecording ? 1 : 0.3 }}
              transition={{ duration: 0.08, ease: 'linear' }}
              className="w-[2.5px] rounded-full flex-shrink-0"
              style={{
                background: barGrad(i, h),
                boxShadow: isRecording && h > 20 ? `0 0 6px rgba(99,102,241,0.35)` : 'none',
                minHeight: 2,
              }}
            />
          ))}
        </div>

        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />

        {/* Processing overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/85 backdrop-blur-md flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 animate-pulse" />
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin relative z-10" />
              </div>
              <span className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-indigo-700">Analyzing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LIVE tag */}
        {isRecording && (
          <div className="absolute top-2.5 right-3.5 flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 bg-rose-500 rounded-full"
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
            <span className="text-[0.55rem] font-black text-rose-500 uppercase tracking-widest">Live</span>
          </div>
        )}

        {/* Volume meter — thin horizontal bar at bottom */}
        {isRecording && (
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-100">
            <motion.div className="h-full rounded-full"
              animate={{ width: `${volume}%` }}
              transition={{ duration: 0.1 }}
              style={{ background: `linear-gradient(90deg, ${bandInfo.color}, ${bandInfo.color}80)` }} />
          </div>
        )}
      </div>

      {/* ── Mic Button ───────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="relative">
          {/* Pulse rings — 2 layers when recording */}
          {isRecording && isSpeaking && (
            <>
              <motion.div className="absolute inset-0 rounded-[2rem] bg-rose-400 opacity-20"
                animate={{ scale: [1, 1.6], opacity: [0.2, 0] }}
                transition={{ duration: 1.0, repeat: Infinity }} />
              <motion.div className="absolute inset-0 rounded-[2rem] bg-rose-400 opacity-15"
                animate={{ scale: [1, 2.0], opacity: [0.15, 0] }}
                transition={{ duration: 1.0, repeat: Infinity, delay: 0.25 }} />
            </>
          )}
          {isRecording && !isSpeaking && (
            <motion.div className="absolute inset-0 rounded-[2rem] bg-slate-400 opacity-10"
              animate={{ scale: [1, 1.3], opacity: [0.1, 0] }}
              transition={{ duration: 2, repeat: Infinity }} />
          )}

          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || disabled}
            whileHover={(!isProcessing && !disabled) ? { scale: 1.07, y: -2 } : {}}
            whileTap={(!isProcessing && !disabled) ? { scale: 0.95 } : {}}
            className={`relative flex items-center justify-center rounded-[2rem] shadow-2xl transition-all duration-300 overflow-hidden ${
              isRecording
                ? 'bg-rose-500 rotate-90 shadow-rose-500/30'
                : 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-indigo-500/30'
            } ${(disabled || isProcessing) ? 'opacity-40 cursor-not-allowed' : ''}`}
            style={{ width: 70, height: 70 }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
            {isRecording
              ? <Square className="w-7 h-7 text-white fill-current relative z-10" />
              : <Mic    className="w-8 h-8 text-white relative z-10" />
            }
          </motion.button>
        </div>

        {/* Status label */}
        <motion.p
          animate={{ color: isRecording ? (isSpeaking ? '#6366f1' : '#f43f5e') : '#94a3b8' }}
          transition={{ duration: 0.3 }}
          className="text-[0.58rem] font-black uppercase tracking-[0.26em] text-center"
        >
          {isProcessing
            ? 'Analyzing speech...'
            : isRecording
              ? isSpeaking ? '◉ Speech detected · tap to stop' : '○ Waiting for voice · tap to stop'
              : 'Tap mic to start speaking'}
        </motion.p>
      </div>
    </div>
  );
};
