import React, { useEffect, useRef, useState } from 'react';
import { useWebGL } from '@/hooks/useWebGL';
import { useFaceMesh } from '@/hooks/useFaceMesh';
import { useTexturePool } from '@/hooks/useTexturePool';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Canvas } from '@/components/ar/Canvas';
import { Controls } from '@/components/ar/Controls';
import { ProductList } from '@/components/ar/ProductList';
import { SecurityProvider } from '@/providers/SecurityProvider';
import { MakeupShader } from '@/shaders/makeup';
import type { Product, FaceMeshData, RenderStats } from '@/types/ar';

interface EnhancedVirtualMirrorProps {
  products: Product[];
  onCapture?: (image: Blob) => void;
  onProductSelect?: (product: Product) => void;
  onError?: (error: Error) => void;
}

export const EnhancedVirtualMirror: React.FC<EnhancedVirtualMirrorProps> = ({
  products,
  onCapture,
  onProductSelect,
  onError
}) => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [calibrationStatus, setCalibrationStatus] = useState<'pending' | 'complete' | 'failed'>('pending');
  const [renderStats, setRenderStats] = useState<RenderStats>({
    fps: 0,
    frameTime: 0,
    gpuMemory: 0
  });

  // Custom hooks
  const { initWebGL, disposeWebGL } = useWebGL();
  const { 
    faceMesh,
    landmarks,
    startTracking,
    stopTracking 
  } = useFaceMesh({
    maxFaces: 4,
    refineLandmarks: true,
    minDetectionConfidence: 0.8
  });
  const { 
    getTexture,
    releaseTexture,
    preloadTextures 
  } = useTexturePool();
  const { 
    startMonitoring,
    stopMonitoring,
    stats 
  } = usePerformanceMonitor();

  // Initialize WebGL and start face tracking
  useEffect(() => {
    async function initialize() {
      try {
        if (!canvasRef.current || !videoRef.current) return;

        // Initialize WebGL with optimized settings
        rendererRef.current = await initWebGL(canvasRef.current, {
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance'
        });

        // Start face tracking
        await startTracking(videoRef.current);

        // Preload product textures
        await preloadTextures(products.map(p => p.textureUrl));

        // Start performance monitoring
        startMonitoring({
          fps: true,
          memory: true,
          gpu: true
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        onError?.(error instanceof Error ? error : new Error('Failed to initialize AR'));
      }
    }

    initialize();

    return () => {
      stopTracking();
      stopMonitoring();
      disposeWebGL();
    };
  }, []);

  // Handle product selection
  useEffect(() => {
    if (!selectedProduct) return;

    async function updateMakeup() {
      try {
        // Get product texture
        const texture = await getTexture(selectedProduct.textureUrl);

        // Update shader uniforms
        if (rendererRef.current) {
          const material = rendererRef.current.materials.get('makeup');
          if (material) {
            material.uniforms.makeupTexture.value = texture;
            material.uniforms.makeupColor.value.setHex(selectedProduct.color);
            material.uniforms.opacity.value = selectedProduct.opacity;
            material.uniforms.blendMode.value = selectedProduct.blendMode;
          }
        }
      } catch (error) {
        console.error('Makeup update error:', error);
        onError?.(error instanceof Error ? error : new Error('Failed to update makeup'));
      }
    }

    updateMakeup();
  }, [selectedProduct]);

  // Handle face mesh updates
  useEffect(() => {
    if (!landmarks) return;

    // Update face mesh geometry
    updateGeometry(landmarks);

    // Update calibration status
    if (calibrationStatus === 'pending' && isValidCalibration(landmarks)) {
      setCalibrationStatus('complete');
    }
  }, [landmarks]);

  // Render loop
  useEffect(() => {
    if (!isInitialized || !rendererRef.current) return;

    let animationFrame: number;

    const render = () => {
      animationFrame = requestAnimationFrame(render);

      // Update physics simulation
      updatePhysics();

      // Render frame
      rendererRef.current?.render();

      // Update stats
      setRenderStats({
        fps: stats.fps,
        frameTime: stats.frameTime,
        gpuMemory: stats.gpuMemory
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInitialized]);

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    onProductSelect?.(product);
  };

  // Handle image capture
  const handleCapture = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.95);
      });

      onCapture?.(blob);
    } catch (error) {
      console.error('Capture error:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to capture image'));
    }
  };

  return (
    <SecurityProvider>
      <div className="relative w-full h-full">
        {/* Video Feed (hidden) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
        />

        {/* AR Canvas */}
        <Canvas
          ref={canvasRef}
          className="w-full h-full"
          stats={renderStats}
        />

        {/* Controls */}
        <Controls
          onCapture={handleCapture}
          calibrationStatus={calibrationStatus}
          stats={renderStats}
        />

        {/* Product Selection */}
        <ProductList
          products={products}
          selectedProduct={selectedProduct}
          onSelect={handleProductSelect}
        />

        {/* Loading State */}
        {!isInitialized && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
              <p>Initializing AR...</p>
            </div>
          </div>
        )}

        {/* Calibration Guide */}
        {calibrationStatus === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/75 text-white p-4 rounded-lg">
              <p>Please position your face in the center of the frame</p>
            </div>
          </div>
        )}
      </div>
    </SecurityProvider>
  );
};
