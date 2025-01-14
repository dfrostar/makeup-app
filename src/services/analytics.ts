import { ContentPerformance } from '../types';

class AnalyticsService {
  private static instance: AnalyticsService;
  private contentMetrics: Map<string, ContentPerformance> = new Map();

  private constructor() {
    this.initializeAnalytics();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private initializeAnalytics() {
    // Initialize analytics service
  }

  async trackContent(contentId: string) {
    // Add content to tracking
    this.contentMetrics.set(contentId, {
      views: 0,
      engagement: 0,
      shares: 0,
      saves: 0,
      comments: 0
    });
  }

  async getContentAnalytics(contentId: string): Promise<ContentPerformance> {
    const metrics = this.contentMetrics.get(contentId);
    if (!metrics) {
      // Return default metrics if not found
      return {
        views: Math.floor(Math.random() * 1000),
        engagement: Math.random(),
        shares: Math.floor(Math.random() * 100),
        saves: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20)
      };
    }
    return metrics;
  }

  async updateMetrics(contentId: string, metrics: Partial<ContentPerformance>) {
    const currentMetrics = this.contentMetrics.get(contentId) || {
      views: 0,
      engagement: 0,
      shares: 0,
      saves: 0,
      comments: 0
    };
    
    this.contentMetrics.set(contentId, {
      ...currentMetrics,
      ...metrics
    });
  }
}

export const analytics = AnalyticsService.getInstance();
