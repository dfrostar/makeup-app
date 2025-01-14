'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Globe2, 
  Calendar, 
  Users, 
  Palette,
  TrendingUp 
} from 'lucide-react';

type TrendCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export function TrendCategories() {
  const { culturalPreference } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('global');

  const categories: TrendCategory[] = [
    {
      id: 'global',
      name: 'Global Trends',
      icon: <Globe2 className="h-5 w-5" />,
      description: 'Popular looks from around the world',
    },
    {
      id: 'seasonal',
      name: 'Seasonal Trends',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Trending looks for the current season',
    },
    {
      id: 'cultural',
      name: `${culturalPreference.country} Trends`,
      icon: <Palette className="h-5 w-5" />,
      description: `Popular in ${culturalPreference.country}`,
    },
    {
      id: 'celebrity',
      name: 'Celebrity Inspired',
      icon: <Sparkles className="h-5 w-5" />,
      description: 'Looks inspired by celebrities',
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: <Users className="h-5 w-5" />,
      description: 'Trending on social platforms',
    },
    {
      id: 'emerging',
      name: 'Emerging Trends',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Up and coming looks',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Trend Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="w-full h-full flex flex-col items-center justify-center p-4 gap-2"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-xs text-gray-500 text-center">
                {category.description}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
