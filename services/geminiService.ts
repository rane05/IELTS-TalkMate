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

export const processUserAudio = async (
  audioBase64: string,
  currentPart: ExamPart,
  previousContext: string,
  practiceMode?: string,
  personality?: string
): Promise<ExaminerResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const model = "gemini-3-flash-preview";

  // Prompt construction to guide the model's state
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
    const response = await ai.models.generateContent({
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

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as ExaminerResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a fallback so the app doesn't crash
    return {
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
        }
      }
    };
  }
};
