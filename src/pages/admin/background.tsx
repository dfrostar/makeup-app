import { useState } from 'react';
import { BackgroundControls } from '../../components/admin/BackgroundControls';
import { FluidBackground } from '../../components/backgrounds/FluidBackground';

interface BackgroundPreset {
  name: string;
  colorScheme: string;
  speed: string;
  animationStyle: string;
  intensity: number;
  blur: number;
}

export default function BackgroundAdmin() {
  const [savedPresets, setSavedPresets] = useState<BackgroundPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<BackgroundPreset | null>(null);

  const handleSavePreset = (preset: BackgroundPreset) => {
    setSavedPresets(prev => [...prev, preset]);
  };

  const handleLoadPreset = (preset: BackgroundPreset) => {
    setSelectedPreset(preset);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Preview */}
      {selectedPreset && <FluidBackground {...selectedPreset} />}

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls */}
          <div>
            <BackgroundControls
              onPresetSave={handleSavePreset}
              onPresetLoad={handleLoadPreset}
            />
          </div>

          {/* Saved Presets */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Saved Presets</h2>
            <div className="space-y-4">
              {savedPresets.map((preset, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 
                    transition-colors cursor-pointer"
                  onClick={() => handleLoadPreset(preset)}
                >
                  <div>
                    <h3 className="text-white font-medium">{preset.name}</h3>
                    <p className="text-white/70 text-sm">
                      {preset.colorScheme} • {preset.animationStyle} • {preset.speed}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedPresets(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 
                      hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}

              {savedPresets.length === 0 && (
                <div className="text-center py-8 text-white/50">
                  No presets saved yet. Create one using the controls!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
