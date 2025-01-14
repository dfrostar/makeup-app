'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Trend {
  id: string;
  title: string;
  description: string;
  popularity: number;
  tags: string[];
  image: string;
}

const monthlyTrends: Record<number, Trend[]> = {
  0: [ // January
    {
      id: 'winter-glow',
      title: 'Winter Glow',
      description: 'Achieve a luminous complexion with frost-inspired highlights',
      popularity: 98,
      tags: ['highlight', 'winter', 'glow'],
      image: '/images/trends/winter-glow.jpg'
    },
    // Add more January trends
  ],
  // Add trends for other months
};

export function TrendsSection({ month }: { month: number }) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setTrends(monthlyTrends[month] || []);
  }, [month]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold">Monthly Trends</h2>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trends.map((trend) => (
          <motion.div
            key={trend.id}
            layoutId={trend.id}
            onClick={() => setSelectedTrend(trend.id)}
            className="cursor-pointer"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={trend.image}
                alt={trend.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold mb-1">{trend.title}</h3>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm">
                    {trend.popularity}% Popularity
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedTrend && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-2">
                {trends.find(t => t.id === selectedTrend)?.title}
              </h3>
              <p className="text-gray-600">
                {trends.find(t => t.id === selectedTrend)?.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTrend(null)}
            >
              Close
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {trends
              .find(t => t.id === selectedTrend)
              ?.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
