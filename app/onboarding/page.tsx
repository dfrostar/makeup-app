"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingWelcome() {
  const router = useRouter();
  
  const startOnboarding = () => {
    router.push('/onboarding/profile');
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-100 to-pink-100 p-4">
      <div className="max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-rose-100 text-4xl mb-6">
            ✨
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Beauty Task Manager</h1>
          <p className="text-xl text-gray-600 mb-8">
            Let's personalize your experience to help you manage your beauty routines effortlessly.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-rose-50 rounded-lg">
              <div className="text-2xl mb-3">💅</div>
              <h3 className="font-bold text-lg mb-2">Personalized Routines</h3>
              <p className="text-gray-600 text-sm">
                Build customized routines for your unique beauty needs and preferences.
              </p>
            </div>
            
            <div className="p-6 bg-pink-50 rounded-lg">
              <div className="text-2xl mb-3">📆</div>
              <h3 className="font-bold text-lg mb-2">Smart Scheduling</h3>
              <p className="text-gray-600 text-sm">
                Never miss a beauty treatment with intelligent task management.
              </p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-3">🔔</div>
              <h3 className="font-bold text-lg mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track your beauty journey and see the results of your dedication.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startOnboarding}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-lg hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition shadow-md"
            >
              Get Started (3 min setup)
            </button>
            
            <Link
              href="/dashboard"
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
            >
              Skip to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 text-center text-sm text-gray-500">
          Already have an account? Your preferences will be saved once you log in.
        </div>
      </div>
    </main>
  );
} 