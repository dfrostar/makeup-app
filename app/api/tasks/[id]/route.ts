import { NextRequest, NextResponse } from 'next/server';
import { taskStore } from '../../../lib/store';
import { TaskPriority, TaskCategory } from '../../../types';

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = taskStore.getTaskById(params.id);
    
    if (!task) {
      console.error(`Task with ID ${params.id} not found`);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = String(params.id);
    console.log(`Attempting to update task with ID: ${taskId}`);
    
    // Verify the task exists before trying to update
    const existingTask = taskStore.getTaskById(taskId);
    if (!existingTask) {
      console.error(`Task with ID ${taskId} not found for update`);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const body = await request.json();
    console.log(`Update payload for task ${taskId}:`, body);
    
    // Validate fields if provided
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
    
    // Handle date conversion carefully
    if (body.dueDate !== undefined) {
      if (body.dueDate === null) {
        // Allow explicitly setting to null
        body.dueDate = null;
      } else if (typeof body.dueDate === 'string') {
        try {
          const parsedDate = new Date(body.dueDate);
          // Validate date
          if (isNaN(parsedDate.getTime())) {
            return NextResponse.json(
              { error: 'Invalid due date format' },
              { status: 400 }
            );
          }
          body.dueDate = parsedDate;
        } catch (err) {
          return NextResponse.json(
            { error: 'Invalid due date format' },
            { status: 400 }
          );
        }
      }
    }
    
    const updatedTask = taskStore.updateTask(taskId, body);
    
    if (!updatedTask) {
      console.error(`Failed to update task with ID ${taskId}`);
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
    
    console.log(`Successfully updated task with ID ${taskId}`);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = String(params.id);
    console.log(`Attempting to delete task with ID: ${taskId}`);
    
    // Verify the task exists before trying to delete
    const existingTask = taskStore.getTaskById(taskId);
    if (!existingTask) {
      console.error(`Task with ID ${taskId} not found for deletion`);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const success = taskStore.deleteTask(taskId);
    
    if (!success) {
      console.error(`Failed to delete task with ID ${taskId}`);
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
    
    console.log(`Successfully deleted task with ID ${taskId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 