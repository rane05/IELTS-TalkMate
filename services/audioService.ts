// Audio generation service for Listening tests
// Uses Web Speech API for text-to-speech

export interface AudioScript {
    text: string;
    voice?: string; // 'male' | 'female' | 'british' | 'american'
    rate?: number; // 0.5 to 2.0 (speed)
    pitch?: number; // 0 to 2 (pitch)
}

export class AudioGenerator {
    private synthesis: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];

    constructor() {
        this.synthesis = window.speechSynthesis;
        this.loadVoices();
    }

    private loadVoices() {
        // Load available voices
        this.voices = this.synthesis.getVoices();

        // If voices aren't loaded yet, wait for them
        if (this.voices.length === 0) {
            this.synthesis.onvoiceschanged = () => {
                this.voices = this.synthesis.getVoices();
            };
        }
    }

    private selectVoice(preference?: string): SpeechSynthesisVoice | null {
        if (this.voices.length === 0) {
            this.voices = this.synthesis.getVoices();
        }

        // Try to find a voice matching the preference
        let selectedVoice: SpeechSynthesisVoice | null = null;

        if (preference === 'british') {
            selectedVoice = this.voices.find(v => v.lang === 'en-GB') || null;
        } else if (preference === 'american') {
            selectedVoice = this.voices.find(v => v.lang === 'en-US') || null;
        } else if (preference === 'female') {
            selectedVoice = this.voices.find(v => v.name.toLowerCase().includes('female')) || null;
        } else if (preference === 'male') {
            selectedVoice = this.voices.find(v => v.name.toLowerCase().includes('male')) || null;
        }

        // Fallback to any English voice
        if (!selectedVoice) {
            selectedVoice = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
        }

        return selectedVoice;
    }

    /**
     * Speak text using Web Speech API
     */
    speak(script: AudioScript): Promise<void> {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            this.synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(script.text);

            // Set voice
            const voice = this.selectVoice(script.voice);
            if (voice) {
                utterance.voice = voice;
            }

            // Set rate and pitch
            utterance.rate = script.rate || 0.9; // Slightly slower for clarity
            utterance.pitch = script.pitch || 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => resolve();
            utterance.onerror = (error) => reject(error);

            this.synthesis.speak(utterance);
        });
    }

    /**
     * Stop any ongoing speech
     */
    stop() {
        this.synthesis.cancel();
    }

    /**
     * Pause speech
     */
    pause() {
        this.synthesis.pause();
    }

    /**
     * Resume paused speech
     */
    resume() {
        this.synthesis.resume();
    }

    /**
     * Check if currently speaking
     */
    isSpeaking(): boolean {
        return this.synthesis.speaking;
    }

    /**
     * Get estimated duration for text (in seconds)
     * Rough estimate: ~150 words per minute at normal rate
     */
    estimateDuration(text: string, rate: number = 0.9): number {
        const words = text.split(/\s+/).length;
        const wordsPerMinute = 150 * rate;
        const minutes = words / wordsPerMinute;
        return Math.ceil(minutes * 60);
    }
}

// Singleton instance
export const audioGenerator = new AudioGenerator();

// Sample listening test scripts
export const LISTENING_SCRIPTS = {
    climate_lecture: `
    Good morning, everyone. Today, we'll be discussing climate change and its effects on marine ecosystems.
    
    Climate change is one of the most pressing environmental issues of our time. Over the past century, global temperatures have risen by approximately 1.5 degrees Celsius. This may not sound like much, but even small changes in temperature can have dramatic effects on our planet's ecosystems.
    
    Marine ecosystems are particularly vulnerable to climate change. As ocean temperatures rise, we're seeing significant changes in marine biodiversity. Coral reefs, often called the rainforests of the sea, are experiencing widespread bleaching events. When water temperatures become too warm, corals expel the algae living in their tissues, causing them to turn white and become more susceptible to disease.
    
    Additionally, ocean acidification is another major concern. As the ocean absorbs more carbon dioxide from the atmosphere, it becomes more acidic. This makes it difficult for marine organisms like shellfish and corals to build their calcium carbonate shells and skeletons.
    
    The consequences extend beyond marine life. Millions of people worldwide depend on healthy oceans for food and livelihoods. Changes in fish populations and marine ecosystems can have serious economic and social impacts.
    
    However, there is hope. By reducing greenhouse gas emissions, protecting marine habitats, and supporting sustainable fishing practices, we can help mitigate these effects and preserve our oceans for future generations.
    
    Now, let's move on to discuss some specific case studies.
  `,

    housing_conversation: `
    Student: Good morning. I'm here to apply for university housing for next semester.
    
    Officer: Good morning! Of course, I'd be happy to help you with that. Do you have your student ID with you?
    
    Student: Yes, here it is.
    
    Officer: Thank you. Let me pull up your information. Okay, I see you're currently in your second year. Are you looking for on-campus or off-campus housing?
    
    Student: I'd prefer on-campus housing if possible. It's more convenient for my classes.
    
    Officer: That's understandable. We have several options available. We have traditional dormitories, which are shared rooms with communal bathrooms. We also have apartment-style housing, which gives you more privacy with a small kitchen and private bathroom.
    
    Student: What's the price difference between the two?
    
    Officer: The traditional dorms are about 800 dollars per month, while the apartment-style housing is around 1,200 dollars per month. Both include utilities.
    
    Student: I think I'll go with the apartment-style housing. When would I need to move in?
    
    Officer: The move-in date for next semester is January 15th. You'll receive an email two weeks before with all the details and your room assignment.
    
    Student: Perfect. What documents do I need to submit?
    
    Officer: You'll need to complete this application form, provide a copy of your student ID, and pay a 200 dollar deposit. The deposit is refundable when you move out, as long as there's no damage to the room.
    
    Student: Okay, I can do that today. Thank you for your help!
    
    Officer: You're welcome! If you have any questions, feel free to contact our office.
  `,

    tech_education: `
    Moderator: Welcome to today's panel discussion on technology in education. We have four distinguished panelists with us today. Let me introduce them.
    
    First, we have Dr. Sarah Chen, a professor of educational technology. Next is Michael Roberts, a high school principal. We also have Lisa Thompson, a software developer specializing in educational apps. And finally, James Wilson, a parent and education advocate.
    
    Let's begin with our first question: How has technology changed the classroom experience?
    
    Dr. Chen: Thank you for having me. Technology has fundamentally transformed education. We've moved from traditional lectures to interactive, multimedia learning experiences. Students can now access information instantly, collaborate with peers globally, and learn at their own pace.
    
    Michael: I'd like to add that in my school, we've seen remarkable improvements in student engagement since introducing tablets and interactive whiteboards. However, we've also faced challenges with ensuring equal access to technology for all students.
    
    Lisa: From a development perspective, we're creating tools that adapt to individual learning styles. Artificial intelligence can now personalize education in ways that weren't possible before.
    
    James: As a parent, I appreciate the convenience, but I'm also concerned about screen time and the loss of face-to-face interaction.
    
    Moderator: Those are all excellent points. Let's explore these issues further.
  `
};
