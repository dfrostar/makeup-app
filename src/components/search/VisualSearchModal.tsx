import React, { useState, useRef } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<void>;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 5242880, // 5MB
    onDrop: handleImageDrop
  });

  async function handleImageDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsLoading(true);
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append('image', file);

      // Send to visual search API
      const response = await fetch('/api/search/visual', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Visual search failed');
      }

      const { searchQuery } = await response.json();
      await onSearch(searchQuery);
      onClose();
    } catch (error) {
      console.error('Visual search error:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      // TODO: Show error toast
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function captureImage() {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      await handleImageDrop([file]);
    }, 'image/jpeg', 0.8);

    stopCamera();
  }

  function handleClose() {
    stopCamera();
    setPreview(null);
    onClose();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Visual Search</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClose}
            className="hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Preview or Video Feed */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Camera Capture */}
            <Button
              onClick={preview ? captureImage : startCamera}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>{preview ? 'Recapture' : 'Take Photo'}</span>
            </Button>

            {/* File Upload */}
            <div {...getRootProps()}>
              <Button
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
              </Button>
              <input {...getInputProps()} />
            </div>
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-500 text-center">
            Take a photo or upload an image to search for similar products
          </p>
        </div>
      </div>
    </Dialog>
  );
};
