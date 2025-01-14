'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon?: any;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isSelected = selected === category.id;
        const Icon = category.icon;

        return (
          <motion.button
            key={category.id}
            onClick={() => onChange(category.id)}
            className={`
              flex items-center px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 ease-in-out
              ${
                isSelected
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 mr-2 ${
                  isSelected ? 'text-white' : 'text-gray-400'
                }`}
              />
            )}
            {category.name}
          </motion.button>
        );
      })}
    </div>
  );
}
