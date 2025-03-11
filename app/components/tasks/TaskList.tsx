"use client";

import { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Task, TaskPriority, TaskCategory } from '../../types';

export default function TaskList() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>(TaskCategory.SKINCARE);
  const [dueDate, setDueDate] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'description' | 'category'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;
    
    try {
      await createTask({
        description: newTaskDescription,
        priority: selectedPriority,
        category: selectedCategory,
        completed: false,
        dueDate: dueDate ? new Date(dueDate) : null,
        productId: null
      });
      setNewTaskDescription('');
      setDueDate('');
      setSelectedPriority(TaskPriority.MEDIUM);
      setSelectedCategory(TaskCategory.SKINCARE);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };
  
  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, {
        completed: !task.completed
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && filter === 'completed' && !task.completed) return false;
    if (filter !== 'all' && filter === 'pending' && task.completed) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      // Sort by priority (URGENT > HIGH > MEDIUM > LOW)
      const priorityOrder = {
        [TaskPriority.URGENT]: 0,
        [TaskPriority.HIGH]: 1,
        [TaskPriority.MEDIUM]: 2,
        [TaskPriority.LOW]: 3
      };
      
      return sortDirection === 'asc' 
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (sortBy === 'date') {
      const dateA = a.createdAt.getTime();
      const dateB = b.createdAt.getTime();
      
      return sortDirection === 'asc' 
        ? dateA - dateB
        : dateB - dateA;
    }
    
    if (sortBy === 'category') {
      // Default to 'OTHER' if category is undefined
      const categoryA = a.category || TaskCategory.OTHER;
      const categoryB = b.category || TaskCategory.OTHER;
      
      return sortDirection === 'asc'
        ? categoryA.localeCompare(categoryB)
        : categoryB.localeCompare(categoryA);
    }
    
    // Sort by description
    return sortDirection === 'asc'
      ? a.description.localeCompare(b.description)
      : b.description.localeCompare(a.description);
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 font-medium">Error: {error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
        aria-label="Refresh page"
      >
        Try Again
      </button>
    </div>
  );

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm backdrop-blur-sm bg-white/80">
      {/* Purpose and instructions */}
      <div className="mb-8 bg-gradient-to-r from-rose-50 to-amber-50 p-6 rounded-lg border border-rose-100">
        <h2 className="text-2xl font-bold text-rose-800 mb-3">Beauty Task Planner</h2>
        <p className="text-neutral-700 mb-4">
          Organize your beauty routines, appointments, product testing schedules, and beauty business tasks in one place.
          Keep track of your beauty journey with our simple yet powerful task manager.
        </p>
        <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100">
          <h3 className="font-semibold text-amber-700 mb-2">How to use:</h3>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Add new beauty tasks using the form below</li>
            <li>Set priorities (Low, Medium, High, Urgent) for each task</li>
            <li>Set due dates for time-sensitive beauty routines</li>
            <li>Filter and sort your tasks for better organization</li>
            <li>Check the box when a task is completed</li>
            <li>Delete tasks you no longer need</li>
          </ul>
        </div>
      </div>

      {/* Stats dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 text-center">
          <p className="text-sm text-rose-600 font-medium">Total Tasks</p>
          <p className="text-2xl font-bold text-rose-800">{totalTasks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
          <p className="text-sm text-green-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-800">{completedTasks}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-center">
          <p className="text-sm text-amber-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-800">{pendingTasks}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
          <p className="text-sm text-blue-600 font-medium">Completion Rate</p>
          <p className="text-2xl font-bold text-blue-800">{completionRate}%</p>
        </div>
      </div>
      
      {/* Task creation form */}
      <form onSubmit={handleCreateTask} className="mb-8 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-700 mb-3">Create New Beauty Task</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-neutral-600 mb-1">Task Description</label>
            <input
              id="taskDescription"
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="E.g., Try new facial mask, Book hair appointment..."
              className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="taskPriority" className="block text-sm font-medium text-neutral-600 mb-1">Priority</label>
            <select
              id="taskPriority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
              aria-label="Select priority"
              className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
            </select>
          </div>
          <div>
            <label htmlFor="taskCategory" className="block text-sm font-medium text-neutral-600 mb-1">Category</label>
            <select
              id="taskCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TaskCategory)}
              aria-label="Select category"
              className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            >
              {Object.values(TaskCategory).map((category) => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-600 mb-1">Due Date (Optional)</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>
          <div className="sm:col-span-2 md:col-span-4 flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium rounded hover:from-rose-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50 transition"
              aria-label="Add task"
            >
              Add Beauty Task
            </button>
          </div>
        </div>
      </form>
      
      {/* Filtering and sorting controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="filterTasks" className="block text-sm font-medium text-neutral-600 mb-1">Filter Tasks</label>
          <select
            id="filterTasks"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
            className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed Tasks</option>
            <option value="pending">Pending Tasks</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-neutral-600 mb-1">Filter by Category</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {Object.values(TaskCategory).map((category) => (
              <option key={category} value={category}>
                {formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="sortBy" className="block text-sm font-medium text-neutral-600 mb-1">Sort By</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'date' | 'description' | 'category')}
            className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          >
            <option value="date">Date Created</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
            <option value="description">Description</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="sortDirection" className="block text-sm font-medium text-neutral-600 mb-1">Sort Direction</label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
            className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      
      {/* Task list */}
      <div className="rounded-lg border border-neutral-200 overflow-hidden">
        <h3 className="text-lg font-medium text-neutral-700 p-4 bg-neutral-50 border-b border-neutral-200">Your Beauty Tasks</h3>
        
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center bg-white">
            <div className="w-16 h-16 mx-auto mb-4 text-neutral-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25M9 13.5h.75M9 10.5h.75" />
              </svg>
            </div>
            <p className="text-neutral-500 mb-2">No tasks found with the current filters.</p>
            <p className="text-neutral-400 text-sm">Try changing your filters or add a new beauty task.</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 bg-white">
            {sortedTasks.map((task) => (
              <li 
                key={task.id} 
                className="p-4 hover:bg-amber-50/30 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      aria-label={`Mark ${task.description} as ${task.completed ? 'incomplete' : 'complete'}`}
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      className="h-5 w-5 rounded border-neutral-300 text-rose-500 focus:ring-rose-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`task-${task.id}`} className={`text-sm font-medium ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                      {task.description}
                    </label>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.category && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryStyles(task.category)}`}>
                          {formatCategoryName(task.category)}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Due: {formatDate(task.dueDate)}
                        </span>
                      )}
                      <span className="text-xs text-neutral-400">
                        Created: {formatDate(task.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-2 flex-shrink-0 p-1 rounded-full text-neutral-400 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  aria-label={`Delete task: ${task.description}`}
                  title="Delete task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Task management tips */}
      {tasks.length > 0 && (
        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
          <h4 className="font-semibold mb-2">Beauty Task Management Tips:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Set regular reminders for recurring beauty routines</li>
            <li>Prioritize time-sensitive tasks like appointments</li>
            <li>Group related tasks to streamline your beauty regimen</li>
            <li>Review completed tasks to track your beauty journey progress</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function getPriorityStyles(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.LOW:
      return 'bg-emerald-100 text-emerald-800';
    case TaskPriority.MEDIUM:
      return 'bg-amber-100 text-amber-800';
    case TaskPriority.HIGH:
      return 'bg-orange-100 text-orange-800';
    case TaskPriority.URGENT:
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
}

function getCategoryStyles(category: TaskCategory): string {
  switch (category) {
    case TaskCategory.SKINCARE:
      return 'bg-teal-100 text-teal-800';
    case TaskCategory.MAKEUP:
      return 'bg-pink-100 text-pink-800';
    case TaskCategory.HAIRCARE:
      return 'bg-purple-100 text-purple-800';
    case TaskCategory.NAILCARE:
      return 'bg-indigo-100 text-indigo-800';
    case TaskCategory.FRAGRANCE:
      return 'bg-violet-100 text-violet-800';
    case TaskCategory.APPOINTMENT:
      return 'bg-sky-100 text-sky-800';
    case TaskCategory.SHOPPING:
      return 'bg-lime-100 text-lime-800';
    case TaskCategory.WELLNESS:
      return 'bg-green-100 text-green-800';
    case TaskCategory.OTHER:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
}

function formatCategoryName(category: string): string {
  // Convert UPPER_SNAKE_CASE to Title Case (e.g., SKINCARE -> Skincare)
  return category.toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
} 