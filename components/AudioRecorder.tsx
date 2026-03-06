import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
  disabled: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  isProcessing,
  disabled
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(blob);
        stopVisualizer();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startVisualizer(stream);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const startVisualizer = (stream: MediaStream) => {
    if (!canvasRef.current) return;

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    source.connect(analyserRef.current);

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!ctx || !analyserRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Gradient Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw a fluid "frequency wave"
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const height = canvas.height * percent * 0.8;
        const x = (canvas.width / bufferLength) * i;
        const y = centerY + (i % 2 === 0 ? -height / 2 : height / 2);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Add glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <div className="relative h-32 w-full max-w-lg bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-inner border-2 border-slate-100 group">
        <canvas ref={canvasRef} width="600" height="200" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Holographic Overlays */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent opacity-50" />

        {isProcessing && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center backdrop-blur-md">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin relative z-10" />
            </div>
            <span className="mt-4 text-indigo-900 font-black uppercase tracking-[0.2em] text-[0.6rem]">
              Analyzing Speech Stream
            </span>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="text-[0.6rem] font-black text-rose-500 uppercase tracking-widest">Live Capture</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || disabled}
          className={`
            relative group flex items-center justify-center w-20 h-20 rounded-[2rem] shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95
            ${isRecording
              ? 'bg-rose-500 rotate-90'
              : 'bg-indigo-600'
            }
            ${(disabled || isProcessing) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-indigo-500/40'}
          `}
        >
          {/* Animated Background Rings (while recording) */}
          {isRecording && (
            <>
              <div className="absolute inset-0 bg-rose-500 rounded-[2.5rem] animate-ping opacity-20" />
              <div className="absolute -inset-2 border-2 border-rose-500/20 rounded-[3rem] animate-pulse" />
            </>
          )}

          <div className="relative z-10">
            {isRecording ? (
              <Square className="w-8 h-8 text-white fill-current" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </div>
        </button>

        <p className={`text-[0.6rem] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${isRecording ? 'text-rose-500' : 'text-slate-400'}`}>
          {isRecording ? "Transmitting..." : "Voice Command Readiness: Active"}
        </p>
      </div>
    </div>
  );
};
