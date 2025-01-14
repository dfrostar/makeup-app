import React, { useState, useEffect } from 'react';
import { CountryCode, countryConfigs, culturalColorSchemes, timeBasedColorSchemes, Holiday } from '../backgrounds/countryConfig';
import { BackgroundPreset, ColorScheme, AnimationStyle } from '../backgrounds/types';
import { motion } from 'framer-motion';
import { Settings2, Save, Upload, Download, Play, Pause, RefreshCw, Globe } from 'lucide-react';

export interface AIPreferences {
  intensity: { min: number; max: number };
  speed: { min: number; max: number };
  transitions: 'smooth' | 'sharp';
}

export interface AIRules {
  timeOfDay: boolean;
  season: boolean;
  holiday: boolean;
  mood: boolean;
}

export interface AIAgentControl {
  enabled: boolean;
  mode: 'auto' | 'assist' | 'manual';
  interval: number;
  countryCode: CountryCode;
  rules: AIRules;
  preferences: AIPreferences;
}

export interface BackgroundControlsProps {
  onPresetChange: (preset: BackgroundPreset) => void;
  onExportPreset: () => void;
  onImportPreset: (preset: BackgroundPreset) => void;
  currentPreset: BackgroundPreset;
}

type ThemeScheme = {
  primary: readonly string[];
  secondary: readonly string[];
  background: readonly string[];
};

export const getSeasonForHemisphere = (date: Date, hemisphere: 'north' | 'south'): ColorScheme => {
  const month = date.getMonth();
  const day = date.getDate();

  // Northern Hemisphere seasons
  const springStart = { month: 2, day: 20 }; // March 20
  const summerStart = { month: 5, day: 21 }; // June 21
  const autumnStart = { month: 8, day: 22 }; // September 22
  const winterStart = { month: 11, day: 21 }; // December 21

  const isAfterDate = (start: { month: number; day: number }) =>
    month > start.month || (month === start.month && day >= start.day);

  if (hemisphere === 'north') {
    if (isAfterDate(springStart) && !isAfterDate(summerStart)) return 'spring';
    if (isAfterDate(summerStart) && !isAfterDate(autumnStart)) return 'summer';
    if (isAfterDate(autumnStart) && !isAfterDate(winterStart)) return 'autumn';
    return 'winter';
  } else {
    // Southern Hemisphere - opposite seasons
    if (isAfterDate(springStart) && !isAfterDate(summerStart)) return 'autumn';
    if (isAfterDate(summerStart) && !isAfterDate(autumnStart)) return 'winter';
    if (isAfterDate(autumnStart) && !isAfterDate(winterStart)) return 'spring';
    return 'summer';
  }
};

export const isHolidayActive = (inputDate: Date | number | string, holiday: Holiday): boolean => {
  // Always create a new Date object to ensure we have a valid date
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  
  // Ensure we have a valid date before proceeding
  if (isNaN(date.getTime())) {
    console.error('Invalid date provided:', inputDate);
    return false;
  }

  const month = date.getMonth();
  const day = date.getDate();
  const weekDay = date.getDay();
  
  for (const holidayDate of holiday.dates) {
    // Check if month matches
    if (holidayDate.month !== month) continue;

    // For fixed date holidays
    if (holidayDate.day !== undefined) {
      // Check if within duration range
      const duration = holidayDate.duration || 1;
      if (day >= holidayDate.day && day < holidayDate.day + duration) {
        return true;
      }
    }

    // For Nth weekday holidays
    if (holidayDate.weekDay !== undefined && holidayDate.weekOfMonth !== undefined) {
      // Calculate which occurrence of the weekday this is
      let weekOfMonth = Math.floor((day - 1) / 7) + 1;
      if (weekDay === holidayDate.weekDay && weekOfMonth === holidayDate.weekOfMonth) {
        return true;
      }
    }
  }

  return false;
};

export const generateAIPreset = (control: AIAgentControl): BackgroundPreset => {
  // Get current time and determine time-based theme
  const date = new Date();
  let theme: ColorScheme = 'noon';
  
  // Check for holidays first
  if (control.rules.holiday) {
    const countryConfig = countryConfigs[control.countryCode];
    for (const holiday of countryConfig.holidays) {
      if (isHolidayActive(date, holiday)) {
        console.log(`Holiday active: ${holiday.name}, theme: ${holiday.theme}`);
        theme = holiday.theme;
        break;
      }
    }
  }
  
  // If no holiday and time of day is enabled, use time-based theme
  if (theme === 'noon' && control.rules.timeOfDay) {
    const hour = date.getHours();
    if (hour >= 5 && hour < 8) theme = 'dawn';
    else if (hour >= 8 && hour < 12) theme = 'morning';
    else if (hour >= 12 && hour < 14) theme = 'noon';
    else if (hour >= 14 && hour < 17) theme = 'afternoon';
    else if (hour >= 17 && hour < 20) theme = 'dusk';
    else if (hour >= 20 && hour < 23) theme = 'evening';
    else theme = 'midnight';
  } else if (theme === 'noon' && !control.rules.timeOfDay) {
    // Default theme if no holiday or time of day
    theme = 'sakura';
  }

  // Get the appropriate color scheme
  let scheme: ThemeScheme;
  if (theme in timeBasedColorSchemes) {
    scheme = timeBasedColorSchemes[theme as keyof typeof timeBasedColorSchemes];
  } else {
    scheme = culturalColorSchemes[theme as keyof typeof culturalColorSchemes];
  }

  // Animation mapping for all themes
  const animationMap: Record<ColorScheme, AnimationStyle> = {
    // Cultural themes
    sakura: 'particles',
    starFestival: 'constellation',
    holi: 'particles',
    diwali: 'prism',
    lunarNewYear: 'fireworks',
    lanternFestival: 'vortex',
    dragonBoat: 'ripple',
    moonFestival: 'constellation',
    dayOfDead: 'vortex',
    guadalupe: 'aurora',
    christmas: 'snow',
    thanksgiving: 'float',
    independence: 'fireworks',
    carnival: 'vortex',
    // Time of day
    dawn: 'float',
    morning: 'ripple',
    noon: 'prism',
    afternoon: 'float',
    dusk: 'vortex',
    evening: 'constellation',
    midnight: 'aurora',
    // Seasons
    spring: 'particles',
    summer: 'ripple',
    autumn: 'float',
    winter: 'snow'
  };

  const animation = {
    style: animationMap[theme] || 'ripple', // Default to ripple if theme not found
    speed: Math.max(control.preferences.speed.min, 
      Math.min(control.preferences.speed.max, Math.random() + 0.5)),
    intensity: Math.max(control.preferences.intensity.min,
      Math.min(control.preferences.intensity.max, Math.random() * 0.5 + 0.3))
  };

  console.log(`Generated theme: ${theme}, animation: ${animation.style}`);

  return {
    theme,
    colors: scheme,
    animation
  };
};

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  onPresetChange,
  onExportPreset,
  onImportPreset,
  currentPreset
}) => {
  const [aiControl, setAIControl] = useState<AIAgentControl>({
    enabled: true,
    mode: 'auto',
    interval: 3600,
    countryCode: 'US',
    rules: {
      timeOfDay: true,
      season: true,
      holiday: true,
      mood: false
    },
    preferences: {
      intensity: { min: 0.5, max: 0.8 },
      speed: { min: 0.8, max: 1.2 },
      transitions: 'smooth'
    }
  });

  useEffect(() => {
    if (aiControl.enabled && aiControl.mode === 'auto') {
      const updatePreset = () => {
        const newPreset = generateAIPreset(aiControl);
        onPresetChange(newPreset);
      };

      updatePreset();
      const interval = setInterval(updatePreset, aiControl.interval * 1000);
      return () => clearInterval(interval);
    }
  }, [aiControl, onPresetChange]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAIControl(prev => ({
      ...prev,
      countryCode: event.target.value as CountryCode
    }));
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-black/30 backdrop-blur-lg rounded-lg p-4 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Background Controls</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setAIControl(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`p-2 rounded ${aiControl.enabled ? 'bg-green-500' : 'bg-gray-500'}`}
            >
              {aiControl.enabled ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={onExportPreset}
              className="p-2 rounded bg-blue-500 hover:bg-blue-600"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => {/* Import logic */}}
              className="p-2 rounded bg-blue-500 hover:bg-blue-600"
            >
              <Upload size={16} />
            </button>
          </div>
        </div>

        {/* AI Control Settings */}
        {aiControl.enabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Mode</span>
              <select
                value={aiControl.mode}
                onChange={(e) => setAIControl(prev => ({ ...prev, mode: e.target.value as AIAgentControl['mode'] }))}
                className="bg-black/30 text-white text-sm rounded px-2 py-1"
              >
                <option value="auto">Automatic</option>
                <option value="assist">AI Assist</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiControl.rules.timeOfDay}
                  onChange={(e) => setAIControl(prev => ({
                    ...prev,
                    rules: { ...prev.rules, timeOfDay: e.target.checked }
                  }))}
                />
                <span className="text-white text-sm">Time of Day</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiControl.rules.season}
                  onChange={(e) => setAIControl(prev => ({
                    ...prev,
                    rules: { ...prev.rules, season: e.target.checked }
                  }))}
                />
                <span className="text-white text-sm">Seasonal</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiControl.rules.holiday}
                  onChange={(e) => setAIControl(prev => ({
                    ...prev,
                    rules: { ...prev.rules, holiday: e.target.checked }
                  }))}
                />
                <span className="text-white text-sm">Holidays</span>
              </label>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-white text-sm">Update Interval</span>
                <input
                  type="range"
                  min="300"
                  max="7200"
                  step="300"
                  value={aiControl.interval}
                  onChange={(e) => setAIControl(prev => ({
                    ...prev,
                    interval: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <span className="text-white text-sm">{aiControl.interval / 60} minutes</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-white text-sm">Country</span>
                <select
                  value={aiControl.countryCode}
                  onChange={handleCountryChange}
                  className="bg-black/30 text-white text-sm rounded px-2 py-1"
                >
                  {Object.keys(countryConfigs).map(countryCode => (
                    <option key={countryCode} value={countryCode}>{countryConfigs[countryCode as CountryCode].name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Current Preset Display */}
        <div className="text-white text-sm">
          <div>Theme: {currentPreset.theme}</div>
          <div>Animation: {currentPreset.animation.style}</div>
          <div>Speed: {currentPreset.animation.speed.toFixed(2)}</div>
          <div>Intensity: {currentPreset.animation.intensity.toFixed(2)}</div>
        </div>
      </div>
    </motion.div>
  );
};
