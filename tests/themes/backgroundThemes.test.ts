import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { countryConfigs, culturalColorSchemes, timeBasedColorSchemes } from '../../src/components/backgrounds/countryConfig';
import { getSeasonForHemisphere, isHolidayActive, generateAIPreset } from '../../src/components/admin/BackgroundControls';
import { ColorScheme } from '../../src/components/backgrounds/types';

type CulturalTheme = Extract<ColorScheme, 
  | 'sakura' | 'starFestival' | 'holi' | 'diwali' | 'lunarNewYear'
  | 'lanternFestival' | 'dragonBoat' | 'moonFestival' | 'dayOfDead'
  | 'guadalupe' | 'christmas' | 'thanksgiving' | 'independence' | 'carnival'>;

type TimeTheme = Extract<ColorScheme,
  | 'dawn' | 'morning' | 'noon' | 'afternoon'
  | 'dusk' | 'evening' | 'midnight'>;

describe('Background Themes', () => {
  describe('Cultural Color Schemes', () => {
    it('has valid RGBA colors for all themes', () => {
      Object.entries(culturalColorSchemes).forEach(([theme, scheme]) => {
        expect(scheme.primary.every(color => isValidRGBA(color))).toBe(true);
        expect(scheme.secondary.every(color => isValidRGBA(color))).toBe(true);
        expect(scheme.background.every(color => isValidRGBA(color))).toBe(true);
      });
    });

    it('has required cultural themes', () => {
      const requiredThemes: CulturalTheme[] = [
        'sakura',
        'starFestival',
        'holi',
        'diwali',
        'lunarNewYear',
        'lanternFestival',
        'dragonBoat',
        'moonFestival',
        'dayOfDead',
        'guadalupe',
        'christmas',
        'thanksgiving',
        'independence',
        'carnival'
      ];

      requiredThemes.forEach(theme => {
        expect(culturalColorSchemes[theme]).toBeDefined();
      });
    });
  });

  describe('Time-based Color Schemes', () => {
    it('has valid RGBA colors for all times', () => {
      Object.entries(timeBasedColorSchemes).forEach(([time, scheme]) => {
        expect(scheme.primary.every(color => isValidRGBA(color))).toBe(true);
        expect(scheme.secondary.every(color => isValidRGBA(color))).toBe(true);
        expect(scheme.background.every(color => isValidRGBA(color))).toBe(true);
      });
    });

    it('has all required time periods', () => {
      const requiredTimes: TimeTheme[] = [
        'dawn',
        'morning',
        'noon',
        'afternoon',
        'dusk',
        'evening',
        'midnight'
      ];

      requiredTimes.forEach(time => {
        expect(timeBasedColorSchemes[time]).toBeDefined();
      });
    });
  });

  describe('Country Configuration', () => {
    test('all countries have valid hemisphere settings', () => {
      Object.entries(countryConfigs).forEach(([code, config]) => {
        expect(['north', 'south']).toContain(config.hemisphere);
      });
    });

    test('all holidays have valid dates', () => {
      Object.values(countryConfigs).forEach(config => {
        config.holidays.forEach(holiday => {
          holiday.dates.forEach(date => {
            expect(date.month).toBeGreaterThanOrEqual(0);
            expect(date.month).toBeLessThanOrEqual(11);
            if (date.day) {
              expect(date.day).toBeGreaterThanOrEqual(1);
              expect(date.day).toBeLessThanOrEqual(31);
            }
            if (date.weekDay !== undefined) {
              expect(date.weekDay).toBeGreaterThanOrEqual(0);
              expect(date.weekDay).toBeLessThanOrEqual(6);
            }
          });
        });
      });
    });

    test('all holidays have corresponding color schemes', () => {
      Object.values(countryConfigs).forEach(config => {
        config.holidays.forEach(holiday => {
          expect(Object.keys(culturalColorSchemes)).toContain(holiday.theme);
        });
      });
    });
  });

  describe('Season Detection', () => {
    const testDates = [
      { date: new Date(2024, 2, 20), season: 'spring' as const }, // March 20
      { date: new Date(2024, 5, 21), season: 'summer' as const }, // June 21
      { date: new Date(2024, 8, 22), season: 'autumn' as const }, // September 22
      { date: new Date(2024, 11, 21), season: 'winter' as const }, // December 21
    ];

    const oppositeSeasons = {
      spring: 'autumn',
      summer: 'winter',
      autumn: 'spring',
      winter: 'summer'
    } as const;

    describe('Northern Hemisphere', () => {
      testDates.forEach(({ date, season }) => {
        test(`correctly identifies ${season} on ${date.toDateString()}`, () => {
          expect(getSeasonForHemisphere(date, 'north')).toBe(season);
        });
      });
    });

    describe('Southern Hemisphere', () => {
      testDates.forEach(({ date, season }) => {
        test(`correctly identifies ${oppositeSeasons[season]} on ${date.toDateString()}`, () => {
          expect(getSeasonForHemisphere(date, 'south')).toBe(oppositeSeasons[season]);
        });
      });
    });
  });

  describe('Holiday Detection', () => {
    const mockHolidays = [
      {
        name: 'Fixed Date Holiday',
        theme: 'christmas' as ColorScheme,
        dates: [{ month: 11, day: 25 }]
      },
      {
        name: 'Range Holiday',
        theme: 'diwali' as ColorScheme,
        dates: [{ month: 10, day: 20, duration: 5 }]
      },
      {
        name: 'Nth Weekday Holiday',
        theme: 'thanksgiving' as ColorScheme,
        dates: [{ month: 10, weekDay: 4, weekOfMonth: 4 }]
      }
    ];

    test('detects fixed date holiday', () => {
      const date = new Date(2024, 11, 25); // December 25, 2024
      expect(isHolidayActive(date, mockHolidays[0])).toBe(true);
    });

    test('detects holiday range', () => {
      const date = new Date(2024, 10, 22); // November 22, 2024
      expect(isHolidayActive(date, mockHolidays[1])).toBe(true);
    });

    test('detects Nth weekday holiday', () => {
      const date = new Date(2024, 10, 28); // November 28, 2024 (4th Thursday)
      expect(isHolidayActive(date, mockHolidays[2])).toBe(true);
    });
  });

  describe('Color Schemes', () => {
    test('all color schemes have valid RGBA values', () => {
      Object.values(culturalColorSchemes).forEach(scheme => {
        const validateRgba = (color: string) => {
          expect(color).toMatch(/^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[0-1](\.\d+)?\)$/);
        };

        scheme.primary.forEach(validateRgba);
        scheme.secondary.forEach(validateRgba);
        scheme.background.forEach(validateRgba);
      });
    });
  });
});

function isValidRGBA(color: string): boolean {
  const rgbaPattern = /^rgba\(\d{1,3},\d{1,3},\d{1,3},(0|1|0?\.\d+)\)$/;
  return rgbaPattern.test(color.replace(/\s/g, ''));
}
