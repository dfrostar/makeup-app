import {
  UserPreferences,
  Product,
  Look,
  Content,
  CurationResult,
  SearchResult
} from './types';
import { ContentAgent } from './agents/ContentAgent';
import { SearchAgent } from './agents/SearchAgent';
import { PerformanceMonitor } from './monitoring/PerformanceMonitor';

export class UnifiedAIService {
  private static instance: UnifiedAIService;
  private contentAgent: ContentAgent;
  private searchAgent: SearchAgent;
  private performanceMonitor: PerformanceMonitor;
  private userPreferences?: UserPreferences;

  private constructor() {
    this.contentAgent = new ContentAgent();
    this.searchAgent = new SearchAgent(this.contentAgent);
    this.performanceMonitor = PerformanceMonitor.getInstance();
  }

  static getInstance(): UnifiedAIService {
    if (!UnifiedAIService.instance) {
      UnifiedAIService.instance = new UnifiedAIService();
    }
    return UnifiedAIService.instance;
  }

  setUserContext(preferences: UserPreferences) {
    this.userPreferences = preferences;
    this.searchAgent.setUserPreferences(preferences);
  }

  async getProducts(category?: string): Promise<Product[]> {
    return this.contentAgent.getProducts(category);
  }

  async getTrendingLooks(): Promise<Look[]> {
    return this.contentAgent.getTrendingLooks();
  }

  async search(query: string, filters: Record<string, any> = {}): Promise<SearchResult[]> {
    return this.searchAgent.search(query, filters);
  }

  async curateContent(content: Content): Promise<CurationResult> {
    return this.contentAgent.curateContent(content);
  }

  getPerformanceMetrics() {
    return this.performanceMonitor.getMetrics();
  }

  clearCache() {
    this.contentAgent.clearCache();
  }
}
