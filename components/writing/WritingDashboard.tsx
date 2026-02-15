import React, { useState } from 'react';
import { WritingPrompt, WritingTaskType, Task1AcademicType, Task1GeneralType } from '../../types/writing';
import { PenTool, Clock, FileText, Award, Play, TrendingUp } from 'lucide-react';

interface WritingDashboardProps {
    onStartTask: (prompt: WritingPrompt) => void;
    onViewResults: () => void;
    stats?: {
        totalAttempts: number;
        averageBand: number;
        averageWordCount: number;
    };
}

// Sample prompts
const SAMPLE_PROMPTS: WritingPrompt[] = [
    {
        id: 'task1-academic-1',
        taskType: WritingTaskType.TASK_1_ACADEMIC,
        task1Type: Task1AcademicType.LINE_GRAPH,
        title: 'Internet Users by Age Group',
        prompt: 'The line graph below shows the percentage of internet users in different age groups in a country from 2000 to 2020.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        imageUrl: '/images/line-graph-sample.png', // Placeholder
        minWords: 150,
        timeLimit: 20,
        modelAnswer: 'The line graph illustrates the proportion of internet users across various age demographics in a particular country over a twenty-year period from 2000 to 2020...',
        bandScore: 7.5
    },
    {
        id: 'task1-general-1',
        taskType: WritingTaskType.TASK_1_GENERAL,
        task1Type: Task1GeneralType.FORMAL_LETTER,
        title: 'Complaint Letter to Manager',
        prompt: 'You recently stayed at a hotel and were disappointed with the service you received.\n\nWrite a letter to the hotel manager. In your letter:\n• Explain when you stayed and what room you had\n• Describe the problems you experienced\n• Say what action you would like the manager to take\n\nWrite at least 150 words.',
        minWords: 150,
        timeLimit: 20
    },
    {
        id: 'task2-1',
        taskType: WritingTaskType.TASK_2,
        title: 'Technology and Social Interaction',
        prompt: 'Some people believe that technology has made our lives more complex and stressful, while others think it has made life easier and more convenient.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        minWords: 250,
        timeLimit: 40
    },
    {
        id: 'task2-2',
        taskType: WritingTaskType.TASK_2,
        title: 'Education and Employment',
        prompt: 'In many countries, young people are finding it increasingly difficult to get a job after graduation.\n\nWhat are the causes of this problem?\nWhat solutions can you suggest?\n\nWrite at least 250 words.',
        minWords: 250,
        timeLimit: 40
    },
    {
        id: 'task2-3',
        taskType: WritingTaskType.TASK_2,
        title: 'Environmental Protection',
        prompt: 'Some people think that environmental problems should be solved on a global scale, while others believe it is better to deal with them nationally.\n\nDiscuss both views and give your opinion.\n\nWrite at least 250 words.',
        minWords: 250,
        timeLimit: 40
    }
];

export const WritingDashboard: React.FC<WritingDashboardProps> = ({
    onStartTask,
    onViewResults,
    stats = { totalAttempts: 0, averageBand: 0, averageWordCount: 0 }
}) => {
    const [selectedType, setSelectedType] = useState<WritingTaskType | 'ALL'>('ALL');

    const filteredPrompts = SAMPLE_PROMPTS.filter(prompt =>
        selectedType === 'ALL' || prompt.taskType === selectedType
    );

    const getTaskTypeLabel = (type: WritingTaskType) => {
        switch (type) {
            case WritingTaskType.TASK_1_ACADEMIC:
                return 'Task 1 Academic';
            case WritingTaskType.TASK_1_GENERAL:
                return 'Task 1 General';
            case WritingTaskType.TASK_2:
                return 'Task 2';
        }
    };

    const getTaskTypeColor = (type: WritingTaskType) => {
        switch (type) {
            case WritingTaskType.TASK_1_ACADEMIC:
                return 'bg-blue-100 text-blue-700';
            case WritingTaskType.TASK_1_GENERAL:
                return 'bg-purple-100 text-purple-700';
            case WritingTaskType.TASK_2:
                return 'bg-green-100 text-green-700';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
                        <PenTool className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Writing Module
                    </h1>
                </div>
                <p className="text-gray-600 text-lg">
                    Practice Task 1 & Task 2 with AI-powered feedback
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6" />
                        <span className="text-sm text-green-100">Total Essays</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.totalAttempts}</div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-6 h-6" />
                        <span className="text-sm text-blue-100">Average Band</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.averageBand || '-'}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-sm text-purple-100">Avg Words</span>
                    </div>
                    <div className="text-4xl font-bold">{stats.averageWordCount || '-'}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Task Type</h3>
                <div className="flex flex-wrap gap-3">
                    {['ALL', WritingTaskType.TASK_1_ACADEMIC, WritingTaskType.TASK_1_GENERAL, WritingTaskType.TASK_2].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type as any)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedType === type
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {type === 'ALL' ? 'All Tasks' : getTaskTypeLabel(type as WritingTaskType)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrompts.map((prompt) => (
                    <div
                        key={prompt.id}
                        className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-green-300 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getTaskTypeColor(prompt.taskType)}`}>
                                {getTaskTypeLabel(prompt.taskType)}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{prompt.timeLimit} min</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                            {prompt.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-4 leading-relaxed">
                            {prompt.prompt}
                        </p>

                        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                            <span>Min. {prompt.minWords} words</span>
                            {prompt.task1Type && (
                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                    {(prompt.task1Type as string).replace(/_/g, ' ')}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => onStartTask(prompt)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                            <Play className="w-5 h-5" />
                            Start Writing
                        </button>
                    </div>
                ))}
            </div>

            {/* View Results Button */}
            {stats.totalAttempts > 0 && (
                <div className="text-center">
                    <button
                        onClick={onViewResults}
                        className="bg-white hover:bg-gray-50 text-green-600 font-semibold px-8 py-4 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all inline-flex items-center gap-2"
                    >
                        <TrendingUp className="w-5 h-5" />
                        View All Submissions
                    </button>
                </div>
            )}

            {/* Tips Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-8">
                <h3 className="text-2xl font-bold text-green-900 mb-4">Writing Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                        <div className="text-2xl">📝</div>
                        <div>
                            <h4 className="font-bold text-green-900 mb-1">Plan Before Writing</h4>
                            <p className="text-sm text-green-700">Spend 5 minutes planning your essay structure and main points.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">⏱️</div>
                        <div>
                            <h4 className="font-bold text-green-900 mb-1">Manage Your Time</h4>
                            <p className="text-sm text-green-700">Task 1: 20 minutes, Task 2: 40 minutes. Practice with a timer!</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">📊</div>
                        <div>
                            <h4 className="font-bold text-green-900 mb-1">Use Varied Vocabulary</h4>
                            <p className="text-sm text-green-700">Demonstrate your lexical range with synonyms and topic-specific words.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">✅</div>
                        <div>
                            <h4 className="font-bold text-green-900 mb-1">Check Your Work</h4>
                            <p className="text-sm text-green-700">Reserve 5 minutes to proofread for grammar and spelling errors.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
