// Manages chat state and AI interactions
import { useState, useCallback } from 'react';
import { Message } from '../types';

const useChat = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message to history
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null);
    
    try {
      // Send to AI processing endpoint
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process message');
      }
      
      const aiResponse = await response.json();
      
      // Add AI response to chat history
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse.responseText || 'I processed your request.',
        sender: 'ai',
        timestamp: new Date(),
        relatedTaskId: aiResponse.taskData?.id
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      return aiResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);
  
  return {
    chatHistory,
    handleUserMessage,
    isProcessing,
    error,
    clearChat: () => setChatHistory([])
  };
};

export default useChat; 