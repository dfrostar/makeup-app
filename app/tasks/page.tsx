"use client";

import TaskList from '../components/tasks/TaskList';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-neutral-50 to-amber-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-600 mb-2">
            Beauty Task Management
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Streamline your beauty routines, track product testing, and manage appointments all in one place.
            Never miss a step in your beauty journey.
          </p>
        </header>
        
        <TaskList />
        
        <footer className="mt-12 text-center text-sm text-neutral-500">
          <p>Part of your all-in-one beauty management system.</p>
          <p className="mt-1">Plan, track, and achieve your beauty goals.</p>
        </footer>
      </div>
    </div>
  );
} 