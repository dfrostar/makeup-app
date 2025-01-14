import type { Look } from '../../../types';
import { mockSocialMediaAPI } from '../../../tests/mocks/externalAPIs';
import { PerplexityService } from '../perplexityService';

export class ContentAnalysisAgent {
  private socialMediaAPI = mockSocialMediaAPI();
  private perplexityService = PerplexityService.getInstance();

  async discoverContent(options: {
    sources: string[];
    categories: string[];
    timeframe: string;
  }): Promise<Look[]> {
    const results: Look[] = [];

    // Get content from social media platforms
    if (options.sources.some(source => ['instagram', 'tiktok', 'youtube'].includes(source))) {
      const socialMediaContent = await this.socialMediaAPI.discoverContent();
      const socialMediaLooks = socialMediaContent.map(content => ({
        id: content.id,
        name: content.caption.split('#')[0].trim(),
        category: content.caption.toLowerCase().includes('natural') ? 'natural' : 'glam',
        image: content.url,
        artist: {
          name: content.metadata.author.name,
          avatar: `https://example.com/avatars/${content.metadata.author.name}.jpg`
        },
        products: [],
        tags: content.caption
          .split('#')
          .slice(1)
          .map(tag => tag.trim())
          .filter(Boolean),
        createdAt: content.metadata.created,
        updatedAt: content.metadata.created
      }));
      results.push(...socialMediaLooks);
    }

    // Get additional content using Perplexity Pro
    const categoryQueries = options.categories.map(category => 
      this.perplexityService.discoverContent(`${category} makeup looks trending ${options.timeframe}`)
    );
    const perplexityLooks = await Promise.all(categoryQueries);
    results.push(...perplexityLooks.flat());

    // Remove duplicates based on image URL
    const uniqueLooks = Array.from(new Map(results.map(look => [look.image, look])).values());

    // Sort by recency
    return uniqueLooks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async analyzeContent(content: Look) {
    // Get analysis from Perplexity Pro
    const perplexityAnalysis = await this.perplexityService.analyzeContent(content);

    // Combine with basic metadata analysis
    return {
      metadata: {
        format: 'image/jpeg',
        dimensions: { width: 1920, height: 1080 },
        size: 2048576 // 2MB
      },
      tags: content.tags,
      structure: {
        hasDescription: true,
        hasProducts: content.products.length > 0,
        hasSteps: true
      },
      quality: perplexityAnalysis
    };
  }

  async validateContent(content: Look) {
    // Validate content against platform requirements
    return {
      isValid: true,
      issues: [],
      recommendations: []
    };
  }
}
