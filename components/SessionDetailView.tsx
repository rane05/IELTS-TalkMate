import React from 'react';
import { SessionHistory } from '../types';
import { X, Download, TrendingUp, MessageSquare, Award } from 'lucide-react';

interface SessionDetailViewProps {
    session: SessionHistory;
    onClose: () => void;
    onExportPDF: (session: SessionHistory) => void;
}

export const SessionDetailView: React.FC<SessionDetailViewProps> = ({ session, onClose, onExportPDF }) => {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} minutes ${secs} seconds`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Session Details</h2>
                            <p className="text-indigo-100 text-sm">{formatDate(session.date)}</p>
                            <p className="text-indigo-100 text-sm">Duration: {formatDuration(session.duration)}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onExportPDF(session)}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                                title="Export as PDF"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Overall Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-2xl text-center">
                            <Award className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                            <div className="text-3xl font-bold text-indigo-600">{session.averageBand}</div>
                            <div className="text-sm text-gray-600 mt-1">Overall Band</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-center">
                            <div className="text-2xl font-bold text-blue-600">{session.grammarScore}%</div>
                            <div className="text-sm text-gray-600 mt-1">Grammar</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl text-center">
                            <div className="text-2xl font-bold text-green-600">{session.fluencyScore}%</div>
                            <div className="text-sm text-gray-600 mt-1">Fluency</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl text-center">
                            <div className="text-2xl font-bold text-purple-600">{session.pronunciationScore}%</div>
                            <div className="text-sm text-gray-600 mt-1">Pronunciation</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl text-center">
                            <div className="text-2xl font-bold text-amber-600">{session.vocabularyScore}%</div>
                            <div className="text-sm text-gray-600 mt-1">Vocabulary</div>
                        </div>
                    </div>

                    {/* Conversation Transcript */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Full Conversation
                        </h3>
                        <div className="space-y-4">
                            {session.conversation.map((turn, index) => (
                                <div key={turn.id} className={`${turn.role === 'examiner' ? 'bg-indigo-50' : 'bg-gray-50'} p-4 rounded-xl`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${turn.role === 'examiner' ? 'bg-indigo-600' : 'bg-gray-600'
                                            }`}>
                                            {turn.role === 'examiner' ? 'E' : 'Y'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm text-gray-700 mb-1">
                                                {turn.role === 'examiner' ? 'Examiner' : 'You'}
                                            </div>
                                            {turn.text && (
                                                <p className="text-gray-800 mb-2">{turn.text}</p>
                                            )}
                                            {turn.audioUrl && (
                                                <audio controls className="w-full mt-2" src={turn.audioUrl} />
                                            )}

                                            {/* Feedback for user turns */}
                                            {turn.feedback && turn.role === 'examiner' && (
                                                <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-200 space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="font-semibold text-indigo-600">Band Score:</span>
                                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                                                            {turn.feedback.estimatedBand}
                                                        </span>
                                                    </div>

                                                    {turn.feedback.grammarMistakes.length > 0 && (
                                                        <div className="text-sm">
                                                            <span className="font-semibold text-red-600">Grammar Issues:</span>
                                                            <ul className="list-disc list-inside text-gray-700 ml-2">
                                                                {turn.feedback.grammarMistakes.map((mistake, i) => (
                                                                    <li key={i}>{mistake}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {turn.feedback.correctedVersion && (
                                                        <div className="text-sm">
                                                            <span className="font-semibold text-green-600">Corrected:</span>
                                                            <p className="text-gray-700 italic ml-2">"{turn.feedback.correctedVersion}"</p>
                                                        </div>
                                                    )}

                                                    {turn.feedback.pronunciation && (
                                                        <div className="text-sm">
                                                            <span className="font-semibold text-purple-600">Pronunciation:</span>
                                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                                <div className="text-xs">Clarity: {turn.feedback.pronunciation.clarity}%</div>
                                                                <div className="text-xs">Intonation: {turn.feedback.pronunciation.intonation}%</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {turn.feedback.improvementTip && (
                                                        <div className="text-sm bg-amber-50 p-2 rounded border border-amber-200">
                                                            <span className="font-semibold text-amber-700">💡 Tip:</span>
                                                            <p className="text-gray-700 ml-2">{turn.feedback.improvementTip}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
