import React, { useState, useEffect } from 'react';
import { WritingPrompt } from '../../types/writing';
import { Clock, FileText, AlertCircle, Send, Save, Lightbulb } from 'lucide-react';

interface WritingEditorProps {
    prompt: WritingPrompt;
    onSubmit: (content: string, wordCount: number, timeSpent: number) => void;
    onCancel: () => void;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({ prompt, onSubmit, onCancel }) => {
    const [content, setContent] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(prompt.timeLimit * 60);
    const [showTips, setShowTips] = useState(true);
    const [autoSaved, setAutoSaved] = useState(false);

    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const timeSpent = (prompt.timeLimit * 60) - timeRemaining;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-save every 30 seconds
    useEffect(() => {
        const autoSaveTimer = setInterval(() => {
            if (content.length > 0) {
                localStorage.setItem(`writing_draft_${prompt.id}`, content);
                setAutoSaved(true);
                setTimeout(() => setAutoSaved(false), 2000);
            }
        }, 30000);

        return () => clearInterval(autoSaveTimer);
    }, [content, prompt.id]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        onSubmit(content, wordCount, timeSpent);
    };

    const getWordCountColor = () => {
        if (wordCount < prompt.minWords * 0.8) return 'text-red-600';
        if (wordCount < prompt.minWords) return 'text-yellow-600';
        return 'text-green-600';
    };

    const tips = {
        TASK_1_ACADEMIC: [
            'Start with an overview of the main trends',
            'Use specific data from the chart/graph',
            'Compare and contrast key features',
            'Use varied vocabulary for trends (increase, rise, surge, etc.)'
        ],
        TASK_1_GENERAL: [
            'Use appropriate greeting and closing',
            'Clearly state your purpose in the first paragraph',
            'Organize your points logically',
            'Use appropriate tone (formal/informal)'
        ],
        TASK_2: [
            'Write a clear thesis statement',
            'Use topic sentences for each paragraph',
            'Provide specific examples and evidence',
            'Write a strong conclusion that restates your position'
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{prompt.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                    {prompt.taskType.replace(/_/g, ' ')}
                                </span>
                                <span>Min. {prompt.minWords} words</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Word Count */}
                            <div className="text-center">
                                <div className={`text-3xl font-bold ${getWordCountColor()}`}>
                                    {wordCount}
                                </div>
                                <div className="text-xs text-gray-500">words</div>
                            </div>

                            {/* Timer */}
                            <div className={`px-6 py-3 rounded-xl ${timeRemaining < 300 ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <Clock className={`w-5 h-5 ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`} />
                                    <span className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prompt */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                                {prompt.prompt}
                            </div>
                        </div>
                    </div>

                    {/* Auto-save indicator */}
                    {autoSaved && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                            <Save className="w-4 h-4" />
                            <span>Draft auto-saved</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Editor */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Your Answer</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>
                                        {wordCount < prompt.minWords
                                            ? `${prompt.minWords - wordCount} more words needed`
                                            : 'Minimum word count reached'}
                                    </span>
                                </div>
                            </div>

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start writing your answer here..."
                                className="w-full h-[500px] p-6 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 leading-relaxed resize-none font-serif text-lg"
                                autoFocus
                            />

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={onCancel}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            localStorage.setItem(`writing_draft_${prompt.id}`, content);
                                            alert('Draft saved!');
                                        }}
                                        className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-all flex items-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Draft
                                    </button>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={wordCount < prompt.minWords * 0.5}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                        Submit for Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Writing Tips</h3>
                                </div>
                                <button
                                    onClick={() => setShowTips(!showTips)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    {showTips ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {showTips && (
                                <div className="space-y-3">
                                    {tips[prompt.taskType]?.map((tip, index) => (
                                        <div key={index} className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <span className="text-yellow-600 font-bold flex-shrink-0">{index + 1}.</span>
                                            <p className="text-sm text-gray-700">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Model Answer Preview */}
                            {prompt.modelAnswer && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-bold text-gray-900 mb-2">Model Answer Available</h4>
                                    <p className="text-xs text-gray-600 mb-3">
                                        A band {prompt.bandScore} model answer is available after submission
                                    </p>
                                    <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium text-center">
                                        Submit to view model answer
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Characters:</span>
                                    <span className="font-bold text-gray-900">{content.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Paragraphs:</span>
                                    <span className="font-bold text-gray-900">
                                        {content.split('\n\n').filter(p => p.trim().length > 0).length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Time spent:</span>
                                    <span className="font-bold text-gray-900">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
