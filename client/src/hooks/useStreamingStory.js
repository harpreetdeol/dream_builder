// src/hooks/useStreamingStory.js
import { useState } from 'react';

export const useStreamingStory = () => {
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const streamStory = async (formData) => {
    setStreamedText('');
    setIsStreaming(true);

    const token = JSON.parse(localStorage.getItem('dreamUser'))?.token;

    const response = await fetch('http://localhost:5000/api/story/generate-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.done) { setIsStreaming(false); break; }
          if (data.word) {
            setStreamedText(prev => prev + data.word);
          }
        }
      }
    }
  };

  return { streamedText, isStreaming, streamStory };
};