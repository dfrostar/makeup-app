import { TaskPriority, TaskCategory } from '../types';
import fs from 'fs';
import path from 'path';

// Define the Task type for storage (with string dates)
export interface Task {
  id: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category?: TaskCategory;
  dueDate: string | null;
  userId: string;
  productId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Type for task input with Date objects
export interface TaskInput {
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category?: TaskCategory;
  dueDate: Date | null | string;
  userId: string;
  productId: string | null;
}

// File path for persisting tasks
const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure the data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create data directory:', error);
}

// Default tasks to use if no saved tasks are found
const defaultTasks = [
  {
    id: '1',
    description: 'Try new facial mask routine',
    completed: false,
    priority: TaskPriority.HIGH,
    category: TaskCategory.SKINCARE,
    dueDate: new Date('2025-03-15').toISOString(),
    userId: 'user1',
    productId: null,
    createdAt: new Date('2025-03-10').toISOString(),
    updatedAt: new Date('2025-03-10').toISOString(),
  },
  {
    id: '2',
    description: 'Schedule hair appointment',
    completed: true,
    priority: TaskPriority.MEDIUM,
    category: TaskCategory.APPOINTMENT,
    dueDate: new Date('2025-03-12').toISOString(),
    userId: 'user1',
    productId: null,
    createdAt: new Date('2025-03-09').toISOString(),
    updatedAt: new Date('2025-03-11').toISOString(),
  },
  {
    id: '3',
    description: 'Research summer makeup trends',
    completed: false,
    priority: TaskPriority.URGENT,
    category: TaskCategory.MAKEUP,
    dueDate: new Date('2025-03-14').toISOString(),
    userId: 'user1',
    productId: null,
    createdAt: new Date('2025-03-10').toISOString(),
    updatedAt: new Date('2025-03-10').toISOString(),
  }
] as Task[];

// Function to load tasks from file
function loadTasks(): Task[] {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const data = fs.readFileSync(TASKS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return defaultTasks;
  } catch (error) {
    console.error('Error loading tasks from file:', error);
    return defaultTasks;
  }
}

// Function to save tasks to file
function saveTasks(tasks: Task[]): void {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving tasks to file:', error);
  }
}

// Global store for tasks
export const taskStore = {
  tasks: loadTasks(),

  // Get all tasks
  getAllTasks() {
    return this.tasks;
  },

  // Get task by ID
  getTaskById(id: string) {
    // Ensure id is a string for comparison
    return this.tasks.find(task => task.id === String(id));
  },

  // Create a new task
  createTask(task: Omit<TaskInput, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Generate new ID as string
      const newId = (Math.max(0, ...this.tasks.map(t => parseInt(t.id))) + 1).toString();
      
      // Format the dueDate properly
      let formattedDueDate: string | null = null;
      if (task.dueDate) {
        // Check if it's already a string (ISO format)
        if (typeof task.dueDate === 'string') {
          formattedDueDate = task.dueDate;
        } 
        // Check if it's a Date object
        else if (typeof task.dueDate === 'object') {
          const dateObj = task.dueDate as Date;
          if (!isNaN(dateObj.getTime())) {
            formattedDueDate = dateObj.toISOString();
          }
        }
      }
      
      // Create new task object
      const newTask = {
        ...task,
        id: newId,
        // Set default category if not provided
        category: task.category || TaskCategory.OTHER,
        // Use the formatted date
        dueDate: formattedDueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Task;
      
      this.tasks.push(newTask);
      
      // Persist tasks to file
      saveTasks(this.tasks);
      
      return newTask;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  },

  // Update a task
  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>> & { dueDate?: Date | null | string }) {
    try {
      // Ensure id is a string for comparison
      const taskIndex = this.tasks.findIndex(task => task.id === String(id));
      if (taskIndex === -1) return null;
      
      // Create processed updates with correct types
      const processedUpdates: Partial<Omit<Task, 'id' | 'createdAt'>> = { ...updates };
      
      // Handle dueDate separately to ensure type compatibility
      if ('dueDate' in updates) {
        if (updates.dueDate === null) {
          processedUpdates.dueDate = null;
        } else if (typeof updates.dueDate === 'string') {
          processedUpdates.dueDate = updates.dueDate;
        } else if (typeof updates.dueDate === 'object') {
          const dateObj = updates.dueDate as Date;
          if (!isNaN(dateObj.getTime())) {
            processedUpdates.dueDate = dateObj.toISOString();
          }
        }
      }
      
      // Create the updated task object
      const updatedTask = {
        ...this.tasks[taskIndex],
        ...processedUpdates,
        updatedAt: new Date().toISOString()
      };
      
      this.tasks[taskIndex] = updatedTask;
      
      // Persist tasks to file
      saveTasks(this.tasks);
      
      return updatedTask;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask(id: string) {
    // Ensure id is a string for comparison
    const taskIndex = this.tasks.findIndex(task => task.id === String(id));
    if (taskIndex === -1) return false;
    
    this.tasks.splice(taskIndex, 1);
    
    // Persist tasks to file
    saveTasks(this.tasks);
    
    return true;
  }
}; 