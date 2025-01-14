'use client';

import { useState, useEffect } from 'react';
import { UnifiedAIService } from '../../../lib/ai/UnifiedAIService';
import { SearchResult, UserPreferences } from '../../../lib/ai/types';

export default function AITestPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  const aiService = UnifiedAIService.getInstance();

  // Set up user preferences
  useEffect(() => {
    const preferences: UserPreferences = {
      skinType: 'combination',
      skinTone: 'medium',
      concerns: ['aging', 'acne'],
      favoriteCategories: ['skincare', 'makeup'],
      priceRange: { min: 10, max: 100 }
    };
    aiService.setUserContext(preferences);
  }, []);

  // Load initial content and metrics
  useEffect(() => {
    loadContent();
    updateMetrics();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [products, looks] = await Promise.all([
        aiService.getProducts(),
        aiService.getTrendingLooks()
      ]);

      // Curate and analyze content
      const results = await Promise.all([
        ...products.slice(0, 5).map(async product => ({
          type: 'product' as const,
          item: product,
          curation: await aiService.curateContent(product)
        })),
        ...looks.slice(0, 5).map(async look => ({
          type: 'look' as const,
          item: look,
          curation: await aiService.curateContent(look)
        }))
      ]);

      setResults(results);
    } catch (err) {
      setError('Error loading content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      await loadContent();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await aiService.search(query);
      setResults(searchResults);
    } catch (err) {
      setError('Error performing search');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateMetrics = () => {
    const metrics = aiService.getPerformanceMetrics();
    setMetrics(metrics);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI System Test Page</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search products, looks, and ingredients..."
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Performance Metrics */}
      {metrics && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-bold mb-2">Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-semibold">Content Quality:</div>
              <div>{(metrics.contentQuality * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="font-semibold">Recommendation Accuracy:</div>
              <div>{(metrics.recommendationAccuracy * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="font-semibold">Cache Hit Rate:</div>
              <div>{(metrics.cacheHitRate * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="font-semibold">Error Rate:</div>
              <div>{(metrics.errorRate * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          Loading...
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="border rounded p-4 hover:shadow-lg transition-shadow"
          >
            <div className="font-bold">
              {'name' in result.item ? result.item.name : result.item.title}
            </div>
            <div className="text-sm text-gray-600">{result.type}</div>
            <div className="mt-2">
              {'description' in result.item && result.item.description}
            </div>
            {'ranking' in result && (
              <div className="mt-2 text-sm">
                <div className="font-semibold">Ranking Factors:</div>
                <div>Relevance: {(result.ranking.textualRelevance * 100).toFixed(1)}%</div>
                <div>Quality: {(result.ranking.qualityScore * 100).toFixed(1)}%</div>
                <div>Trend: {(result.ranking.trendAlignment * 100).toFixed(1)}%</div>
              </div>
            )}
            {'curation' in result && (
              <div className="mt-2 text-sm">
                <div className="font-semibold">Quality Score:</div>
                <div>{(result.curation.qualityMetrics.overall * 100).toFixed(1)}%</div>
                {result.curation.suggestedImprovements.length > 0 && (
                  <div className="mt-1">
                    <div className="font-semibold">Suggestions:</div>
                    <ul className="list-disc list-inside">
                      {result.curation.suggestedImprovements.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
