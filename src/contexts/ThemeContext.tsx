'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CulturalPreference = {
  country: string;
  language: string;
  direction: 'ltr' | 'rtl';
  events: Record<string, string[]>;
  colors: Record<string, string[]>;
};

type Theme = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
};

type ThemeContextType = {
  theme: Theme;
  culturalPreference: CulturalPreference;
  setTheme: (theme: Theme) => void;
  setCulturalPreference: (preference: CulturalPreference) => void;
  toggleDirection: () => void;
};

const culturalPresets: Record<string, CulturalPreference> = {
  US: {
    country: 'US',
    language: 'en',
    direction: 'ltr',
    events: {
      spring: ['Easter', 'Mother\'s Day', 'Memorial Day'],
      summer: ['Independence Day', 'Labor Day'],
      fall: ['Halloween', 'Thanksgiving'],
      winter: ['Christmas', 'New Year\'s Eve'],
    },
    colors: {
      spring: ['#FFB3BA', '#BAFFC9', '#BAE1FF'],
      summer: ['#FF8C69', '#FFB347', '#FFD700'],
      fall: ['#8B4513', '#D2691E', '#CD853F'],
      winter: ['#87CEEB', '#E0FFFF', '#B0E0E6'],
    },
  },
  JP: {
    country: 'JP',
    language: 'ja',
    direction: 'ltr',
    events: {
      spring: ['Hanami', 'Golden Week', 'Children\'s Day'],
      summer: ['Tanabata', 'Obon', 'Fireworks Festivals'],
      fall: ['Tsukimi', 'Culture Day', 'Labor Thanksgiving'],
      winter: ['Seijin no Hi', 'Setsubun', 'New Year'],
    },
    colors: {
      spring: ['#FFB7C5', '#E4A5C0', '#FEDFE1'],
      summer: ['#66BAB7', '#7DB9DE', '#FB9966'],
      fall: ['#D05A6E', '#F8C3CD', '#F4A7B9'],
      winter: ['#BDC0BA', '#91989F', '#787878'],
    },
  },
  IN: {
    country: 'IN',
    language: 'hi',
    direction: 'ltr',
    events: {
      spring: ['Holi', 'Ugadi', 'Baisakhi'],
      summer: ['Raksha Bandhan', 'Independence Day', 'Onam'],
      fall: ['Diwali', 'Durga Puja', 'Navratri'],
      winter: ['Pongal', 'Republic Day', 'Lohri'],
    },
    colors: {
      spring: ['#FF9933', '#FF1493', '#FF69B4'],
      summer: ['#138808', '#800080', '#FF4500'],
      fall: ['#B83B5E', '#FF1493', '#FF69B4'],
      winter: ['#6B5B95', '#FF6B6B', '#4ECDC4'],
    },
  },
  SA: {
    country: 'SA',
    language: 'ar',
    direction: 'rtl',
    events: {
      spring: ['Ramadan Start', 'Eid al-Fitr', 'National Day'],
      summer: ['Hajj', 'Eid al-Adha', 'Islamic New Year'],
      fall: ['Prophet\'s Birthday', 'National Foundation Day'],
      winter: ['Winter at Tantora', 'Janadriyah Festival'],
    },
    colors: {
      spring: ['#00A693', '#D4AF37', '#800020'],
      summer: ['#C19A6B', '#FFB347', '#CD7F32'],
      fall: ['#800020', '#D4AF37', '#654321'],
      winter: ['#40826D', '#7B9F80', '#004225'],
    },
  },
  IL: {
    country: 'IL',
    language: 'he',
    direction: 'rtl',
    events: {
      spring: ['Passover', 'Yom HaAtzmaut', 'Lag BaOmer'],
      summer: ['Shavuot', 'Tisha B\'Av', 'Tu B\'Av'],
      fall: ['Rosh Hashanah', 'Yom Kippur', 'Sukkot'],
      winter: ['Hanukkah', 'Tu BiShvat', 'Purim'],
    },
    colors: {
      spring: ['#4B9CD3', '#13294B', '#FFFFFF'],
      summer: ['#FFB347', '#FFA07A', '#F4A460'],
      fall: ['#8B4513', '#DAA520', '#CD853F'],
      winter: ['#1E4D2B', '#A2AAAD', '#FFFFFF'],
    },
  },
};

const defaultTheme: Theme = {
  background: 'bg-white dark:bg-gray-900',
  text: 'text-gray-900 dark:text-gray-100',
  primary: 'text-purple-600 dark:text-purple-400',
  secondary: 'text-pink-600 dark:text-pink-400',
  accent: 'text-blue-600 dark:text-blue-400',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [culturalPreference, setCulturalPreference] = useState<CulturalPreference>(
    culturalPresets.US
  );

  useEffect(() => {
    // Detect user's country and set initial cultural preference
    const detectUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country || 'US';
        if (culturalPresets[country]) {
          setCulturalPreference(culturalPresets[country]);
          // Set document direction
          document.documentElement.dir = culturalPresets[country].direction;
          // Set language
          document.documentElement.lang = culturalPresets[country].language;
        }
      } catch (error) {
        console.error('Failed to detect user country:', error);
      }
    };

    detectUserCountry();
  }, []);

  const toggleDirection = () => {
    setCulturalPreference((prev) => ({
      ...prev,
      direction: prev.direction === 'ltr' ? 'rtl' : 'ltr',
    }));
    document.documentElement.dir =
      document.documentElement.dir === 'ltr' ? 'rtl' : 'ltr';
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        culturalPreference,
        setTheme,
        setCulturalPreference,
        toggleDirection,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
