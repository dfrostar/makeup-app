import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedAIService, CurationResult } from '../services/ai/unifiedAIService';
import type { Look, Artist, Product, UserPreferences } from '../types';

interface UseAIContentOptions {
  autoUpdate?: boolean;
  updateInterval?: number;
  qualityThreshold?: number;
  userPreferences?: UserPreferences;
  purchaseHistory?: Product[];
  viewHistory?: Product[];
}

export function useAIContent(
  content: Look | Artist | Product,
  options: UseAIContentOptions = {}
) {
  const {
    autoUpdate = true,
    updateInterval = 1000 * 60 * 60, // 1 hour
    qualityThreshold = 0.8,
    userPreferences,
    purchaseHistory = [],
    viewHistory = [],
  } = options;

  const queryClient = useQueryClient();

  // Set user context if provided
  useEffect(() => {
    if (userPreferences) {
      unifiedAIService.setUserContext(userPreferences, purchaseHistory, viewHistory);
    }
  }, [userPreferences, purchaseHistory, viewHistory]);

  // Query for content curation
  const { data: curationResult, isLoading } = useQuery({
    queryKey: ['content-curation', content.id],
    queryFn: () => unifiedAIService.curateContent(content),
    staleTime: updateInterval,
  });

  // Mutation for updating content
  const { mutate: updateContent } = useMutation({
    mutationFn: async (updatedContent: Look | Artist | Product) => {
      const result = await unifiedAIService.curateContent(updatedContent);
      return result;
    },
    onSuccess: (result) => {
      queryClient.setQueryData(['content-curation', content.id], result);
    },
  });

  // Auto-update content based on AI insights
  useEffect(() => {
    if (!autoUpdate || !curationResult) return;

    const timer = setInterval(async () => {
      const { score } = curationResult;
      
      // Check if content needs updating based on quality threshold
      if (score.overall < qualityThreshold) {
        const optimizedContent = await unifiedAIService.optimizeContentMetadata(content as Look);
        updateContent(optimizedContent);
      }
    }, updateInterval);

    return () => clearInterval(timer);
  }, [autoUpdate, curationResult, content, updateInterval, qualityThreshold]);

  // Get trending content suggestions
  const { data: trendingSuggestions } = useQuery({
    queryKey: ['trending-suggestions'],
    queryFn: () => unifiedAIService.suggestTrendingContent(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Get personalized recommendations if user context is available
  const { data: personalizedRecommendations } = useQuery({
    queryKey: ['personalized-recommendations', userPreferences?.skinType],
    queryFn: () => unifiedAIService.getPersonalizedRecommendations([content]),
    enabled: !!userPreferences,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    curationResult,
    isLoading,
    updateContent,
    trendingSuggestions,
    personalizedRecommendations,
  };
}

// Hook for batch processing content
export function useAIBatchContent(
  contents: (Look | Artist | Product)[],
  options: UseAIContentOptions = {}
) {
  const { data: batchResults, isLoading } = useQuery({
    queryKey: ['batch-curation', contents.map(c => c.id)],
    queryFn: () => unifiedAIService.batchProcessContent(contents),
    staleTime: options.updateInterval || 1000 * 60 * 60,
  });

  return {
    batchResults,
    isLoading,
  };
}
