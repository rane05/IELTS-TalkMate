import React, { useState, useEffect, useRef } from 'react';
import { Dashboard } from './components/Dashboard';
import { AudioRecorder } from './components/AudioRecorder';
import { FeedbackCard } from './components/FeedbackCard';
import { PracticeSelector } from './components/PracticeSelector';
import { SessionHistoryView } from './components/SessionHistoryView';
import { SessionDetailView } from './components/SessionDetailView';
import { processUserAudio } from './services/geminiService';
import { ExamPart, ConversationTurn, ExaminerResponse, PracticeMode, Topic, DifficultyLevel, SessionHistory, SessionStats } from './types';
import { PART_DESCRIPTIONS, MOCK_STATS } from './constants';
import { Mic, Volume2, ArrowLeft, AlertCircle, MessageSquare } from 'lucide-react';

// Simple helper to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function App() {
  // View states
  const [view, setView] = useState<'dashboard' | 'practice' | 'selector'>('dashboard');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionHistory | null>(null);

  // Practice states
  const [currentPart, setCurrentPart] = useState<ExamPart>(ExamPart.IDLE);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(PracticeMode.FULL_TEST);
  const [selectedTopic, setSelectedTopic] = useState<Topic | undefined>();
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [examinerText, setExaminerText] = useState("Hello. I am your IELTS examiner today. Could you please tell me your full name?");
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Stats & History
  const [stats, setStats] = useState<SessionStats>(MOCK_STATS);

  // Part 2 Timer
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, examinerText]);

  // Timer logic for Part 2
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // If prep time ends
      if (currentPart === ExamPart.PART_2_PREP) {
        speak("Your one minute preparation is up. Please start speaking now. You have 2 minutes.");
        setCurrentPart(ExamPart.PART_2_SPEAK);
        setExaminerText("Please start speaking now.");
        setTimer(120); // 2 mins to speak
        setIsTimerRunning(true);
      }
      // If speaking time ends
      else if (currentPart === ExamPart.PART_2_SPEAK) {
        speak("Thank you. That is the end of Part 2.");
        setCurrentPart(ExamPart.PART_3);
        setExaminerText("Thank you. Now let's move on to Part 3.");
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, currentPart]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a British voice for IELTS feel
    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find(v => v.lang.includes('GB'));
    if (gbVoice) utterance.voice = gbVoice;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleStartPractice = (mode: PracticeMode, topic?: Topic, difficulty?: DifficultyLevel) => {
    setView('practice');
    setPracticeMode(mode);
    setSelectedTopic(topic);
    setSessionStartTime(Date.now());
    setConversation([]);

    // Set initial part based on mode
    if (mode === PracticeMode.PART_1_ONLY) {
      setCurrentPart(ExamPart.PART_1);
      setExaminerText("Good afternoon. My name is Sarah. Could you tell me your full name?");
      speak("Good afternoon. My name is Sarah. Could you tell me your full name?");
    } else if (mode === PracticeMode.PART_2_ONLY) {
      setCurrentPart(ExamPart.PART_2_PREP);
      setTimer(60);
      setIsTimerRunning(true);
      const topicText = topic ? topic.name : "a memorable event in your life";
      const prepMsg = `Now I will give you a topic: ${topicText}. You have one minute to prepare.`;
      setExaminerText(prepMsg);
      speak(prepMsg);
    } else if (mode === PracticeMode.PART_3_ONLY) {
      setCurrentPart(ExamPart.PART_3);
      setExaminerText("Let's discuss some abstract questions. What do you think about...");
      speak("Let's discuss some abstract questions.");
    } else {
      // Full test
      setCurrentPart(ExamPart.PART_1);
      setExaminerText("Good afternoon. My name is Sarah. Could you tell me your full name?");
      speak("Good afternoon. My name is Sarah. Could you tell me your full name?");
    }
  };

  const handleAudioStop = async (audioBlob: Blob) => {
    setIsProcessing(true);

    // Create user turn
    const userAudioUrl = URL.createObjectURL(audioBlob);
    const newTurn: ConversationTurn = {
      id: Date.now().toString(),
      role: 'user',
      audioUrl: userAudioUrl,
      timestamp: Date.now()
    };

    // Add temporary user turn to UI (we don't have the text yet)
    setConversation(prev => [...prev, newTurn]);

    try {
      const b64 = await blobToBase64(audioBlob);

      // Build context from last 3 turns
      const context = conversation.slice(-3).map(t =>
        `${t.role}: ${t.text || (t.audioUrl ? '[Audio]' : '')}`
      ).join('\n');

      const response: ExaminerResponse = await processUserAudio(b64, currentPart, context);

      // Update the user turn with transcribed text
      if (response.userTranscript) {
        setConversation(prev => prev.map(t =>
          t.id === newTurn.id ? { ...t, text: response.userTranscript } : t
        ));
      }

      // Add Examiner Turn
      const examinerTurn: ConversationTurn = {
        id: (Date.now() + 1).toString(),
        role: 'examiner',
        text: response.examinerSpeech,
        feedback: response.feedback,
        timestamp: Date.now()
      };

      setConversation(prev => [...prev, examinerTurn]);
      setExaminerText(response.examinerSpeech);
      speak(response.examinerSpeech);

      // Handle Exam Logic Transitions
      if (response.isExamFinished) {
        setCurrentPart(ExamPart.COMPLETED);
        saveSession();
      }

      // Auto-transition logic for full test
      if (practiceMode === PracticeMode.FULL_TEST && currentPart === ExamPart.PART_1 && conversation.length > 4) {
        setCurrentPart(ExamPart.PART_2_PREP);
        setTimer(60);
        setIsTimerRunning(true);
        const topicText = selectedTopic ? selectedTopic.name : "a memorable event in your life";
        const prepMsg = `Now I will give you a topic: ${topicText}. You have one minute to prepare.`;
        speak(prepMsg);
        setExaminerText(prepMsg);
      }

    } catch (err) {
      console.error(err);
      alert("Error processing audio. Please check your API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveSession = () => {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);

    // Calculate scores from feedback
    const feedbacks = conversation.filter(t => t.feedback).map(t => t.feedback!);
    const avgBand = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.estimatedBand, 0) / feedbacks.length
      : 0;

    const grammarScore = feedbacks.length > 0
      ? Math.round(feedbacks.reduce((sum, f) => sum + (f.grammarMistakes.length === 0 ? 100 : 70), 0) / feedbacks.length)
      : 0;

    const fluencyScore = 75; // Simplified - would need more analysis
    const pronunciationScore = feedbacks.length > 0 && feedbacks[0].pronunciation
      ? Math.round(feedbacks.reduce((sum, f) => sum + (f.pronunciation?.overallScore || 0), 0) / feedbacks.length)
      : 0;
    const vocabularyScore = 70; // Simplified

    const newSession: SessionHistory = {
      id: Date.now().toString(),
      date: sessionStartTime,
      mode: practiceMode,
      topic: selectedTopic,
      duration,
      conversation,
      averageBand: Math.round(avgBand * 2) / 2, // Round to nearest 0.5
      grammarScore,
      fluencyScore,
      pronunciationScore,
      vocabularyScore,
      completedParts: [currentPart]
    };

    setStats(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      totalSessions: prev.totalSessions + 1,
      totalPracticeTime: prev.totalPracticeTime + Math.floor(duration / 60),
      averageBand: Math.round(((prev.averageBand * prev.totalSessions + avgBand) / (prev.totalSessions + 1)) * 2) / 2,
      recentAttempts: [...prev.recentAttempts, {
        date: new Date(sessionStartTime).toLocaleDateString(),
        band: Math.round(avgBand * 2) / 2
      }].slice(-5)
    }));
  };

  const handleExportPDF = (session: SessionHistory) => {
    // Simple text export (in real app, use jsPDF or similar)
    const content = `
IELTS Speaking Session Report
Date: ${new Date(session.date).toLocaleString()}
Mode: ${session.mode}
Duration: ${Math.floor(session.duration / 60)}m ${session.duration % 60}s

SCORES:
Overall Band: ${session.averageBand}
Grammar: ${session.grammarScore}%
Fluency: ${session.fluencyScore}%
Pronunciation: ${session.pronunciationScore}%
Vocabulary: ${session.vocabularyScore}%

CONVERSATION:
${session.conversation.map(turn => `
${turn.role.toUpperCase()}: ${turn.text || '[Audio]'}
${turn.feedback ? `Band: ${turn.feedback.estimatedBand}` : ''}
`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IELTS-Session-${session.id}.txt`;
    a.click();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1.5 rounded-lg">
              <Mic className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">IELTS<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Coach</span></span>
          </div>
          {view === 'practice' && (
            <button onClick={() => { setView('dashboard'); saveSession(); }} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> End Session
            </button>
          )}
        </div>
      </nav>

      {/* Content */}
      <main className="pb-20">
        {view === 'dashboard' ? (
          <Dashboard
            onStartPractice={() => setView('selector')}
            onViewHistory={() => setShowHistory(true)}
            stats={stats}
          />
        ) : view === 'selector' ? (
          <PracticeSelector
            onStart={handleStartPractice}
            onCancel={() => setView('dashboard')}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-4 space-y-6">

            {/* Status Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Current Section</h2>
                <p className="font-semibold text-indigo-700">{PART_DESCRIPTIONS[currentPart] || "Introduction"}</p>
              </div>
              {(currentPart === ExamPart.PART_2_PREP || currentPart === ExamPart.PART_2_SPEAK) && (
                <div className={`text-2xl font-mono font-bold ${timer < 10 ? 'text-red-500' : 'text-gray-800'}`}>
                  {formatTime(timer)}
                </div>
              )}
            </div>

            {/* Conversation Area */}
            <div className="space-y-6">
              {/* Examiner's Latest Message */}
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 relative">
                <div className="absolute -top-3 -left-3 bg-indigo-600 text-white p-2 rounded-full border-4 border-gray-50">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="ml-6">
                  <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    {examinerText}
                  </p>
                </div>
              </div>

              {/* User Transcript Display */}
              {conversation.filter(t => t.role === 'user' && t.text).slice(-1).map((turn) => (
                <div key={turn.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <div className="text-sm font-semibold text-purple-900 mb-1">You said:</div>
                      <p className="text-gray-800 italic">"{turn.text}"</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* History & Feedback */}
              <div className="space-y-8">
                {conversation.filter(t => t.role === 'examiner' && t.feedback).map((turn) => (
                  <div key={turn.id} className="opacity-90 hover:opacity-100 transition-opacity">
                    {turn.feedback && <FeedbackCard feedback={turn.feedback} />}
                  </div>
                ))}
              </div>

              <div ref={conversationEndRef} />
            </div>

            {/* Controls (Sticky Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto flex flex-col items-center">
                {currentPart === ExamPart.COMPLETED ? (
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">Test Completed! 🎉</h3>
                    <button onClick={() => setView('dashboard')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">Return to Dashboard</button>
                  </div>
                ) : (
                  <AudioRecorder
                    onRecordingComplete={handleAudioStop}
                    isProcessing={isProcessing}
                    disabled={isTimerRunning && currentPart === ExamPart.PART_2_PREP}
                  />
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Session History Modal */}
      {showHistory && (
        <SessionHistoryView
          sessions={stats.sessions}
          onViewSession={(session) => setSelectedSession(session)}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailView
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onExportPDF={handleExportPDF}
        />
      )}

      {/* API Key Warning */}
      {!process.env.API_KEY && (
        <div className="fixed bottom-4 right-4 bg-amber-100 border border-amber-300 text-amber-800 p-4 rounded-lg shadow-lg max-w-sm flex items-start gap-3 z-50">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong>API Key Missing:</strong> Please configure <code>GEMINI_API_KEY</code> in your .env.local file to enable AI features.
          </div>
        </div>
      )}

    </div>
  );
}
