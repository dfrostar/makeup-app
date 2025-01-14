import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Animation Speed Presets
export const SPEED_PRESETS = {
  slow: {
    morph: 20,
    rotate: 25,
    gradient: 20,
  },
  medium: {
    morph: 15,
    rotate: 20,
    gradient: 15,
  },
  fast: {
    morph: 10,
    rotate: 15,
    gradient: 10,
  }
} as const;

// Color Palette Presets
export const COLOR_PRESETS = {
  sunset: {
    primary: ['rgba(255, 69, 0, 0.2)', 'rgba(255, 140, 0, 0.2)', 'rgba(255, 192, 203, 0.2)'],
    secondary: ['rgba(255, 192, 203, 0.2)', 'rgba(255, 218, 185, 0.2)', 'rgba(255, 140, 0, 0.2)'],
    tertiary: ['rgba(255, 218, 185, 0.2)', 'rgba(255, 69, 0, 0.2)', 'rgba(255, 192, 203, 0.2)'],
    background: ['rgba(255, 128, 128, 0.3)', 'rgba(255, 192, 203, 0.3)', 'rgba(255, 182, 193, 0.3)', 'rgba(255, 218, 185, 0.3)']
  },
  ocean: {
    primary: ['rgba(0, 119, 190, 0.2)', 'rgba(0, 180, 216, 0.2)', 'rgba(72, 202, 228, 0.2)'],
    secondary: ['rgba(144, 224, 239, 0.2)', 'rgba(72, 202, 228, 0.2)', 'rgba(0, 180, 216, 0.2)'],
    tertiary: ['rgba(0, 180, 216, 0.2)', 'rgba(72, 202, 228, 0.2)', 'rgba(144, 224, 239, 0.2)'],
    background: ['rgba(0, 119, 190, 0.3)', 'rgba(0, 180, 216, 0.3)', 'rgba(72, 202, 228, 0.3)', 'rgba(144, 224, 239, 0.3)']
  },
  forest: {
    primary: ['rgba(34, 139, 34, 0.2)', 'rgba(46, 139, 87, 0.2)', 'rgba(60, 179, 113, 0.2)'],
    secondary: ['rgba(46, 139, 87, 0.2)', 'rgba(60, 179, 113, 0.2)', 'rgba(143, 188, 143, 0.2)'],
    tertiary: ['rgba(60, 179, 113, 0.2)', 'rgba(143, 188, 143, 0.2)', 'rgba(34, 139, 34, 0.2)'],
    background: ['rgba(34, 139, 34, 0.3)', 'rgba(46, 139, 87, 0.3)', 'rgba(60, 179, 113, 0.3)', 'rgba(143, 188, 143, 0.3)']
  },
  lavender: {
    primary: ['rgba(147, 112, 219, 0.2)', 'rgba(153, 50, 204, 0.2)', 'rgba(186, 85, 211, 0.2)'],
    secondary: ['rgba(186, 85, 211, 0.2)', 'rgba(147, 112, 219, 0.2)', 'rgba(153, 50, 204, 0.2)'],
    tertiary: ['rgba(153, 50, 204, 0.2)', 'rgba(186, 85, 211, 0.2)', 'rgba(147, 112, 219, 0.2)'],
    background: ['rgba(147, 112, 219, 0.3)', 'rgba(153, 50, 204, 0.3)', 'rgba(186, 85, 211, 0.3)', 'rgba(218, 112, 214, 0.3)']
  },
  neon: {
    primary: ['rgba(255, 0, 255, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(255, 255, 0, 0.2)'],
    secondary: ['rgba(0, 255, 255, 0.2)', 'rgba(255, 255, 0, 0.2)', 'rgba(255, 0, 255, 0.2)'],
    tertiary: ['rgba(255, 255, 0, 0.2)', 'rgba(255, 0, 255, 0.2)', 'rgba(0, 255, 255, 0.2)'],
    background: ['rgba(255, 0, 255, 0.3)', 'rgba(0, 255, 255, 0.3)', 'rgba(255, 255, 0, 0.3)', 'rgba(255, 0, 128, 0.3)']
  },
  aurora: {
    primary: ['rgba(0, 255, 127, 0.2)', 'rgba(64, 224, 208, 0.2)', 'rgba(0, 191, 255, 0.2)'],
    secondary: ['rgba(64, 224, 208, 0.2)', 'rgba(0, 191, 255, 0.2)', 'rgba(138, 43, 226, 0.2)'],
    tertiary: ['rgba(0, 191, 255, 0.2)', 'rgba(138, 43, 226, 0.2)', 'rgba(0, 255, 127, 0.2)'],
    background: ['rgba(0, 255, 127, 0.3)', 'rgba(64, 224, 208, 0.3)', 'rgba(0, 191, 255, 0.3)', 'rgba(138, 43, 226, 0.3)']
  },
  galaxy: {
    primary: ['rgba(75, 0, 130, 0.2)', 'rgba(138, 43, 226, 0.2)', 'rgba(0, 0, 139, 0.2)'],
    secondary: ['rgba(138, 43, 226, 0.2)', 'rgba(0, 0, 139, 0.2)', 'rgba(75, 0, 130, 0.2)'],
    tertiary: ['rgba(0, 0, 139, 0.2)', 'rgba(75, 0, 130, 0.2)', 'rgba(138, 43, 226, 0.2)'],
    background: ['rgba(75, 0, 130, 0.3)', 'rgba(138, 43, 226, 0.3)', 'rgba(0, 0, 139, 0.3)', 'rgba(25, 25, 112, 0.3)']
  },
  pastel: {
    primary: ['rgba(255, 182, 193, 0.2)', 'rgba(176, 224, 230, 0.2)', 'rgba(255, 218, 185, 0.2)'],
    secondary: ['rgba(176, 224, 230, 0.2)', 'rgba(255, 218, 185, 0.2)', 'rgba(221, 160, 221, 0.2)'],
    tertiary: ['rgba(255, 218, 185, 0.2)', 'rgba(221, 160, 221, 0.2)', 'rgba(255, 182, 193, 0.2)'],
    background: ['rgba(255, 182, 193, 0.3)', 'rgba(176, 224, 230, 0.3)', 'rgba(255, 218, 185, 0.3)', 'rgba(221, 160, 221, 0.3)']
  },
  spring: {
    primary: ['rgba(144, 238, 144, 0.2)', 'rgba(255, 192, 203, 0.2)', 'rgba(255, 218, 185, 0.2)'],
    secondary: ['rgba(255, 192, 203, 0.2)', 'rgba(255, 218, 185, 0.2)', 'rgba(176, 224, 230, 0.2)'],
    tertiary: ['rgba(255, 218, 185, 0.2)', 'rgba(176, 224, 230, 0.2)', 'rgba(144, 238, 144, 0.2)'],
    background: ['rgba(144, 238, 144, 0.3)', 'rgba(255, 192, 203, 0.3)', 'rgba(255, 218, 185, 0.3)', 'rgba(176, 224, 230, 0.3)']
  },
  summer: {
    primary: ['rgba(255, 215, 0, 0.2)', 'rgba(0, 191, 255, 0.2)', 'rgba(50, 205, 50, 0.2)'],
    secondary: ['rgba(0, 191, 255, 0.2)', 'rgba(50, 205, 50, 0.2)', 'rgba(255, 165, 0, 0.2)'],
    tertiary: ['rgba(50, 205, 50, 0.2)', 'rgba(255, 165, 0, 0.2)', 'rgba(255, 215, 0, 0.2)'],
    background: ['rgba(255, 215, 0, 0.3)', 'rgba(0, 191, 255, 0.3)', 'rgba(50, 205, 50, 0.3)', 'rgba(255, 165, 0, 0.3)']
  },
  autumn: {
    primary: ['rgba(205, 133, 63, 0.2)', 'rgba(210, 105, 30, 0.2)', 'rgba(139, 69, 19, 0.2)'],
    secondary: ['rgba(210, 105, 30, 0.2)', 'rgba(139, 69, 19, 0.2)', 'rgba(160, 82, 45, 0.2)'],
    tertiary: ['rgba(139, 69, 19, 0.2)', 'rgba(160, 82, 45, 0.2)', 'rgba(205, 133, 63, 0.2)'],
    background: ['rgba(205, 133, 63, 0.3)', 'rgba(210, 105, 30, 0.3)', 'rgba(139, 69, 19, 0.3)', 'rgba(160, 82, 45, 0.3)']
  },
  winter: {
    primary: ['rgba(135, 206, 235, 0.2)', 'rgba(176, 224, 230, 0.2)', 'rgba(240, 248, 255, 0.2)'],
    secondary: ['rgba(176, 224, 230, 0.2)', 'rgba(240, 248, 255, 0.2)', 'rgba(230, 230, 250, 0.2)'],
    tertiary: ['rgba(240, 248, 255, 0.2)', 'rgba(230, 230, 250, 0.2)', 'rgba(135, 206, 235, 0.2)'],
    background: ['rgba(135, 206, 235, 0.3)', 'rgba(176, 224, 230, 0.3)', 'rgba(240, 248, 255, 0.3)', 'rgba(230, 230, 250, 0.3)']
  },
  christmas: {
    primary: ['rgba(34, 139, 34, 0.2)', 'rgba(178, 34, 34, 0.2)', 'rgba(255, 215, 0, 0.2)'],
    secondary: ['rgba(178, 34, 34, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(0, 100, 0, 0.2)'],
    tertiary: ['rgba(255, 215, 0, 0.2)', 'rgba(0, 100, 0, 0.2)', 'rgba(34, 139, 34, 0.2)'],
    background: ['rgba(34, 139, 34, 0.3)', 'rgba(178, 34, 34, 0.3)', 'rgba(255, 215, 0, 0.3)', 'rgba(0, 100, 0, 0.3)']
  },
  halloween: {
    primary: ['rgba(255, 140, 0, 0.2)', 'rgba(138, 43, 226, 0.2)', 'rgba(0, 0, 0, 0.2)'],
    secondary: ['rgba(138, 43, 226, 0.2)', 'rgba(0, 0, 0, 0.2)', 'rgba(255, 69, 0, 0.2)'],
    tertiary: ['rgba(0, 0, 0, 0.2)', 'rgba(255, 69, 0, 0.2)', 'rgba(255, 140, 0, 0.2)'],
    background: ['rgba(255, 140, 0, 0.3)', 'rgba(138, 43, 226, 0.3)', 'rgba(0, 0, 0, 0.3)', 'rgba(255, 69, 0, 0.3)']
  },
  valentines: {
    primary: ['rgba(255, 182, 193, 0.2)', 'rgba(255, 105, 180, 0.2)', 'rgba(255, 20, 147, 0.2)'],
    secondary: ['rgba(255, 105, 180, 0.2)', 'rgba(255, 20, 147, 0.2)', 'rgba(219, 112, 147, 0.2)'],
    tertiary: ['rgba(255, 20, 147, 0.2)', 'rgba(219, 112, 147, 0.2)', 'rgba(255, 182, 193, 0.2)'],
    background: ['rgba(255, 182, 193, 0.3)', 'rgba(255, 105, 180, 0.3)', 'rgba(255, 20, 147, 0.3)', 'rgba(219, 112, 147, 0.3)']
  },
  newYear: {
    primary: ['rgba(255, 215, 0, 0.2)', 'rgba(192, 192, 192, 0.2)', 'rgba(0, 191, 255, 0.2)'],
    secondary: ['rgba(192, 192, 192, 0.2)', 'rgba(0, 191, 255, 0.2)', 'rgba(255, 140, 0, 0.2)'],
    tertiary: ['rgba(0, 191, 255, 0.2)', 'rgba(255, 140, 0, 0.2)', 'rgba(255, 215, 0, 0.2)'],
    background: ['rgba(255, 215, 0, 0.3)', 'rgba(192, 192, 192, 0.3)', 'rgba(0, 191, 255, 0.3)', 'rgba(255, 140, 0, 0.3)']
  },
  tropical: {
    primary: ['rgba(0, 255, 127, 0.2)', 'rgba(255, 223, 0, 0.2)', 'rgba(255, 69, 0, 0.2)'],
    secondary: ['rgba(255, 223, 0, 0.2)', 'rgba(255, 69, 0, 0.2)', 'rgba(0, 191, 255, 0.2)'],
    tertiary: ['rgba(255, 69, 0, 0.2)', 'rgba(0, 191, 255, 0.2)', 'rgba(0, 255, 127, 0.2)'],
    background: ['rgba(0, 255, 127, 0.3)', 'rgba(255, 223, 0, 0.3)', 'rgba(255, 69, 0, 0.3)', 'rgba(0, 191, 255, 0.3)']
  },
  desert: {
    primary: ['rgba(210, 180, 140, 0.2)', 'rgba(244, 164, 96, 0.2)', 'rgba(205, 133, 63, 0.2)'],
    secondary: ['rgba(244, 164, 96, 0.2)', 'rgba(205, 133, 63, 0.2)', 'rgba(189, 183, 107, 0.2)'],
    tertiary: ['rgba(205, 133, 63, 0.2)', 'rgba(189, 183, 107, 0.2)', 'rgba(210, 180, 140, 0.2)'],
    background: ['rgba(210, 180, 140, 0.3)', 'rgba(244, 164, 96, 0.3)', 'rgba(205, 133, 63, 0.3)', 'rgba(189, 183, 107, 0.3)']
  },
  rainforest: {
    primary: ['rgba(34, 139, 34, 0.2)', 'rgba(0, 100, 0, 0.2)', 'rgba(85, 107, 47, 0.2)'],
    secondary: ['rgba(0, 100, 0, 0.2)', 'rgba(85, 107, 47, 0.2)', 'rgba(107, 142, 35, 0.2)'],
    tertiary: ['rgba(85, 107, 47, 0.2)', 'rgba(107, 142, 35, 0.2)', 'rgba(34, 139, 34, 0.2)'],
    background: ['rgba(34, 139, 34, 0.3)', 'rgba(0, 100, 0, 0.3)', 'rgba(85, 107, 47, 0.3)', 'rgba(107, 142, 35, 0.3)']
  },
  dawn: {
    primary: ['rgba(255, 160, 122, 0.2)', 'rgba(255, 218, 185, 0.2)', 'rgba(176, 224, 230, 0.2)'],
    secondary: ['rgba(255, 218, 185, 0.2)', 'rgba(176, 224, 230, 0.2)', 'rgba(255, 192, 203, 0.2)'],
    tertiary: ['rgba(176, 224, 230, 0.2)', 'rgba(255, 192, 203, 0.2)', 'rgba(255, 160, 122, 0.2)'],
    background: ['rgba(255, 160, 122, 0.3)', 'rgba(255, 218, 185, 0.3)', 'rgba(176, 224, 230, 0.3)', 'rgba(255, 192, 203, 0.3)']
  },
  dusk: {
    primary: ['rgba(138, 43, 226, 0.2)', 'rgba(255, 140, 0, 0.2)', 'rgba(75, 0, 130, 0.2)'],
    secondary: ['rgba(255, 140, 0, 0.2)', 'rgba(75, 0, 130, 0.2)', 'rgba(186, 85, 211, 0.2)'],
    tertiary: ['rgba(75, 0, 130, 0.2)', 'rgba(186, 85, 211, 0.2)', 'rgba(138, 43, 226, 0.2)'],
    background: ['rgba(138, 43, 226, 0.3)', 'rgba(255, 140, 0, 0.3)', 'rgba(75, 0, 130, 0.3)', 'rgba(186, 85, 211, 0.3)']
  },
  midnight: {
    primary: ['rgba(25, 25, 112, 0.2)', 'rgba(0, 0, 139, 0.2)', 'rgba(72, 61, 139, 0.2)'],
    secondary: ['rgba(0, 0, 139, 0.2)', 'rgba(72, 61, 139, 0.2)', 'rgba(138, 43, 226, 0.2)'],
    tertiary: ['rgba(72, 61, 139, 0.2)', 'rgba(138, 43, 226, 0.2)', 'rgba(25, 25, 112, 0.2)'],
    background: ['rgba(25, 25, 112, 0.3)', 'rgba(0, 0, 139, 0.3)', 'rgba(72, 61, 139, 0.3)', 'rgba(138, 43, 226, 0.3)']
  },
  easter: {
    primary: ['rgba(255, 192, 203, 0.2)', 'rgba(176, 224, 230, 0.2)', 'rgba(255, 255, 224, 0.2)'],
    secondary: ['rgba(176, 224, 230, 0.2)', 'rgba(255, 255, 224, 0.2)', 'rgba(230, 230, 250, 0.2)'],
    tertiary: ['rgba(255, 255, 224, 0.2)', 'rgba(230, 230, 250, 0.2)', 'rgba(255, 192, 203, 0.2)'],
    background: ['rgba(255, 192, 203, 0.3)', 'rgba(176, 224, 230, 0.3)', 'rgba(255, 255, 224, 0.3)', 'rgba(230, 230, 250, 0.3)']
  },
  thanksgiving: {
    primary: ['rgba(205, 133, 63, 0.2)', 'rgba(160, 82, 45, 0.2)', 'rgba(139, 69, 19, 0.2)'],
    secondary: ['rgba(160, 82, 45, 0.2)', 'rgba(139, 69, 19, 0.2)', 'rgba(210, 105, 30, 0.2)'],
    tertiary: ['rgba(139, 69, 19, 0.2)', 'rgba(210, 105, 30, 0.2)', 'rgba(205, 133, 63, 0.2)'],
    background: ['rgba(205, 133, 63, 0.3)', 'rgba(160, 82, 45, 0.3)', 'rgba(139, 69, 19, 0.3)', 'rgba(210, 105, 30, 0.3)']
  },
  stPatricks: {
    primary: ['rgba(0, 100, 0, 0.2)', 'rgba(34, 139, 34, 0.2)', 'rgba(50, 205, 50, 0.2)'],
    secondary: ['rgba(34, 139, 34, 0.2)', 'rgba(50, 205, 50, 0.2)', 'rgba(144, 238, 144, 0.2)'],
    tertiary: ['rgba(50, 205, 50, 0.2)', 'rgba(144, 238, 144, 0.2)', 'rgba(0, 100, 0, 0.2)'],
    background: ['rgba(0, 100, 0, 0.3)', 'rgba(34, 139, 34, 0.3)', 'rgba(50, 205, 50, 0.3)', 'rgba(144, 238, 144, 0.3)']
  },
  calm: {
    primary: ['rgba(176, 224, 230, 0.2)', 'rgba(230, 230, 250, 0.2)', 'rgba(240, 248, 255, 0.2)'],
    secondary: ['rgba(230, 230, 250, 0.2)', 'rgba(240, 248, 255, 0.2)', 'rgba(176, 224, 230, 0.2)'],
    tertiary: ['rgba(240, 248, 255, 0.2)', 'rgba(176, 224, 230, 0.2)', 'rgba(230, 230, 250, 0.2)'],
    background: ['rgba(176, 224, 230, 0.3)', 'rgba(230, 230, 250, 0.3)', 'rgba(240, 248, 255, 0.3)', 'rgba(176, 224, 230, 0.3)']
  },
  energetic: {
    primary: ['rgba(255, 69, 0, 0.2)', 'rgba(255, 140, 0, 0.2)', 'rgba(255, 215, 0, 0.2)'],
    secondary: ['rgba(255, 140, 0, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(255, 69, 0, 0.2)'],
    tertiary: ['rgba(255, 215, 0, 0.2)', 'rgba(255, 69, 0, 0.2)', 'rgba(255, 140, 0, 0.2)'],
    background: ['rgba(255, 69, 0, 0.3)', 'rgba(255, 140, 0, 0.3)', 'rgba(255, 215, 0, 0.3)', 'rgba(255, 69, 0, 0.3)']
  },
  dreamy: {
    primary: ['rgba(147, 112, 219, 0.2)', 'rgba(186, 85, 211, 0.2)', 'rgba(221, 160, 221, 0.2)'],
    secondary: ['rgba(186, 85, 211, 0.2)', 'rgba(221, 160, 221, 0.2)', 'rgba(230, 230, 250, 0.2)'],
    tertiary: ['rgba(221, 160, 221, 0.2)', 'rgba(230, 230, 250, 0.2)', 'rgba(147, 112, 219, 0.2)'],
    background: ['rgba(147, 112, 219, 0.3)', 'rgba(186, 85, 211, 0.3)', 'rgba(221, 160, 221, 0.3)', 'rgba(230, 230, 250, 0.3)']
  }
} as const;

// Animation Style Presets
export const ANIMATION_PRESETS = {
  morph: {
    style: 'fluid-morph',
    variants: {
      initial: { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
      animate: { borderRadius: ['60% 40% 30% 70%/60% 30% 70% 40%', '30% 60% 70% 40%/50% 60% 30% 60%', '60% 40% 30% 70%/60% 30% 70% 40%'] }
    }
  },
  pulse: {
    style: 'fluid-pulse',
    variants: {
      initial: { scale: 1, opacity: 0.5 },
      animate: { scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }
    }
  },
  wave: {
    style: 'fluid-wave',
    variants: {
      initial: { y: 0 },
      animate: { y: [0, -20, 0] }
    }
  },
  spiral: {
    style: 'fluid-spiral',
    variants: {
      initial: { rotate: 0, scale: 1 },
      animate: { rotate: 360, scale: [1, 1.2, 1] }
    }
  },
  float: {
    style: 'fluid-float',
    variants: {
      initial: { y: 0, x: 0 },
      animate: { 
        y: [0, -30, 0],
        x: [0, 20, 0]
      }
    }
  },
  bounce: {
    style: 'fluid-bounce',
    variants: {
      initial: { y: 0, scale: 1 },
      animate: { 
        y: [0, -20, 0],
        scale: [1, 0.95, 1]
      }
    }
  },
  swirl: {
    style: 'fluid-swirl',
    variants: {
      initial: { 
        rotate: 0,
        scale: 1,
        borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%'
      },
      animate: { 
        rotate: 360,
        scale: [1, 1.1, 1],
        borderRadius: ['60% 40% 30% 70%/60% 30% 70% 40%', '30% 60% 70% 40%/50% 60% 30% 60%', '60% 40% 30% 70%/60% 30% 70% 40%']
      }
    }
  },
  ripple: {
    style: 'fluid-ripple',
    variants: {
      initial: { scale: 0, opacity: 0 },
      animate: { 
        scale: [0, 2, 0],
        opacity: [0, 0.5, 0]
      }
    }
  },
  vortex: {
    style: 'fluid-vortex',
    variants: {
      initial: { 
        rotate: 0,
        scale: 1,
        x: 0,
        y: 0
      },
      animate: { 
        rotate: 360,
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -30, 0]
      }
    }
  },
  prism: {
    style: 'fluid-prism',
    variants: {
      initial: { 
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        rotate: 0
      },
      animate: { 
        clipPath: [
          'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          'polygon(50% 0%, 100% 100%, 50% 100%, 0% 0%)',
          'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        ],
        rotate: 360
      }
    }
  },
  liquid: {
    style: 'fluid-liquid',
    variants: {
      initial: { 
        borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
        scale: 1
      },
      animate: { 
        borderRadius: [
          '60% 40% 30% 70%/60% 30% 70% 40%',
          '30% 60% 70% 40%/50% 60% 30% 60%',
          '60% 40% 30% 70%/60% 30% 70% 40%'
        ],
        scale: [1, 1.05, 1]
      }
    }
  },
  constellation: {
    style: 'fluid-constellation',
    variants: {
      initial: { 
        opacity: 0.5,
        scale: 1,
        rotate: 0
      },
      animate: { 
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.1, 1],
        rotate: [0, 45, 0]
      }
    }
  },
  aurora: {
    style: 'fluid-aurora',
    variants: {
      initial: { 
        y: 0,
        skewX: 0
      },
      animate: { 
        y: [0, -20, 0],
        skewX: [0, 10, 0]
      }
    }
  },
  nebula: {
    style: 'fluid-nebula',
    variants: {
      initial: { 
        scale: 1,
        rotate: 0,
        opacity: 0.6
      },
      animate: { 
        scale: [1, 1.3, 1],
        rotate: [0, 180, 360],
        opacity: [0.6, 0.8, 0.6]
      }
    }
  }
} as const;

interface FluidBackgroundProps {
  colorScheme?: keyof typeof COLOR_PRESETS;
  speed?: keyof typeof SPEED_PRESETS;
  animationStyle?: keyof typeof ANIMATION_PRESETS;
  intensity?: number; // 0 to 1
  blur?: number; // pixels
}

export const FluidBackground = ({
  colorScheme = 'sunset',
  speed = 'medium',
  animationStyle = 'morph',
  intensity = 0.5,
  blur = 30
}: FluidBackgroundProps) => {
  const [mounted, setMounted] = useState(false);
  const colors = COLOR_PRESETS[colorScheme];
  const speeds = SPEED_PRESETS[speed];
  const animation = ANIMATION_PRESETS[animationStyle];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getGradientStyle = (colors: string[]) => ({
    background: `linear-gradient(45deg, ${colors.join(', ')})`,
    opacity: intensity
  });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          ...getGradientStyle(colors.background),
          backgroundSize: '400% 400%',
          animation: `gradient-shift ${speeds.gradient}s ease infinite`
        }}
      />

      {/* Animated Shapes */}
      {[colors.primary, colors.secondary, colors.tertiary].map((gradientColors, index) => (
        <motion.div
          key={index}
          className="absolute w-1/2 h-1/2"
          style={{
            ...getGradientStyle(gradientColors),
            top: ['20%', '40%', '30%'][index],
            left: ['20%', '40%', '30%'][index],
            filter: `blur(${blur}px)`
          }}
          initial={animation.variants.initial}
          animate={animation.variants.animate}
          transition={{
            duration: speeds.morph,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 2
          }}
        />
      ))}

      {/* Blur Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${blur * 0.5}px)`
        }}
      />
    </div>
  );
};
