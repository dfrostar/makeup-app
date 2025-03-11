import { NextRequest, NextResponse } from 'next/server';
import { TaskPriority, TaskCategory } from '../../types';
import { taskStore } from '../../lib/store';

// GET /api/tasks - Get all tasks for the current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters for filtering
    const completed = searchParams.get('completed');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    
    // Get all tasks
    let tasks = taskStore.getAllTasks();
    
    // Apply filters if they exist
    if (completed !== null) {
      const isCompleted = completed === 'true';
      tasks = tasks.filter(task => task.completed === isCompleted);
    }
    
    if (priority) {
      tasks = tasks.filter(task => task.priority === priority);
    }

    if (category) {
      tasks = tasks.filter(task => task.category === category);
    }
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.description) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      );
    }
    
    // Validate priority if provided
    if (body.priority && !Object.values(TaskPriority).includes(body.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority value' },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (body.category && !Object.values(TaskCategory).includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category value' },
        { status: 400 }
      );
    }
    
    // Handle date conversion safely
    let dueDate = null;
    if (body.dueDate) {
      try {
        dueDate = new Date(body.dueDate);
        // Check if the date is valid
        if (isNaN(dueDate.getTime())) {
          throw new Error('Invalid date format');
        }
      } catch (err) {
        return NextResponse.json(
          { error: 'Invalid due date format' },
          { status: 400 }
        );
      }
    }
    
    // Create the task with proper date handling
    const task = taskStore.createTask({
      description: body.description,
      completed: body.completed || false,
      priority: body.priority || TaskPriority.MEDIUM,
      category: body.category,
      dueDate: dueDate,
      userId: body.userId || 'user1',
      productId: body.productId || null,
    });
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
} 