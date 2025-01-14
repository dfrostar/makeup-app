'use client';

import { useState, useEffect } from 'react';
import { Paintbrush } from 'lucide-react';
import { motion } from 'framer-motion';
import { CulturalPreference } from '@/contexts/ThemeContext';

type ColorPaletteProps = {
  season: string;
  onChange: (colors: string[]) => void;
  culturalPreference: CulturalPreference;
};

type ColorGroup = {
  name: string;
  colors: string[];
};

type CulturalPalette = {
  [key: string]: ColorGroup[];
};

const culturalPalettes: Record<string, CulturalPalette> = {
  US: {
    spring: [
      { name: 'pastels', colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'] },
      { name: 'brights', colors: ['#FF69B4', '#98FB98', '#87CEEB', '#FFB6C1'] },
    ],
    summer: [
      { name: 'warm', colors: ['#FF8C69', '#FFB347', '#FFD700', '#FFA07A'] },
      { name: 'cool', colors: ['#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'] },
    ],
    // Add more seasons
  },
  JP: {
    spring: [
      { name: 'sakura', colors: ['#FFB7C5', '#E4A5C0', '#FEDFE1', '#FEEEED'] },
      { name: 'matcha', colors: ['#A8C97F', '#86A697', '#DAF7A6', '#B5CAA0'] },
    ],
    summer: [
      { name: 'traditional', colors: ['#E16B8C', '#8E354A', '#F8C3CD', '#F4A7B9'] },
      { name: 'modern', colors: ['#66BAB7', '#7DB9DE', '#FB9966', '#C1328E'] },
    ],
    // Add more seasons
  },
  IN: {
    spring: [
      { name: 'holi', colors: ['#FF9933', '#FF1493', '#FF69B4', '#FFB6C1'] },
      { name: 'festive', colors: ['#138808', '#800080', '#FF4500', '#FFD700'] },
    ],
    summer: [
      { name: 'traditional', colors: ['#B83B5E', '#FF1493', '#FF69B4', '#FFB6C1'] },
      { name: 'modern', colors: ['#6B5B95', '#FF6B6B', '#4ECDC4', '#45B7D1'] },
    ],
    // Add more seasons
  },
};

const seasonalPalettes = {
  spring: {
    primary: ['#FF69B4', '#FF1493', '#DB7093', '#FFB6C1'],
    secondary: ['#9370DB', '#BA55D3', '#DDA0DD', '#D8BFD8'],
    accent: ['#FFD700', '#DAA520', '#F0E68C', '#BDB76B'],
  },
  summer: {
    primary: ['#FF69B4', '#FF1493', '#DB7093', '#FFB6C1'],
    secondary: ['#9370DB', '#BA55D3', '#DDA0DD', '#D8BFD8'],
    accent: ['#20B2AA', '#48D1CC', '#40E0D0', '#7FFFD4'],
  },
  // Add more seasons
};

export function ColorPalette({ season, onChange, culturalPreference }: ColorPaletteProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentPalette, setCurrentPalette] = useState<ColorGroup[]>([]);

  useEffect(() => {
    // Use cultural palette if available, otherwise fall back to seasonal
    const culturalPalette = culturalPalettes[culturalPreference.country]?.[season];
    if (culturalPalette) {
      setCurrentPalette(culturalPalette);
    } else {
      const fallbackPalette = seasonalPalettes[season as keyof typeof seasonalPalettes];
      setCurrentPalette(
        Object.entries(fallbackPalette).map(([name, colors]) => ({
          name,
          colors,
        }))
      );
    }
  }, [season, culturalPreference]);

  const handleColorClick = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color].slice(-4);

    setSelectedColors(newColors);
    onChange(newColors);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Paintbrush className="h-4 w-4" />
        <h3 className="text-sm font-medium">
          {culturalPreference.country} {season} Colors
        </h3>
      </div>

      <div className="space-y-4">
        {currentPalette.map((group) => (
          <div key={group.name}>
            <h4 className="text-xs text-gray-500 mb-2 capitalize">
              {group.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.colors.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleColorClick(color)}
                  className={`w-8 h-8 rounded-full ${
                    selectedColors.includes(color)
                      ? 'ring-2 ring-offset-2 ring-primary'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={`${group.name} ${color}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedColors.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs text-gray-500 mb-2">Selected Colors</h4>
          <div className="flex gap-2">
            {selectedColors.map((color) => (
              <div
                key={color}
                className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-primary"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
