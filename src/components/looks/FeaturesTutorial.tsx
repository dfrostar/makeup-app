'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnalytics } from '@/hooks/useAnalytics';

type TutorialStep = {
  title: string;
  description: string;
  image?: string;
  action?: () => void;
};

type FeedbackData = {
  stepIndex: number;
  rating: 1 | 2 | 3 | 4 | 5;
  helpful: boolean;
  comment?: string;
};

export function FeaturesTutorial() {
  const { culturalPreference } = useTheme();
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Load tutorial state from localStorage
  useEffect(() => {
    const tutorialState = localStorage.getItem('tutorialState');
    if (tutorialState) {
      const { completed, lastStep, feedbackData } = JSON.parse(tutorialState);
      if (completed) {
        setShowTutorial(false);
      } else {
        setCurrentStep(lastStep || 0);
      }
      if (feedbackData) {
        setFeedback(feedbackData);
      }
    }

    // Track tutorial start
    trackEvent('tutorial_started', {
      country: culturalPreference.country,
      language: culturalPreference.language,
    });
  }, []);

  // Save tutorial state to localStorage
  useEffect(() => {
    localStorage.setItem(
      'tutorialState',
      JSON.stringify({
        completed: !showTutorial,
        lastStep: currentStep,
        feedbackData: feedback,
      })
    );
  }, [showTutorial, currentStep, feedback]);

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Welcome to Beauty Directory',
      description: 'Discover personalized makeup looks and trends based on your cultural preferences.',
      image: '/images/tutorial/welcome.jpg',
    },
    {
      title: 'Cultural Themes',
      description: `Experience beauty through your cultural lens. We've curated looks specific to ${culturalPreference.country}.`,
      image: '/images/tutorial/themes.jpg',
    },
    {
      title: 'Seasonal Trends',
      description: 'Explore looks that match the current season and upcoming cultural events.',
      image: '/images/tutorial/seasons.jpg',
    },
    {
      title: 'Look Scheduler',
      description: 'Plan your looks ahead with our smart scheduler, complete with cultural event awareness.',
      image: '/images/tutorial/scheduler.jpg',
    },
    {
      title: 'Notifications',
      description: 'Stay updated with customizable notifications for your scheduled looks.',
      image: '/images/tutorial/notifications.jpg',
    },
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      trackEvent('tutorial_next_step', {
        step: currentStep + 1,
        stepName: tutorialSteps[currentStep + 1].title,
      });
    } else {
      setShowFeedback(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      trackEvent('tutorial_previous_step', {
        step: currentStep - 1,
        stepName: tutorialSteps[currentStep - 1].title,
      });
    }
  };

  const handleFeedback = (data: Partial<FeedbackData>) => {
    const newFeedback: FeedbackData = {
      stepIndex: currentStep,
      rating: data.rating || 3,
      helpful: data.helpful || false,
      comment: data.comment,
    };

    setFeedback((prev) => [...prev, newFeedback]);
    trackEvent('tutorial_feedback_submitted', {
      step: currentStep,
      rating: newFeedback.rating,
      helpful: newFeedback.helpful,
    });

    if (currentStep === tutorialSteps.length - 1) {
      handleClose();
    } else {
      setShowFeedback(false);
      handleNext();
    }
  };

  const handleClose = () => {
    setShowTutorial(false);
    trackEvent('tutorial_completed', {
      stepsCompleted: currentStep + 1,
      totalSteps: tutorialSteps.length,
      averageRating:
        feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length,
    });
  };

  if (!showTutorial) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className={`bg-white rounded-lg p-6 max-w-2xl w-full mx-4 ${
          culturalPreference.direction === 'rtl' ? 'rtl' : 'ltr'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {showFeedback ? 'Your Feedback' : tutorialSteps[currentStep].title}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {showFeedback ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="font-medium">How would you rate this feature?</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFeedback({ rating: rating as 1 | 2 | 3 | 4 | 5 })}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating <= (feedback[currentStep]?.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Was this helpful?</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback({ helpful: true })}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback({ helpful: false })}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    No
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Any additional feedback?</h3>
                <textarea
                  className="w-full h-24 p-2 border rounded-md"
                  placeholder="Share your thoughts..."
                  onChange={(e) => handleFeedback({ comment: e.target.value })}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {tutorialSteps[currentStep].image && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={tutorialSteps[currentStep].image}
                    alt={tutorialSteps[currentStep].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-gray-600">
                {tutorialSteps[currentStep].description}
              </p>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep
                          ? 'bg-primary'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <Button onClick={handleNext}>
                  {currentStep === tutorialSteps.length - 1 ? (
                    'Finish'
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
