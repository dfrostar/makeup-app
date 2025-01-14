# Getting Started with AI Features

## Introduction

This guide will help you understand and start using the AI features in the Beauty Directory Platform. We'll cover everything from basic setup to advanced usage patterns.

## Prerequisites

- Node.js 18.x or higher
- TypeScript 5.x
- Basic understanding of React and Next.js
- Familiarity with async/await patterns

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Import Required Components**
   ```typescript
   import { UnifiedAIService } from '../lib/ai/UnifiedAIService';
   import { UserPreferences, SearchResult } from '../lib/ai/types';
   ```

3. **Initialize the AI Service**
   ```typescript
   const aiService = UnifiedAIService.getInstance();

   // Set up user preferences
   const preferences: UserPreferences = {
     skinType: 'combination',
     skinTone: 'medium',
     concerns: ['aging', 'acne'],
     favoriteCategories: ['skincare', 'makeup'],
     priceRange: { min: 10, max: 100 }
   };

   aiService.setUserContext(preferences);
   ```

## Basic Usage Examples

### 1. Content Search

```typescript
// Simple search
const results = await aiService.search('natural makeup tutorial');

// Search with filters
const filteredResults = await aiService.search('foundation', {
  category: 'makeup',
  priceRange: { min: 20, max: 50 },
  brand: 'MAC'
});

// Access search results
results.forEach(result => {
  console.log(`Type: ${result.type}`);
  console.log(`Name: ${result.item.name}`);
  console.log(`Ranking: ${result.ranking.overall}`);
  console.log(`Quality: ${result.ranking.qualityScore}`);
});
```

### 2. Content Quality Analysis

```typescript
// Analyze a single piece of content
const content = {
  id: '123',
  title: 'Summer Makeup Tutorial',
  description: 'Learn how to create a fresh summer look',
  images: ['image1.jpg', 'image2.jpg'],
  tags: ['summer', 'natural', 'tutorial']
};

const analysis = await aiService.curateContent(content);

console.log('Quality Metrics:', analysis.qualityMetrics);
console.log('Trend Analysis:', analysis.trendAnalysis);
console.log('Improvements:', analysis.suggestedImprovements);
```

### 3. Performance Monitoring

```typescript
// Get current performance metrics
const metrics = aiService.getPerformanceMetrics();

console.log('Content Quality:', metrics.contentQuality);
console.log('Cache Hit Rate:', metrics.cacheHitRate);
console.log('Error Rate:', metrics.errorRate);
```

## React Integration

### 1. Custom Hook for Search

```typescript
function useAISearch(defaultQuery = '') {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const aiService = UnifiedAIService.getInstance();

  const search = useCallback(async (searchQuery: string) => {
    try {
      setLoading(true);
      const searchResults = await aiService.search(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  return { query, setQuery, results, loading };
}
```

### 2. Search Component Example

```typescript
function SearchComponent() {
  const { query, setQuery, results, loading } = useAISearch();

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />

      {loading && <div>Loading...</div>}

      <div className="results-grid">
        {results.map((result) => (
          <div key={result.item.id} className="result-card">
            <h3>{result.item.name || result.item.title}</h3>
            <div className="ranking-info">
              <div>Relevance: {(result.ranking.textualRelevance * 100).toFixed(1)}%</div>
              <div>Quality: {(result.ranking.qualityScore * 100).toFixed(1)}%</div>
              <div>Trending: {(result.ranking.trendAlignment * 100).toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Advanced Usage

### 1. Custom Content Analysis

```typescript
class CustomContentAnalyzer {
  private aiService = UnifiedAIService.getInstance();

  async analyzeContent(content: Content) {
    // Get basic analysis
    const curationResult = await this.aiService.curateContent(content);

    // Enhance with custom metrics
    return {
      ...curationResult,
      customMetrics: {
        engagementPotential: this.calculateEngagementPotential(content),
        marketFit: this.analyzeMarketFit(content),
        seasonalRelevance: this.calculateSeasonalRelevance(content)
      }
    };
  }

  private calculateEngagementPotential(content: Content): number {
    // Custom engagement potential calculation
    return 0.85; // Example score
  }

  private analyzeMarketFit(content: Content): number {
    // Custom market fit analysis
    return 0.92; // Example score
  }

  private calculateSeasonalRelevance(content: Content): number {
    // Custom seasonal relevance calculation
    return 0.78; // Example score
  }
}
```

### 2. Batch Processing

```typescript
async function batchProcessContent(contents: Content[]) {
  const aiService = UnifiedAIService.getInstance();
  const batchSize = 5;
  const results = [];

  // Process in batches to avoid overwhelming the system
  for (let i = 0; i < contents.length; i += batchSize) {
    const batch = contents.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(content => aiService.curateContent(content))
    );
    results.push(...batchResults);
  }

  return results;
}
```

## Performance Optimization

### 1. Caching Strategy

The AI service implements automatic caching for search results and content analysis. However, you can optimize it further:

```typescript
// Clear cache when needed
aiService.clearCache();

// Monitor cache performance
const metrics = aiService.getPerformanceMetrics();
if (metrics.cacheHitRate < 0.5) {
  console.warn('Low cache hit rate - consider adjusting cache settings');
}
```

### 2. Error Handling

```typescript
try {
  const results = await aiService.search(query);
} catch (error) {
  if (error instanceof AIServiceError) {
    switch (error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        // Wait and retry
        await delay(1000);
        return retry(query);
      case 'INVALID_QUERY':
        // Handle invalid query
        return fallbackSearch(query);
      default:
        // Log error and show user-friendly message
        console.error('Search error:', error);
        showErrorMessage('Unable to complete search');
    }
  }
}
```

## Best Practices

1. **Resource Management**
   - Use the singleton pattern correctly
   - Clear cache periodically
   - Monitor performance metrics

2. **Error Handling**
   - Implement proper error boundaries
   - Provide fallback content
   - Log errors appropriately

3. **Performance**
   - Use batch processing for multiple items
   - Implement proper loading states
   - Monitor and optimize cache usage

4. **User Experience**
   - Show relevant loading indicators
   - Provide meaningful error messages
   - Implement proper retry mechanisms

## Troubleshooting

### Common Issues

1. **High Error Rates**
   - Check network connectivity
   - Verify API endpoints
   - Review error logs

2. **Poor Performance**
   - Monitor cache hit rates
   - Check batch processing sizes
   - Review performance metrics

3. **Inconsistent Results**
   - Verify user preferences
   - Check search filters
   - Review ranking weights

### Debug Mode

```typescript
// Enable debug mode
process.env.AI_DEBUG = 'true';

// Get detailed logs
const aiService = UnifiedAIService.getInstance();
const debugMetrics = await aiService.getDebugMetrics();
console.log('Debug Metrics:', debugMetrics);
```

## Next Steps

1. Explore advanced features in the [AI-AGENTS.md](../features/AI-AGENTS.md) documentation
2. Review implementation details in [AI-IMPLEMENTATION.md](../AI-IMPLEMENTATION.md)
3. Check out service specifications in [AI-SERVICES.md](../AI-SERVICES.md)

## Support

For additional help:
1. Check the GitHub issues
2. Review the documentation
3. Contact the development team

Remember to keep this guide updated as new features are added or existing ones are modified.
