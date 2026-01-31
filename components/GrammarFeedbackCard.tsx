import React from 'react';
import { GrammarCoachData } from '../types';
import { CheckCircle2, XCircle, Lightbulb, Sparkles, MessageCircle } from 'lucide-react';

interface Props {
    data: GrammarCoachData;
}

export const GrammarFeedbackCard: React.FC<Props> = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                    <Sparkles className="text-white w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-lg">Grammar Feedback</h3>
            </div>

            <div className="p-6 space-y-6">

                {/* Comparison Section */}
                <div className="grid gap-4">

                    {/* Correction */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Correct Version</div>
                                <p className="text-xl font-medium text-green-900">{data.correctSentence}</p>
                            </div>
                        </div>
                    </div>

                    {/* Original */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="flex items-start gap-3">
                            <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-semibold text-red-800 uppercase tracking-wide mb-1">You Said</div>
                                <p className="text-lg text-red-700 line-through decoration-red-400 decoration-2">{data.originalSentence}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Explanation */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex gap-3">
                        <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-1">Why is this specific correction needed?</h4>
                            <p className="text-blue-800 leading-relaxed">{data.explanation}</p>
                        </div>
                    </div>
                </div>

                {/* Natural Version (Optional) */}
                {data.naturalVersion && data.naturalVersion !== data.correctSentence && (
                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                        <div className="text-sm font-semibold text-purple-600 mb-1 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Native Speaker Way
                        </div>
                        <p className="text-lg text-gray-800 italic">"{data.naturalVersion}"</p>
                    </div>
                )}

                {/* Practice Tip */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                        <div className="font-bold text-amber-800 text-sm mb-1">Practice Tip</div>
                        <div className="text-amber-900">{data.practiceTip}</div>
                    </div>
                </div>

            </div>
        </div>
    );
};
