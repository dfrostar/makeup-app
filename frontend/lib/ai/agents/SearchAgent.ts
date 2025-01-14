import {
  Content,
  SearchResult,
  SearchRankingFactors,
  UserPreferences
} from '../types';
import { ContentAgent } from './ContentAgent';
import { PerformanceMonitor } from '../monitoring/PerformanceMonitor';

export interface SearchAgentConfig {
  minQueryLength?: number;
  maxResults?: number;
  scoreThreshold?: number;
  weights?: {
    textual?: number;
    visual?: number;
    user?: number;
    trend?: number;
    quality?: number;
  };
}

export class SearchAgent {
  private contentAgent: ContentAgent;
  private config: Required<SearchAgentConfig>;
  private performanceMonitor: PerformanceMonitor;
  private userPreferences?: UserPreferences;

  constructor(contentAgent: ContentAgent, config: SearchAgentConfig = {}) {
    this.contentAgent = contentAgent;
    this.config = {
      minQueryLength: 2,
      maxResults: 50,
      scoreThreshold: 0.5,
      weights: {
        textual: 0.3,
        visual: 0.2,
        user: 0.2,
        trend: 0.15,
        quality: 0.15,
        ...config.weights
      },
      ...config
    };
    this.performanceMonitor = PerformanceMonitor.getInstance();
  }

  setUserPreferences(preferences: UserPreferences) {
    this.userPreferences = preferences;
  }

  async search(query: string, filters: Record<string, any> = {}): Promise<SearchResult[]> {
    return this.performanceMonitor.measureOperationTime(async () => {
      if (query.length < this.config.minQueryLength) {
        return [];
      }

      try {
        // Get all content
        const [products, looks] = await Promise.all([
          this.contentAgent.getProducts(),
          this.contentAgent.getTrendingLooks()
        ]);

        // Search and rank results
        const results = await Promise.all([
          ...products.map(async product => ({
            type: 'product' as const,
            item: product,
            ranking: await this.calculateRankingFactors(query, product, filters)
          })),
          ...looks.map(async look => ({
            type: 'look' as const,
            item: look,
            ranking: await this.calculateRankingFactors(query, look, filters)
          }))
        ]);

        // Filter and sort results
        return results
          .filter(result => this.calculateOverallScore(result.ranking) >= this.config.scoreThreshold)
          .sort((a, b) => this.calculateOverallScore(b.ranking) - this.calculateOverallScore(a.ranking))
          .slice(0, this.config.maxResults);
      } catch (error) {
        console.error('Error performing search:', error);
        throw error;
      }
    });
  }

  private async calculateRankingFactors(
    query: string,
    content: Content,
    filters: Record<string, any>
  ): Promise<SearchRankingFactors> {
    const textualRelevance = this.calculateTextualRelevance(query, content);
    const visualSimilarity = await this.calculateVisualSimilarity(content);
    const userPreference = this.calculateUserPreference(content);
    const trendAnalysis = await this.contentAgent.analyzeTrends([content]);
    const qualityMetrics = await this.contentAgent.analyzeContentQuality(content);

    const overall = this.calculateOverallScore({
      textualRelevance,
      visualSimilarity,
      userPreference,
      trendAlignment: trendAnalysis.relevanceScore,
      qualityScore: qualityMetrics.overall,
      overall: 0 // Will be calculated
    });

    return {
      textualRelevance,
      visualSimilarity,
      userPreference,
      trendAlignment: trendAnalysis.relevanceScore,
      qualityScore: qualityMetrics.overall,
      overall
    };
  }

  private calculateTextualRelevance(query: string, content: Content): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const contentText = this.getContentText(content).toLowerCase();

    let relevance = 0;
    for (const term of queryTerms) {
      if (contentText.includes(term)) {
        relevance += 1;
      }
    }

    return relevance / queryTerms.length;
  }

  private async calculateVisualSimilarity(content: Content): Promise<number> {
    // Simulate visual similarity calculation
    // In a real implementation, this would use computer vision APIs
    return Math.random() * 0.3 + 0.7; // 0.7-1.0
  }

  private calculateUserPreference(content: Content): number {
    if (!this.userPreferences) return 0.5;

    // Simulate preference calculation based on user preferences
    let score = 0.5;

    if ('category' in content && this.userPreferences.favoriteCategories) {
      if (this.userPreferences.favoriteCategories.includes(content.category)) {
        score += 0.2;
      }
    }

    if ('price' in content && this.userPreferences.priceRange) {
      const { min, max } = this.userPreferences.priceRange;
      if (content.price >= min && content.price <= max) {
        score += 0.2;
      }
    }

    return Math.min(score, 1);
  }

  private calculateOverallScore(factors: SearchRankingFactors): number {
    return (
      factors.textualRelevance * this.config.weights.textual +
      factors.visualSimilarity * this.config.weights.visual +
      factors.userPreference * this.config.weights.user +
      factors.trendAlignment * this.config.weights.trend +
      factors.qualityScore * this.config.weights.quality
    );
  }

  private getContentText(content: Content): string {
    const texts: string[] = [];

    if ('name' in content) texts.push(content.name);
    if ('title' in content) texts.push(content.title);
    if ('description' in content) texts.push(content.description);
    if ('tags' in content) texts.push(...content.tags);
    if ('brand' in content) texts.push(content.brand);
    if ('ingredients' in content) texts.push(...content.ingredients);

    return texts.join(' ');
  }
}
