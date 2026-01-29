import React from 'react';
import { FeedbackData } from '../types';
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp, BookOpen, Activity } from 'lucide-react';
import { PronunciationCard } from './PronunciationCard';

interface FeedbackCardProps {
  feedback: FeedbackData;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-fade-in">
        <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
          <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
            <Activity className="w-4 h-4" /> AI Analysis
          </h3>
          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
            Band {feedback.estimatedBand}
          </span>
        </div>

        <div className="p-4 space-y-4">

          {/* Grammar Section */}
          {feedback.grammarMistakes.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
                <AlertTriangle className="w-4 h-4" /> Grammar Corrections
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {feedback.grammarMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
              <div className="bg-green-50 p-2 rounded text-sm text-green-800 border border-green-100">
                <span className="font-semibold">Better: </span> {feedback.correctedVersion}
              </div>
            </div>
          ) : (
            <div className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Excellent grammar!
            </div>
          )}

          {/* Fluency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-800 font-medium text-sm mb-1">
                <TrendingUp className="w-4 h-4" /> Fluency
              </div>
              <p className="text-xs text-blue-900">{feedback.fluencyFeedback}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-purple-800 font-medium text-sm mb-1">
                <BookOpen className="w-4 h-4" /> Vocabulary
              </div>
              <div className="flex flex-wrap gap-1">
                {feedback.vocabularySuggestions.slice(0, 3).map((word, i) => (
                  <span key={i} className="bg-white px-2 py-0.5 rounded border border-purple-200 text-xs text-purple-700">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800"><span className="font-bold">Pro Tip:</span> {feedback.improvementTip}</p>
          </div>

          {/* C1 Version */}
          <div className="text-xs text-gray-400 mt-2 border-t pt-2">
            <span className="uppercase font-bold tracking-wider">C1 Native Version:</span> {feedback.moreFluentVersion}
          </div>
        </div>
      </div>

      {/* Pronunciation Card (if available) */}
      {feedback.pronunciation && (
        <PronunciationCard pronunciation={feedback.pronunciation} />
      )}
    </div>
  );
};
