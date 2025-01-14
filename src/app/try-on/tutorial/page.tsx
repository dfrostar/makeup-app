'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Camera,
  Palette,
  Sliders,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const tutorials = [
  {
    id: 1,
    title: 'Getting Started',
    description: 'Allow camera access and position your face in the frame',
    icon: Camera,
    video: '/videos/tutorial-1.mp4',
    tips: [
      'Find a well-lit area',
      'Keep your face centered',
      'Ensure your camera is clean'
    ]
  },
  {
    id: 2,
    title: 'Choosing Products',
    description: 'Browse and select from our wide range of makeup products',
    icon: Palette,
    video: '/videos/tutorial-2.mp4',
    tips: [
      'Start with foundation',
      'Try different shades',
      'Experiment with combinations'
    ]
  },
  {
    id: 3,
    title: 'Adjusting Settings',
    description: 'Fine-tune intensity, color, and effects for the perfect look',
    icon: Sliders,
    video: '/videos/tutorial-3.mp4',
    tips: [
      'Use the intensity slider',
      'Try different blend modes',
      'Adjust color saturation'
    ]
  },
  {
    id: 4,
    title: 'Sharing Your Look',
    description: 'Save, share, and get feedback on your virtual makeover',
    icon: Share2,
    video: '/videos/tutorial-4.mp4',
    tips: [
      'Take snapshots',
      'Share on social media',
      'Save favorite looks'
    ]
  }
];

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, tutorials.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const currentTutorial = tutorials[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Use Virtual Try-On
          </h1>
          <p className="text-xl text-gray-600">
            Follow this quick tutorial to get started with our AR makeup features
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between mb-2">
            {tutorials.map((tutorial, index) => (
              <motion.button
                key={tutorial.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index <= currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-purple-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${((currentStep + 1) / tutorials.length) * 100}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Video Section */}
            <div className="aspect-video bg-gray-900 relative">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={currentTutorial.video} type="video/mp4" />
              </video>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="flex items-center mb-4">
                <currentTutorial.icon className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentTutorial.title}
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                {currentTutorial.description}
              </p>

              {/* Tips */}
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-4">Pro Tips:</h3>
                <ul className="space-y-2">
                  {currentTutorial.tips.map((tip, index) => (
                    <li key={index} className="flex items-center text-purple-700">
                      <span className="h-2 w-2 bg-purple-600 rounded-full mr-3" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentStep === tutorials.length - 1 ? (
                  <Link href="/test-ar">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                      Start Try-On
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={nextStep}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
