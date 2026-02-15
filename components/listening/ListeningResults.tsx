import React from 'react';
import { ListeningTest } from '../../types/listening';
import { Award, Clock, CheckCircle, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

interface ListeningResultsProps {
    test: ListeningTest;
    answers: Record<string, string>;
    timeSpent: number;
    onRetry: () => void;
    onBackToDashboard: () => void;
}

export const ListeningResults: React.FC<ListeningResultsProps> = ({
    test,
    answers,
    timeSpent,
    onRetry,
    onBackToDashboard
}) => {
    // Calculate results
    const allQuestions = test.sections.flatMap(section => section.questions);
    const results = allQuestions.map(question => {
        const userAnswer = answers[question.id]?.trim().toLowerCase() || '';
        const correctAnswer = Array.isArray(question.correctAnswer)
            ? question.correctAnswer.map(a => a.toLowerCase())
            : [question.correctAnswer.toLowerCase()];

        const isCorrect = correctAnswer.some(ans => userAnswer === ans);

        return {
            question,
            userAnswer: answers[question.id] || 'Not answered',
            isCorrect
        };
    });

    const correctCount = results.filter(r => r.isCorrect).length;
    const scorePercentage = Math.round((correctCount / allQuestions.length) * 100);

    // Simplified band score calculation
    const bandScore =
        correctCount >= 36 ? 9 :
            correctCount >= 32 ? 8 :
                correctCount >= 26 ? 7 :
                    correctCount >= 20 ? 6 :
                        correctCount >= 15 ? 5 :
                            correctCount >= 10 ? 4 : 3;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBackToDashboard}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Listening Test Results</h1>
                        <p className="text-gray-600">{test.title}</p>
                    </div>
                </div>

                {/* Overall Band Score */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl p-8 text-white text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Award className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Overall Band Score</h2>
                    </div>
                    <div className="text-7xl font-bold mb-2">{bandScore}</div>
                    <p className="text-orange-100 text-lg">
                        {bandScore >= 7 ? 'Excellent listening skills!' :
                            bandScore >= 6 ? 'Good performance!' :
                                bandScore >= 5 ? 'Fair attempt. Keep practicing!' :
                                    'Keep working on your listening skills!'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-semibold text-gray-600">Score</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{correctCount}/{allQuestions.length}</div>
                        <div className="text-sm text-gray-600 mt-1">{scorePercentage}% correct</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-600">Time Taken</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{formatTime(timeSpent)}</div>
                        <div className="text-sm text-gray-600 mt-1">Total duration</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Award className="w-6 h-6 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-600">Passing Score</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">
                            {correctCount >= test.passingScore ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {correctCount >= test.passingScore ? 'Passed!' : `Need ${test.passingScore - correctCount} more`}
                        </div>
                    </div>
                </div>

                {/* Performance Analysis */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Strengths
                            </h4>
                            <ul className="space-y-2 text-sm text-green-800">
                                {scorePercentage >= 70 && <li>• Strong overall comprehension</li>}
                                {correctCount >= test.passingScore && <li>• Met the passing criteria</li>}
                                {timeSpent < test.duration && <li>• Good time management</li>}
                                {scorePercentage >= 50 && <li>• Decent understanding of main ideas</li>}
                            </ul>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                Areas for Improvement
                            </h4>
                            <ul className="space-y-2 text-sm text-blue-800">
                                {scorePercentage < 70 && <li>• Practice more listening exercises</li>}
                                {scorePercentage < 50 && <li>• Focus on understanding main ideas</li>}
                                <li>• Take notes while listening</li>
                                <li>• Practice with different accents</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section-by-Section Results */}
                {test.sections.map((section, sectionIdx) => {
                    const sectionResults = results.filter(r =>
                        section.questions.some(q => q.id === r.question.id)
                    );
                    const sectionCorrect = sectionResults.filter(r => r.isCorrect).length;
                    const sectionTotal = sectionResults.length;

                    return (
                        <div key={section.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Section {sectionIdx + 1}: {section.title}
                                </h3>
                                <div className="px-6 py-3 bg-orange-100 rounded-xl">
                                    <span className="text-2xl font-bold text-orange-700">
                                        {sectionCorrect}/{sectionTotal}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {sectionResults.map((result, idx) => (
                                    <div
                                        key={result.question.id}
                                        className={`p-6 rounded-xl border-2 ${result.isCorrect
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-red-50 border-red-200'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                }`}>
                                                {result.isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-white" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900 mb-2">
                                                    Question {idx + 1}: {result.question.question}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-600 mb-1">Your Answer:</div>
                                                        <div className={`font-medium ${result.isCorrect ? 'text-green-700' : 'text-red-700'
                                                            }`}>
                                                            {result.userAnswer}
                                                        </div>
                                                    </div>

                                                    {!result.isCorrect && (
                                                        <div>
                                                            <div className="text-xs font-semibold text-gray-600 mb-1">Correct Answer:</div>
                                                            <div className="font-medium text-green-700">
                                                                {Array.isArray(result.question.correctAnswer)
                                                                    ? result.question.correctAnswer.join(' or ')
                                                                    : result.question.correctAnswer}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {result.question.explanation && (
                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                        <div className="text-xs font-semibold text-blue-900 mb-1">Explanation:</div>
                                                        <div className="text-sm text-blue-800">{result.question.explanation}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center flex-wrap">
                    <button
                        onClick={onRetry}
                        className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Try Another Test
                    </button>

                    <button
                        onClick={onBackToDashboard}
                        className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
