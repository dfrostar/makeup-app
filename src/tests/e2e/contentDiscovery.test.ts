import { ContentAnalysisAgent } from '../../services/ai/agents/contentAnalysis';
import { contentManager } from '../../services/ai/contentManagement';
import { unifiedAIService } from '../../services/ai/unifiedAIService';
import type { Look } from '../../types';

describe('Content Discovery End-to-End Tests', () => {
  let contentAgent: ContentAnalysisAgent;
  let discoveredContent: Look[];

  beforeAll(() => {
    contentAgent = new ContentAnalysisAgent();
  });

  test('1. Discover content from multiple sources', async () => {
    discoveredContent = await contentAgent.discoverContent({
      sources: ['instagram', 'tiktok', 'youtube', 'perplexity'],
      categories: ['natural', 'bold', 'colorful'],
      timeframe: '24h'
    });

    expect(discoveredContent).toBeDefined();
    expect(discoveredContent.length).toBeGreaterThan(0);
    
    // Validate content structure
    const firstLook = discoveredContent[0];
    expect(firstLook).toHaveProperty('id');
    expect(firstLook).toHaveProperty('name');
    expect(firstLook).toHaveProperty('category');
    expect(firstLook).toHaveProperty('image');
    expect(firstLook).toHaveProperty('artist');
    expect(firstLook).toHaveProperty('tags');
  });

  test('2. Analyze discovered content', async () => {
    const contentAnalysis = await Promise.all(
      discoveredContent.slice(0, 3).map(look => contentAgent.analyzeContent(look))
    );

    contentAnalysis.forEach(analysis => {
      expect(analysis).toHaveProperty('metadata');
      expect(analysis).toHaveProperty('tags');
      expect(analysis).toHaveProperty('structure');
      expect(analysis).toHaveProperty('quality');
      
      expect(analysis.quality).toHaveProperty('qualityScore');
      expect(analysis.quality.qualityScore).toBeGreaterThanOrEqual(0);
      expect(analysis.quality.qualityScore).toBeLessThanOrEqual(1);
    });
  });

  test('3. Optimize content for platform', async () => {
    const optimizedContent = await contentManager.batchOptimizeContent(
      discoveredContent.slice(0, 3)
    ) as Look[];

    expect(optimizedContent).toHaveLength(3);
    optimizedContent.forEach((content: Look) => {
      expect(content).toHaveProperty('id');
      expect(content).toHaveProperty('name');
      expect(content.tags.length).toBeGreaterThan(0);
    });
  });

  test('4. Get trending topics', async () => {
    const trends = await unifiedAIService.suggestTrendingContent();
    
    expect(trends).toBeDefined();
    expect(Array.isArray(trends)).toBe(true);
    expect(trends.length).toBeGreaterThan(0);
  });

  test('5. Monitor content performance', async () => {
    const performanceData = await Promise.all(
      discoveredContent.slice(0, 3).map(look => 
        contentManager.getContentPerformance(look)
      )
    );

    performanceData.forEach(data => {
      expect(data).toHaveProperty('views');
      expect(data).toHaveProperty('engagement');
      expect(data).toHaveProperty('shares');
    });
  });

  test('6. Get content quality reports', async () => {
    const qualityReports = await Promise.all(
      discoveredContent.slice(0, 3).map(look =>
        contentManager.getContentQualityReport(look)
      )
    );

    qualityReports.forEach(report => {
      expect(report).toHaveProperty('content');
      expect(report).toHaveProperty('qualityScore');
      expect(report).toHaveProperty('issues');
      expect(report).toHaveProperty('recommendations');
    });
  });
});
