import React from 'react';
import { PronunciationData } from '../types';
import { Volume2, TrendingUp, AlertCircle } from 'lucide-react';

interface PronunciationCardProps {
    pronunciation: PronunciationData;
}

export const PronunciationCard: React.FC<PronunciationCardProps> = ({ pronunciation }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 60) return 'text-blue-600 bg-blue-50';
        if (score >= 40) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Work';
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-600 rounded-full">
                    <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Pronunciation Analysis</h3>
                    <p className="text-sm text-gray-600">AI-powered speech assessment</p>
                </div>
            </div>

            {/* Overall Score */}
            <div className="mb-6 text-center p-4 bg-white rounded-xl shadow-sm">
                <div className={`text-5xl font-bold mb-2 ${getScoreColor(pronunciation.overallScore)}`}>
                    {pronunciation.overallScore}
                </div>
                <div className="text-sm font-semibold text-gray-600">
                    {getScoreLabel(pronunciation.overallScore)}
                </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white p-3 rounded-xl text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(pronunciation.clarity)}`}>
                        {pronunciation.clarity}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Clarity</div>
                </div>
                <div className="bg-white p-3 rounded-xl text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(pronunciation.intonation)}`}>
                        {pronunciation.intonation}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Intonation</div>
                </div>
                <div className="bg-white p-3 rounded-xl text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(pronunciation.wordStress)}`}>
                        {pronunciation.wordStress}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Word Stress</div>
                </div>
            </div>

            {/* Problematic Words */}
            {pronunciation.problematicWords.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-sm text-red-900">Words to Practice</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {pronunciation.problematicWords.map((word, index) => (
                            <span key={index} className="px-3 py-1 bg-white text-red-700 rounded-full text-sm font-medium border border-red-200">
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {pronunciation.suggestions.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-blue-900">Improvement Tips</span>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                        {pronunciation.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
