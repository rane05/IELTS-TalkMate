import { WritingFeedback } from '../types/writing';
import { simulateTextStreaming } from './streamingService';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface WritingStreamingCallbacks {
    onAnalysisChunk?: (chunk: string) => void;
    onPartialFeedback?: (partial: Partial<WritingFeedback>) => void;
    onComplete?: (feedback: WritingFeedback) => void;
    onError?: (error: Error) => void;
}

/**
 * Analyze writing with streaming for real-time feedback
 * This creates a more engaging experience during analysis
 */
export async function analyzeWritingStreaming(
    content: string,
    taskType: string,
    prompt: string,
    callbacks: WritingStreamingCallbacks
): Promise<void> {
    if (!GEMINI_API_KEY) {
        callbacks.onError?.(new Error('Gemini API key not configured'));
        return;
    }

    const analysisPrompt = `You are an expert IELTS examiner. Analyze the following IELTS writing task and provide detailed feedback.

TASK TYPE: ${taskType}
PROMPT: ${prompt}

STUDENT'S ANSWER:
${content}

Provide a comprehensive analysis in the following JSON format:
{
  "taskAchievement": {
    "score": <number 0-9>,
    "comments": [<array of strings>],
    "strengths": [<array of strings>],
    "improvements": [<array of strings>]
  },
  "coherenceCohesion": {
    "score": <number 0-9>,
    "comments": [<array of strings>],
    "strengths": [<array of strings>],
    "improvements": [<array of strings>]
  },
  "lexicalResource": {
    "score": <number 0-9>,
    "comments": [<array of strings>],
    "advancedVocabulary": [<array of impressive words used>],
    "repetitiveWords": [<array of overused words>],
    "suggestions": [<array of vocabulary improvement suggestions>]
  },
  "grammaticalRange": {
    "score": <number 0-9>,
    "comments": [<array of strings>],
    "complexSentences": <number of complex sentences identified>,
    "errors": [
      {
        "text": "<the error>",
        "correction": "<the correction>",
        "explanation": "<why it's wrong>"
      }
    ]
  },
  "overallBand": <number 0-9 (average of all scores)>,
  "wordCount": <number>,
  "estimatedTime": <estimated time in seconds>,
  "band9RephrasedSections": [
    {
      "original": "<a specific sentence or section from student answer>",
      "rephrased": "<how a Band 9 candidate would write it>",
      "explanation": "<explain the specific improvements made in terms of grammar or vocabulary>"
    }
  ]
}

Be specific, constructive, and encouraging. Identify both strengths and areas for improvement.`;

    try {
        // Show initial analyzing message
        callbacks.onAnalysisChunk?.("Analyzing your essay...");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: analysisPrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let accumulatedText = '';
        let analysisMessages = [
            "Reading your essay...",
            "Checking grammar and vocabulary...",
            "Evaluating task achievement...",
            "Analyzing coherence and cohesion...",
            "Calculating band scores...",
            "Preparing detailed feedback..."
        ];
        let messageIndex = 0;

        // Show progressive analysis messages
        const messageInterval = setInterval(() => {
            if (messageIndex < analysisMessages.length) {
                callbacks.onAnalysisChunk?.(analysisMessages[messageIndex]);
                messageIndex++;
            }
        }, 800);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;

            // Try to extract partial feedback
            try {
                // Parse the streaming response format
                const lines = accumulatedText.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6);
                        if (jsonStr.trim() === '[DONE]') continue;

                        const data = JSON.parse(jsonStr);
                        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            // Try to parse as complete JSON
                            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
                                text.match(/\{[\s\S]*\}/);

                            if (jsonMatch) {
                                const feedback = JSON.parse(jsonMatch[1] || jsonMatch[0]);
                                callbacks.onPartialFeedback?.(feedback);
                            }
                        }
                    }
                }
            } catch (e) {
                // Continue accumulating
            }
        }

        clearInterval(messageInterval);

        // Final parse
        const jsonMatch = accumulatedText.match(/```json\n([\s\S]*?)\n```/) ||
            accumulatedText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Could not parse AI response');
        }

        const feedback = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        callbacks.onComplete?.(feedback);

    } catch (error) {
        console.error('Error analyzing writing:', error);

        // Return fallback feedback
        const wordCount = content.trim().split(/\s+/).length;
        const fallbackFeedback: WritingFeedback = {
            taskAchievement: {
                score: 6,
                comments: ['Unable to get AI feedback at this time. Please try again.'],
                strengths: ['Essay submitted successfully'],
                improvements: ['Try submitting again for detailed AI feedback']
            },
            coherenceCohesion: {
                score: 6,
                comments: ['Feedback unavailable'],
                strengths: [],
                improvements: []
            },
            lexicalResource: {
                score: 6,
                comments: ['Feedback unavailable'],
                advancedVocabulary: [],
                repetitiveWords: [],
                suggestions: []
            },
            grammaticalRange: {
                score: 6,
                comments: ['Feedback unavailable'],
                complexSentences: 0,
                errors: []
            },
            overallBand: 6,
            wordCount,
            estimatedTime: 0
        };

        callbacks.onError?.(error as Error);
        callbacks.onComplete?.(fallbackFeedback);
    }
}

/**
 * Original non-streaming function for backward compatibility
 */
export async function analyzeWriting(
    content: string,
    taskType: string,
    prompt: string
): Promise<WritingFeedback> {
    return new Promise((resolve, reject) => {
        analyzeWritingStreaming(content, taskType, prompt, {
            onComplete: resolve,
            onError: reject
        });
    });
}
