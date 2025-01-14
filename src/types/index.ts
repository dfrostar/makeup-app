export interface Look {
  id: string;
  name: string;
  category: string;
  image: string;
  artist: {
    name: string;
    avatar?: string;
  };
  products?: Array<{
    id: string;
    name: string;
    brand: string;
  }>;
  tags: string[];
  likes: number;
  saves: number;
  metrics?: {
    engagement: number;
    quality: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  experience: number;
  social: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  looks: Look[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  ingredients: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  skinType: string;
  skinTone: string;
  concerns: string[];
  favoriteCategories: string[];
  preferredBrands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface TrendingTopic {
  name: string;
  category: string;
  momentum: number;
  volume: number;
  sentiment: number;
  relatedTopics: string[];
  sources: string[];
  timeframe: string;
}

export interface ContentMetrics {
  performance: {
    views: number;
    engagement: number;
    shares: number;
  };
  quality: QualityMetrics;
  timestamp: Date;
}

export interface QualityMetrics {
  technical: {
    imageQuality: number;
    lighting: number;
    composition: number;
  };
  content: {
    relevance: number;
    completeness: number;
    accuracy: number;
  };
  engagement: {
    viewTime: number;
    interactionRate: number;
    shareRate: number;
  };
}

export interface ContentQualityReport {
  qualityScore: number;
  technicalQuality: {
    lighting: number;
    composition: number;
  };
  contentQuality: {
    relevance: number;
    accuracy: number;
  };
  recommendations: string[];
}

export interface TrendReport {
  trends: string[];
  popularity: {
    score: number;
    momentum: number;
  };
  momentum: {
    rising: boolean;
    velocity: number;
  };
}

export interface ContentUpdateResult {
  success: boolean;
  contentId: string;
  updateType: 'new' | 'update' | 'remove';
  timestamp: Date;
}

export interface ContentPerformance {
  views: number;
  engagement: number;
  shares: number;
  saves: number;
  comments: number;
}

export interface QualityChangeAction {
  action: 'update_required' | 'monitor' | 'remove';
  reason: string;
  recommendations: string[];
}

export interface TrendAdaptationResult {
  adapted: boolean;
  changes: string[];
  newRelevanceScore: number;
}

export interface Artist {
  name: string;
  avatar: string;
}

export interface Metrics {
  engagement: number;
  quality: number;
}

export interface Look {
  id: string;
  name: string;
  category: string;
  image: string;
  artist: Artist;
  tags: string[];
  likes: number;
  saves: number;
  metrics: Metrics;
}
