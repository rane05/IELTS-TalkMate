import React from 'react';
import { WritingFeedback, WritingPrompt } from '../../types/writing';
import { Award, BookOpen, MessageCircle, CheckCircle, XCircle, TrendingUp, ArrowLeft, FileText } from 'lucide-react';

interface WritingResultsProps {
    prompt: WritingPrompt;
    content: string;
    feedback: WritingFeedback;
    onRetry: () => void;
    onBackToDashboard: () => void;
    onViewModelAnswer?: () => void;
}

export const WritingResults: React.FC<WritingResultsProps> = ({
    prompt,
    content,
    feedback,
    onRetry,
    onBackToDashboard,
    onViewModelAnswer
}) => {
    const criteriaData = [
        {
            name: 'Task Achievement',
            score: feedback.taskAchievement.score,
            color: 'blue',
            icon: <CheckCircle className="w-6 h-6" />,
            data: feedback.taskAchievement
        },
        {
            name: 'Coherence & Cohesion',
            score: feedback.coherenceCohesion.score,
            color: 'purple',
            icon: <MessageCircle className="w-6 h-6" />,
            data: feedback.coherenceCohesion
        },
        {
            name: 'Lexical Resource',
            score: feedback.lexicalResource.score,
            color: 'pink',
            icon: <BookOpen className="w-6 h-6" />,
            data: feedback.lexicalResource
        },
        {
            name: 'Grammatical Range',
            score: feedback.grammaticalRange.score,
            color: 'green',
            icon: <FileText className="w-6 h-6" />,
            data: feedback.grammaticalRange
        }
    ];

    const getScoreColor = (score: number) => {
        if (score >= 7) return 'text-green-600';
        if (score >= 6) return 'text-blue-600';
        if (score >= 5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score: number) => {
        if (score >= 7) return 'bg-green-100';
        if (score >= 6) return 'bg-blue-100';
        if (score >= 5) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBackToDashboard}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Writing Feedback</h1>
                        <p className="text-gray-600">{prompt.title}</p>
                    </div>
                </div>

                {/* Overall Band Score */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Award className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Overall Band Score</h2>
                    </div>
                    <div className="text-7xl font-bold mb-2">{feedback.overallBand}</div>
                    <p className="text-green-100 text-lg">
                        {feedback.overallBand >= 7 ? 'Excellent work!' :
                            feedback.overallBand >= 6 ? 'Good performance!' :
                                feedback.overallBand >= 5 ? 'Fair attempt. Keep practicing!' :
                                    'Keep working on your writing skills!'}
                    </p>
                </div>

                {/* Criteria Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {criteriaData.map((criteria) => (
                        <div key={criteria.name} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                            <div className={`p-3 bg-${criteria.color}-100 rounded-xl w-fit mb-3`}>
                                <div className={`text-${criteria.color}-600`}>{criteria.icon}</div>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">{criteria.name}</h3>
                            <div className={`text-4xl font-bold ${getScoreColor(criteria.score)}`}>
                                {criteria.score}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
                        <div className="text-sm text-gray-600 mb-1">Word Count</div>
                        <div className="text-3xl font-bold text-gray-900">{feedback.wordCount}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {feedback.wordCount >= prompt.minWords ? '✓ Meets requirement' : `Need ${prompt.minWords - feedback.wordCount} more`}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
                        <div className="text-sm text-gray-600 mb-1">Complex Sentences</div>
                        <div className="text-3xl font-bold text-gray-900">{feedback.grammaticalRange.complexSentences}</div>
                        <div className="text-xs text-gray-500 mt-1">Identified in your writing</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
                        <div className="text-sm text-gray-600 mb-1">Grammar Errors</div>
                        <div className="text-3xl font-bold text-gray-900">{feedback.grammaticalRange.errors.length}</div>
                        <div className="text-xs text-gray-500 mt-1">Found and corrected below</div>
                    </div>
                </div>

                {/* Detailed Feedback Sections */}
                {criteriaData.map((criteria) => (
                    <div key={criteria.name} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{criteria.name}</h3>
                            <div className={`px-6 py-3 rounded-xl ${getScoreBg(criteria.score)}`}>
                                <span className={`text-2xl font-bold ${getScoreColor(criteria.score)}`}>
                                    {criteria.score}/9
                                </span>
                            </div>
                        </div>

                        {/* Comments */}
                        {criteria.data.comments && criteria.data.comments.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Overall Assessment</h4>
                                <div className="space-y-2">
                                    {criteria.data.comments.map((comment, idx) => (
                                        <p key={idx} className="text-gray-600 leading-relaxed">{comment}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Strengths */}
                        {criteria.data.strengths && criteria.data.strengths.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Strengths
                                </h4>
                                <div className="space-y-2">
                                    {criteria.data.strengths.map((strength, idx) => (
                                        <div key={idx} className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <span className="text-green-600">✓</span>
                                            <p className="text-gray-700">{strength}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Improvements */}
                        {criteria.data.improvements && criteria.data.improvements.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    Areas for Improvement
                                </h4>
                                <div className="space-y-2">
                                    {criteria.data.improvements.map((improvement, idx) => (
                                        <div key={idx} className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <span className="text-blue-600">→</span>
                                            <p className="text-gray-700">{improvement}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Vocabulary Analysis */}
                {(feedback.lexicalResource.advancedVocabulary.length > 0 ||
                    feedback.lexicalResource.repetitiveWords.length > 0) && (
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Vocabulary Analysis</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Advanced Vocabulary */}
                                {feedback.lexicalResource.advancedVocabulary.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            Advanced Vocabulary Used
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.lexicalResource.advancedVocabulary.map((word, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Repetitive Words */}
                                {feedback.lexicalResource.repetitiveWords.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <XCircle className="w-5 h-5 text-yellow-600" />
                                            Overused Words
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.lexicalResource.repetitiveWords.map((word, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Vocabulary Suggestions */}
                            {feedback.lexicalResource.suggestions && feedback.lexicalResource.suggestions.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-700 mb-3">Vocabulary Suggestions</h4>
                                    <div className="space-y-2">
                                        {feedback.lexicalResource.suggestions.map((suggestion, idx) => (
                                            <p key={idx} className="text-gray-600 leading-relaxed">• {suggestion}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                {/* Grammar Errors */}
                {feedback.grammaticalRange.errors.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Grammar Corrections</h3>
                        <div className="space-y-4">
                            {feedback.grammaticalRange.errors.map((error, idx) => (
                                <div key={idx} className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <div className="text-xs font-semibold text-red-600 mb-1">❌ Your text:</div>
                                            <div className="text-gray-800 font-medium">{error.text}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-green-600 mb-1">✓ Correction:</div>
                                            <div className="text-gray-800 font-medium">{error.correction}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold">Explanation:</span> {error.explanation}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Your Essay */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Essay</h3>
                    <div className="prose max-w-none">
                        <div className="whitespace-pre-line text-gray-800 leading-relaxed font-serif text-lg">
                            {content}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center flex-wrap">
                    <button
                        onClick={onRetry}
                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                        Write Another Essay
                    </button>

                    {prompt.modelAnswer && onViewModelAnswer && (
                        <button
                            onClick={onViewModelAnswer}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                            View Model Answer (Band {prompt.bandScore})
                        </button>
                    )}

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
