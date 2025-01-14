import { jest } from '@jest/globals';

interface SocialMediaContent {
  id: string;
  platform: string;
  type: string;
  url: string;
  caption: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  metadata: {
    created: Date;
    author: {
      name: string;
      followers: number;
    };
  };
}

interface ImageAnalysis {
  quality: {
    resolution: { width: number; height: number; };
    sharpness: number;
    brightness: number;
    contrast: number;
    colorBalance: number;
  };
  detection: {
    face: boolean;
    makeup: boolean;
    products: string[];
  };
  analysis: {
    style: string;
    colors: string[];
    techniques: string[];
  };
}

interface CurrentTrend {
  name: string;
  momentum: number;
  popularity: number;
  relatedTags: string[];
}

interface PredictedTrend {
  name: string;
  confidence: number;
  timeframe: string;
  signals: string[];
}

interface TrendMomentum {
  score: number;
  velocity: number;
  acceleration: number;
}

// Mock data for social media content
const mockSocialMediaContent: SocialMediaContent[] = Array.from({ length: 10 }, (_, i) => ({
  id: `social-${i + 1}`,
  platform: i % 2 === 0 ? 'instagram' : 'tiktok',
  type: 'look',
  url: `https://example.com/p/mock${i + 1}`,
  caption: `${i % 2 === 0 ? 'Natural' : 'Glam'} makeup tutorial #makeup #beauty`,
  engagement: {
    likes: 1500 + i * 100,
    comments: 45 + i * 5,
    shares: 20 + i * 2
  },
  metadata: {
    created: new Date(),
    author: {
      name: `BeautyArtist${i + 1}`,
      followers: 10000 + i * 1000
    }
  }
}));

// Mock data for image analysis
const mockImageAnalysis: ImageAnalysis = {
  quality: {
    resolution: { width: 1920, height: 1080 },
    sharpness: 0.85,
    brightness: 0.75,
    contrast: 0.8,
    colorBalance: 0.9
  },
  detection: {
    face: true,
    makeup: true,
    products: ['foundation', 'mascara', 'lipstick']
  },
  analysis: {
    style: 'natural',
    colors: ['nude', 'pink', 'brown'],
    techniques: ['contouring', 'highlighting']
  }
};

// Mock data for trend analysis
const mockTrends = {
  current: [
    {
      name: 'glass skin',
      momentum: 0.9,
      popularity: 0.85,
      relatedTags: ['dewy', 'natural', 'korean beauty']
    },
    {
      name: 'fox eye',
      momentum: 0.75,
      popularity: 0.8,
      relatedTags: ['cat eye', 'lifting', 'elongated']
    }
  ] as CurrentTrend[],
  predicted: [
    {
      name: 'clean girl aesthetic',
      confidence: 0.9,
      timeframe: '2w',
      signals: ['social media', 'influencers', 'runway']
    }
  ] as PredictedTrend[]
};

interface SocialMediaAPI {
  discoverContent: () => Promise<SocialMediaContent[]>;
  getEngagementMetrics: () => Promise<{ views: number; engagement: number; shareRate: number; }>;
  getTrendingContent: () => Promise<SocialMediaContent[]>;
}

interface ImageAnalysisAPI {
  analyzeImage: () => Promise<ImageAnalysis>;
  detectProducts: () => Promise<string[]>;
  assessQuality: () => Promise<ImageAnalysis['quality']>;
}

interface TrendAPI {
  getCurrentTrends: () => Promise<CurrentTrend[]>;
  getPredictedTrends: () => Promise<PredictedTrend[]>;
  getTrendMomentum: () => Promise<TrendMomentum>;
}

export const mockSocialMediaAPI = (): SocialMediaAPI => {
  return {
    discoverContent: jest.fn<() => Promise<SocialMediaContent[]>>().mockResolvedValue(mockSocialMediaContent),
    getEngagementMetrics: jest.fn<() => Promise<{ views: number; engagement: number; shareRate: number; }>>().mockResolvedValue({
      views: 5000,
      engagement: 0.85,
      shareRate: 0.2
    }),
    getTrendingContent: jest.fn<() => Promise<SocialMediaContent[]>>().mockResolvedValue(mockSocialMediaContent.slice(0, 3))
  };
};

export const mockImageAnalysisAPI = (): ImageAnalysisAPI => {
  return {
    analyzeImage: jest.fn<() => Promise<ImageAnalysis>>().mockResolvedValue(mockImageAnalysis),
    detectProducts: jest.fn<() => Promise<string[]>>().mockResolvedValue(mockImageAnalysis.detection.products),
    assessQuality: jest.fn<() => Promise<ImageAnalysis['quality']>>().mockResolvedValue(mockImageAnalysis.quality)
  };
};

export const mockTrendAPI = (): TrendAPI => {
  return {
    getCurrentTrends: jest.fn<() => Promise<CurrentTrend[]>>().mockResolvedValue(mockTrends.current),
    getPredictedTrends: jest.fn<() => Promise<PredictedTrend[]>>().mockResolvedValue(mockTrends.predicted),
    getTrendMomentum: jest.fn<() => Promise<TrendMomentum>>().mockResolvedValue({
      score: 0.85,
      velocity: 0.2,
      acceleration: 0.1
    })
  };
};
