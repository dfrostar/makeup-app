"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskPriority, TaskCategory } from '../../types';

export default function FirstTaskCreation() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [task, setTask] = useState({
    description: '',
    category: TaskCategory.SKINCARE,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    notes: ''
  });
  
  // Step 1: Select a category
  const categories = [
    { value: TaskCategory.SKINCARE, label: 'Skincare', icon: '✨' },
    { value: TaskCategory.MAKEUP, label: 'Makeup', icon: '💄' },
    { value: TaskCategory.HAIRCARE, label: 'Haircare', icon: '💇‍♀️' },
    { value: TaskCategory.NAILCARE, label: 'Nailcare', icon: '💅' },
    { value: TaskCategory.APPOINTMENT, label: 'Appointment', icon: '📅' },
    { value: TaskCategory.SHOPPING, label: 'Shopping', icon: '🛍️' },
  ];
  
  // Step 2: Task suggestions based on category
  const getCategorySuggestions = () => {
    switch(task.category) {
      case TaskCategory.SKINCARE:
        return [
          'Start my morning skincare routine',
          'Apply sunscreen before going outside',
          'Do a hydrating face mask',
          'Try new moisturizer for dry skin'
        ];
      case TaskCategory.MAKEUP:
        return [
          'Practice winged eyeliner technique',
          'Try new foundation shade',
          'Clean makeup brushes',
          'Organize makeup collection'
        ];
      case TaskCategory.HAIRCARE:
        return [
          'Deep condition hair',
          'Apply hair mask treatment',
          'Trim split ends',
          'Try new hairstyling technique'
        ];
      case TaskCategory.APPOINTMENT:
        return [
          'Schedule haircut appointment',
          'Book facial appointment',
          'Make appointment for manicure',
          'Schedule lash extension touch-up'
        ];
      default:
        return [
          'Add a new beauty task',
          'Try a new beauty product',
          'Research beauty trends',
          'Make a beauty shopping list'
        ];
    }
  };
  
  const handleCategorySelect = (category: TaskCategory) => {
    setTask(prev => ({ ...prev, category }));
    nextStep();
  };
  
  const handleSuggestionSelect = (suggestion: string) => {
    setTask(prev => ({ ...prev, description: suggestion }));
    nextStep();
  };
  
  const handleCustomTask = () => {
    nextStep();
  };
  
  const handlePrioritySelect = (priority: TaskPriority) => {
    setTask(prev => ({ ...prev, priority }));
    nextStep();
  };
  
  const handleCreateTask = async () => {
    setLoading(true);
    
    try {
      // Create the task via API
      await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: task.description,
          category: task.category,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          completed: false
        }),
      });
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('There was a problem creating your task. Please try again.');
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-50 to-pink-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 pt-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-rose-600 bg-rose-200">
                  Step {step} of 4
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-rose-600">
                  {Math.round((step / 4) * 100)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rose-200">
              <div style={{ width: `${(step / 4) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-rose-500 to-pink-500"></div>
            </div>
          </div>
        </div>
        
        <div className="px-8 py-6">
          {/* Step 1: Choose Category */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's Create Your First Beauty Task</h2>
                <p className="text-gray-600">What type of beauty task would you like to create?</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    onClick={() => handleCategorySelect(category.value)}
                    className="flex flex-col items-center p-6 border rounded-lg cursor-pointer transition hover:bg-rose-50/50 hover:border-rose-300"
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="font-medium">{category.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="text-gray-500 text-sm">
                <p>This will help us organize your beauty tasks and provide appropriate suggestions.</p>
              </div>
            </div>
          )}
          
          {/* Step 2: Choose Suggestion or Custom */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select or Create a Task</h2>
                <p className="text-gray-600">Choose a suggestion or create your own</p>
              </div>
              
              <div className="space-y-3 mb-8">
                {getCategorySuggestions().map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="p-4 border rounded-lg cursor-pointer transition hover:bg-rose-50/50 hover:border-rose-300"
                  >
                    {suggestion}
                  </div>
                ))}
                
                <div className="mt-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={task.description}
                      onChange={(e) => setTask({ ...task, description: e.target.value })}
                      placeholder="Or type your own task here..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      aria-label="Enter custom task description"
                    />
                    
                    <button
                      onClick={handleCustomTask}
                      disabled={!task.description.trim()}
                      className="absolute right-2 top-2 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Continue with custom task"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Set Priority */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Task Priority</h2>
                <p className="text-gray-600">How important is this task?</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div
                  onClick={() => handlePrioritySelect(TaskPriority.LOW)}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition ${
                    task.priority === TaskPriority.LOW ? 'bg-emerald-50 border-emerald-300' : 'hover:bg-emerald-50/50 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-medium text-lg text-emerald-700 mb-1">Low</div>
                  <div className="text-sm text-gray-600">Nice to do, but not urgent</div>
                </div>
                
                <div
                  onClick={() => handlePrioritySelect(TaskPriority.MEDIUM)}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition ${
                    task.priority === TaskPriority.MEDIUM ? 'bg-amber-50 border-amber-300' : 'hover:bg-amber-50/50 hover:border-amber-300'
                  }`}
                >
                  <div className="font-medium text-lg text-amber-700 mb-1">Medium</div>
                  <div className="text-sm text-gray-600">Should do soon</div>
                </div>
                
                <div
                  onClick={() => handlePrioritySelect(TaskPriority.HIGH)}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition ${
                    task.priority === TaskPriority.HIGH ? 'bg-orange-50 border-orange-300' : 'hover:bg-orange-50/50 hover:border-orange-300'
                  }`}
                >
                  <div className="font-medium text-lg text-orange-700 mb-1">High</div>
                  <div className="text-sm text-gray-600">Important to do</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Set Due Date and Create */}
          {step === 4 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">When Should You Do This?</h2>
                <p className="text-gray-600">Set a target date for your task</p>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={task.notes}
                    onChange={(e) => setTask({ ...task, notes: e.target.value })}
                    placeholder="Add any details or reminders about this task..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">Your First Task</p>
                  <p className="mb-2">
                    <span className="font-medium">Description:</span> {task.description}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Category:</span> {categories.find(c => c.value === task.category)?.label}
                  </p>
                  <p>
                    <span className="font-medium">Priority:</span> {task.priority}
                  </p>
                  {task.dueDate && (
                    <p className="mt-2">
                      <span className="font-medium">Due:</span> {task.dueDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-8 py-4 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition"
              aria-label="Go back to previous step"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={step === 2 && !task.description.trim()}
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-md hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to next step"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreateTask}
              disabled={loading || !task.description.trim()}
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-md hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Create task and complete onboarding"
            >
              {loading ? 'Creating Task...' : 'Create Task & Get Started'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 