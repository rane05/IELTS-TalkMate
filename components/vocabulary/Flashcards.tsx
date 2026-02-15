import React, { useState, useEffect } from 'react';
import { VocabularyWord, VocabularyTopic } from '../../types/vocabulary';
import { ArrowLeft, ArrowRight, Check, X, Volume2, BookOpen, RotateCcw } from 'lucide-react';

interface FlashcardsProps {
    topic: VocabularyTopic;
    words: VocabularyWord[];
    onComplete: (correctCount: number, totalCount: number) => void;
    onBack: () => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ topic, words, onComplete, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
    const [unknownWords, setUnknownWords] = useState<Set<string>>(new Set());
    const [showResults, setShowResults] = useState(false);

    const currentWord = words[currentIndex];
    const progress = ((currentIndex + 1) / words.length) * 100;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleKnow = () => {
        setKnownWords(prev => new Set([...prev, currentWord.id]));
        nextCard();
    };

    const handleDontKnow = () => {
        setUnknownWords(prev => new Set([...prev, currentWord.id]));
        nextCard();
    };

    const nextCard = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        } else {
            setShowResults(true);
        }
    };

    const previousCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const restart = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownWords(new Set());
        setUnknownWords(new Set());
        setShowResults(false);
    };

    if (showResults) {
        const correctCount = knownWords.size;
        const totalCount = words.length;
        const percentage = Math.round((correctCount / totalCount) * 100);

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Session Complete!</h2>
                        <p className="text-xl text-gray-600 mb-8">Great job reviewing {topic.name} vocabulary!</p>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                                <div className="text-4xl font-bold text-green-600 mb-2">{knownWords.size}</div>
                                <div className="text-sm text-green-700">Words Known</div>
                            </div>
                            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                                <div className="text-4xl font-bold text-red-600 mb-2">{unknownWords.size}</div>
                                <div className="text-sm text-red-700">Need Review</div>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                                <div className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</div>
                                <div className="text-sm text-blue-700">Accuracy</div>
                            </div>
                        </div>

                        {unknownWords.size > 0 && (
                            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200 mb-8">
                                <h3 className="font-bold text-yellow-900 mb-3">Words to Review:</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {words.filter(w => unknownWords.has(w.id)).map(word => (
                                        <span key={word.id} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                                            {word.word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={restart}
                                className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Review Again
                            </button>
                            <button
                                onClick={() => onComplete(correctCount, totalCount)}
                                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">{topic.name}</h2>
                        <p className="text-sm text-gray-600">Card {currentIndex + 1} of {words.length}</p>
                    </div>

                    <div className="w-20" /> {/* Spacer for alignment */}
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">{knownWords.size} Known</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full">
                        <X className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-bold text-red-700">{unknownWords.size} Learning</span>
                    </div>
                </div>

                {/* Flashcard */}
                <div
                    className="relative h-96 cursor-pointer perspective-1000"
                    onClick={handleFlip}
                >
                    <div
                        className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                            }`}
                    >
                        {/* Front of card */}
                        <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}>
                            <div className="h-full bg-white rounded-2xl shadow-2xl p-12 flex flex-col items-center justify-center border-4 border-pink-200">
                                <div className="text-sm font-bold text-pink-600 uppercase tracking-wide mb-4">
                                    {currentWord.partOfSpeech}
                                </div>
                                <h3 className="text-5xl font-bold text-gray-900 mb-6">{currentWord.word}</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        speak(currentWord.word);
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full transition-all"
                                >
                                    <Volume2 className="w-5 h-5" />
                                    <span className="font-medium">Pronounce</span>
                                </button>
                                <div className="mt-8 text-gray-400 text-sm">Click to reveal definition</div>
                            </div>
                        </div>

                        {/* Back of card */}
                        <div className={`absolute inset-0 backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : 'visible'}`}>
                            <div className="h-full bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-2xl p-8 flex flex-col justify-between text-white">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-wide">Definition</span>
                                    </div>
                                    <p className="text-2xl font-medium mb-6 leading-relaxed">{currentWord.definition}</p>

                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                                        <div className="text-sm font-bold mb-2">Example:</div>
                                        <p className="italic">{currentWord.example}</p>
                                    </div>

                                    {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                                        <div>
                                            <div className="text-sm font-bold mb-2">Synonyms:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {currentWord.synonyms.map((syn, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-white/30 rounded-full text-sm">
                                                        {syn}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center text-sm opacity-75">Click to flip back</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {isFlipped && (
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleDontKnow}
                            className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                        >
                            <X className="w-5 h-5" />
                            Still Learning
                        </button>
                        <button
                            onClick={handleKnow}
                            className="flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                        >
                            <Check className="w-5 h-5" />
                            I Know This
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={previousCard}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </button>
                    <button
                        onClick={nextCard}
                        disabled={currentIndex === words.length - 1}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
        </div>
    );
};
