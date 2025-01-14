import { useState, useEffect } from 'react';
import { BackgroundControls } from '../components/admin/BackgroundControls';
import { FluidBackground } from '../components/backgrounds/FluidBackground';
import { BackgroundPreset, BackgroundState } from '../components/backgrounds/types';

export default function TestBackgrounds() {
  const [backgroundState, setBackgroundState] = useState<BackgroundState>({
    currentPreset: {
      colorScheme: 'christmas', // It's Christmas Eve!
      animationStyle: 'ripple',
      speed: 0.7,
      intensity: 0.6,
      customParams: {
        rotationSpeed: 1.2,
        scaleAmount: 1.15,
        moveDistance: 30
      }
    },
    history: [],
    aiControl: {
      enabled: true,
      mode: 'assist',
      interval: 3600,
      rules: {
        timeOfDay: true,
        season: true,
        holiday: true,
        mood: false
      },
      preferences: {
        intensity: { min: 0.3, max: 0.8 },
        speed: { min: 0.5, max: 1.5 },
        transitions: 'smooth'
      }
    },
    lastUpdate: new Date()
  });

  const handlePresetChange = (preset: BackgroundPreset) => {
    setBackgroundState(prev => ({
      ...prev,
      currentPreset: preset,
      history: [...prev.history, prev.currentPreset].slice(-5),
      lastUpdate: new Date()
    }));
  };

  const handleExportPreset = () => {
    const dataStr = JSON.stringify(backgroundState.currentPreset, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `background-preset-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportPreset = (preset: BackgroundPreset) => {
    handlePresetChange(preset);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <FluidBackground {...backgroundState.currentPreset} />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Background Test Page</h1>
          
          {/* Current Theme Info */}
          <div className="mb-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Current Theme</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Theme: {backgroundState.currentPreset.colorScheme}</p>
                <p>Animation: {backgroundState.currentPreset.animationStyle}</p>
                <p>Speed: {backgroundState.currentPreset.speed.toFixed(2)}</p>
                <p>Intensity: {backgroundState.currentPreset.intensity.toFixed(2)}</p>
              </div>
              <div>
                <p>Last Update: {backgroundState.lastUpdate.toLocaleTimeString()}</p>
                <p>AI Mode: {backgroundState.aiControl.mode}</p>
                <p>Update Interval: {backgroundState.aiControl.interval / 60}min</p>
              </div>
            </div>
          </div>

          {/* Theme History */}
          {backgroundState.history.length > 0 && (
            <div className="mb-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Recent Themes</h2>
              <div className="space-y-2">
                {backgroundState.history.map((preset, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded p-2 cursor-pointer hover:bg-white/20"
                    onClick={() => handlePresetChange(preset)}
                  >
                    {preset.colorScheme} - {preset.animationStyle}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <BackgroundControls
        onPresetChange={handlePresetChange}
        onExportPreset={handleExportPreset}
        onImportPreset={handleImportPreset}
        currentPreset={backgroundState.currentPreset}
      />
    </div>
  );
}
