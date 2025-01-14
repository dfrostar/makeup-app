import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { unifiedAIService } from '../services/ai/unifiedAIService';
import { contentManager } from '../services/ai/contentManagement';
import type { Product, UserPreferences } from '../types';

interface UseUnifiedRecommendationsProps {
  userPreferences: UserPreferences;
  recentlyViewed: Product[];
  purchaseHistory: Product[];
}

interface RecommendationResult {
  personalizedRecommendations: Product[];
  trendingProducts: Product[];
  similarProducts: Product[];
  qualityScores: Record<string, number>;
  insights: Record<string, string[]>;
}

export function useUnifiedRecommendations({
  userPreferences,
  recentlyViewed,
  purchaseHistory,
}: UseUnifiedRecommendationsProps) {
  // Set up user context in unified service
  useEffect(() => {
    unifiedAIService.setUserContext(userPreferences, purchaseHistory, recentlyViewed);
  }, [userPreferences, purchaseHistory, recentlyViewed]);

  // Get personalized recommendations
  const { data: personalizedData, isLoading: personalizedLoading } = useQuery({
    queryKey: ['personalized-recommendations', userPreferences],
    queryFn: () => unifiedAIService.getPersonalizedRecommendations(recentlyViewed),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Get trending products
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => unifiedAIService.getTrendingProducts(recentlyViewed),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Get similar products based on recently viewed
  const { data: similarData, isLoading: similarLoading } = useQuery({
    queryKey: ['similar-products', recentlyViewed[0]?.id],
    queryFn: () => 
      recentlyViewed[0]
        ? unifiedAIService.getPersonalizedRecommendations([recentlyViewed[0]])
        : Promise.resolve([]),
    enabled: recentlyViewed.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Get quality metrics for all recommendations
  const { data: qualityData, isLoading: qualityLoading } = useQuery({
    queryKey: ['quality-metrics', personalizedData, trendingData, similarData],
    queryFn: async () => {
      const allProducts = [
        ...(personalizedData || []),
        ...(trendingData || []),
        ...(similarData || []),
      ];
      
      const qualityReports = await Promise.all(
        allProducts.map(product => contentManager.getContentQualityReport(product))
      );
      
      const scores: Record<string, number> = {};
      const productInsights: Record<string, string[]> = {};
      
      qualityReports.forEach(report => {
        scores[report.content.id] = report.qualityScore;
        productInsights[report.content.id] = report.recommendations;
      });
      
      return { scores, insights: productInsights };
    },
    enabled: !!(personalizedData || trendingData || similarData),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const isLoading = 
    personalizedLoading || 
    trendingLoading || 
    similarLoading || 
    qualityLoading;

  const error = null; // Add error handling as needed

  return {
    personalizedRecommendations: personalizedData || [],
    trendingProducts: trendingData || [],
    similarProducts: similarData || [],
    qualityScores: qualityData?.scores || {},
    insights: qualityData?.insights || {},
    isLoading,
    error,
  };
}
