import React from 'react';
import { ReadingPassage } from '../../types/reading';
import { CheckCircle, XCircle, Clock, Award, BookOpen, TrendingUp, ArrowLeft } from 'lucide-react';

interface ReadingResultsProps {
    passage: ReadingPassage;
    answers: Record<string, string>;
    timeSpent: number;
    onRetry: () => void;
    onBackToDashboard: () => void;
}

export const ReadingResults: React.FC<ReadingResultsProps> = ({
    passage,
    answers,
    timeSpent,
    onRetry,
    onBackToDashboard
}) => {
    // Calculate score
    const results = passage.questions.map((question) => {
        const userAnswer = answers[question.id]?.trim().toLowerCase() || '';
        const correctAnswer = Array.isArray(question.correctAnswer)
            ? question.correctAnswer.map(a => a.toLowerCase())
            : [question.correctAnswer.toLowerCase()];

        const isCorrect = correctAnswer.includes(userAnswer);

        return {
            question,
            userAnswer: answers[question.id] || 'Not answered',
            isCorrect
        };
    });

    const correctCount = results.filter(r => r.isCorrect).length;
    const totalQuestions = passage.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // Estimate band score (simplified)
    const bandScore = scorePercentage >= 90 ? 9 :
        scorePercentage >= 80 ? 8 :
            scorePercentage >= 70 ? 7 :
                scorePercentage >= 60 ? 6 :
                    scorePercentage >= 50 ? 5 :
                        scorePercentage >= 40 ? 4 : 3;

    const readingSpeed = Math.round((passage.wordCount / timeSpent) * 60); // words per minute

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
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
                        <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
                        <p className="text-gray-600">{passage.title}</p>
                    </div>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5" />
                            <span className="text-sm text-blue-100">Band Score</span>
                        </div>
                        <div className="text-4xl font-bold">{bandScore}</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm text-green-100">Score</span>
                        </div>
                        <div className="text-4xl font-bold">{scorePercentage}%</div>
                        <div className="text-sm text-green-100 mt-1">{correctCount}/{totalQuestions} correct</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm text-purple-100">Time Taken</span>
                        </div>
                        <div className="text-4xl font-bold">{Math.floor(timeSpent / 60)}</div>
                        <div className="text-sm text-purple-100 mt-1">minutes</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm text-orange-100">Reading Speed</span>
                        </div>
                        <div className="text-4xl font-bold">{readingSpeed}</div>
                        <div className="text-sm text-orange-100 mt-1">words/min</div>
                    </div>
                </div>

                {/* Performance Analysis */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className={`p-6 rounded-xl ${scorePercentage >= 70 ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                            <h3 className={`font-bold mb-2 ${scorePercentage >= 70 ? 'text-green-900' : 'text-yellow-900'}`}>
                                Overall Performance
                            </h3>
                            <p className={`text-sm ${scorePercentage >= 70 ? 'text-green-700' : 'text-yellow-700'}`}>
                                {scorePercentage >= 90 ? 'Excellent! You have a strong understanding of the passage.' :
                                    scorePercentage >= 70 ? 'Good work! You understood most of the passage well.' :
                                        scorePercentage >= 50 ? 'Fair performance. Review the passage and explanations to improve.' :
                                            'Keep practicing! Focus on understanding the main ideas and details.'}
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-blue-50 border-2 border-blue-200">
                            <h3 className="font-bold text-blue-900 mb-2">Reading Speed</h3>
                            <p className="text-sm text-blue-700">
                                {readingSpeed >= 250 ? 'Excellent reading speed! You read efficiently.' :
                                    readingSpeed >= 200 ? 'Good reading speed. You\'re reading at a comfortable pace.' :
                                        readingSpeed >= 150 ? 'Average reading speed. Consider practicing speed reading techniques.' :
                                            'Take time to improve your reading speed through regular practice.'}
                            </p>
                        </div>
                    </div>

                    {/* Question-by-Question Review */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Question Review</h3>
                        {results.map((result, index) => (
                            <div
                                key={result.question.id}
                                className={`p-6 rounded-xl border-2 ${result.isCorrect
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${result.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {result.isCorrect ? (
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-gray-900">Question {index + 1}</span>
                                            <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600">
                                                {result.question.type.replace(/_/g, ' ')}
                                            </span>
                                        </div>

                                        <p className="text-gray-800 font-medium mb-3">{result.question.question}</p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-700">Your answer:</span>
                                                <span className={result.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                                                    {result.userAnswer}
                                                </span>
                                            </div>

                                            {!result.isCorrect && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Correct answer:</span>
                                                    <span className="text-green-700 font-medium">
                                                        {Array.isArray(result.question.correctAnswer)
                                                            ? result.question.correctAnswer.join(' or ')
                                                            : result.question.correctAnswer}
                                                    </span>
                                                </div>
                                            )}

                                            {result.question.explanation && (
                                                <div className="mt-3 p-3 bg-white rounded-lg">
                                                    <span className="font-semibold text-gray-700 block mb-1">Explanation:</span>
                                                    <p className="text-gray-600">{result.question.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onRetry}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                        Try Again
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
