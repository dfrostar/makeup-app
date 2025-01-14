import { CountryCode } from './countryConfig';

export type ColorScheme = 
  // Cultural Themes
  | 'sakura'
  | 'starFestival'
  | 'holi'
  | 'diwali'
  | 'lunarNewYear'
  | 'lanternFestival'
  | 'dragonBoat'
  | 'moonFestival'
  | 'dayOfDead'
  | 'guadalupe'
  | 'christmas'
  | 'thanksgiving'
  | 'independence'
  | 'carnival'
  // Time of Day
  | 'dawn'
  | 'morning'
  | 'noon'
  | 'afternoon'
  | 'dusk'
  | 'evening'
  | 'midnight'
  // Seasons
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  
export type AnimationStyle = 
  | 'float'
  | 'ripple'
  | 'vortex'
  | 'constellation'
  | 'aurora'
  | 'particles'
  | 'prism'
  | 'fireworks'
  | 'snow';

export interface BackgroundPreset {
  theme: ColorScheme;
  colors: {
    primary: readonly string[];
    secondary: readonly string[];
    background: readonly string[];
  };
  animation: {
    style: AnimationStyle;
    speed: number;
    intensity: number;
  };
}

export interface AIBackgroundControl {
  enabled: boolean;
  mode: 'auto' | 'assist' | 'manual';
  interval: number;
  rules: {
    timeOfDay: boolean;
    season: boolean;
    holiday: boolean;
    mood: boolean;
  };
  preferences: {
    intensity: { min: number; max: number };
    speed: { min: number; max: number };
    transitions: 'smooth' | 'instant' | 'crossfade';
  };
}

export interface AIAgentControl {
  enabled: boolean;
  mode: 'auto' | 'assist';
  interval: number;
  countryCode: CountryCode;
  rules: {
    timeOfDay: boolean;
    season: boolean;
    holiday: boolean;
    mood: boolean;
  };
  preferences: {
    intensity: { min: number; max: number; };
    speed: { min: number; max: number; };
    transitions: 'smooth' | 'sharp';
  };
}

export interface BackgroundState {
  currentPreset: BackgroundPreset;
  history: BackgroundPreset[];
  aiControl: AIBackgroundControl;
  lastUpdate: Date;
}
