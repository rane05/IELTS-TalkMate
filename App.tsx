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
import { processUserAudio } from './services/geminiService';
import { processUserAudioStreaming, StreamingCallbacks } from './services/streamingService';
import { analyzeWriting } from './services/writingService';
import { ExamPart, ConversationTurn, ExaminerResponse, PracticeMode, Topic, DifficultyLevel, SessionHistory, SessionStats, ExaminerPersonality } from './types';
import { ReadingPassage } from './types/reading';
import { WritingPrompt, WritingFeedback } from './types/writing';
import { VocabularyTopic, VocabularyWord } from './types/vocabulary';
import { ListeningTest } from './types/listening';
import { MockTestPackage, MockTestSession } from './types/mocktest';
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
    } else {
      setCurrentPart(ExamPart.PART_1);
      setExaminerText("Good afternoon. My name is Sarah. Could you tell me your full name?");
      speak("Good afternoon. My name is Sarah. Could you tell me your full name?");
    }
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

  const renderContent = () => {
    if (currentModule === 'home') {
      return <ModuleNavigation onSelectModule={(m) => setCurrentModule(m)} stats={stats} />;
    }

    if (currentModule === 'speaking') {
      if (view === 'dashboard') return <Dashboard onStartPractice={() => setView('selector')} onStartGrammarCoach={() => handleStartPractice(PracticeMode.GRAMMAR_COACH)} onViewHistory={() => setShowHistory(true)} stats={stats} />;
      if (view === 'selector') return <PracticeSelector onStart={handleStartPractice} onCancel={() => setView('dashboard')} />;
      if (view === 'practice') {
        return (
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Status Bar */}
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Section</h2>
                  <p className="font-black text-slate-900">{PART_DESCRIPTIONS[currentPart] || "Introduction"}</p>
                </div>
              </div>

              {(currentPart === ExamPart.PART_2_PREP || currentPart === ExamPart.PART_2_SPEAK) && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Remaining</p>
                    <div className={`text-2xl font-black ${timer < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-900'}`}>
                      {formatTime(timer)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <VirtualExaminer
              personality={currentPersonality}
              isListening={false} // AudioRecorder handles this visually, but we can pass state if needed
              isThinking={isProcessing && !isActuallySpeaking}
              isSpeaking={isActuallySpeaking}
              examinerText={isStreaming && streamingExaminerText ? streamingExaminerText : examinerText}
              fluencyScore={fluencyScore}
              fillerCount={fillerCount}
            />

            {/* Part 2 Scratchpad */}
            {showScratchpad && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-sm border border-amber-200 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500 rounded-lg">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-amber-900">Digital Scratchpad</h3>
                      <p className="text-xs text-amber-700">Notes will disappear after Part 2</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScratchpad(false)}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-800"
                  >
                    Hide
                  </button>
                </div>
                <textarea
                  value={scratchpad}
                  onChange={(e) => setScratchpad(e.target.value)}
                  placeholder="Structure your talk here... (bullet points, keywords, ideas)"
                  className="w-full h-40 bg-white/50 border-2 border-amber-200 rounded-xl p-3 text-gray-800 placeholder-amber-400 focus:outline-none focus:border-amber-400 transition-colors resize-none shadow-inner"
                />
              </div>
            )}

            {/* User Transcript Display */}
            {isStreaming && streamingTranscript && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 animate-fade-in">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-purple-900 mb-1 flex items-center gap-2">
                      You said:
                      <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"></span>
                    </div>
                    <p className="text-gray-800 italic">"{streamingTranscript}"</p>
                  </div>
                </div>
              </div>
            )}

            {!isStreaming && conversation.filter(t => t.role === 'user' && t.text).slice(-1).map((turn) => (
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
                  {turn.feedback && (
                    <FeedbackCard
                      feedback={turn.feedback}
                      onSaveVocabulary={handleSaveVocabulary}
                    />
                  )}
                </div>
              ))}
            </div>

            <div ref={conversationEndRef} />
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

              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-black text-slate-900 leading-none">Pranav Rane</span>
                  <span className="text-[0.65rem] font-bold text-indigo-500 mt-0.5">Pro Member</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 p-0.5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-slate-200">
                  <div className="w-full h-full rounded-[0.9rem] overflow-hidden bg-white">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav" alt="avatar" />
                  </div>
                </div>
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
    </div>
  );
}
