import React, { useState, useEffect, useRef } from 'react';
import { Dashboard } from './components/Dashboard';
import { AudioRecorder } from './components/AudioRecorder';
import { FeedbackCard } from './components/FeedbackCard';
import { PracticeSelector } from './components/PracticeSelector';
import { SessionHistoryView } from './components/SessionHistoryView';
import { SessionDetailView } from './components/SessionDetailView';
import { ModuleNavigation } from './components/ModuleNavigation';
import { ReadingDashboard } from './components/reading/ReadingDashboard';
import { ReadingTest } from './components/reading/ReadingTest';
import { ReadingResults } from './components/reading/ReadingResults';
import { WritingDashboard } from './components/writing/WritingDashboard';
import { WritingEditor } from './components/writing/WritingEditor';
import { WritingResults } from './components/writing/WritingResults';
import { VocabularyDashboard } from './components/vocabulary/VocabularyDashboard';
import { Flashcards } from './components/vocabulary/Flashcards';
import { ListeningDashboard } from './components/listening/ListeningDashboard';
import { ListeningTestComponent } from './components/listening/ListeningTest';
import { ListeningResults } from './components/listening/ListeningResults';
import { MockTestDashboard } from './components/mocktest/MockTestDashboard';
import { MockTestEngine } from './components/mocktest/MockTestEngine';
import { MockTestResults } from './components/mocktest/MockTestResults';
import { VirtualExaminer } from './components/VirtualExaminer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { OnboardingModal } from './components/OnboardingModal';
import { userService } from './services/api';
import { processUserAudio } from './services/geminiService';
import { processUserAudioStreaming, StreamingCallbacks } from './services/streamingService';
import { analyzeWriting } from './services/writingService';
import { ExamPart, ConversationTurn, ExaminerResponse, PracticeMode, Topic, DifficultyLevel, SessionHistory, SessionStats, ExaminerPersonality } from './types';
import { ReadingPassage } from './types/reading';
import { WritingPrompt, WritingFeedback } from './types/writing';
import { VocabularyTopic, VocabularyWord } from './types/vocabulary';
import { ListeningTest } from './types/listening';
import { MockTestPackage, MockTestSession } from './types/mocktest';
import { User as UserType } from './types';
import { SAMPLE_VOCABULARY } from './data/vocabularyData';
import { PART_DESCRIPTIONS, MOCK_STATS } from './constants';
import { Mic, Volume2, ArrowLeft, AlertCircle, MessageSquare, BookOpen, Home, Settings, Sparkles } from 'lucide-react';

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
  // Main view states
  const [currentModule, setCurrentModule] = useState<'home' | 'speaking' | 'reading' | 'writing' | 'listening' | 'vocabulary' | 'mocktest' | 'resources' | 'analytics'>('home');
  const [view, setView] = useState<'dashboard' | 'practice' | 'selector' | 'test' | 'results'>('dashboard');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionHistory | null>(null);

  // Auth state
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load user from persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('ielts_user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Persist user on changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('ielts_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('ielts_user_profile');
    }
  }, [user]);

  // Practice states
  const [currentPart, setCurrentPart] = useState<ExamPart>(ExamPart.IDLE);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(PracticeMode.FULL_TEST);
  const [selectedTopic, setSelectedTopic] = useState<Topic | undefined>();
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [examinerText, setExaminerText] = useState("Hello. I am your IELTS examiner today. Could you please tell me your full name?");
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [currentPersonality, setCurrentPersonality] = useState<ExaminerPersonality>(ExaminerPersonality.PROFESSIONAL);

  // Streaming states for real-time responses
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingTranscript, setStreamingTranscript] = useState("");
  const [streamingExaminerText, setStreamingExaminerText] = useState("");
  const [isActuallySpeaking, setIsActuallySpeaking] = useState(false);

  // Immersive Speaking States
  const [fluencyScore, setFluencyScore] = useState(85);
  const [fillerCount, setFillerCount] = useState(0);
  const [examinerGesture, setExaminerGesture] = useState<'wave' | 'greet' | 'none'>('none');

  // Stats & History
  const [stats, setStats] = useState<SessionStats>(MOCK_STATS);

  // Part 2 Timer
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scratchpad, setScratchpad] = useState("");
  const [showScratchpad, setShowScratchpad] = useState(false);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Module Specific States
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [readingTimeSpent, setReadingTimeSpent] = useState(0);
  const [showReadingResults, setShowReadingResults] = useState(false);

  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [writingContent, setWritingContent] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [selectedVocabTopic, setSelectedVocabTopic] = useState<VocabularyTopic | null>(null);
  const [showFlashcards, setShowFlashcards] = useState(false);

  const [selectedListeningTest, setSelectedListeningTest] = useState<ListeningTest | null>(null);
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});
  const [listeningTimeSpent, setListeningTimeSpent] = useState(0);
  const [showListeningResults, setShowListeningResults] = useState(false);

  const [mockTestStats, setMockTestStats] = useState({
    completedTests: 3,
    averageBand: 7.0,
    bestModule: 'Speaking'
  });

  const [activeMockTest, setActiveMockTest] = useState<MockTestPackage | null>(null);
  const [mockSession, setMockSession] = useState<MockTestSession | null>(null);

  // Effect for scrolling
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, examinerText]);

  // Speaking Timer Effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (currentPart === ExamPart.PART_2_PREP) {
        speak("Your one minute preparation is up. Please start speaking now.");
        setCurrentPart(ExamPart.PART_2_SPEAK);
        setTimer(120);
        setIsTimerRunning(true);
      } else if (currentPart === ExamPart.PART_2_SPEAK) {
        speak("Thank you. End of Part 2.");
        setCurrentPart(ExamPart.PART_3);
        setShowScratchpad(false);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, currentPart]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find(v => v.lang.includes('GB'));
    if (gbVoice) utterance.voice = gbVoice;

    utterance.onstart = () => setIsActuallySpeaking(true);
    utterance.onend = () => setIsActuallySpeaking(false);
    utterance.onerror = () => setIsActuallySpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStartPractice = (mode: PracticeMode, topic?: Topic, difficulty?: DifficultyLevel, personality: ExaminerPersonality = ExaminerPersonality.PROFESSIONAL) => {
    setView('practice');
    setPracticeMode(mode);
    setSelectedTopic(topic);
    setSessionStartTime(Date.now());
    setConversation([]);
    setCurrentPersonality(personality);

    if (mode === PracticeMode.PART_2_ONLY) {
      setCurrentPart(ExamPart.PART_2_PREP);
      setTimer(60);
      setIsTimerRunning(true);
      setShowScratchpad(true);
      setExaminerText("Hello Candidate. Let's practice Part 2. Here represents your task card.");
      speak("Hello Candidate. Let's practice Part 2. Here represents your task card.");
      setExaminerGesture('greet');
      setTimeout(() => setExaminerGesture('none'), 3000);
    } else {
      setCurrentPart(ExamPart.PART_1);
      const greeting = "Hello there. I am Professor Aethera. Welcome to your IELTS Speaking session. Could you tell me your full name, please?";
      setExaminerText(greeting);
      speak(greeting);
      setExaminerGesture('wave');
      setTimeout(() => setExaminerGesture('none'), 4000);
    }
  };

  const endSessionWithGoodbye = () => {
    const goodbyeText = "Thank you for your performance today. You've shown great potential. Goodbye and good luck with your studies!";
    setExaminerText(goodbyeText);
    speak(goodbyeText);
    setExaminerGesture('wave');

    // Switch back to dashboard after the gesture and speech ends
    setTimeout(() => {
      setExaminerGesture('none');
      setView('dashboard');
    }, 5000);
  };

  const handleAudioStop = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setIsStreaming(true);
    const newTurn: ConversationTurn = { id: Date.now().toString(), role: 'user', timestamp: Date.now() };
    setConversation(prev => [...prev, newTurn]);

    try {
      const b64 = await blobToBase64(audioBlob);
      const callbacks: StreamingCallbacks = {
        onTranscriptChunk: (chunk) => setStreamingTranscript(chunk),
        onExaminerSpeechChunk: (chunk) => setStreamingExaminerText(chunk),
        onComplete: (res) => {
          setIsStreaming(false);
          setIsProcessing(false);
          setConversation(prev => prev.map(t => t.id === newTurn.id ? { ...t, text: res.userTranscript } : t));
          setConversation(prev => [...prev, { id: Date.now().toString(), role: 'examiner', text: res.examinerSpeech, feedback: res.feedback, timestamp: Date.now() }]);
          setExaminerText(res.examinerSpeech);
          speak(res.examinerSpeech);

          // Simulation: update fluency based on feedback
          if (res.feedback) {
            if (res.feedback.pronunciation) {
              setFluencyScore(prev => Math.min(100, Math.max(0, res.feedback!.pronunciation!.overallScore + Math.floor(Math.random() * 10))));
            }
            if (res.feedback.fillerWordCount !== undefined) {
              setFillerCount(res.feedback.fillerWordCount);
            } else {
              setFillerCount(prev => Math.max(0, 10 - Math.floor(res.feedback!.estimatedBand)));
            }
          }
        },
        onError: () => { setIsProcessing(false); setIsStreaming(false); }
      };
      await processUserAudioStreaming(b64, currentPart, "", callbacks, practiceMode, currentPersonality);
    } catch (err) { setIsProcessing(false); setIsStreaming(false); }
  };

  const saveSession = () => { /* Logic to save session info */ };
  const handleSaveVocabulary = (word: string) => { /* Logic to save vocab */ };
  const handleExportPDF = (session: SessionHistory) => { /* SVG/PDF Logic */ };
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleLogout = () => {
    setUser(null);
    setShowProfileModal(false);
    setCurrentModule('home');
  };

  const renderContent = () => {
    if (currentModule === 'home') {
      return <ModuleNavigation onSelectModule={(m) => setCurrentModule(m)} stats={stats} user={user} />;
    }

    if (currentModule === 'speaking') {
      if (view === 'dashboard') return <Dashboard onStartPractice={() => setView('selector')} onStartGrammarCoach={() => handleStartPractice(PracticeMode.GRAMMAR_COACH)} onViewHistory={() => setShowHistory(true)} stats={stats} />;
      if (view === 'selector') return <PracticeSelector onStart={handleStartPractice} onCancel={() => setView('dashboard')} />;
      if (view === 'practice') {
        const lastUserTurn = conversation.filter(t => t.role === 'user' && t.text).slice(-1)[0];

        return (
          <div className="relative min-h-[calc(100vh-120px)] flex flex-col pt-12 pb-32 px-6">
            {/* Immersive Studio Environment - Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.05)_0%,transparent_70%)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[40px] border-indigo-500/5 rounded-[10rem] rotate-12 animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Top Navigation HUD */}
            <header className="fixed top-28 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
              <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[3rem] p-5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] flex items-center justify-between px-10 border-b-white/80">
                <div className="flex items-center gap-8">
                  <button
                    onClick={endSessionWithGoodbye}
                    className="p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group border border-white hover:shadow-lg active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-all" />
                  </button>
                  <div className="h-10 w-[1px] bg-slate-200/50" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                      <span className="text-[0.65rem] font-black text-indigo-500 uppercase tracking-[0.3em]">Module Live</span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
                      {PART_DESCRIPTIONS[currentPart] || "Introduction"}
                      <span className="px-2 py-0.5 bg-slate-900 text-white rounded-lg text-[0.55rem] font-black uppercase tracking-widest">Section {currentPart === ExamPart.PART_1 ? '01' : currentPart === ExamPart.PART_3 ? '03' : '02'}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  {/* Real-time Bio-metrics Summary */}
                  <div className="hidden lg:flex items-center gap-10">
                    <div className="flex flex-col items-center">
                      <span className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Eloquence</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-indigo-600">{fluencyScore}</span>
                        <span className="text-[0.6rem] font-bold text-slate-300">/ 100</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hesitations</span>
                      <span className={`text-xl font-black ${fillerCount > 5 ? 'text-rose-500' : 'text-slate-900'}`}>{fillerCount}</span>
                    </div>
                  </div>

                  {/* Timer Display */}
                  {(currentPart === ExamPart.PART_2_PREP || currentPart === ExamPart.PART_2_SPEAK) ? (
                    <div className={`px-8 py-3 rounded-[1.5rem] border-2 transition-all duration-300 ${timer < 10 ? 'bg-rose-50 border-rose-300 animate-pulse' : 'bg-white border-slate-100 shadow-inner'} flex flex-col items-center`}>
                      <span className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-0.5">Live Sync</span>
                      <span className={`text-2xl font-black ${timer < 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {formatTime(timer)}
                      </span>
                    </div>
                  ) : (
                    <div className="relative group/sim">
                      <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover/sim:opacity-40 transition-opacity" />
                      <div className="relative bg-slate-900 text-white px-8 py-4 rounded-2xl text-[0.7rem] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Live Simulation Active
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Main Stage */}
            <main className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full relative pt-20">

              {/* Central Interaction View */}
              <div className="w-full relative z-10 flex flex-col items-center">
                <VirtualExaminer
                  personality={currentPersonality}
                  isListening={false}
                  isThinking={isProcessing && !isActuallySpeaking}
                  isSpeaking={isActuallySpeaking}
                  examinerText={isStreaming && streamingExaminerText ? streamingExaminerText : examinerText}
                  fluencyScore={fluencyScore}
                  fillerCount={fillerCount}
                  targetBand={user?.targetBand}
                  gesture={examinerGesture}
                />
              </div>

              {/* Floating Transcript HUD - Next Level */}
              <div className={`fixed bottom-44 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${isStreaming || lastUserTurn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
                <div className="bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[2.5rem] p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                  {/* Holographic scanning effect on transcript */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-shimmer" />

                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20" />
                      <div className="relative p-4 bg-indigo-500 text-white rounded-2xl shadow-xl">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">AI Transcript Bridge</span>
                        {isStreaming && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100/50 rounded-full border border-emerald-200/50">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            <span className="text-[0.6rem] font-black text-emerald-600 uppercase tracking-widest">Input Stream Active</span>
                          </div>
                        )}
                      </div>
                      <p className="text-2xl font-black text-slate-900 leading-snug min-h-[1.5rem] tracking-tight">
                        {isStreaming ? (streamingTranscript || "Calibrating voice signals...") : (lastUserTurn?.text || "")}
                      </p>
                      {!isStreaming && lastUserTurn && (
                        <div className="mt-4 flex items-center gap-2 text-[0.6rem] font-black text-indigo-500 uppercase tracking-widest">
                          <Sparkles className="w-3 h-3" /> Grammatically Analyzed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Action Widgets (Scratchpad) */}
              {showScratchpad && (
                <div className="fixed right-10 top-1/2 -translate-y-1/2 w-[22rem] z-40 animate-fade-in-right">
                  <div className="bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[3rem] p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg rotate-3">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Strategy Mat</h3>
                          <p className="text-[0.6rem] text-slate-400 font-bold">Plan your Band 9 structure</p>
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={scratchpad}
                      onChange={(e) => setScratchpad(e.target.value)}
                      placeholder="Brainstorm keys points, advanced idioms, and complex structures..."
                      className="w-full h-80 bg-white/50 border-2 border-slate-100 rounded-[2rem] p-6 text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-inner"
                    />
                    <div className="flex items-center justify-center gap-2 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest bg-slate-100 py-2 rounded-xl">
                      <AlertCircle className="w-3 h-3 text-amber-500" /> Auto-purges post Part 2
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Premium Interactive Control Bar */}
            <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
              <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-5 shadow-[0_32px_128px_-12px_rgba(0,0,0,0.5)] flex items-center justify-between px-10">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${isProcessing ? 'bg-indigo-600/20 ring-4 ring-indigo-500/10' : 'bg-white/5'}`}>
                    <Sparkles className={`w-6 h-6 ${isProcessing ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[0.6rem] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Process Status</p>
                    <p className="text-sm font-black text-white flex items-center gap-2">
                      {isProcessing ? "AI Sythesizing..." : "Link Established"}
                      {!isProcessing && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                    </p>
                  </div>
                </div>

                {/* Central Microphone Hub */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                  <AudioRecorder
                    onRecordingComplete={handleAudioStop}
                    isProcessing={isProcessing}
                    disabled={isStreaming}
                  />
                </div>

                <div className="flex items-center gap-8">
                  <div className="h-12 w-[1px] bg-white/10" />
                  <button
                    onClick={() => setShowScratchpad(!showScratchpad)}
                    className={`p-5 rounded-full transition-all flex items-center gap-4 group/scratch ${showScratchpad ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)]' : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'}`}
                  >
                    <BookOpen className={`w-6 h-6 transition-transform duration-500 ${showScratchpad ? 'scale-110' : 'group-hover/scratch:rotate-12'}`} />
                    <span className="hidden lg:inline text-[0.65rem] font-black uppercase tracking-[0.2em]">Open Tactical HUD</span>
                  </button>
                </div>
              </div>
            </footer>

            <div ref={conversationEndRef} className="pb-20" />

            <style>{`
              @keyframes fade-in-right {
                from { opacity: 0; transform: translate(30px, -50%); }
                to { opacity: 1; transform: translate(0, -50%); }
              }
              .animate-fade-in-right {
                animation: fade-in-right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
              .animate-shimmer {
                animation: shimmer 3s linear infinite;
              }
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>
          </div>
        );
      }
    }

    if (currentModule === 'reading') {
      if (view === 'results' && selectedPassage) return <ReadingResults passage={selectedPassage} answers={readingAnswers} timeSpent={readingTimeSpent} onRetry={() => setView('test')} onBackToDashboard={() => { setView('dashboard'); setSelectedPassage(null); }} />;
      if (view === 'test' && selectedPassage) return <ReadingTest passage={selectedPassage} onComplete={(a, t) => { setReadingAnswers(a); setReadingTimeSpent(t); setView('results'); }} onCancel={() => setView('dashboard')} />;
      return <ReadingDashboard onStartTest={(p) => { setSelectedPassage(p); setView('test'); }} onViewResults={() => { }} />;
    }

    if (currentModule === 'writing') {
      if (view === 'results' && selectedPrompt && writingFeedback) return <WritingResults prompt={selectedPrompt} content={writingContent} feedback={writingFeedback} onRetry={() => setView('test')} onBackToDashboard={() => setView('dashboard')} />;
      if (view === 'test' && selectedPrompt) return <WritingEditor prompt={selectedPrompt} onSubmit={async (c) => { setWritingContent(c); setIsAnalyzing(true); const f = await analyzeWriting(c, selectedPrompt.taskType, selectedPrompt.prompt); setWritingFeedback(f); setIsAnalyzing(false); setView('results'); }} onCancel={() => setView('dashboard')} />;
      return <WritingDashboard onStartTask={(p) => { setSelectedPrompt(p); setView('test'); }} onViewResults={() => { }} />;
    }

    if (currentModule === 'vocabulary') {
      if (showFlashcards && selectedVocabTopic) return <Flashcards topic={selectedVocabTopic} words={SAMPLE_VOCABULARY[selectedVocabTopic.id] || []} onComplete={() => setShowFlashcards(false)} onBack={() => setShowFlashcards(false)} />;
      return <VocabularyDashboard onStartFlashcards={(t) => { setSelectedVocabTopic(t); setShowFlashcards(true); }} onViewWordList={() => { }} stats={{ totalWords: stats.vocabularyBank.length, masteredWords: 10, currentStreak: 5, dailyGoal: 10 }} />;
    }

    if (currentModule === 'listening') {
      if (view === 'results' && selectedListeningTest) return <ListeningResults test={selectedListeningTest} answers={listeningAnswers} timeSpent={listeningTimeSpent} onRetry={() => setView('dashboard')} onBackToDashboard={() => setView('dashboard')} />;
      if (view === 'test' && selectedListeningTest) return <ListeningTestComponent test={selectedListeningTest} onComplete={(a, t) => { setListeningAnswers(a); setListeningTimeSpent(t); setView('results'); }} onCancel={() => setView('dashboard')} />;
      return <ListeningDashboard onStartTest={(t) => { setSelectedListeningTest(t); setView('test'); }} onViewResults={() => { }} />;
    }

    if (currentModule === 'mocktest') {
      if (view === 'test' && activeMockTest) {
        return (
          <MockTestEngine
            testPackage={activeMockTest}
            onComplete={(session) => {
              setMockSession(session);
              setView('results');
            }}
            onCancel={() => {
              setActiveMockTest(null);
              setView('dashboard');
            }}
          />
        );
      }
      if (view === 'results' && mockSession) {
        return (
          <MockTestResults
            session={mockSession}
            onBackToDashboard={() => {
              setMockSession(null);
              setActiveMockTest(null);
              setView('dashboard');
            }}
          />
        );
      }
      return (
        <MockTestDashboard
          onStartFullTest={(pkg) => {
            if (!user) {
              setShowAuthModal(true);
              return;
            }
            setActiveMockTest(pkg);
            setView('test');
          }}
          onStartModuleTest={(m) => {
            setCurrentModule(m);
            setView('dashboard');
          }}
          stats={mockTestStats}
        />
      );
    }

    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{currentModule} coming soon!</h2>
        <button onClick={() => setCurrentModule('home')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Home</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Background Blobs for specific modules or global */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      {/* Navbar - Premium Floating Style */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-[100] transition-all duration-500">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] px-8 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { setCurrentModule('home'); setView('dashboard'); }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-2xl shadow-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Mic className="text-white w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 tracking-tight leading-none">
                IELTS<span className="text-indigo-600">TalkMate</span>
              </span>
              <span className="text-[0.6rem] uppercase tracking-widest font-black text-slate-400 mt-1">
                AI Powered Success
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 pr-6 border-r border-slate-200/50">
              {currentModule !== 'home' && (
                <button
                  onClick={() => { setCurrentModule('home'); setView('dashboard'); }}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Platform Home
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 pl-2">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                <Settings className="w-5 h-5 text-slate-500" />
              </button>

              <div className="flex items-center gap-3 pl-2">
                {user ? (
                  <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <div className="flex flex-col text-right hidden sm:flex">
                      <span className="text-xs font-black text-slate-900 leading-none">{user.name}</span>
                      <span className="text-[0.65rem] font-bold text-indigo-500 mt-0.5">Target: Band {user.targetBand}</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-200 to-purple-100 p-0.5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-slate-200">
                      <div className="w-full h-full rounded-[0.9rem] overflow-hidden bg-white">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    Join Elite
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-32 pb-20">
        {renderContent()}
      </main>

      {/* Sticky Bottom Controls for Speaking only when in practice view */}
      {currentModule === 'speaking' && view === 'practice' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/50 p-6 z-50">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {currentPart === ExamPart.COMPLETED ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                  <Sparkles className="w-6 h-6" />
                  <span>Session Analyzed Successfully!</span>
                </div>
                <button
                  onClick={() => setView('dashboard')}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:shadow-indigo-500/20 transition-all uppercase tracking-widest text-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <AudioRecorder
                onRecordingComplete={handleAudioStop}
                isProcessing={isProcessing}
                disabled={(isTimerRunning && currentPart === ExamPart.PART_2_PREP) || isStreaming}
              />
            )}
          </div>
        </div>
      )}

      {showHistory && <SessionHistoryView sessions={stats.sessions} onViewSession={setSelectedSession} onClose={() => setShowHistory(false)} />}
      {selectedSession && <SessionDetailView session={selectedSession} onClose={() => setSelectedSession(null)} onExportPDF={handleExportPDF} />}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={(user) => {
          setUser(user);
          setShowAuthModal(false);
          if (!user.routine || user.routine.length === 0) {
            setShowOnboarding(true);
          }
        }}
      />

      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUpdate={async (updatedUser) => {
            const result = await userService.updateProfile(user.id, updatedUser);
            setUser(result);
          }}
          onLogout={handleLogout}
        />
      )}

      {showOnboarding && user && (
        <OnboardingModal
          user={user}
          onComplete={async (updatedUser) => {
            const result = await userService.updateProfile(user.id, updatedUser);
            setUser(result);
            setShowOnboarding(false);
          }}
        />
      )}
    </div>
  );
}
