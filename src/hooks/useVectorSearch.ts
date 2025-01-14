import { useCallback, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { SearchResult, SearchVector } from '@/types/search';

interface VectorSearchOptions {
  threshold?: number;
  limit?: number;
  rerank?: boolean;
}

export const useVectorSearch = (defaultOptions: VectorSearchOptions = {}) => {
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastEmbedding, setLastEmbedding] = useState<SearchVector | null>(null);

  // Get query embedding from AI service
  const embedQuery = useCallback(async (query: string): Promise<SearchVector> => {
    const response = await fetch('/api/search/embed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate embedding');
    }

    const { embedding } = await response.json();
    setLastEmbedding(embedding);
    return embedding;
  }, []);

  // Perform vector search
  const searchWithVector = useCallback(async (
    query: string,
    embedding: SearchVector,
    options: VectorSearchOptions = {}
  ): Promise<SearchResult[]> => {
    const {
      threshold = 0.7,
      limit = 20,
      rerank = true
    } = { ...defaultOptions, ...options };

    setLastQuery(query);

    const response = await fetch('/api/search/vector', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        embedding,
        threshold,
        limit,
        rerank
      }),
    });

    if (!response.ok) {
      throw new Error('Vector search failed');
    }

    return response.json();
  }, [defaultOptions]);

  // Cache recent search results
  const { data: recentResults } = useQuery(
    ['vectorSearch', lastQuery, lastEmbedding],
    () => lastEmbedding ? searchWithVector(lastQuery, lastEmbedding) : null,
    {
      enabled: !!lastQuery && !!lastEmbedding,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  // Prefetch similar queries
  const prefetchSimilarQueries = useMutation(
    async (query: string) => {
      const embedding = await embedQuery(query);
      return searchWithVector(query, embedding, { limit: 5 });
    },
    {
      onSuccess: (results, query) => {
        // Cache results for similar queries
        results.forEach(result => {
          if (result.similarQueries) {
            result.similarQueries.forEach(similarQuery => {
              embedQuery(similarQuery).catch(console.error);
            });
          }
        });
      }
    }
  );

  return {
    searchWithVector,
    embedQuery,
    prefetchSimilarQueries,
    recentResults,
    lastQuery,
    lastEmbedding
  };
};
