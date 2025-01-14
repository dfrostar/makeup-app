export type SearchVector = number[];

export interface SearchOptions {
  embedding?: SearchVector;
  type?: 'text' | 'visual' | 'voice' | 'hybrid';
  filters?: SearchFilters;
  threshold?: number;
  limit?: number;
  rerank?: boolean;
}

export interface SearchFilters {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  brands?: string[];
  ratings?: number;
  inStock?: boolean;
}

export interface SearchResult {
  id: string;
  type: 'product' | 'look' | 'professional';
  title: string;
  description: string;
  imageUrl: string;
  score: number;
  metadata: Record<string, unknown>;
  similarQueries?: string[];
  highlights?: {
    field: string;
    snippet: string;
  }[];
}

export interface SearchAnalytics {
  queryId: string;
  timestamp: number;
  query: string;
  type: SearchOptions['type'];
  filters?: SearchFilters;
  results: number;
  selectedResult?: string;
  duration: number;
}

export interface SearchSuggestion {
  type: 'recent' | 'trending' | 'popular' | 'similar';
  text: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface SearchStats {
  totalResults: number;
  processingTime: number;
  confidence: number;
  strategy: string;
}
