import React, { useState, useEffect, useRef } from 'react';
import useChat from '../hooks/useChat';
import useTodo from '../hooks/useTodo';
import { Message, Task } from '../types';
import ChatHistory from './ChatHistory';

const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTaskDetected, setIsTaskDetected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get chat and todo functionality from hooks
  const { chatHistory, handleUserMessage, isProcessing, error } = useChat();
  const { addTodo } = useTodo();

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Process the message through AI
    const aiResponse = await handleUserMessage(input);
    setInput('');
    
    // Check if a task was detected
    if (aiResponse && aiResponse.type === 'task_create' && aiResponse.taskData) {
      setIsTaskDetected(true);
      // Create the task
      await addTodo(
        aiResponse.taskData.description || input,
        aiResponse.taskData.priority || 'medium'
      );
      
      // Reset task detection state after a moment
      setTimeout(() => setIsTaskDetected(false), 3000);
    }
  };

  const handleTaskDetection = async (message: string) => {
    // AI integration handled by the useChat hook
    // This function is kept for backward compatibility
    console.log('Task detection handled by useChat hook');
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="chat-messages">
        <ChatHistory messages={chatHistory} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message or task..."
          disabled={isProcessing}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={isProcessing || !input.trim()} 
          className="send-button"
        >
          {isProcessing ? 'Processing...' : 'Send'}
        </button>
      </form>
      
      {isTaskDetected && (
        <div className="task-created-notification">
          Task successfully created!
        </div>
      )}
    </div>
  );
};

export default AIChat; 