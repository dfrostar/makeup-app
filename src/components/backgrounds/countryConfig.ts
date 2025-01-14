import { ColorScheme } from './types';

export type CountryCode = 
  | 'US' 
  | 'JP' 
  | 'IN' 
  | 'CN' 
  | 'MX' 
  | 'AU' 
  | 'KR' 
  | 'BR' 
  | 'GB' 
  | 'DE' 
  | 'FR' 
  | 'IT';

export interface HolidayDate {
  month: number;
  day?: number;
  weekDay?: number;
  weekOfMonth?: number;
  duration?: number;
}

export interface Holiday {
  name: string;
  theme: ColorScheme;
  dates: HolidayDate[];
}

export interface CountryConfig {
  name: string;
  hemisphere: 'north' | 'south';
  holidays: Holiday[];
}

export const countryConfigs: Record<CountryCode, CountryConfig> = {
  US: {
    name: 'United States',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Independence Day',
        theme: 'independence',
        dates: [{ month: 6, day: 4 }]
      },
      {
        name: 'Thanksgiving',
        theme: 'thanksgiving',
        dates: [{ month: 10, weekDay: 4, weekOfMonth: 4 }]
      },
      {
        name: 'Christmas',
        theme: 'christmas',
        dates: [{ month: 11, day: 25 }]
      }
    ]
  },
  JP: {
    name: 'Japan',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Cherry Blossom Festival',
        theme: 'sakura',
        dates: [{ month: 2, day: 25, duration: 14 }]
      },
      {
        name: 'Star Festival',
        theme: 'starFestival',
        dates: [{ month: 6, day: 7 }]
      }
    ]
  },
  IN: {
    name: 'India',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Holi',
        theme: 'holi',
        dates: [{ month: 2, day: 28, duration: 2 }]
      },
      {
        name: 'Diwali',
        theme: 'diwali',
        dates: [{ month: 10, day: 20, duration: 5 }]
      }
    ]
  },
  CN: {
    name: 'China',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Lunar New Year',
        theme: 'lunarNewYear',
        dates: [{ month: 1, day: 10, duration: 15 }]
      },
      {
        name: 'Lantern Festival',
        theme: 'lanternFestival',
        dates: [{ month: 1, day: 24 }]
      },
      {
        name: 'Dragon Boat Festival',
        theme: 'dragonBoat',
        dates: [{ month: 5, day: 5 }]
      },
      {
        name: 'Moon Festival',
        theme: 'moonFestival',
        dates: [{ month: 8, day: 15 }]
      }
    ]
  },
  MX: {
    name: 'Mexico',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Day of the Dead',
        theme: 'dayOfDead',
        dates: [{ month: 10, day: 31, duration: 2 }]
      },
      {
        name: 'Our Lady of Guadalupe',
        theme: 'guadalupe',
        dates: [{ month: 11, day: 12 }]
      }
    ]
  },
  AU: {
    name: 'Australia',
    hemisphere: 'south',
    holidays: [
      {
        name: 'Australia Day',
        theme: 'summer',
        dates: [{ month: 0, day: 26 }]
      }
    ]
  },
  KR: {
    name: 'South Korea',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Seollal',
        theme: 'lunarNewYear',
        dates: [{ month: 1, day: 10, duration: 3 }]
      }
    ]
  },
  BR: {
    name: 'Brazil',
    hemisphere: 'south',
    holidays: [
      {
        name: 'Carnival',
        theme: 'carnival',
        dates: [{ month: 1, day: 13, duration: 5 }]
      }
    ]
  },
  GB: {
    name: 'United Kingdom',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Christmas',
        theme: 'christmas',
        dates: [{ month: 11, day: 25 }]
      }
    ]
  },
  DE: {
    name: 'Germany',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Oktoberfest',
        theme: 'autumn',
        dates: [{ month: 8, day: 16, duration: 16 }]
      }
    ]
  },
  FR: {
    name: 'France',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Bastille Day',
        theme: 'independence',
        dates: [{ month: 6, day: 14 }]
      }
    ]
  },
  IT: {
    name: 'Italy',
    hemisphere: 'north',
    holidays: [
      {
        name: 'Carnival of Venice',
        theme: 'carnival',
        dates: [{ month: 1, day: 11, duration: 18 }]
      }
    ]
  }
};

// Cultural color schemes
export const culturalColorSchemes = {
  sakura: {
    primary: ['rgba(255,182,193,1)', 'rgba(255,192,203,1)'],
    secondary: ['rgba(255,240,245,1)', 'rgba(255,228,225,1)'],
    background: ['rgba(255,245,250,0.8)']
  },
  starFestival: {
    primary: ['rgba(25,25,112,1)', 'rgba(0,0,128,1)'],
    secondary: ['rgba(255,215,0,1)', 'rgba(255,223,0,1)'],
    background: ['rgba(0,0,50,0.9)']
  },
  holi: {
    primary: ['rgba(255,0,150,1)', 'rgba(255,100,0,1)', 'rgba(0,255,200,1)'],
    secondary: ['rgba(255,200,0,1)', 'rgba(150,0,255,1)'],
    background: ['rgba(255,255,255,0.9)']
  },
  diwali: {
    primary: ['rgba(255,140,0,1)', 'rgba(255,215,0,1)'],
    secondary: ['rgba(255,0,0,1)', 'rgba(255,69,0,1)'],
    background: ['rgba(0,0,0,0.9)']
  },
  lunarNewYear: {
    primary: ['rgba(255,0,0,1)', 'rgba(255,215,0,1)'],
    secondary: ['rgba(255,140,0,1)', 'rgba(178,34,34,1)'],
    background: ['rgba(0,0,0,0.9)']
  },
  lanternFestival: {
    primary: ['rgba(255,69,0,1)', 'rgba(255,140,0,1)'],
    secondary: ['rgba(255,215,0,1)', 'rgba(255,165,0,1)'],
    background: ['rgba(0,0,0,0.95)']
  },
  dragonBoat: {
    primary: ['rgba(0,100,0,1)', 'rgba(34,139,34,1)'],
    secondary: ['rgba(255,215,0,1)', 'rgba(218,165,32,1)'],
    background: ['rgba(0,50,0,0.9)']
  },
  moonFestival: {
    primary: ['rgba(255,215,0,1)', 'rgba(218,165,32,1)'],
    secondary: ['rgba(169,169,169,1)', 'rgba(192,192,192,1)'],
    background: ['rgba(25,25,112,0.9)']
  },
  dayOfDead: {
    primary: ['rgba(255,140,0,1)', 'rgba(255,69,0,1)'],
    secondary: ['rgba(138,43,226,1)', 'rgba(75,0,130,1)'],
    background: ['rgba(0,0,0,0.95)']
  },
  guadalupe: {
    primary: ['rgba(0,191,255,1)', 'rgba(30,144,255,1)'],
    secondary: ['rgba(255,215,0,1)', 'rgba(218,165,32,1)'],
    background: ['rgba(25,25,112,0.9)']
  },
  christmas: {
    primary: ['rgba(220,20,60,1)', 'rgba(139,0,0,1)'],
    secondary: ['rgba(0,128,0,1)', 'rgba(0,100,0,1)'],
    background: ['rgba(255,250,250,0.9)']
  },
  thanksgiving: {
    primary: ['rgba(205,133,63,1)', 'rgba(210,105,30,1)'],
    secondary: ['rgba(139,69,19,1)', 'rgba(160,82,45,1)'],
    background: ['rgba(255,248,220,0.9)']
  },
  independence: {
    primary: ['rgba(178,34,34,1)', 'rgba(220,20,60,1)'],
    secondary: ['rgba(0,48,143,1)', 'rgba(25,25,112,1)'],
    background: ['rgba(255,250,250,0.9)']
  },
  carnival: {
    primary: ['rgba(255,0,255,1)', 'rgba(255,20,147,1)', 'rgba(0,255,255,1)'],
    secondary: ['rgba(255,215,0,1)', 'rgba(255,140,0,1)'],
    background: ['rgba(0,0,0,0.9)']
  },
  summer: {
    primary: ['rgba(255,215,0,1)', 'rgba(255,140,0,1)'],
    secondary: ['rgba(0,191,255,1)', 'rgba(30,144,255,1)'],
    background: ['rgba(135,206,235,0.9)']
  },
  autumn: {
    primary: ['rgba(205,133,63,1)', 'rgba(210,105,30,1)'],
    secondary: ['rgba(139,69,19,1)', 'rgba(160,82,45,1)'],
    background: ['rgba(255,248,220,0.9)']
  },
  spring: {
    primary: ['rgba(255,192,203,1)', 'rgba(255,182,193,1)'],
    secondary: ['rgba(144,238,144,1)', 'rgba(152,251,152,1)'],
    background: ['rgba(240,255,240,0.9)']
  },
  winter: {
    primary: ['rgba(255,250,250,1)', 'rgba(240,248,255,1)'],
    secondary: ['rgba(176,196,222,1)', 'rgba(176,224,230,1)'],
    background: ['rgba(240,248,255,0.9)']
  }
} as const;

// Time-based color schemes
export const timeBasedColorSchemes = {
  dawn: {
    primary: ['rgba(255,192,203,1)', 'rgba(255,182,193,1)'],
    secondary: ['rgba(255,218,185,1)', 'rgba(255,228,196,1)'],
    background: ['rgba(255,240,245,0.9)']
  },
  morning: {
    primary: ['rgba(135,206,235,1)', 'rgba(176,224,230,1)'],
    secondary: ['rgba(255,255,224,1)', 'rgba(255,250,205,1)'],
    background: ['rgba(240,255,255,0.9)']
  },
  noon: {
    primary: ['rgba(135,206,250,1)', 'rgba(30,144,255,1)'],
    secondary: ['rgba(255,255,224,1)', 'rgba(255,250,205,1)'],
    background: ['rgba(240,248,255,0.9)']
  },
  afternoon: {
    primary: ['rgba(100,149,237,1)', 'rgba(70,130,180,1)'],
    secondary: ['rgba(255,250,205,1)', 'rgba(255,255,224,1)'],
    background: ['rgba(240,248,255,0.9)']
  },
  dusk: {
    primary: ['rgba(255,140,0,1)', 'rgba(255,127,80,1)'],
    secondary: ['rgba(255,218,185,1)', 'rgba(255,228,196,1)'],
    background: ['rgba(255,245,238,0.9)']
  },
  evening: {
    primary: ['rgba(138,43,226,1)', 'rgba(147,112,219,1)'],
    secondary: ['rgba(255,192,203,1)', 'rgba(255,182,193,1)'],
    background: ['rgba(25,25,112,0.9)']
  },
  midnight: {
    primary: ['rgba(25,25,112,1)', 'rgba(0,0,128,1)'],
    secondary: ['rgba(138,43,226,1)', 'rgba(147,112,219,1)'],
    background: ['rgba(0,0,50,0.9)']
  }
};
