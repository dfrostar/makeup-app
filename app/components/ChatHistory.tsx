import React, { useState } from 'react';
import { FixedSizeList } from 'react-window';
import { Message } from '../types';

interface ChatHistoryProps {
  messages: Message[];
  onMessageClick?: (message: Message) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, onMessageClick }) => {
  const renderMessage = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const message = messages[index];
    return (
      <div 
        style={{
          ...style,
          padding: '10px',
          backgroundColor: message.sender === 'user' ? '#e6f7ff' : '#f6f6f6',
          borderRadius: '8px',
          margin: '5px 0',
          cursor: onMessageClick ? 'pointer' : 'default'
        }}
        onClick={() => onMessageClick && onMessageClick(message)}
      >
        <div style={{ fontWeight: 'bold' }}>
          {message.sender === 'user' ? 'You' : 'AI Assistant'}
        </div>
        <div>{message.text}</div>
        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="empty-chat">
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <FixedSizeList
        height={400}
        itemSize={80}
        itemCount={messages.length}
        width="100%"
      >
        {renderMessage}
      </FixedSizeList>
    </div>
  );
};

export default ChatHistory; 