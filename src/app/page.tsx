// Main App Page
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewToggle } from '../components/navigation/ViewToggle';
import { DiscoveryView } from '../components/discovery/DiscoveryView';
import { DirectoryView } from '../components/directory/DirectoryView';
import { MainNavigation } from '../components/navigation/MainNavigation';
import { BackgroundGradient } from '../components/ui/BackgroundGradient';
import { Suspense } from 'react';
import { Skeleton } from '../components/ui/skeleton';

export default function Home() {
  const [currentView, setCurrentView] = useState<'discovery' | 'directory'>('discovery');

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background */}
      <BackgroundGradient />

      {/* Main Content */}
      <div className="relative">
        {/* Navigation */}
        <MainNavigation />

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          {/* View Toggle */}
          <div className="mb-8">
            <ViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>

          {/* Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {currentView === 'discovery' ? (
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-[400px] w-full rounded-lg" />
                      ))}
                    </div>
                  }
                >
                  <DiscoveryView />
                </Suspense>
              ) : (
                <DirectoryView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
