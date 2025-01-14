import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { UnifiedAIService } from '../../services/ai/unifiedAIService';
import { ContentManagementSystem } from '../../services/ai/contentManagement';
import { ContentAnalysisAgent } from '../../services/ai/agents/contentAnalysis';
import { QualityAssessmentAgent } from '../../services/ai/agents/qualityAssessment';
import { TrendAnalysisAgent } from '../../services/ai/agents/trendAnalysis';
import { mockSocialMediaAPI, mockImageAnalysisAPI, mockTrendAPI } from '../mocks/externalAPIs';
import type { Look, ContentQualityReport, TrendReport } from '../../types';

describe('Content Pipeline Integration Tests', () => {
  let unifiedService: UnifiedAIService;
  let cms: ContentManagementSystem;
  let contentAgent: ContentAnalysisAgent;
  let qualityAgent: QualityAssessmentAgent;
  let trendAgent: TrendAnalysisAgent;

  // Mock content for testing
  const mockLook: Look = {
    id: 'test-look-1',
    name: 'Natural Glam Look',
    category: 'natural',
    image: 'https://example.com/test-look.jpg',
    artist: {
      name: 'Test Artist',
      avatar: 'https://example.com/artist.jpg'
    },
    products: [
      { id: 'prod1', name: 'Foundation', brand: 'TestBrand' },
      { id: 'prod2', name: 'Mascara', brand: 'TestBrand' }
    ],
    tags: ['natural', 'glam', 'everyday'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Initialize services with mocked external APIs
    unifiedService = UnifiedAIService.getInstance();
    cms = ContentManagementSystem.getInstance();
    contentAgent = new ContentAnalysisAgent();
    qualityAgent = new QualityAssessmentAgent();
    trendAgent = new TrendAnalysisAgent();

    // Mock external API calls
    mockSocialMediaAPI();
    mockImageAnalysisAPI();
    mockTrendAPI();
  });

  describe('Content Discovery', () => {
    test('should discover and analyze new content', async () => {
      // Test content discovery
      const discoveredContent = await contentAgent.discoverContent({
        sources: ['instagram', 'tiktok', 'youtube'],
        categories: ['natural', 'glam'],
        timeframe: '24h'
      });

      expect(discoveredContent).toHaveLength(10); // Assuming 10 items discovered
      expect(discoveredContent[0]).toHaveProperty('id');
      expect(discoveredContent[0]).toHaveProperty('image');
    });

    test('should analyze image quality of discovered content', async () => {
      const qualityReport = await qualityAgent.analyzeContent(mockLook);

      expect(qualityReport).toMatchObject({
        qualityScore: expect.any(Number),
        technicalQuality: expect.any(Object),
        contentQuality: expect.any(Object),
        recommendations: expect.any(Array)
      });

      expect(qualityReport.qualityScore).toBeGreaterThan(0);
      expect(qualityReport.qualityScore).toBeLessThanOrEqual(1);
    });

    test('should analyze current trends', async () => {
      const trendReport = await trendAgent.analyzeTrends({
        timeframe: '24h',
        categories: ['natural', 'glam']
      });

      expect(trendReport).toMatchObject({
        trends: expect.any(Array),
        popularity: expect.any(Object),
        momentum: expect.any(Object)
      });

      expect(trendReport.trends.length).toBeGreaterThan(0);
    });
  });

  describe('Content Processing Pipeline', () => {
    test('should process content through entire pipeline', async () => {
      // 1. Discover content
      const discoveredContent = await contentAgent.discoverContent({
        sources: ['instagram'],
        categories: ['natural'],
        timeframe: '24h'
      });

      // 2. Analyze first discovered item
      const firstItem = discoveredContent[0];
      const qualityReport = await qualityAgent.analyzeContent(firstItem);
      
      // 3. Get trend data
      const trendReport = await trendAgent.analyzeTrends({
        timeframe: '24h',
        categories: [firstItem.category]
      });

      // 4. Process through CMS
      const processedContent = await cms.processContent({
        content: firstItem,
        qualityReport,
        trendReport
      });

      // Verify processed content
      expect(processedContent).toMatchObject({
        content: expect.any(Object),
        quality: expect.any(Object),
        trends: expect.any(Object),
        status: expect.any(String)
      });

      expect(processedContent.status).toBe('ready');
      expect(processedContent.quality.qualityScore).toBeGreaterThan(0.7); // Minimum quality threshold
    });

    test('should update site with new content', async () => {
      // 1. Process mock look
      const processedLook = await cms.processContent({
        content: mockLook,
        qualityReport: await qualityAgent.analyzeContent(mockLook),
        trendReport: await trendAgent.analyzeTrends({
          timeframe: '24h',
          categories: [mockLook.category]
        })
      });

      // 2. Update site content
      const updateResult = await cms.updateSiteContent(processedLook);

      expect(updateResult).toMatchObject({
        success: true,
        contentId: mockLook.id,
        updateType: 'new',
        timestamp: expect.any(Date)
      });
    });
  });

  describe('Content Quality Monitoring', () => {
    test('should monitor content performance', async () => {
      // Add mock look to monitoring
      await cms.addToMonitoring(mockLook.id);

      // Simulate 24 hours of performance data
      const performanceData = await cms.getContentPerformance(mockLook);

      expect(performanceData).toMatchObject({
        views: expect.any(Number),
        engagement: expect.any(Number),
        shares: expect.any(Number)
      });
    });

    test('should trigger content update when quality drops', async () => {
      // Simulate quality drop
      const poorQualityReport: ContentQualityReport = {
        qualityScore: 0.4,
        technicalQuality: { lighting: 0.3, composition: 0.5 },
        contentQuality: { relevance: 0.4, accuracy: 0.5 },
        recommendations: ['Improve lighting', 'Enhance composition']
      };

      // Monitor should detect and handle quality drop
      const updateAction = await cms.handleQualityChange(mockLook.id, poorQualityReport);

      expect(updateAction).toMatchObject({
        action: 'update_required',
        reason: 'quality_drop',
        recommendations: expect.any(Array)
      });
    });

    test('should update content based on trend changes', async () => {
      // Simulate trend change
      const newTrendReport: TrendReport = {
        trends: ['new_trend_1', 'new_trend_2'],
        popularity: { score: 0.9, momentum: 0.8 },
        momentum: { rising: true, velocity: 0.7 }
      };

      // System should adapt content to new trends
      const adaptationResult = await cms.adaptToTrends(mockLook.id, newTrendReport);

      expect(adaptationResult).toMatchObject({
        adapted: true,
        changes: expect.any(Array),
        newRelevanceScore: expect.any(Number)
      });

      expect(adaptationResult.newRelevanceScore).toBeGreaterThan(0.7);
    });
  });
});
