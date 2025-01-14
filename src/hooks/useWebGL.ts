import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { MakeupShader } from '@/shaders/makeup';
import { BlendingShader } from '@/shaders/blending';
import type { WebGLSettings } from '@/types/ar';

export const useWebGL = () => {
  const composerRef = useRef<EffectComposer | null>(null);
  const gpuComputeRef = useRef<GPUComputationRenderer | null>(null);

  const initWebGL = useCallback(async (
    canvas: HTMLCanvasElement,
    settings: WebGLSettings = {}
  ): Promise<THREE.WebGLRenderer> => {
    // Create renderer with optimized settings
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: settings.antialias ?? true,
      alpha: settings.alpha ?? true,
      preserveDrawingBuffer: settings.preserveDrawingBuffer ?? true,
      powerPreference: settings.powerPreference ?? 'high-performance',
      precision: settings.precision ?? 'highp',
      logarithmicDepthBuffer: settings.logarithmicDepthBuffer ?? true
    });

    // Enable advanced features
    renderer.capabilities.isWebGL2 && renderer.outputEncoding === THREE.sRGBEncoding;
    renderer.info.autoReset = false;
    renderer.setPixelRatio(window.devicePixelRatio);

    // Initialize GPU computation
    gpuComputeRef.current = new GPUComputationRenderer(
      1024,
      1024,
      renderer
    );

    // Create texture for makeup simulation
    const makeupTexture = gpuComputeRef.current.createTexture();
    const makeupVariable = gpuComputeRef.current.addVariable(
      'texturePosition',
      MakeupShader,
      makeupTexture
    );

    // Add dependencies
    gpuComputeRef.current.setVariableDependencies(makeupVariable, [makeupVariable]);

    // Initialize computation
    const error = gpuComputeRef.current.init();
    if (error !== null) {
      throw new Error(`GPUComputationRenderer error: ${error}`);
    }

    // Setup post-processing
    composerRef.current = new EffectComposer(renderer);

    // Add makeup shader pass
    const makeupPass = new ShaderPass(MakeupShader);
    makeupPass.uniforms['tDiffuse'].value = null;
    makeupPass.uniforms['opacity'].value = 1.0;
    composerRef.current.addPass(makeupPass);

    // Add blending shader pass
    const blendingPass = new ShaderPass(BlendingShader);
    blendingPass.uniforms['tDiffuse'].value = null;
    blendingPass.uniforms['blendMode'].value = 0;
    composerRef.current.addPass(blendingPass);

    // Setup memory management
    const disposeTextures = () => {
      renderer.renderLists.dispose();
      makeupTexture.dispose();
    };

    // Handle context loss
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      disposeTextures();
    }, false);

    // Handle context restoration
    renderer.domElement.addEventListener('webglcontextrestored', () => {
      initWebGL(canvas, settings);
    }, false);

    return renderer;
  }, []);

  const disposeWebGL = useCallback(() => {
    if (composerRef.current) {
      composerRef.current.dispose();
      composerRef.current = null;
    }

    if (gpuComputeRef.current) {
      gpuComputeRef.current.dispose();
      gpuComputeRef.current = null;
    }
  }, []);

  const updateUniforms = useCallback((uniforms: Record<string, any>) => {
    if (!composerRef.current) return;

    const passes = composerRef.current.passes;
    passes.forEach(pass => {
      if ('uniforms' in pass) {
        Object.entries(uniforms).forEach(([key, value]) => {
          if (key in pass.uniforms) {
            pass.uniforms[key].value = value;
          }
        });
      }
    });
  }, []);

  return {
    initWebGL,
    disposeWebGL,
    updateUniforms,
    composer: composerRef.current,
    gpuCompute: gpuComputeRef.current
  };
};
