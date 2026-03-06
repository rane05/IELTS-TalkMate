# How to Use Real-Time Streaming in IELTS TalkMate

## For Users

### Speaking Module (Already Implemented)

1. **Start a Practice Session**
   - Go to Speaking module
   - Choose any mode (Full Test, Grammar Coach, Part 1/2/3)
   - Click "Start Practice"

2. **Have a Conversation**
   - Click the microphone button to start recording
   - Speak your answer
   - Click stop when done

3. **Watch the Magic! ✨**
   - You'll see "Analyzing your response..." with animated dots
   - Your transcript will appear progressively
   - The examiner's response will stream in word-by-word
   - You'll hear the response as complete sentences arrive

### Writing Module (Enhanced)

The writing service now supports streaming too! When you submit an essay:
- Progressive analysis messages show what's being checked
- Partial feedback appears as it's generated
- More engaging than waiting for complete analysis

## For Developers

### Using Streaming in Speaking Module

The speaking module is already fully integrated. Here's how it works:

```typescript
// In App.tsx - handleAudioStop()
const callbacks: StreamingCallbacks = {
  onTranscriptChunk: (chunk) => {
    setStreamingTranscript(chunk);  // Update UI in real-time
  },
  
  onExaminerSpeechChunk: (chunk) => {
    setStreamingExaminerText(chunk);
    // Speak complete sentences immediately
    const sentences = chunk.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      speak(sentences[sentences.length - 1]);
    }
  },
  
  onComplete: (response) => {
    // Handle final response
    setIsStreaming(false);
    setConversation(prev => [...prev, examinerTurn]);
  }
};

await processUserAudioStreaming(
  audioBase64,
  currentPart,
  context,
  callbacks,
  practiceMode,
  personality
);
```

### Adding Streaming to Writing Module

To use streaming in the writing module, update `App.tsx`:

```typescript
// Add streaming state
const [isAnalyzingWriting, setIsAnalyzingWriting] = useState(false);
const [analysisMessage, setAnalysisMessage] = useState("");

// Update the writing submission handler
onSubmit={async (content, wordCount, timeSpent) => {
  setWritingContent(content);
  setIsAnalyzingWriting(true);
  
  try {
    await analyzeWritingStreaming(
      content,
      selectedPrompt.taskType,
      selectedPrompt.prompt,
      {
        onAnalysisChunk: (message) => {
          setAnalysisMessage(message);
        },
        
        onPartialFeedback: (partial) => {
          // Could show partial scores as they arrive
          console.log('Partial feedback:', partial);
        },
        
        onComplete: (feedback) => {
          setWritingFeedback(feedback);
          setView('results');
          setIsAnalyzingWriting(false);
        },
        
        onError: (error) => {
          console.error('Error:', error);
          alert('Failed to analyze writing. Please try again.');
          setIsAnalyzingWriting(false);
        }
      }
    );
  } catch (error) {
    console.error('Error analyzing writing:', error);
    setIsAnalyzingWriting(false);
  }
}}
```

### Creating Custom Streaming Services

To add streaming to other modules, follow this pattern:

```typescript
// 1. Define callback interface
export interface MyStreamingCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (result: MyResult) => void;
  onError?: (error: Error) => void;
}

// 2. Create streaming function
export const processMyDataStreaming = async (
  input: string,
  callbacks: MyStreamingCallbacks
): Promise<void> => {
  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: input }] }
    });

    let accumulated = '';
    
    for await (const chunk of stream) {
      accumulated += chunk.text || '';
      callbacks.onChunk?.(chunk.text || '');
    }
    
    const result = JSON.parse(accumulated);
    callbacks.onComplete?.(result);
    
  } catch (error) {
    callbacks.onError?.(error as Error);
  }
};

// 3. Use in component
const handleSubmit = async () => {
  await processMyDataStreaming(input, {
    onChunk: (chunk) => setStreamingText(chunk),
    onComplete: (result) => setFinalResult(result),
    onError: (error) => console.error(error)
  });
};
```

## UI Best Practices

### Loading States

Always show clear loading indicators:

```tsx
{isStreaming && !streamingText && (
  <div className="flex items-center gap-2">
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" 
           style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" 
           style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" 
           style={{ animationDelay: '300ms' }}></div>
    </div>
    <span>Processing...</span>
  </div>
)}
```

### Streaming Text Display

Show streaming text with a cursor indicator:

```tsx
{isStreaming && streamingText && (
  <div>
    {streamingText}
    <span className="inline-block w-2 h-5 bg-indigo-600 ml-1 animate-pulse"></span>
  </div>
)}
```

### Smooth Transitions

Use fade-in animations for new content:

```tsx
<div className="animate-fade-in">
  {streamingContent}
</div>

// Add to your CSS
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

## Performance Tips

### 1. Debounce Rapid Updates

If chunks arrive very quickly, debounce UI updates:

```typescript
import { debounce } from 'lodash';

const debouncedUpdate = debounce((chunk) => {
  setStreamingText(prev => prev + chunk);
}, 50);

onChunk: (chunk) => debouncedUpdate(chunk)
```

### 2. Limit Re-renders

Use `useCallback` for callback functions:

```typescript
const handleChunk = useCallback((chunk: string) => {
  setStreamingText(chunk);
}, []);

const callbacks = useMemo(() => ({
  onChunk: handleChunk,
  onComplete: handleComplete
}), [handleChunk, handleComplete]);
```

### 3. Clean Up State

Always clear streaming state when done:

```typescript
onComplete: (result) => {
  setFinalResult(result);
  setIsStreaming(false);
  setStreamingText("");  // Clear streaming state
}
```

## Testing Streaming Features

### Manual Testing

1. **Test with different input lengths**
   - Short responses (1-2 sentences)
   - Medium responses (30 seconds)
   - Long responses (60+ seconds)

2. **Test network conditions**
   - Fast connection (should stream smoothly)
   - Slow connection (should still work, just slower)
   - Network interruption (should handle gracefully)

3. **Test error scenarios**
   - Invalid API key
   - API quota exceeded
   - Malformed responses

### Automated Testing

```typescript
describe('Streaming Service', () => {
  it('should call onChunk for each chunk', async () => {
    const chunks: string[] = [];
    
    await processUserAudioStreaming(
      audioBase64,
      ExamPart.PART_1,
      "",
      {
        onChunk: (chunk) => chunks.push(chunk),
        onComplete: () => {}
      }
    );
    
    expect(chunks.length).toBeGreaterThan(0);
  });
  
  it('should call onComplete with final result', async () => {
    let finalResult: ExaminerResponse | null = null;
    
    await processUserAudioStreaming(
      audioBase64,
      ExamPart.PART_1,
      "",
      {
        onComplete: (result) => { finalResult = result; }
      }
    );
    
    expect(finalResult).not.toBeNull();
    expect(finalResult?.examinerSpeech).toBeDefined();
  });
});
```

## Troubleshooting

### Streaming doesn't start
- Check API key is configured
- Verify network connection
- Check browser console for errors

### Choppy or incomplete streaming
- Check network speed
- Verify JSON parsing logic
- Look for errors in stream processing

### UI doesn't update
- Verify state updates in callbacks
- Check React component re-rendering
- Ensure callbacks are properly bound

### Audio playback issues
- Check sentence detection regex
- Verify speech synthesis is available
- Test with different browsers

## Advanced Features

### Custom Chunk Processing

Process chunks differently based on content:

```typescript
onChunk: (chunk) => {
  if (chunk.includes('"examinerSpeech"')) {
    // Extract and display examiner speech
    const match = chunk.match(/"examinerSpeech"\s*:\s*"([^"]*)"/);
    if (match) setExaminerText(match[1]);
  }
  
  if (chunk.includes('"feedback"')) {
    // Start showing feedback section
    setShowFeedback(true);
  }
}
```

### Progressive Feedback Display

Show feedback as it arrives:

```typescript
onFeedbackChunk: (partial) => {
  if (partial.feedback?.grammarMistakes) {
    setGrammarMistakes(partial.feedback.grammarMistakes);
  }
  
  if (partial.feedback?.estimatedBand) {
    setBandScore(partial.feedback.estimatedBand);
  }
}
```

### Adaptive Streaming Speed

Adjust based on user preferences:

```typescript
const streamingSpeed = userPreferences.streamingSpeed || 'normal';
const chunkDelay = {
  slow: 100,
  normal: 50,
  fast: 20
}[streamingSpeed];

// Apply delay between chunks
await new Promise(resolve => setTimeout(resolve, chunkDelay));
```

## Summary

The streaming implementation makes IELTS TalkMate feel **alive and responsive**. Users get:
- ⚡ Instant feedback
- 💬 Natural conversations
- 🎯 Engaging experience
- ✨ Professional polish

Follow these guidelines to maintain and extend the streaming functionality across all modules!
