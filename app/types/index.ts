// Type definitions for the application

// User type for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
}

// Message type for chat interface
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  relatedTaskId?: string;
}

// Define TaskPriority enum to match Prisma schema
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Define beauty-specific task categories
export enum TaskCategory {
  SKINCARE = 'SKINCARE',
  MAKEUP = 'MAKEUP',
  HAIRCARE = 'HAIRCARE',
  NAILCARE = 'NAILCARE',
  FRAGRANCE = 'FRAGRANCE',
  APPOINTMENT = 'APPOINTMENT',
  SHOPPING = 'SHOPPING',
  WELLNESS = 'WELLNESS',
  OTHER = 'OTHER'
}

// Task interface
export interface Task {
  id: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category?: TaskCategory;
  dueDate: Date | null;
  userId: string;
  productId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// TaskFilter interface
export interface TaskFilter {
  completed?: boolean;
  priority?: TaskPriority;
  category?: TaskCategory;
}

// Intent detection response type
export interface IntentResponse {
  type: 'task_create' | 'task_update' | 'task_delete' | 'general_chat' | 'unknown';
  confidence: number;
  taskData?: Partial<Task>;
  responseText?: string;
} 