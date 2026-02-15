import { WritingFeedback } from '../types/writing';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function analyzeWriting(
    content: string,
    taskType: string,
    prompt: string
): Promise<WritingFeedback> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
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
  "estimatedTime": <estimated time in seconds>
}

Be specific, constructive, and encouraging. Identify both strengths and areas for improvement.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
            textResponse.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Could not parse AI response');
        }

        const feedback = JSON.parse(jsonMatch[1] || jsonMatch[0]);

        return feedback;
    } catch (error) {
        console.error('Error analyzing writing:', error);

        // Return fallback feedback
        const wordCount = content.trim().split(/\s+/).length;
        return {
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
    }
}
