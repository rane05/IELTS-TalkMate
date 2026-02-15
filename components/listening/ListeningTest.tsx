import React, { useState, useEffect, useRef } from 'react';
import { ListeningTest } from '../../types/listening';
import { Play, Pause, RotateCcw, Volume2, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { audioGenerator, LISTENING_SCRIPTS } from '../../services/audioService';

interface ListeningTestProps {
    test: ListeningTest;
    onComplete: (answers: Record<string, string>, timeSpent: number) => void;
    onCancel: () => void;
}

export const ListeningTestComponent: React.FC<ListeningTestProps> = ({ test, onComplete, onCancel }) => {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const [notes, setNotes] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const currentSection = test.sections[currentSectionIndex];
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Get audio script based on test ID
    const getAudioScript = () => {
        if (test.id === 'listen1') return LISTENING_SCRIPTS.climate_lecture;
        if (test.id === 'listen2') return LISTENING_SCRIPTS.housing_conversation;
        if (test.id === 'listen3') return LISTENING_SCRIPTS.tech_education;
        return LISTENING_SCRIPTS.climate_lecture; // fallback
    };

    // Calculate audio duration on mount
    useEffect(() => {
        const script = getAudioScript();
        const duration = audioGenerator.estimateDuration(script);
        setAudioDuration(duration);
    }, [test.id]);

    // Timer for time spent
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            audioGenerator.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioTimerRef.current) clearInterval(audioTimerRef.current);
        };
    }, []);

    const togglePlayPause = async () => {
        if (isPlaying) {
            // Pause
            audioGenerator.pause();
            setIsPlaying(false);
            if (audioTimerRef.current) {
                clearInterval(audioTimerRef.current);
                audioTimerRef.current = null;
            }
        } else {
            // Play
            setIsPlaying(true);

            // Start audio timer
            audioTimerRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 1;
                    if (newTime >= audioDuration) {
                        // Audio finished
                        setIsPlaying(false);
                        if (audioTimerRef.current) {
                            clearInterval(audioTimerRef.current);
                            audioTimerRef.current = null;
                        }
                        // Auto-advance to next section
                        if (currentSectionIndex < test.sections.length - 1) {
                            setTimeout(() => {
                                setCurrentSectionIndex(prev => prev + 1);
                                setCurrentTime(0);
                            }, 2000);
                        }
                        return audioDuration;
                    }
                    return newTime;
                });
            }, 1000);

            // Speak the audio
            try {
                const script = getAudioScript();
                await audioGenerator.speak({
                    text: script,
                    voice: 'british',
                    rate: 0.9
                });
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        }
    };

    const restartAudio = () => {
        audioGenerator.stop();
        setCurrentTime(0);
        setIsPlaying(false);
        if (audioTimerRef.current) {
            clearInterval(audioTimerRef.current);
            audioTimerRef.current = null;
        }
        // Auto-play after restart
        setTimeout(() => togglePlayPause(), 100);
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        audioGenerator.stop();
        const totalQuestions = test.sections.reduce((sum, section) => sum + section.questions.length, 0);
        const answeredCount = Object.keys(answers).length;

        if (answeredCount < totalQuestions) {
            setShowConfirmModal(true);
        } else {
            onComplete(answers, timeSpent);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const answeredInSection = currentSection.questions.filter(q => answers[q.id]).length;
    const totalInSection = currentSection.questions.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    audioGenerator.stop();
                                    onCancel();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{test.title}</h2>
                                <p className="text-gray-600">{test.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-center px-4 py-2 bg-blue-100 rounded-xl">
                                <div className="text-xs text-blue-600 font-semibold">Time Spent</div>
                                <div className="text-lg font-bold text-blue-700">{formatTime(timeSpent)}</div>
                            </div>
                            <div className="text-center px-4 py-2 bg-green-100 rounded-xl">
                                <div className="text-xs text-green-600 font-semibold">Progress</div>
                                <div className="text-lg font-bold text-green-700">
                                    {Object.keys(answers).length}/{test.totalQuestions}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Navigation */}
                    <div className="flex gap-2 flex-wrap">
                        {test.sections.map((section, idx) => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    audioGenerator.stop();
                                    setCurrentSectionIndex(idx);
                                    setCurrentTime(0);
                                    setIsPlaying(false);
                                }}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${idx === currentSectionIndex
                                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Section {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Audio Player & Notes */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Audio Player */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Volume2 className="w-5 h-5 text-orange-600" />
                                {currentSection.title}
                            </h3>

                            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 mb-4">
                                <div className="text-center mb-4">
                                    <div className="text-sm text-orange-700 mb-2">Audio Duration</div>
                                    <div className="text-2xl font-bold text-orange-900">
                                        {formatTime(currentTime)} / {formatTime(audioDuration)}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="bg-white rounded-full h-2 mb-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all"
                                        style={{ width: `${audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0}%` }}
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={restartAudio}
                                        className="p-3 bg-white hover:bg-gray-50 rounded-full transition-all shadow-md"
                                        disabled={isPlaying}
                                    >
                                        <RotateCcw className="w-5 h-5 text-orange-600" />
                                    </button>
                                    <button
                                        onClick={togglePlayPause}
                                        className="p-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-full transition-all shadow-lg"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6 text-white" />
                                        ) : (
                                            <Play className="w-6 h-6 text-white" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* AI Audio Info */}
                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-sm text-green-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4" />
                                    <strong>AI-Generated Audio</strong>
                                </div>
                                <p>Using Web Speech API for realistic text-to-speech playback!</p>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Take notes while listening..."
                                className="w-full h-40 p-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Questions</h3>
                                <span className="text-sm text-gray-600">
                                    {answeredInSection}/{totalInSection} answered in this section
                                </span>
                            </div>

                            <div className="space-y-6">
                                {currentSection.questions.map((question, idx) => (
                                    <div
                                        key={question.id}
                                        className={`p-6 rounded-xl border-2 transition-all ${answers[question.id]
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-gray-50 border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="px-3 py-1 bg-orange-600 text-white rounded-lg font-bold text-sm">
                                                Q{idx + 1}
                                            </div>
                                            <p className="flex-1 text-gray-800 font-medium">{question.question}</p>
                                        </div>

                                        {question.type === 'MULTIPLE_CHOICE' && question.options ? (
                                            <div className="space-y-2 ml-12">
                                                {question.options.map((option, optIdx) => (
                                                    <label
                                                        key={optIdx}
                                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-300 cursor-pointer transition-all"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={question.id}
                                                            value={option}
                                                            checked={answers[question.id] === option}
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                            className="w-4 h-4 text-orange-600"
                                                        />
                                                        <span className="text-gray-700">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="ml-12">
                                                <input
                                                    type="text"
                                                    value={answers[question.id] || ''}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    placeholder="Type your answer..."
                                                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Total: {Object.keys(answers).length} of {test.totalQuestions} questions answered
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Submit Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Test?</h3>
                        <p className="text-gray-600 mb-6">
                            You have answered {Object.keys(answers).length} out of {test.totalQuestions} questions.
                            Are you sure you want to submit?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                            >
                                Continue Test
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    onComplete(answers, timeSpent);
                                }}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all"
                            >
                                Submit Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
