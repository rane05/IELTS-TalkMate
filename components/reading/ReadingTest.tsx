import React, { useState, useEffect } from 'react';
import { ReadingPassage, ReadingQuestion } from '../../types/reading';
import { Clock, BookOpen, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface ReadingTestProps {
    passage: ReadingPassage;
    onComplete: (answers: Record<string, string>, timeSpent: number) => void;
    onCancel: () => void;
}

export const ReadingTest: React.FC<ReadingTestProps> = ({ passage, onComplete, onCancel }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(passage.timeLimit * 60); // Convert to seconds
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [highlightedText, setHighlightedText] = useState<string>('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    // Auto-submit when time runs out
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        const timeSpent = (passage.timeLimit * 60) - timeRemaining;
        onComplete(answers, timeSpent);
    };

    const currentQ = passage.questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / passage.questions.length) * 100;

    const renderQuestion = (question: ReadingQuestion) => {
        switch (question.type) {
            case 'MULTIPLE_CHOICE':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option, index) => (
                            <label
                                key={index}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[question.id] === option
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={answers[question.id] === option}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    className="w-5 h-5 text-blue-600"
                                />
                                <span className="text-gray-800 font-medium">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'TRUE_FALSE_NOT_GIVEN':
            case 'YES_NO_NOT_GIVEN':
                const options = question.type === 'TRUE_FALSE_NOT_GIVEN'
                    ? ['TRUE', 'FALSE', 'NOT GIVEN']
                    : ['YES', 'NO', 'NOT GIVEN'];

                return (
                    <div className="space-y-3">
                        {options.map((option) => (
                            <label
                                key={option}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[question.id] === option
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={answers[question.id] === option}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    className="w-5 h-5 text-blue-600"
                                />
                                <span className="text-gray-800 font-bold">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'SENTENCE_COMPLETION':
            case 'SHORT_ANSWER':
                return (
                    <input
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-gray-800 font-medium"
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-gray-800 font-medium"
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onCancel}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{passage.title}</h2>
                                <p className="text-sm text-gray-500">{passage.testType} • {passage.difficulty}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Progress */}
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {answeredCount}/{passage.questions.length} answered
                                </span>
                            </div>

                            {/* Timer */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 60 ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                <Clock className={`w-5 h-5 ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`} />
                                <span className={`text-lg font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Passage */}
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 h-fit sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-900">Reading Passage</h3>
                        </div>
                        <div className="prose max-w-none">
                            <div className="text-gray-800 leading-relaxed whitespace-pre-line select-text">
                                {passage.content}
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                            {passage.wordCount} words
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                        {/* Question Navigation */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Questions</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {passage.questions.map((q, index) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestion(index)}
                                        className={`p-3 rounded-lg font-bold transition-all ${currentQuestion === index
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : answers[q.id]
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Current Question */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                                        Question {currentQuestion + 1} of {passage.questions.length}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                        {currentQ.type.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
                                    {currentQ.question}
                                </h3>
                            </div>

                            {renderQuestion(currentQ)}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                                    disabled={currentQuestion === 0}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Previous
                                </button>

                                {currentQuestion < passage.questions.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentQuestion((prev) => prev + 1)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Next
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowConfirmSubmit(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-green-600 text-white hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Submit Test
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit Test?</h3>
                            <p className="text-gray-600">
                                You have answered {answeredCount} out of {passage.questions.length} questions.
                                {answeredCount < passage.questions.length && (
                                    <span className="block mt-2 text-yellow-600 font-medium">
                                        {passage.questions.length - answeredCount} question(s) remain unanswered.
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmSubmit(false)}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                            >
                                Review
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-all"
                            >
                                Submit Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
