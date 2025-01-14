import { useState } from 'react';
import { UnifiedAIService } from '@/lib/ai/UnifiedAIService';
import { ContentQualityMetrics } from '@/lib/ai/types';
import {
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AIContentManager() {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<ContentQualityMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze content quality
  const analyzeContent = async (contentId: string) => {
    setIsAnalyzing(true);
    try {
      const aiService = UnifiedAIService.getInstance();
      const metrics = await aiService.analyzeContentQuality(contentId);
      setQualityMetrics(metrics);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Optimize content
  const optimizeContent = async (contentId: string) => {
    try {
      const aiService = UnifiedAIService.getInstance();
      await aiService.optimizeContent(contentId);
      // Refresh metrics after optimization
      await analyzeContent(contentId);
    } catch (error) {
      console.error('Error optimizing content:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Analysis Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => selectedContent && analyzeContent(selectedContent)}
          disabled={!selectedContent || isAnalyzing}
          className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <DocumentMagnifyingGlassIcon className="h-6 w-6 mr-2 text-blue-600" />
          <span>Analyze Quality</span>
        </button>

        <button
          onClick={() => selectedContent && optimizeContent(selectedContent)}
          disabled={!selectedContent || !qualityMetrics}
          className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <SparklesIcon className="h-6 w-6 mr-2 text-purple-600" />
          <span>Optimize Content</span>
        </button>

        <button
          onClick={() => selectedContent && analyzeContent(selectedContent)}
          disabled={!selectedContent}
          className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <ChartBarIcon className="h-6 w-6 mr-2 text-green-600" />
          <span>View Analytics</span>
        </button>
      </div>

      {/* Quality Metrics Display */}
      {qualityMetrics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Content Quality Metrics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Quality Score"
              value={qualityMetrics.qualityScore}
              format="percentage"
            />
            <MetricCard
              label="Engagement Potential"
              value={qualityMetrics.engagementPotential}
              format="percentage"
            />
            <MetricCard
              label="Trend Alignment"
              value={qualityMetrics.trendAlignment}
              format="percentage"
            />
            <MetricCard
              label="Brand Consistency"
              value={qualityMetrics.brandConsistency}
              format="percentage"
            />
          </div>

          {/* Improvement Suggestions */}
          {qualityMetrics.improvements.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Suggested Improvements</h4>
              <ul className="space-y-2">
                {qualityMetrics.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs">
                      !
                    </span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, format }: {
  label: string;
  value: number;
  format: 'percentage' | 'number';
}) {
  const formattedValue = format === 'percentage'
    ? `${(value * 100).toFixed(1)}%`
    : value.toFixed(1);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-semibold">{formattedValue}</div>
    </div>
  );
}
