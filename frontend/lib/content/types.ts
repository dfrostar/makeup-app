// Base content types that can be extended for different domains
export type BaseContentType = 
  | 'article' 
  | 'video' 
  | 'image' 
  | 'product' 
  | 'tutorial' 
  | 'review' 
  | 'collection'
  | 'story'
  | 'post';

// Domain-specific content types
export type MakeupContentType = 
  | 'look' 
  | 'routine' 
  | 'technique' 
  | 'product_review' 
  | 'trend';

export type FashionContentType = 
  | 'outfit' 
  | 'style_guide' 
  | 'trend_report' 
  | 'lookbook';

export type FoodContentType = 
  | 'recipe' 
  | 'restaurant_review' 
  | 'cooking_technique' 
  | 'meal_plan';

// Extensible content type system
export type ContentType = BaseContentType | MakeupContentType | FashionContentType | FoodContentType;

export type ContentStatus = 
  | 'draft' 
  | 'in_review' 
  | 'scheduled' 
  | 'published' 
  | 'archived' 
  | 'featured';

export type ContentCategory = {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  metadata?: Record<string, any>;
};

export type ContentTag = {
  id: string;
  name: string;
  slug: string;
  type?: string;
  metadata?: Record<string, any>;
};

// Flexible metadata system for different content types
export type ContentMetadata = {
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  scheduling?: {
    publishAt?: string;
    expireAt?: string;
    timeZone?: string;
  };
  targeting?: {
    regions?: string[];
    languages?: string[];
    demographics?: Record<string, any>;
  };
  custom?: Record<string, any>;
};

// Rich media support
export type ContentMedia = {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size?: number;
    mimeType?: string;
    [key: string]: any;
  };
};

// Base content interface that can be extended
export interface ContentItem {
  id: string;
  type: ContentType;
  status: ContentStatus;
  title: string;
  slug: string;
  description?: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  media?: ContentMedia[];
  categories?: ContentCategory[];
  tags?: ContentTag[];
  metadata?: ContentMetadata;
  
  // Analytics and metrics
  qualityScore: number;
  engagementRate: number;
  viewCount?: number;
  shareCount?: number;
  commentCount?: number;
  likeCount?: number;
  
  // AI-generated insights
  aiInsights?: {
    contentQuality?: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
    seoScore?: number;
    readabilityScore?: number;
    sentimentScore?: number;
    trendAlignment?: number;
    brandAlignment?: number;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Attribution
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  
  // Version control
  version?: number;
  lastModifiedBy?: string;
  
  // Workflow
  workflowState?: {
    stage: string;
    assignedTo?: string;
    dueDate?: string;
    comments?: Array<{
      id: string;
      text: string;
      author: string;
      createdAt: string;
    }>;
  };
  
  // Relationships
  relatedContent?: string[];
  parentId?: string;
  childIds?: string[];
}

// Performance metrics for AI analysis
export interface ContentQualityMetrics {
  qualityScore: number;
  engagementPotential: number;
  trendAlignment: number;
  brandConsistency: number;
  improvements: string[];
  
  // Additional metrics can be added per domain
  domainSpecificMetrics?: {
    [key: string]: any;
  };
}

// System performance metrics
export interface PerformanceMetrics {
  contentQuality: number;
  contentQualityChange: number;
  recommendationAccuracy: number;
  recommendationAccuracyChange: number;
  averageProcessingTime: number;
  processingTimeChange: number;
  cacheHitRate: number;
  cacheHitRateChange: number;
  errorRates: Record<string, number>;
  systemHealth: {
    memoryUsage: number;
    cpuLoad: number;
    apiResponseTime: number;
  };
}

// AI settings interface
export interface AISettings {
  contentQuality: {
    minQualityScore: number;
    minEngagementScore: number;
    autoOptimize: boolean;
  };
  search: {
    textualRelevanceWeight: number;
    visualSimilarityWeight: number;
    userPreferenceWeight: number;
    trendAlignmentWeight: number;
    qualityScoreWeight: number;
  };
  performance: {
    cacheLifetime: number;
    batchSize: number;
    maxConcurrentRequests: number;
  };
  monitoring: {
    errorThreshold: number;
    performanceAlertThreshold: number;
    enableDetailedLogging: boolean;
  };
}
