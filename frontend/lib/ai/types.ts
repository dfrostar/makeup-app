export interface UserPreferences {
  skinType?: string;
  skinTone?: string;
  concerns?: string[];
  favoriteCategories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  brand: string;
  ingredients: string[];
  images: string[];
  rating: number;
  reviews: number;
  tags: string[];
}

export interface Look {
  id: string;
  title: string;
  description: string;
  artist: string;
  products: Product[];
  images: string[];
  tags: string[];
  views: number;
  likes: number;
  createdAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  portfolio: Look[];
  followers: number;
  rating: number;
  verified: boolean;
}

export interface ContentQualityMetrics {
  visualQuality: number;
  techniqueAccuracy: number;
  engagementMetrics: number;
  brandSafety: number;
  overall: number;
}

export interface TrendAnalysis {
  trending: boolean;
  momentum: number;
  relevanceScore: number;
  seasonality: number;
  projectedGrowth: number;
}

export interface SearchRankingFactors {
  textualRelevance: number;
  visualSimilarity: number;
  userPreference: number;
  trendAlignment: number;
  qualityScore: number;
  overall: number;
}

export interface PerformanceMetrics {
  contentQuality: number;
  recommendationAccuracy: number;
  processingTime: number;
  cacheHitRate: number;
  errorRate: number;
}

export interface CurationResult {
  approved: boolean;
  qualityMetrics: ContentQualityMetrics;
  trendAnalysis: TrendAnalysis;
  suggestedImprovements: string[];
}

export type Content = Product | Look | Artist;

export interface SearchResult {
  type: 'product' | 'look' | 'artist';
  item: Content;
  ranking: SearchRankingFactors;
}
