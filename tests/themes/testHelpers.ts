import { ColorScheme, AnimationStyle, AIAgentControl } from '../../src/components/backgrounds/types';
import { CountryCode } from '../../src/components/backgrounds/countryConfig';

export const createMockDate = (
  year: number,
  month: number,
  day: number,
  hours: number = 0,
  minutes: number = 0
): Date => new Date(year, month, day, hours, minutes);

export const validateRgbaColor = (color: string): boolean => {
  const rgbaRegex = /^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[0-1](\.\d+)?\)$/;
  if (!rgbaRegex.test(color)) return false;

  const values = color
    .replace('rgba(', '')
    .replace(')', '')
    .split(',')
    .map(v => parseFloat(v.trim()));

  return (
    values.length === 4 &&
    values.slice(0, 3).every(v => v >= 0 && v <= 255) &&
    values[3] >= 0 && values[3] <= 1
  );
};

export const createMockAIControl = (overrides?: Partial<AIAgentControl>): AIAgentControl => ({
  enabled: true,
  mode: 'auto',
  interval: 3600,
  countryCode: 'US' as CountryCode,
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
  },
  ...overrides
});

export const expectValidPreset = (preset: any) => {
  expect(preset).toBeDefined();
  expect(preset.theme).toBeDefined();
  expect(preset.colors).toBeDefined();
  expect(preset.colors.primary).toBeDefined();
  expect(preset.colors.secondary).toBeDefined();
  expect(preset.colors.background).toBeDefined();
  expect(preset.animation).toBeDefined();
  expect(preset.animation.style).toBeDefined();
  expect(preset.animation.speed).toBeDefined();
  expect(preset.animation.intensity).toBeDefined();
};

export const seasonDates = {
  spring: {
    north: createMockDate(2024, 2, 20), // March 20
    south: createMockDate(2024, 8, 22)  // September 22
  },
  summer: {
    north: createMockDate(2024, 5, 21), // June 21
    south: createMockDate(2024, 11, 21) // December 21
  },
  autumn: {
    north: createMockDate(2024, 8, 22), // September 22
    south: createMockDate(2024, 2, 20)  // March 20
  },
  winter: {
    north: createMockDate(2024, 11, 21), // December 21
    south: createMockDate(2024, 5, 21)   // June 21
  }
};

export const holidayDates = {
  christmas: createMockDate(2024, 11, 25),
  thanksgiving: createMockDate(2024, 10, 28),
  diwali: createMockDate(2024, 10, 22),
  lunarNewYear: createMockDate(2024, 1, 10),
  sakura: createMockDate(2024, 2, 25),
  dayOfDead: createMockDate(2024, 10, 1)
};
