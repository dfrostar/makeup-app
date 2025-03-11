import { NextResponse } from 'next/server';
import { IntentResponse } from '../../types';

// Rate limit configuration
const RATE_LIMIT = 10; // requests per minute
const rateLimitMap = new Map<string, number[]>();

// Helper function to detect intent using NLP
async function detectIntent(message: string): Promise<IntentResponse> {
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
  
  return {
    type: 'general_chat',
    confidence: 0.7,
    responseText: "I'm here to help manage your tasks. Try asking me to remind you of something."
  };
}

export async function POST(request: Request) {
  // Add proper error handling
  try {
    // Check request content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content type must be application/json' },
        { status: 415 }
      );
    }
    
    const data = await request.json();
    
    // Implement input validation
    if (!data.message || typeof data.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Extract IP for rate limiting (in production use a more robust method)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Implement rate limiting
    const now = Date.now();
    const requestTimes = rateLimitMap.get(ip) || [];
    
    // Filter out requests older than 1 minute
    const recentRequests = requestTimes.filter(time => now - time < 60000);
    
    if (recentRequests.length >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }
    
    // Add current request to the map
    rateLimitMap.set(ip, [...recentRequests, now]);
    
    // Process the message with AI
    const intentResponse = await detectIntent(data.message);
    
    return NextResponse.json(intentResponse);
  } catch (error) {
    console.error('AI processing error:', error);
    return NextResponse.json(
      { error: 'AI processing failed' },
      { status: 500 }
    );
  }
} 