import { useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { LRUCache } from '@/utils/lru-cache';
import type { TexturePoolConfig } from '@/types/ar';

interface TextureEntry {
  texture: THREE.Texture;
  lastUsed: number;
  refCount: number;
}

const DEFAULT_CONFIG: TexturePoolConfig = {
  maxSize: 50,
  preloadThreshold: 0.7,
  disposeThreshold: 0.9,
  maxTextureSize: 2048
};

export const useTexturePool = (config: Partial<TexturePoolConfig> = {}) => {
  // Merge config with defaults
  const poolConfig = { ...DEFAULT_CONFIG, ...config };

  // Texture pool using LRU cache
  const texturePool = useRef(new LRUCache<string, TextureEntry>(poolConfig.maxSize));
  
  // Texture loader with loading manager
  const loadingManager = useRef(new THREE.LoadingManager());
  const textureLoader = useRef(new THREE.TextureLoader(loadingManager.current));

  // Memory tracking
  const totalMemoryUsage = useRef(0);

  // Initialize loading manager
  useEffect(() => {
    loadingManager.current.onProgress = (url, loaded, total) => {
      // Track loading progress
      const progress = loaded / total;
      
      // Check memory thresholds
      if (progress > poolConfig.preloadThreshold) {
        cleanupUnusedTextures();
      }
    };

    return () => {
      // Cleanup all textures on unmount
      disposeAllTextures();
    };
  }, []);

  // Get or load texture
  const getTexture = useCallback(async (url: string): Promise<THREE.Texture> => {
    // Check if texture exists in pool
    const entry = texturePool.current.get(url);
    if (entry) {
      entry.lastUsed = Date.now();
      entry.refCount++;
      return entry.texture;
    }

    // Load new texture
    try {
      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.current.load(
          url,
          (texture) => {
            // Optimize texture
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = 16;

            // Resize if needed
            if (texture.image) {
              const { width, height } = texture.image;
              if (width > poolConfig.maxTextureSize || height > poolConfig.maxTextureSize) {
                const scale = poolConfig.maxTextureSize / Math.max(width, height);
                texture.image.width *= scale;
                texture.image.height *= scale;
                texture.needsUpdate = true;
              }
            }

            resolve(texture);
          },
          undefined,
          reject
        );
      });

      // Add to pool
      const memoryUsage = estimateTextureMemory(texture);
      if (totalMemoryUsage.current + memoryUsage > poolConfig.disposeThreshold) {
        cleanupUnusedTextures();
      }

      texturePool.current.set(url, {
        texture,
        lastUsed: Date.now(),
        refCount: 1
      });

      totalMemoryUsage.current += memoryUsage;
      return texture;
    } catch (error) {
      console.error('Texture loading error:', error);
      throw error;
    }
  }, []);

  // Release texture
  const releaseTexture = useCallback((url: string) => {
    const entry = texturePool.current.get(url);
    if (entry) {
      entry.refCount--;
      if (entry.refCount <= 0) {
        const memoryUsage = estimateTextureMemory(entry.texture);
        totalMemoryUsage.current -= memoryUsage;
        
        entry.texture.dispose();
        texturePool.current.delete(url);
      }
    }
  }, []);

  // Preload textures
  const preloadTextures = useCallback(async (urls: string[]) => {
    const promises = urls.map(url => getTexture(url));
    return Promise.all(promises);
  }, [getTexture]);

  // Cleanup unused textures
  const cleanupUnusedTextures = useCallback(() => {
    const now = Date.now();
    const entries = Array.from(texturePool.current.entries());
    
    entries
      .filter(([_, entry]) => entry.refCount <= 0)
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed)
      .forEach(([url, entry]) => {
        if (now - entry.lastUsed > 60000) { // 1 minute threshold
          releaseTexture(url);
        }
      });
  }, [releaseTexture]);

  // Dispose all textures
  const disposeAllTextures = useCallback(() => {
    texturePool.current.forEach((entry) => {
      entry.texture.dispose();
    });
    texturePool.current.clear();
    totalMemoryUsage.current = 0;
  }, []);

  // Estimate texture memory usage
  const estimateTextureMemory = (texture: THREE.Texture): number => {
    if (!texture.image) return 0;
    
    const { width, height } = texture.image;
    const bytesPerPixel = 4; // RGBA
    return width * height * bytesPerPixel;
  };

  return {
    getTexture,
    releaseTexture,
    preloadTextures,
    cleanupUnusedTextures,
    disposeAllTextures,
    totalMemoryUsage: totalMemoryUsage.current
  };
};
