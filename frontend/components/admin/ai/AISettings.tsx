import { useState, useEffect } from 'react';
import { UnifiedAIService } from '@/lib/ai/UnifiedAIService';
import { AISettings as AISettingsType } from '@/lib/ai/types';

export default function AISettings() {
  const [settings, setSettings] = useState<AISettingsType>({
    contentQuality: {
      minQualityScore: 0.7,
      minEngagementScore: 0.6,
      autoOptimize: true,
    },
    search: {
      textualRelevanceWeight: 0.3,
      visualSimilarityWeight: 0.2,
      userPreferenceWeight: 0.2,
      trendAlignmentWeight: 0.15,
      qualityScoreWeight: 0.15,
    },
    performance: {
      cacheLifetime: 3600,
      batchSize: 10,
      maxConcurrentRequests: 5,
    },
    monitoring: {
      errorThreshold: 0.05,
      performanceAlertThreshold: 1000,
      enableDetailedLogging: true,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const aiService = UnifiedAIService.getInstance();
      const currentSettings = await aiService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading AI settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const aiService = UnifiedAIService.getInstance();
      await aiService.updateSettings(settings);
    } catch (error) {
      console.error('Error saving AI settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Content Quality Settings */}
      <section>
        <h3 className="text-lg font-medium mb-4">Content Quality</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Quality Score
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.contentQuality.minQualityScore}
              onChange={(e) => setSettings({
                ...settings,
                contentQuality: {
                  ...settings.contentQuality,
                  minQualityScore: parseFloat(e.target.value),
                },
              })}
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {(settings.contentQuality.minQualityScore * 100).toFixed(0)}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Engagement Score
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.contentQuality.minEngagementScore}
              onChange={(e) => setSettings({
                ...settings,
                contentQuality: {
                  ...settings.contentQuality,
                  minEngagementScore: parseFloat(e.target.value),
                },
              })}
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {(settings.contentQuality.minEngagementScore * 100).toFixed(0)}%
            </div>
          </div>

          <div className="col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.contentQuality.autoOptimize}
                onChange={(e) => setSettings({
                  ...settings,
                  contentQuality: {
                    ...settings.contentQuality,
                    autoOptimize: e.target.checked,
                  },
                })}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Auto-optimize low-quality content
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Search Ranking Weights */}
      <section>
        <h3 className="text-lg font-medium mb-4">Search Ranking Weights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.search).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={value}
                onChange={(e) => setSettings({
                  ...settings,
                  search: {
                    ...settings.search,
                    [key]: parseFloat(e.target.value),
                  },
                })}
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                {(value * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Settings */}
      <section>
        <h3 className="text-lg font-medium mb-4">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cache Lifetime (seconds)
            </label>
            <input
              type="number"
              value={settings.performance.cacheLifetime}
              onChange={(e) => setSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  cacheLifetime: parseInt(e.target.value),
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Batch Size
            </label>
            <input
              type="number"
              value={settings.performance.batchSize}
              onChange={(e) => setSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  batchSize: parseInt(e.target.value),
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Concurrent Requests
            </label>
            <input
              type="number"
              value={settings.performance.maxConcurrentRequests}
              onChange={(e) => setSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  maxConcurrentRequests: parseInt(e.target.value),
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Monitoring Settings */}
      <section>
        <h3 className="text-lg font-medium mb-4">Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Error Threshold
            </label>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={settings.monitoring.errorThreshold}
              onChange={(e) => setSettings({
                ...settings,
                monitoring: {
                  ...settings.monitoring,
                  errorThreshold: parseFloat(e.target.value),
                },
              })}
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {(settings.monitoring.errorThreshold * 100).toFixed(1)}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Performance Alert Threshold (ms)
            </label>
            <input
              type="number"
              value={settings.monitoring.performanceAlertThreshold}
              onChange={(e) => setSettings({
                ...settings,
                monitoring: {
                  ...settings.monitoring,
                  performanceAlertThreshold: parseInt(e.target.value),
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.monitoring.enableDetailedLogging}
                onChange={(e) => setSettings({
                  ...settings,
                  monitoring: {
                    ...settings.monitoring,
                    enableDetailedLogging: e.target.checked,
                  },
                })}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable Detailed Logging
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={`
            px-4 py-2 rounded-md text-white font-medium
            ${isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
