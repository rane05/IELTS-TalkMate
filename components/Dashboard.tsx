import React from 'react';
import { SessionStats } from '../types';
import { MOCK_STATS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, Clock, Book, Activity, History, TrendingUp, TrendingDown, Volume2, BookOpen } from 'lucide-react';

interface DashboardProps {
  onStartPractice: () => void;
  onStartGrammarCoach?: () => void;
  onViewHistory?: () => void;
  stats?: SessionStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartPractice, onStartGrammarCoach, onViewHistory, stats = MOCK_STATS }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your IELTS Progress
        </h1>
        <p className="text-gray-500">Track your improvement and consistency over time.</p>
        <div className="flex justify-center gap-3 mt-4">
          <div className="px-4 py-2 bg-indigo-50 rounded-full text-sm">
            <span className="font-semibold text-indigo-600">{stats.totalSessions}</span> Sessions Completed
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-full text-sm">
            <span className="font-semibold text-purple-600">{stats.totalPracticeTime}</span> Minutes Practiced
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center transform hover:scale-105 transition-all">
          <div className="p-3 bg-white/20 rounded-full mb-3">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-4xl font-bold">{stats.averageBand}</span>
          <span className="text-sm text-indigo-100 mt-1">Average Band</span>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center transform hover:scale-105 transition-all">
          <div className="p-3 bg-white/20 rounded-full mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-4xl font-bold">{stats.fluencyScore}%</span>
          <span className="text-sm text-green-100 mt-1">Fluency</span>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center transform hover:scale-105 transition-all">
          <div className="p-3 bg-white/20 rounded-full mb-3">
            <Book className="w-6 h-6" />
          </div>
          <span className="text-4xl font-bold">{stats.grammarScore}%</span>
          <span className="text-sm text-blue-100 mt-1">Grammar</span>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center transform hover:scale-105 transition-all">
          <div className="p-3 bg-white/20 rounded-full mb-3">
            <Volume2 className="w-6 h-6" />
          </div>
          <span className="text-4xl font-bold">{stats.pronunciationScore}%</span>
          <span className="text-sm text-purple-100 mt-1">Pronunciation</span>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center transform hover:scale-105 transition-all">
          <div className="p-3 bg-white/20 rounded-full mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-4xl font-bold">{stats.vocabularyScore}%</span>
          <span className="text-sm text-amber-100 mt-1">Vocabulary</span>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-green-900">Your Strengths</h3>
          </div>
          <div className="space-y-2">
            {stats.strongAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-2 text-green-700">
                <span className="text-green-500">✓</span>
                <span className="text-sm font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-900">Areas to Improve</h3>
          </div>
          <div className="space-y-2">
            {stats.weakAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-2 text-amber-700">
                <span className="text-amber-500">→</span>
                <span className="text-sm font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Band Score Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.recentAttempts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis domain={[0, 9]} hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="band" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200 flex flex-col items-center justify-center text-center space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Ready to Practice?</h3>
          <p className="text-gray-600 max-w-xs">Start a new speaking session with AI feedback and track your progress.</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={onStartPractice}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full"
            >
              🎯 Full IELTS Practice
            </button>
            {onStartGrammarCoach && (
              <button
                onClick={onStartGrammarCoach}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full flex items-center justify-center gap-2"
              >
                ✍️ Speak with Grammar Coach
              </button>
            )}
            {onViewHistory && (
              <button
                onClick={onViewHistory}
                className="bg-white hover:bg-gray-50 text-indigo-600 text-sm font-semibold px-6 py-3 rounded-xl border-2 border-indigo-200 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
              >
                <History className="w-4 h-4" />
                View Session History
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vocabulary Bank Preview */}
      {stats.vocabularyBank.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Your Vocabulary Bank ({stats.vocabularyBank.length} words)
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.vocabularyBank.slice(0, 10).map((item, index) => (
              <div key={index} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-100 transition-all cursor-pointer" title={item.definition}>
                {item.word}
              </div>
            ))}
            {stats.vocabularyBank.length > 10 && (
              <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                +{stats.vocabularyBank.length - 10} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
