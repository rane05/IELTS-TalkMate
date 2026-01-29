import React from 'react';
import { SessionHistory, PracticeMode } from '../types';
import { Calendar, Clock, TrendingUp, Award, Download, Eye } from 'lucide-react';

interface SessionHistoryViewProps {
    sessions: SessionHistory[];
    onViewSession: (session: SessionHistory) => void;
    onClose: () => void;
}

export const SessionHistoryView: React.FC<SessionHistoryViewProps> = ({ sessions, onViewSession, onClose }) => {
    const sortedSessions = [...sessions].sort((a, b) => b.date - a.date);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getModeLabel = (mode: PracticeMode) => {
        const labels = {
            [PracticeMode.FULL_TEST]: '🎯 Full Test',
            [PracticeMode.PART_1_ONLY]: '👋 Part 1',
            [PracticeMode.PART_2_ONLY]: '🎤 Part 2',
            [PracticeMode.PART_3_ONLY]: '💬 Part 3',
        };
        return labels[mode];
    };

    const getBandColor = (band: number) => {
        if (band >= 7) return 'text-green-600 bg-green-50';
        if (band >= 6) return 'text-blue-600 bg-blue-50';
        if (band >= 5) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Session History</h2>
                            <p className="text-gray-600 text-sm mt-1">{sessions.length} total sessions</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white rounded-full transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {sortedSessions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sessions Yet</h3>
                            <p className="text-gray-500">Start practicing to see your history here!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer"
                                    onClick={() => onViewSession(session)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Left Side - Info */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                                    {getModeLabel(session.mode)}
                                                </span>
                                                {session.topic && (
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                        {session.topic.name}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(session.date)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDuration(session.duration)}
                                                </div>
                                            </div>

                                            {/* Scores Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div className={`text-lg font-bold ${getBandColor(session.averageBand)}`}>
                                                        {session.averageBand}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Band</div>
                                                </div>
                                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div className="text-lg font-bold text-gray-900">{session.grammarScore}%</div>
                                                    <div className="text-xs text-gray-500">Grammar</div>
                                                </div>
                                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div className="text-lg font-bold text-gray-900">{session.fluencyScore}%</div>
                                                    <div className="text-xs text-gray-500">Fluency</div>
                                                </div>
                                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div className="text-lg font-bold text-gray-900">{session.pronunciationScore}%</div>
                                                    <div className="text-xs text-gray-500">Pronunciation</div>
                                                </div>
                                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div className="text-lg font-bold text-gray-900">{session.vocabularyScore}%</div>
                                                    <div className="text-xs text-gray-500">Vocabulary</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side - Action */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewSession(session);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
