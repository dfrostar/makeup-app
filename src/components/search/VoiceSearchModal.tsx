import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Microphone, X } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: string;
  isListening: boolean;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  transcript,
  isListening
}) => {
  const [visualizer, setVisualizer] = useState<CanvasRenderingContext2D | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let source: MediaStreamAudioSourceNode | null = null;

    const setupAudio = async () => {
      if (!isListening) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        source.connect(analyser);
        setAudioData(dataArray);
        
        // Start visualization
        animate();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    const animate = () => {
      if (!analyser || !dataArray || !visualizer) return;

      const frame = requestAnimationFrame(animate);
      setAnimationFrame(frame);

      analyser.getByteFrequencyData(dataArray);
      drawVisualization(dataArray);
    };

    if (isOpen && isListening) {
      setupAudio();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (audioContext) {
        audioContext.close();
      }
      if (source) {
        source.disconnect();
      }
    };
  }, [isOpen, isListening, visualizer]);

  const drawVisualization = (dataArray: Uint8Array) => {
    if (!visualizer) return;

    const canvas = visualizer.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / dataArray.length;

    visualizer.clearRect(0, 0, width, height);
    visualizer.fillStyle = 'rgb(249, 168, 212)'; // pink-300

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      const x = i * barWidth;
      const y = height - barHeight;

      visualizer.fillRect(x, y, barWidth - 1, barHeight);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Voice Search</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Microphone Animation */}
          <div className="flex justify-center">
            <div
              className={`
                p-4 rounded-full
                ${isListening 
                  ? 'bg-pink-100 animate-pulse' 
                  : 'bg-gray-100'
                }
              `}
            >
              <Microphone 
                className={`
                  h-8 w-8
                  ${isListening ? 'text-pink-500' : 'text-gray-400'}
                `}
              />
            </div>
          </div>

          {/* Audio Visualizer */}
          <canvas
            ref={(canvas) => {
              if (canvas) {
                setVisualizer(canvas.getContext('2d'));
              }
            }}
            width={320}
            height={60}
            className="w-full rounded-lg bg-gray-50"
          />

          {/* Transcript */}
          <div className="min-h-[60px] p-3 rounded-lg bg-gray-50">
            <p className="text-gray-600">
              {transcript || 'Listening...'}
            </p>
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-500 text-center">
            {isListening
              ? 'Speak now...'
              : 'Click the microphone to start speaking'
            }
          </p>
        </div>
      </div>
    </Dialog>
  );
};
