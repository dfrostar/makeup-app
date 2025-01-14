import { PerformanceMetrics } from '../types';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: {
    contentQualitySum: number;
    contentQualityCount: number;
    recommendationAccuracySum: number;
    recommendationAccuracyCount: number;
    processingTimes: number[];
    cacheHits: number;
    cacheRequests: number;
    errors: number;
    totalOperations: number;
  };

  private constructor() {
    this.resetMetrics();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private resetMetrics() {
    this.metrics = {
      contentQualitySum: 0,
      contentQualityCount: 0,
      recommendationAccuracySum: 0,
      recommendationAccuracyCount: 0,
      processingTimes: [],
      cacheHits: 0,
      cacheRequests: 0,
      errors: 0,
      totalOperations: 0
    };
  }

  recordContentQuality(score: number) {
    this.metrics.contentQualitySum += score;
    this.metrics.contentQualityCount++;
  }

  recordRecommendationAccuracy(score: number) {
    this.metrics.recommendationAccuracySum += score;
    this.metrics.recommendationAccuracyCount++;
  }

  recordProcessingTime(milliseconds: number) {
    this.metrics.processingTimes.push(milliseconds);
  }

  recordCacheHit() {
    this.metrics.cacheHits++;
    this.metrics.cacheRequests++;
  }

  recordCacheMiss() {
    this.metrics.cacheRequests++;
  }

  recordError() {
    this.metrics.errors++;
    this.metrics.totalOperations++;
  }

  recordOperation() {
    this.metrics.totalOperations++;
  }

  getMetrics(): PerformanceMetrics {
    const avgProcessingTime = this.metrics.processingTimes.length > 0
      ? this.metrics.processingTimes.reduce((a, b) => a + b, 0) / this.metrics.processingTimes.length
      : 0;

    return {
      contentQuality: this.metrics.contentQualityCount > 0
        ? this.metrics.contentQualitySum / this.metrics.contentQualityCount
        : 0,
      recommendationAccuracy: this.metrics.recommendationAccuracyCount > 0
        ? this.metrics.recommendationAccuracySum / this.metrics.recommendationAccuracyCount
        : 0,
      processingTime: avgProcessingTime,
      cacheHitRate: this.metrics.cacheRequests > 0
        ? this.metrics.cacheHits / this.metrics.cacheRequests
        : 0,
      errorRate: this.metrics.totalOperations > 0
        ? this.metrics.errors / this.metrics.totalOperations
        : 0
    };
  }

  async measureOperationTime<T>(operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await operation();
      const end = performance.now();
      this.recordProcessingTime(end - start);
      this.recordOperation();
      return result;
    } catch (error) {
      this.recordError();
      throw error;
    }
  }
}
