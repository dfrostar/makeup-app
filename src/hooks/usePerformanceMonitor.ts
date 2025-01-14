import { useCallback, useRef, useState, useEffect } from 'react';
import Stats from 'stats.js';
import { GPUStatsPanel } from '@/utils/gpu-stats';
import type { PerformanceStats, MonitoringOptions } from '@/types/ar';

const DEFAULT_OPTIONS: MonitoringOptions = {
  fps: true,
  memory: true,
  gpu: true,
  sampleSize: 60, // 1 second at 60fps
  warningThresholds: {
    fps: 30,
    memory: 0.8, // 80% of available memory
    gpu: 0.9 // 90% of GPU memory
  }
};

export const usePerformanceMonitor = (options: Partial<MonitoringOptions> = {}) => {
  // Merge options with defaults
  const monitorOptions = { ...DEFAULT_OPTIONS, ...options };

  // Stats instances
  const statsRef = useRef<Stats | null>(null);
  const gpuStatsRef = useRef<GPUStatsPanel | null>(null);

  // Performance metrics
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    memory: 0,
    gpuMemory: 0,
    warnings: []
  });

  // Metrics history for trending
  const metricsHistory = useRef<PerformanceStats[]>([]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    // Initialize stats.js
    if (!statsRef.current) {
      statsRef.current = new Stats();
      statsRef.current.showPanel(0); // 0: fps, 1: ms, 2: mb
      
      // Add GPU panel if supported
      if (monitorOptions.gpu && 'performance' in window) {
        gpuStatsRef.current = new GPUStatsPanel();
        statsRef.current.addPanel(gpuStatsRef.current);
      }
    }

    // Start RAF loop
    let frameId: number;
    const update = () => {
      frameId = requestAnimationFrame(update);

      if (statsRef.current) {
        statsRef.current.update();

        // Get current metrics
        const currentStats: PerformanceStats = {
          fps: statsRef.current.getFPS(),
          frameTime: statsRef.current.getMS(),
          memory: statsRef.current.getMemory(),
          gpuMemory: gpuStatsRef.current?.getGPUMemory() ?? 0,
          warnings: []
        };

        // Check thresholds and add warnings
        if (currentStats.fps < monitorOptions.warningThresholds.fps) {
          currentStats.warnings.push({
            type: 'fps',
            message: `Low FPS: ${currentStats.fps.toFixed(1)}`,
            value: currentStats.fps
          });
        }

        if (currentStats.memory / performance.memory.jsHeapSizeLimit > monitorOptions.warningThresholds.memory) {
          currentStats.warnings.push({
            type: 'memory',
            message: `High memory usage: ${(currentStats.memory / 1024 / 1024).toFixed(1)} MB`,
            value: currentStats.memory
          });
        }

        if (currentStats.gpuMemory > monitorOptions.warningThresholds.gpu) {
          currentStats.warnings.push({
            type: 'gpu',
            message: `High GPU memory usage: ${(currentStats.gpuMemory * 100).toFixed(1)}%`,
            value: currentStats.gpuMemory
          });
        }

        // Update metrics history
        metricsHistory.current.push(currentStats);
        if (metricsHistory.current.length > monitorOptions.sampleSize) {
          metricsHistory.current.shift();
        }

        // Calculate trends
        if (metricsHistory.current.length >= monitorOptions.sampleSize) {
          const trends = calculateTrends(metricsHistory.current);
          if (trends.fpsDecreasing) {
            currentStats.warnings.push({
              type: 'trend',
              message: 'FPS is trending downward',
              value: trends.fpsSlope
            });
          }
        }

        setStats(currentStats);
      }
    };

    update();

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [monitorOptions]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (statsRef.current) {
      statsRef.current.end();
      statsRef.current = null;
    }
    if (gpuStatsRef.current) {
      gpuStatsRef.current.dispose();
      gpuStatsRef.current = null;
    }
    metricsHistory.current = [];
  }, []);

  // Calculate performance trends
  const calculateTrends = (history: PerformanceStats[]) => {
    const n = history.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    history.forEach((stats, i) => {
      sumX += i;
      sumY += stats.fps;
      sumXY += i * stats.fps;
      sumXX += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const fpsDecreasing = slope < -1; // Threshold for significant decrease

    return {
      fpsSlope: slope,
      fpsDecreasing
    };
  };

  // Get performance recommendations
  const getRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    const currentStats = stats;

    if (currentStats.fps < monitorOptions.warningThresholds.fps) {
      recommendations.push(
        'Consider reducing visual effects or polygon count',
        'Enable texture compression',
        'Implement level-of-detail (LOD) system'
      );
    }

    if (currentStats.memory / performance.memory.jsHeapSizeLimit > monitorOptions.warningThresholds.memory) {
      recommendations.push(
        'Implement texture pooling',
        'Dispose unused resources',
        'Reduce texture sizes'
      );
    }

    if (currentStats.gpuMemory > monitorOptions.warningThresholds.gpu) {
      recommendations.push(
        'Optimize shader complexity',
        'Reduce render target resolution',
        'Implement frustum culling'
      );
    }

    return recommendations;
  }, [stats, monitorOptions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  return {
    stats,
    startMonitoring,
    stopMonitoring,
    getRecommendations,
    metricsHistory: metricsHistory.current
  };
};
