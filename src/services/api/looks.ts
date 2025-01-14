import type { Look } from '../../types';
import { ContentAnalysisAgent } from '../ai/agents/contentAnalysis';
import { contentManager } from '../ai/contentManagement';
import { unifiedAIService } from '../ai/unifiedAIService';

interface FetchLooksParams {
  category?: string;
  searchQuery?: string;
}

export async function fetchLooks({ category, searchQuery }: FetchLooksParams): Promise<Look[]> {
  const contentAgent = new ContentAnalysisAgent();
  const looks = await contentAgent.discoverContent({
    sources: ['instagram', 'tiktok', 'youtube', 'perplexity'],
    categories: category === 'all' ? ['natural', 'bold', 'colorful', 'bridal', 'editorial', 'sfx'] : [category],
    timeframe: '24h'
  });

  if (searchQuery) {
    return looks.filter(look => 
      look.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      look.artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      look.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  return contentManager.batchOptimizeContent(looks);
}

export async function getTrendingLooks(): Promise<Look[]> {
  return unifiedAIService.suggestTrendingContent();
}

export async function getLookInsights(lookId: string) {
  const look = await contentManager.getContentById(lookId);
  if (!look) {
    throw new Error('Look not found');
  }

  const [quality, performance] = await Promise.all([
    contentManager.getContentQualityReport(look),
    contentManager.getContentPerformance(look)
  ]);

  return {
    qualityScore: quality.qualityScore,
    recommendations: quality.recommendations,
    performance: {
      engagement: performance.engagement,
      shares: performance.shares,
      views: performance.views
    }
  };
}
