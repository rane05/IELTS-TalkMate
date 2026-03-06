import { WritingPrompt, WritingTaskType } from '../types/writing';

export const ACADEMIC_WRITING_PROMPTS: WritingPrompt[] = [
    {
        id: 'W-001',
        title: 'Global Urbanization Trends',
        taskType: WritingTaskType.TASK_1_ACADEMIC,
        prompt: 'The graph below shows the percentage of the population living in urban areas in different parts of the world between 1950 and 2050.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.',
        minWords: 150,
        timeLimit: 20
    }
];

export const GENERAL_WRITING_PROMPTS: WritingPrompt[] = [
    {
        id: 'W-002',
        title: 'Complaint Letter - Formal',
        taskType: WritingTaskType.TASK_1_GENERAL,
        prompt: 'You recently bought a piece of electronic equipment that does not work. You phoned the shop but the manager was not helpful.\n\nWrite a letter to the manager of the shop. In your letter:\n- give details of the equipment you bought\n- explain what the problem is\n- say what you want the manager to do.',
        minWords: 150,
        timeLimit: 20
    }
];
