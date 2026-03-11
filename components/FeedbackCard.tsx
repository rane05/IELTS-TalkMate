import React from 'react';
import { motion } from 'framer-motion';
import { FeedbackData } from '../types';
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp, BookOpen, Activity, Sparkles } from 'lucide-react';
import { PronunciationCard } from './PronunciationCard';

interface FeedbackCardProps {
  feedback: FeedbackData;
  onSaveVocabulary?: (word: string) => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onSaveVocabulary }) => {
  const band = feedback.estimatedBand;
  const bandColor = band >= 7.5 ? '#10b981' : band >= 6 ? '#6366f1' : '#f59e0b';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
      style={{ fontFamily: 'Outfit, Inter, sans-serif' }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center justify-between">
          <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
            <Activity className="w-4 h-4" /> AI Analysis
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-black text-white/70 uppercase tracking-widest">Estimated Band</span>
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="px-3 py-1 rounded-xl font-black text-sm text-white"
              style={{ background: `${bandColor}30`, border: `2px solid ${bandColor}` }}
            >
              {band}
            </motion.span>
          </div>
        </div>

        <div className="p-5 space-y-5">

          {/* Grammar section */}
          {feedback.grammarMistakes.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" /> Grammar Corrections
              </div>
              <div className="space-y-1.5">
                {feedback.grammarMistakes.map((mistake, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">•</span>
                    {mistake}
                  </motion.div>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm text-emerald-800">
                <span className="font-black text-emerald-700">Better: </span>
                {feedback.correctedVersion}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-emerald-600 font-black text-sm"
            >
              <CheckCircle className="w-5 h-5" /> Excellent grammar! Keep it up.
            </motion.div>
          )}

          {/* Fluency + Vocabulary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-indigo-100/80">
              <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase tracking-widest mb-2">
                <TrendingUp className="w-3.5 h-3.5" /> Fluency
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{feedback.fluencyFeedback}</p>
              {feedback.fillerWordCount !== undefined && (
                <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center justify-between">
                  <span className="text-[0.6rem] uppercase font-black text-indigo-500 tracking-widest">Filler Words</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${feedback.fillerWordCount > 3 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {feedback.fillerWordCount}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 rounded-xl border border-purple-100/80">
              <div className="flex items-center gap-2 text-purple-700 font-black text-xs uppercase tracking-widest mb-2">
                <BookOpen className="w-3.5 h-3.5" /> Vocabulary
              </div>
              <div className="flex flex-wrap gap-2">
                {feedback.vocabularySuggestions.slice(0, 4).map((word, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.06 * i }}
                    whileHover={{ scale: 1.07, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSaveVocabulary?.(word)}
                    className="px-3 py-1 bg-white rounded-full border border-purple-200 text-xs font-bold text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-all shadow-sm"
                    title="Save to Vocabulary Bank"
                  >
                    {word} <span className="opacity-50 ml-0.5">+</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="flex items-start gap-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
            <div className="p-1.5 bg-amber-100 rounded-xl">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-black text-amber-700">Pro Tip: </span>
              {feedback.improvementTip}
            </p>
          </div>

          {/* C1 Fluent Version */}
          {feedback.moreFluentVersion && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3" /> Band 9 Native Version
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "{feedback.moreFluentVersion}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pronunciation Card */}
      {feedback.pronunciation && (
        <PronunciationCard pronunciation={feedback.pronunciation} />
      )}
    </motion.div>
  );
};
