import { IntentResponse } from '../types';

/**
 * Detects the intent of a user message using NLP
 * 
 * @param message The user message to analyze
 * @returns Promise with the detected intent and related data
 */
export async function detectIntent(message: string): Promise<IntentResponse> {
  // TODO: Replace with actual AI model integration
  // This is a simple rule-based implementation for testing
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('remind me') || lowerMessage.includes('todo') || lowerMessage.includes('task')) {
    return {
      type: 'task_create',
      confidence: 0.85,
      taskData: {
        description: message,
        priority: 'medium'
      },
      responseText: `I've created a task: "${message}"`
    };
  }
  
  if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
    return {
      type: 'task_delete',
      confidence: 0.75,
      responseText: `I understand you want to delete a task.`
    };
  }
  
  if (lowerMessage.includes('update') || lowerMessage.includes('change') || lowerMessage.includes('modify')) {
    return {
      type: 'task_update',
      confidence: 0.8,
      responseText: `I understand you want to update a task.`
    };
  }
  
  return {
    type: 'general_chat',
    confidence: 0.7,
    responseText: "I'm here to help manage your tasks. Try asking me to remind you of something."
  };
}

/**
 * Analyzes a task description for urgency and priority
 * 
 * @param description The task description to analyze
 * @returns The suggested priority level
 */
export function analyzePriority(description: string): 'low' | 'medium' | 'high' {
  const lowerDesc = description.toLowerCase();
  
  // Check for urgent indicators
  if (
    lowerDesc.includes('urgent') ||
    lowerDesc.includes('asap') ||
    lowerDesc.includes('immediately') ||
    lowerDesc.includes('emergency')
  ) {
    return 'high';
  }
  
  // Check for low priority indicators
  if (
    lowerDesc.includes('when you have time') ||
    lowerDesc.includes('whenever') ||
    lowerDesc.includes('low priority') ||
    lowerDesc.includes('not urgent')
  ) {
    return 'low';
  }
  
  // Default to medium
  return 'medium';
} 