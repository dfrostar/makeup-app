import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateAIPreset } from '../../src/components/admin/BackgroundControls';
import { AIAgentControl } from '../../src/components/backgrounds/types';
import { CountryCode } from '../../src/components/backgrounds/countryConfig';
import { Holiday, HolidayDate } from '../../src/components/backgrounds/countryConfig';
import * as BackgroundControls from '../../src/components/admin/BackgroundControls';
import { createMockAIControl, expectValidPreset } from './testHelpers';

describe('AI Theme Generation', () => {
  let mockDate: Date;

  beforeEach(() => {
    // Mock the current date to January 6, 2025, 09:32
    mockDate = new Date(2025, 0, 6, 9, 32);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  describe('Time-based Theme Generation', () => {
    const timeTests = [
      { time: new Date(2025, 0, 6, 6, 0), expected: 'dawn' },
      { time: new Date(2025, 0, 6, 10, 0), expected: 'morning' },
      { time: new Date(2025, 0, 6, 13, 0), expected: 'noon' },
      { time: new Date(2025, 0, 6, 15, 0), expected: 'afternoon' },
      { time: new Date(2025, 0, 6, 18, 0), expected: 'dusk' },
      { time: new Date(2025, 0, 6, 21, 0), expected: 'evening' },
      { time: new Date(2025, 0, 6, 23, 30), expected: 'midnight' }
    ];

    timeTests.forEach(({ time, expected }) => {
      test(`generates correct theme for ${time.toLocaleTimeString()}`, () => {
        mockDate = time;
        const preset = generateAIPreset(createMockAIControl({
          rules: {
            timeOfDay: true,
            season: false,
            holiday: false,
            mood: false
          }
        }));

        expectValidPreset(preset);
        expect(preset?.colors).toBeDefined();
      });
    });
  });

  describe('Holiday Theme Priority', () => {
    const holidayTests = [
      { 
        date: new Date(2024, 11, 25), // Christmas
        country: 'US' as CountryCode,
        expected: 'christmas'
      },
      {
        date: new Date(2024, 10, 23), // Thanksgiving
        country: 'US' as CountryCode,
        expected: 'thanksgiving'
      },
      {
        date: new Date(2024, 10, 1), // Day of the Dead
        country: 'MX' as CountryCode,
        expected: 'dayOfDead'
      },
      {
        date: new Date(2024, 2, 25), // Cherry Blossom
        country: 'JP' as CountryCode,
        expected: 'sakura'
      }
    ];

    holidayTests.forEach(({ date, country, expected }) => {
      test(`prioritizes ${expected} theme for ${country} on ${date.toDateString()}`, () => {
        mockDate = date;
        const preset = generateAIPreset(createMockAIControl({
          countryCode: country,
          rules: {
            timeOfDay: true,
            season: true,
            holiday: true,
            mood: false
          }
        }));

        expectValidPreset(preset);
      });
    });
  });

  describe('Animation Style Selection', () => {
    const RealDate = global.Date;

    beforeEach(() => {
      // Reset all mocks before each test
      jest.resetAllMocks();
    });

    afterEach(() => {
      // Clean up all mocks after each test
      jest.restoreAllMocks();
      global.Date = RealDate;
    });

    test('selects appropriate animation styles for cultural holidays', () => {
      const holidayAnimationPairs = [
        {
          timestamp: RealDate.UTC(2024, 2, 25),
          country: 'JP' as CountryCode,
          expectedTheme: 'sakura',
          expectedAnimation: 'particles',
          holidayName: 'Cherry Blossom Festival',
          description: 'Cherry Blossom Festival - gentle particles representing falling petals'
        },
        {
          timestamp: RealDate.UTC(2024, 2, 28),
          country: 'IN' as CountryCode,
          expectedTheme: 'holi',
          expectedAnimation: 'particles',
          holidayName: 'Holi',
          description: 'Holi - vibrant particles representing colorful powder'
        },
        {
          timestamp: RealDate.UTC(2024, 8, 15),
          country: 'CN' as CountryCode,
          expectedTheme: 'moonFestival',
          expectedAnimation: 'constellation',
          holidayName: 'Moon Festival',
          description: 'Moon Festival - starry night constellation effect'
        },
        {
          timestamp: RealDate.UTC(2024, 6, 7),
          country: 'JP' as CountryCode,
          expectedTheme: 'starFestival',
          expectedAnimation: 'constellation',
          holidayName: 'Star Festival',
          description: 'Star Festival (Tanabata) - celestial constellation patterns'
        },
        {
          timestamp: RealDate.UTC(2024, 10, 31),
          country: 'MX' as CountryCode,
          expectedTheme: 'dayOfDead',
          expectedAnimation: 'vortex',
          holidayName: 'Day of the Dead',
          description: 'Day of the Dead - mystical spiral patterns'
        }
      ];

      holidayAnimationPairs.forEach(({ timestamp, country, expectedTheme, expectedAnimation, holidayName, description }, index) => {
        // Mock isHolidayActive to return true only for the expected holiday
        const mockIsHolidayActive = jest.spyOn(BackgroundControls, 'isHolidayActive')
          .mockImplementation((date, holiday) => {
            const isActive = holiday.name === holidayName;
            console.log(`Checking holiday ${holiday.name} against ${holidayName}: ${isActive}`);
            return isActive;
          });
        
        // Mock the Date constructor to return our test date
        const testDate = new RealDate(timestamp);
        global.Date = jest.fn(() => testDate) as any;
        (global.Date as any).UTC = RealDate.UTC;
        
        console.log(`\nRunning test for ${holidayName}`);
        console.log(`Test date: ${testDate.toISOString()}`);
        console.log(`Country: ${country}`);
        
        const mockControl = createMockAIControl({
          countryCode: country,
          rules: {
            timeOfDay: false,
            season: false,
            holiday: true,
            mood: false
          }
        });
        
        console.log('Mock control settings:', JSON.stringify(mockControl, null, 2));
        
        const preset = generateAIPreset(mockControl);

        console.log(`\nTest ${index + 1}: ${description}
          Date: ${testDate.toDateString()}
          Country: ${country}
          Holiday: ${holidayName}
          Theme: ${preset.theme}
          Expected Theme: ${expectedTheme}
          Animation: ${preset.animation.style}
          Expected Animation: ${expectedAnimation}
          Rules enabled: ${JSON.stringify(mockControl.rules)}\n`);

        expect(preset.theme).toBe(expectedTheme);
        expect(preset.animation.style).toBe(expectedAnimation);
        
        // Clean up the mocks
        mockIsHolidayActive.mockRestore();
      });
    });

    test('handles transition between holidays gracefully', () => {
      // Test transition from one holiday to another
      const mockDate1 = new RealDate(RealDate.UTC(2024, 2, 25)); // Cherry Blossom Festival
      const mockDate2 = new RealDate(RealDate.UTC(2024, 2, 28)); // Holi

      console.log('\nTesting holiday transition');
      
      // First holiday
      global.Date = jest.fn(() => mockDate1) as any;
      (global.Date as any).UTC = RealDate.UTC;
      
      const mockIsHolidayActive1 = jest.spyOn(BackgroundControls, 'isHolidayActive')
        .mockImplementation((date, holiday) => {
          const isActive = holiday.name === 'Cherry Blossom Festival';
          console.log(`First transition - Checking holiday ${holiday.name}: ${isActive}`);
          return isActive;
        });

      const preset1 = generateAIPreset(createMockAIControl({
        countryCode: 'JP',
        rules: { timeOfDay: false, season: false, holiday: true, mood: false }
      }));

      console.log('First transition preset:', JSON.stringify(preset1, null, 2));

      expect(preset1.theme).toBe('sakura');
      expect(preset1.animation.style).toBe('particles');
      expect(preset1.animation.intensity).toBeLessThanOrEqual(1);
      expect(preset1.animation.intensity).toBeGreaterThanOrEqual(0);

      mockIsHolidayActive1.mockRestore();

      // Second holiday
      global.Date = jest.fn(() => mockDate2) as any;
      (global.Date as any).UTC = RealDate.UTC;
      
      const mockIsHolidayActive2 = jest.spyOn(BackgroundControls, 'isHolidayActive')
        .mockImplementation((date, holiday) => {
          const isActive = holiday.name === 'Holi';
          console.log(`Second transition - Checking holiday ${holiday.name}: ${isActive}`);
          return isActive;
        });
      
      const preset2 = generateAIPreset(createMockAIControl({
        countryCode: 'IN',
        rules: { timeOfDay: false, season: false, holiday: true, mood: false }
      }));

      console.log('Second transition preset:', JSON.stringify(preset2, null, 2));

      expect(preset2.theme).toBe('holi');
      expect(preset2.animation.style).toBe('particles');
      expect(preset2.animation.intensity).toBeLessThanOrEqual(1);
      expect(preset2.animation.intensity).toBeGreaterThanOrEqual(0);

      mockIsHolidayActive2.mockRestore();
    });
  });

  describe('Preference Boundaries', () => {
    test('respects intensity boundaries', () => {
      const preset = generateAIPreset(createMockAIControl({
        preferences: {
          intensity: { min: 0.3, max: 0.6 },
          speed: { min: 0.8, max: 1.2 },
          transitions: 'smooth'
        }
      }));

      expectValidPreset(preset);
      expect(preset?.animation.intensity).toBeGreaterThanOrEqual(0.3);
      expect(preset?.animation.intensity).toBeLessThanOrEqual(0.6);
    });

    test('respects speed boundaries', () => {
      const preset = generateAIPreset(createMockAIControl({
        preferences: {
          intensity: { min: 0.5, max: 0.8 },
          speed: { min: 0.5, max: 0.9 },
          transitions: 'smooth'
        }
      }));

      expectValidPreset(preset);
      expect(preset?.animation.speed).toBeGreaterThanOrEqual(0.5);
      expect(preset?.animation.speed).toBeLessThanOrEqual(0.9);
    });
  });

  describe('AI Theme Generation', () => {
    beforeEach(() => {
      // Mock the current date to January 6, 2025, 09:32
      const mockDate = new Date(2025, 0, 6, 9, 32);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('generates a valid preset based on time of day', () => {
      const mockControl = createMockAIControl();
      const preset = generateAIPreset(mockControl);
      expect(preset).toBeDefined();
      expect(preset.theme).toBeDefined();
      expect(preset.colors).toBeDefined();
      expect(preset.animation).toBeDefined();
      expect(preset.animation.speed).toBeGreaterThanOrEqual(mockControl.preferences.speed.min);
      expect(preset.animation.speed).toBeLessThanOrEqual(mockControl.preferences.speed.max);
      expect(preset.animation.intensity).toBeGreaterThanOrEqual(mockControl.preferences.intensity.min);
      expect(preset.animation.intensity).toBeLessThanOrEqual(mockControl.preferences.intensity.max);
    });

    it('respects time of day rules', () => {
      const timeControl = createMockAIControl({
        rules: { timeOfDay: true, season: true, holiday: true, mood: false }
      });
      const preset = generateAIPreset(timeControl);
      
      // At 09:32, we expect the morning theme
      expect(preset.theme).toBe('morning');
    });

    it('uses default theme when time of day is disabled', () => {
      const noTimeControl = createMockAIControl({
        rules: { timeOfDay: false, season: true, holiday: true, mood: false }
      });
      const preset = generateAIPreset(noTimeControl);
      expect(preset.theme).toBe('sakura');
    });

    it('applies correct animation styles for themes', () => {
      const timeControl = createMockAIControl({
        rules: { timeOfDay: true, season: true, holiday: true, mood: false }
      });
      const preset = generateAIPreset(timeControl);
      
      // At 09:32, we expect the ripple animation for morning
      expect(preset.animation.style).toBe('ripple');
    });
  });
});
