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
import { processUserAudio } from './services/geminiService';
import { analyzeWriting } from './services/writingService';
import { ExamPart, ConversationTurn, ExaminerResponse, PracticeMode, Topic, DifficultyLevel, SessionHistory, SessionStats, ExaminerPersonality } from './types';
import { ReadingPassage } from './types/reading';
import { WritingPrompt, WritingFeedback } from './types/writing';
import { VocabularyTopic, VocabularyWord } from './types/vocabulary';
import { ListeningTest } from './types/listening';
import { SAMPLE_VOCABULARY } from './data/vocabularyData';
import { PART_DESCRIPTIONS, MOCK_STATS } from './constants';
import { Mic, Volume2, ArrowLeft, AlertCircle, MessageSquare, BookOpen, Home } from 'lucide-react';

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
  // Main view states - now supports multiple modules
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

  // Stats & History
  const [stats, setStats] = useState<SessionStats>(MOCK_STATS);

  // Part 2 Timer
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scratchpad, setScratchpad] = useState("");
  const [showScratchpad, setShowScratchpad] = useState(false);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Reading Module States
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [readingTimeSpent, setReadingTimeSpent] = useState(0);
  const [showReadingResults, setShowReadingResults] = useState(false);

  // Writing Module States
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [writingContent, setWritingContent] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Vocabulary Module States
  const [selectedVocabTopic, setSelectedVocabTopic] = useState<VocabularyTopic | null>(null);
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Listening Module States
  const [selectedListeningTest, setSelectedListeningTest] = useState<ListeningTest | null>(null);
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});
  const [listeningTimeSpent, setListeningTimeSpent] = useState(0);
  const [showListeningResults, setShowListeningResults] = useState(false);

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
        setShowScratchpad(false);
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

  const handleStartPractice = (mode: PracticeMode, topic?: Topic, difficulty?: DifficultyLevel, personality: ExaminerPersonality = ExaminerPersonality.PROFESSIONAL) => {
    setView('practice');
    setPracticeMode(mode);
    setSelectedTopic(topic);
    setSessionStartTime(Date.now());
    setConversation([]);
    setCurrentPersonality(personality);
    setScratchpad(""); // Reset scratchpad for new session

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
      setShowScratchpad(true);
    } else if (mode === PracticeMode.PART_3_ONLY) {
      setCurrentPart(ExamPart.PART_3);
      setExaminerText("Let's discuss some abstract questions. What do you think about...");
      speak("Let's discuss some abstract questions.");
    } else if (mode === PracticeMode.GRAMMAR_COACH) {
      setCurrentPart(ExamPart.PART_1);
      setExaminerText("Hello! I am your Grammar Coach. I'll help you correct your mistakes while we talk. What would you like to talk about today?");
      speak("Hello! I am your Grammar Coach. I'll help you correct your mistakes while we talk. What would you like to talk about today?");
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

      const response: ExaminerResponse = await processUserAudio(b64, currentPart, context, practiceMode, currentPersonality);

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
        setShowScratchpad(true);
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
      completedParts: [currentPart],
      scratchpadNotes: scratchpad
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

  const handleSaveVocabulary = (word: string) => {
    // Check if word already exists
    if (stats.vocabularyBank.some(item => item.word.toLowerCase() === word.toLowerCase())) {
      return;
    }

    const newItem = {
      word,
      definition: "Review during your next session", // Placeholder or fetch from AI
      example: "Used in your recent IELTS practice session",
      learnedDate: Date.now(),
      reviewCount: 0
    };

    setStats(prev => ({
      ...prev,
      vocabularyBank: [newItem, ...prev.vocabularyBank]
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

  // Main content renderer based on current module
  const renderContent = () => {
    // Home - Module Selection
    if (currentModule === 'home') {
      return (
        <ModuleNavigation
          onSelectModule={(module) => {
            setCurrentModule(module);
            setView('dashboard');
          }}
          stats={{
            speaking: { sessions: stats.totalSessions, band: stats.averageBand },
            vocabulary: { wordsLearned: stats.vocabularyBank.length }
          }}
        />
      );
    }

    // Speaking Module
    if (currentModule === 'speaking') {
      if (view === 'dashboard') {
        return (
          <Dashboard
            onStartPractice={() => setView('selector')}
            onStartGrammarCoach={() => handleStartPractice(PracticeMode.GRAMMAR_COACH)}
            onViewHistory={() => setShowHistory(true)}
            stats={stats}
          />
        );
      } else if (view === 'selector') {
        return (
          <PracticeSelector
            onStart={handleStartPractice}
            onCancel={() => setView('dashboard')}
          />
        );
      } else if (view === 'practice') {
        return (
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
        );
      }
    }

    // Reading Module
    if (currentModule === 'reading') {
      if (view === 'results' && selectedPassage && showReadingResults) {
        return (
          <ReadingResults
            passage={selectedPassage}
            answers={readingAnswers}
            timeSpent={readingTimeSpent}
            onRetry={() => {
              setShowReadingResults(false);
              setView('test');
            }}
            onBackToDashboard={() => {
              setView('dashboard');
              setShowReadingResults(false);
              setSelectedPassage(null);
            }}
          />
        );
      } else if (view === 'test' && selectedPassage) {
        return (
          <ReadingTest
            passage={selectedPassage}
            onComplete={(answers, timeSpent) => {
              setReadingAnswers(answers);
              setReadingTimeSpent(timeSpent);
              setShowReadingResults(true);
              setView('results');
            }}
            onCancel={() => {
              setView('dashboard');
              setSelectedPassage(null);
            }}
          />
        );
      } else {
        return (
          <ReadingDashboard
            onStartTest={(passage) => {
              setSelectedPassage(passage);
              setView('test');
            }}
            onViewResults={() => {
              // TODO: Implement results history view
            }}
          />
        );
      }
    }

    // Writing Module
    if (currentModule === 'writing') {
      if (view === 'results' && selectedPrompt && writingFeedback) {
        return (
          <WritingResults
            prompt={selectedPrompt}
            content={writingContent}
            feedback={writingFeedback}
            onRetry={() => {
              setWritingFeedback(null);
              setWritingContent('');
              setView('test');
            }}
            onBackToDashboard={() => {
              setView('dashboard');
              setWritingFeedback(null);
              setWritingContent('');
              setSelectedPrompt(null);
            }}
          />
        );
      } else if (view === 'test' && selectedPrompt) {
        return (
          <WritingEditor
            prompt={selectedPrompt}
            onSubmit={async (content, wordCount, timeSpent) => {
              setWritingContent(content);
              setIsAnalyzing(true);
              try {
                const feedback = await analyzeWriting(content, selectedPrompt.taskType, selectedPrompt.prompt);
                setWritingFeedback(feedback);
                setView('results');
              } catch (error) {
                console.error('Error analyzing writing:', error);
                alert('Failed to analyze writing. Please try again.');
              } finally {
                setIsAnalyzing(false);
              }
            }}
            onCancel={() => {
              setView('dashboard');
              setSelectedPrompt(null);
              setWritingContent('');
            }}
          />
        );
      } else {
        return (
          <WritingDashboard
            onStartTask={(prompt) => {
              setSelectedPrompt(prompt);
              setView('test');
            }}
            onViewResults={() => {
              // TODO: Implement results history view
            }}
          />
        );
      }
    }

    // Vocabulary Module
    if (currentModule === 'vocabulary') {
      if (showFlashcards && selectedVocabTopic) {
        const topicWords = SAMPLE_VOCABULARY[selectedVocabTopic.id] || [];
        return (
          <Flashcards
            topic={selectedVocabTopic}
            words={topicWords}
            onComplete={(correctCount, totalCount) => {
              setShowFlashcards(false);
              setSelectedVocabTopic(null);
              // TODO: Save progress
            }}
            onBack={() => {
              setShowFlashcards(false);
              setSelectedVocabTopic(null);
            }}
          />
        );
      } else {
        return (
          <VocabularyDashboard
            onStartFlashcards={(topic) => {
              setSelectedVocabTopic(topic);
              setShowFlashcards(true);
            }}
            onViewWordList={(topic) => {
              // TODO: Implement word list view
            }}
            stats={{
              totalWords: stats.vocabularyBank.length,
              masteredWords: Math.floor(stats.vocabularyBank.length * 0.6),
              currentStreak: 5,
              dailyGoal: 10
            }}
          />
        );
      }
    }

    // Listening Module
    if (currentModule === 'listening') {
      if (view === 'results' && selectedListeningTest && showListeningResults) {
        return (
          <ListeningResults
            test={selectedListeningTest}
            answers={listeningAnswers}
            timeSpent={listeningTimeSpent}
            onRetry={() => {
              setShowListeningResults(false);
              setView('dashboard');
              setSelectedListeningTest(null);
            }}
            onBackToDashboard={() => {
              setView('dashboard');
              setShowListeningResults(false);
              setSelectedListeningTest(null);
            }}
          />
        );
      } else if (view === 'test' && selectedListeningTest) {
        return (
          <ListeningTestComponent
            test={selectedListeningTest}
            onComplete={(answers, timeSpent) => {
              setListeningAnswers(answers);
              setListeningTimeSpent(timeSpent);
              setShowListeningResults(true);
              setView('results');
            }}
            onCancel={() => {
              setView('dashboard');
              setSelectedListeningTest(null);
            }}
          />
        );
      } else {
        return (
          <ListeningDashboard
            onStartTest={(test) => {
              setSelectedListeningTest(test);
              setView('test');
            }}
            onViewResults={() => {
              // TODO: Implement results history view
            }}
          />
        );
      }
    }

    // Placeholder for other modules
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {currentModule.charAt(0).toUpperCase() + currentModule.slice(1)} Module
        </h2>
        <p className="text-gray-600 mb-6">This module is coming soon!</p>
        <button
          onClick={() => setCurrentModule('home')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Back to All Modules
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentModule('home'); setView('dashboard'); }}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1.5 rounded-lg">
              <Mic className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">IELTS<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TalkMate</span></span>
          </div>
          <div className="flex items-center gap-4">
            {currentModule !== 'home' && (
              <button
                onClick={() => { setCurrentModule('home'); setView('dashboard'); }}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                <Home className="w-4 h-4" /> All Modules
              </button>
            )}
            {view === 'practice' && currentModule === 'speaking' && (
              <button onClick={() => { setView('dashboard'); saveSession(); }} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> End Session
              </button>
            )}
            {view === 'test' && currentModule === 'reading' && (
              <button onClick={() => { setView('dashboard'); setSelectedPassage(null); }} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Exit Test
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pb-20">{renderContent()}</main>

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
