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

      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`; // Purple-ish
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="relative h-24 w-full max-w-md bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
        <canvas ref={canvasRef} width="400" height="100" className="w-full h-full" />
        {isProcessing && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="ml-2 text-indigo-700 font-medium">Analyzing...</span>
          </div>
        )}
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing || disabled}
        className={`
          flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-indigo-600 hover:bg-indigo-700'
          }
          ${(disabled || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isRecording ? (
          <Square className="w-6 h-6 text-white fill-current" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>
      <p className="text-sm text-gray-500 font-medium">
        {isRecording ? "Listening... (Tap to finish)" : "Tap to Speak"}
      </p>
    </div>
  );
};
