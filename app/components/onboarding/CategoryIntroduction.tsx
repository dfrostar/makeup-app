"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskCategory } from '../../types';

export default function CategoryIntroduction() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(0);
  
  // Categories with descriptions and examples
  const categories = [
    {
      name: 'Skincare',
      value: TaskCategory.SKINCARE,
      description: 'Manage your skincare routines, treatments, and product usage.',
      icon: '✨',
      color: 'teal',
      examples: [
        'Apply vitamin C serum in the morning',
        'Use hydrating face mask twice weekly',
        'Apply sunscreen daily before going outside'
      ]
    },
    {
      name: 'Makeup',
      value: TaskCategory.MAKEUP,
      description: 'Track makeup application, techniques, and product testing.',
      icon: '💄',
      color: 'pink',
      examples: [
        'Practice winged eyeliner technique',
        'Try new foundation shade',
        'Clean makeup brushes weekly'
      ]
    },
    {
      name: 'Haircare',
      value: TaskCategory.HAIRCARE,
      description: 'Schedule hair treatments, styling, and maintenance.',
      icon: '💇‍♀️',
      color: 'purple',
      examples: [
        'Deep condition hair weekly',
        'Apply heat protectant before styling',
        'Trim hair ends every 8 weeks'
      ]
    },
    {
      name: 'Appointments',
      value: TaskCategory.APPOINTMENT,
      description: 'Manage salon, spa, and other beauty appointments.',
      icon: '📅',
      color: 'sky',
      examples: [
        'Book facial appointment',
        'Schedule hair coloring session',
        'Make appointment for lash extensions'
      ]
    },
    {
      name: 'Shopping',
      value: TaskCategory.SHOPPING,
      description: 'Keep track of beauty products to purchase.',
      icon: '🛍️',
      color: 'lime',
      examples: [
        'Buy new moisturizer',
        'Research summer foundation options',
        'Restock cotton pads'
      ]
    }
  ];
  
  const nextCategory = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      // Completed all categories, move to next step
      router.push('/onboarding/first-task');
    }
  };
  
  const prevCategory = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };
  
  const category = categories[currentCategory];
  const progress = Math.round(((currentCategory + 1) / categories.length) * 100);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-50 to-pink-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative pt-1 px-8 pt-8">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-rose-600 bg-rose-200">
                Category {currentCategory + 1} of {categories.length}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-rose-600">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rose-200">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-rose-500 to-pink-500"></div>
          </div>
        </div>
        
        <div className="px-8 py-6">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-${category.color}-100 text-3xl mb-4`}>
              {category.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.name} Tasks</h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
          
          <div className={`p-6 rounded-lg border border-${category.color}-200 bg-${category.color}-50 mb-8`}>
            <h3 className="font-medium text-gray-800 mb-3">Example Tasks:</h3>
            <ul className="space-y-2">
              {category.examples.map((example, index) => (
                <li key={index} className="flex items-center">
                  <svg className={`h-5 w-5 text-${category.color}-500 mr-2`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {example}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-gray-600 text-sm mb-8">
            <p>
              Tasks in this category will be color-coded and organized for easy reference.
              You'll be able to create custom tasks or choose from suggested templates.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 flex justify-between">
          {currentCategory > 0 ? (
            <button
              onClick={prevCategory}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition"
              aria-label="Go to previous category"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            onClick={nextCategory}
            className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-md hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition"
            aria-label={currentCategory < categories.length - 1 ? "Go to next category" : "Complete category introduction"}
          >
            {currentCategory < categories.length - 1 ? 'Next Category' : 'Complete Introduction'}
          </button>
        </div>
      </div>
    </div>
  );
} 