import { ProductData } from '@/types/ar';

export const testProducts: ProductData[] = [
  {
    id: 'lipstick-001',
    name: 'Matte Revolution Lipstick',
    type: 'lipstick',
    description: 'Long-lasting matte lipstick with intense color payoff',
    price: 34.99,
    defaultColor: '#FF4136',
    colors: [
      '#FF4136', // Red
      '#FF69B4', // Pink
      '#800020', // Burgundy
      '#CD5C5C', // Indian Red
      '#8B0000', // Dark Red
      '#FFB6C1', // Light Pink
    ],
    blendMode: 'multiply',
    opacity: 0.85,
    features: ['longWearing', 'moisturizing', 'veganFormula']
  },
  {
    id: 'eyeshadow-001',
    name: 'Shimmer Eye Palette',
    type: 'eyeshadow',
    description: 'Highly pigmented metallic eyeshadow',
    price: 49.99,
    defaultColor: '#B8860B',
    colors: [
      '#B8860B', // Gold
      '#C0C0C0', // Silver
      '#8B4513', // Bronze
      '#4A412A', // Taupe
      '#800080', // Purple
      '#006400', // Dark Green
    ],
    blendMode: 'overlay',
    opacity: 0.75,
    features: ['shimmer', 'buildable', 'waterproof']
  },
  {
    id: 'blush-001',
    name: 'Natural Flush Blush',
    type: 'blush',
    description: 'Buildable blush for a natural-looking flush',
    price: 29.99,
    defaultColor: '#FFB6C1',
    colors: [
      '#FFB6C1', // Light Pink
      '#FF69B4', // Hot Pink
      '#DDA0DD', // Plum
      '#F08080', // Coral
      '#CD5C5C', // Indian Red
      '#E9967A', // Dark Salmon
    ],
    blendMode: 'soft-light',
    opacity: 0.6,
    features: ['naturalFinish', 'buildable']
  },
  {
    id: 'foundation-001',
    name: 'Perfect Match Foundation',
    type: 'foundation',
    description: 'AI-powered foundation matching with skincare benefits',
    price: 42.99,
    defaultColor: '#F5DEB3',
    colors: [
      '#F5DEB3', // Wheat
      '#DEB887', // Burlywood
      '#D2B48C', // Tan
      '#BC8F8F', // Rosy Brown
      '#A0522D', // Sienna
      '#8B4513', // Saddle Brown
    ],
    blendMode: 'normal',
    opacity: 0.9,
    features: ['spf50', 'hyaluronicAcid', 'vitaminC']
  },
  {
    id: 'contour-001',
    name: 'Sculpt & Define Contour',
    type: 'bronzer',
    description: 'Professional-grade contour with 3D scanning',
    price: 38.99,
    defaultColor: '#A0522D',
    colors: [
      '#A0522D', // Sienna
      '#8B4513', // Saddle Brown
      '#6B4423', // Deep Brown
      '#483C32', // Taupe
      '#3B2F2F', // Dark Liver
      '#704214', // Sepia
    ],
    blendMode: 'multiply',
    opacity: 0.7,
    features: ['3dSculpting', 'buildable']
  },
  {
    id: 'highlighter-001',
    name: 'Glow Prism Highlighter',
    type: 'highlighter',
    description: 'Multi-dimensional highlighter with light-adapting technology',
    price: 36.99,
    defaultColor: '#FFF8DC',
    colors: [
      '#FFF8DC', // Cornsilk
      '#FFE4B5', // Moccasin
      '#FFDAB9', // Peach Puff
      '#FFE4E1', // Misty Rose
      '#F0E68C', // Khaki
      '#E6E6FA', // Lavender
    ],
    blendMode: 'screen',
    opacity: 0.65,
    features: ['holographic', 'lightAdapting']
  }
];
