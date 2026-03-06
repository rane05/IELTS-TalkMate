import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExaminerResponse, ExamPart } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const feedbackSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        examinerSpeech: { type: Type.STRING, description: "The words the examiner says to the student." },
        userTranscript: { type: Type.STRING, description: "What the user said (transcribed from audio)." },
        isExamFinished: { type: Type.BOOLEAN, description: "Whether the IELTS test has concluded." },
        feedback: {
            type: Type.OBJECT,
            properties: {
                grammarMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctedVersion: { type: Type.STRING },
                moreFluentVersion: { type: Type.STRING },
                vocabularySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                fluencyFeedback: { type: Type.STRING },
                estimatedBand: { type: Type.NUMBER },
                improvementTip: { type: Type.STRING },
                fillerWordCount: { type: Type.NUMBER, description: "Count of filler words like um, ah, uh, like, you know" },
                pronunciation: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.NUMBER, description: "Overall pronunciation score 0-100" },
                        clarity: { type: Type.NUMBER, description: "Clarity score 0-100" },
                        intonation: { type: Type.NUMBER, description: "Intonation score 0-100" },
                        wordStress: { type: Type.NUMBER, description: "Word stress score 0-100" },
                        problematicWords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["overallScore", "clarity", "intonation", "wordStress"]
                }
            },
            required: ["grammarMistakes", "correctedVersion", "estimatedBand", "improvementTip", "pronunciation", "fillerWordCount"]
        }
    },
    required: ["examinerSpeech", "feedback"]
};

export interface StreamingCallbacks {
    onTranscriptChunk?: (chunk: string) => void;
    onExaminerSpeechChunk?: (chunk: string) => void;
    onFeedbackChunk?: (partialFeedback: Partial<ExaminerResponse>) => void;
    onComplete?: (response: ExaminerResponse) => void;
    onError?: (error: Error) => void;
}

/**
 * Process user audio with streaming responses for real-time feedback
 * This provides a more natural, conversational experience
 */
export const processUserAudioStreaming = async (
    audioBase64: string,
    currentPart: ExamPart,
    previousContext: string,
    callbacks: StreamingCallbacks,
    practiceMode?: string,
    personality?: string
): Promise<void> => {
    if (!apiKey) {
        callbacks.onError?.(new Error("API Key is missing."));
        return;
    }

    const model = "gemini-3-flash-preview";

    // Prompt construction
    const personalityContext = personality === 'ENCOURAGING'
        ? "EXAMINER PERSONALITY: Encouraging and warm. Use positive reinforcement, friendly nods (verbal), and a supportive tone."
        : personality === 'STRICT'
            ? "EXAMINER PERSONALITY: Strict and highly formal. Avoid small talk, be direct, and use a serious, authoritative tone."
            : "EXAMINER PERSONALITY: Neutral and professional, sticking strictly to IELTS protocols.";

    const modeContext = practiceMode === 'GRAMMAR_COACH'
        ? `MODE: GRAMMAR COACH. Your primary goal is to help the user improve their grammar. ${personalityContext}`
        : `MODE: IELTS EXAM. Be professional and realistic. ${personalityContext}`;

    const fillerWordInstruction = "FLUENCY ANALYSIS: Count the number of filler words (um, ah, uh, like, you know) used by the user and return it in 'fillerWordCount'.";

    const partContext = `${modeContext}
  ${fillerWordInstruction}
  Current Exam Phase: ${currentPart}. 
  Previous conversation context: ${previousContext}. 
  If Phase is PART_2_PREP, provide a Cue Card topic in 'examinerSpeech' and ask user to tell you when they are ready to speak.
  If Phase is PART_2_SPEAK, listen to the speech, provide specific feedback, and transition to Part 3 questions.
  Analyze pronunciation carefully including clarity, intonation, and word stress patterns.
  `;

    try {
        // Use streaming API
        const stream = await ai.models.generateContentStream({
            model: model,
            contents: {
                parts: [
                    {
                        text: partContext
                    },
                    {
                        inlineData: {
                            mimeType: "audio/wav",
                            data: audioBase64
                        }
                    }
                ]
            },
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: feedbackSchema
            }
        });

        let accumulatedText = '';
        let partialResponse: Partial<ExaminerResponse> = {};

        // Process chunks as they arrive
        for await (const chunk of stream) {
            const chunkText = chunk.text || '';
            accumulatedText += chunkText;

            // Try to parse partial JSON to extract what we can
            try {
                // Attempt to parse accumulated text
                const parsed = JSON.parse(accumulatedText);
                partialResponse = parsed;

                // Notify about examiner speech chunks
                if (parsed.examinerSpeech && callbacks.onExaminerSpeechChunk) {
                    callbacks.onExaminerSpeechChunk(parsed.examinerSpeech);
                }

                // Notify about transcript chunks
                if (parsed.userTranscript && callbacks.onTranscriptChunk) {
                    callbacks.onTranscriptChunk(parsed.userTranscript);
                }

                // Notify about partial feedback
                if (callbacks.onFeedbackChunk) {
                    callbacks.onFeedbackChunk(partialResponse);
                }
            } catch (e) {
                // JSON not complete yet, continue accumulating
                // Try to extract partial fields using regex for better UX

                // Extract examiner speech if available
                const speechMatch = accumulatedText.match(/"examinerSpeech"\s*:\s*"([^"]*)"/);
                if (speechMatch && callbacks.onExaminerSpeechChunk) {
                    callbacks.onExaminerSpeechChunk(speechMatch[1]);
                }

                // Extract user transcript if available
                const transcriptMatch = accumulatedText.match(/"userTranscript"\s*:\s*"([^"]*)"/);
                if (transcriptMatch && callbacks.onTranscriptChunk) {
                    callbacks.onTranscriptChunk(transcriptMatch[1]);
                }
            }
        }

        // Final parse
        const finalResponse = JSON.parse(accumulatedText) as ExaminerResponse;
        callbacks.onComplete?.(finalResponse);

    } catch (error) {
        console.error("Gemini Streaming API Error:", error);

        const fallbackResponse: ExaminerResponse = {
            examinerSpeech: "I'm having trouble connecting to the evaluation server. Please try again.",
            isExamFinished: false,
            userTranscript: "",
            feedback: {
                grammarMistakes: [],
                correctedVersion: "Error processing audio.",
                moreFluentVersion: "",
                vocabularySuggestions: [],
                fluencyFeedback: "Check internet connection.",
                estimatedBand: 0,
                improvementTip: "Ensure your API key is valid.",
                pronunciation: {
                    overallScore: 0,
                    clarity: 0,
                    intonation: 0,
                    wordStress: 0,
                    problematicWords: [],
                    suggestions: []
                },
                fillerWordCount: 0
            }
        };

        callbacks.onError?.(error as Error);
        callbacks.onComplete?.(fallbackResponse);
    }
};

/**
 * Simulated streaming for text-based responses (for writing analysis)
 * This creates a typewriter effect for better UX
 */
export const simulateTextStreaming = (
    text: string,
    onChunk: (chunk: string) => void,
    chunkSize: number = 3,
    delayMs: number = 30
): Promise<void> => {
    return new Promise((resolve) => {
        const words = text.split(' ');
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex >= words.length) {
                clearInterval(interval);
                resolve();
                return;
            }

            const chunk = words.slice(currentIndex, currentIndex + chunkSize).join(' ') + ' ';
            onChunk(chunk);
            currentIndex += chunkSize;
        }, delayMs);
    });
};
