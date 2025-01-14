'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Camera,
    title: 'Real-Time Try-On',
    description: 'Experience makeup virtually with our advanced AR technology'
  },
  {
    icon: Sparkles,
    title: 'Professional Effects',
    description: 'Choose from a wide range of professional-grade makeup products'
  },
  {
    icon: Users,
    title: 'Share Your Look',
    description: 'Share your virtual makeovers with friends and get feedback'
  },
  {
    icon: Star,
    title: 'Save Favorites',
    description: 'Save your favorite looks and products for quick access'
  }
];

export default function TryOnLanding() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6"
              >
                Virtual Makeup Try-On
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-8"
              >
                Experience the future of beauty with our AI-powered makeup simulator.
                Try on products in real-time and find your perfect look.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/test-ar">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    Try Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/try-on/tutorial">
                  <Button size="lg" variant="outline">
                    Watch Tutorial
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Demo Video/Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onPlay={() => setIsVideoPlaying(true)}
                  className="w-full aspect-video object-cover"
                >
                  <source src="/videos/ar-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Experience the Magic
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Look?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have discovered their perfect makeup look
          </p>
          <Link href="/test-ar">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600">
              Start Your Virtual Makeover
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
