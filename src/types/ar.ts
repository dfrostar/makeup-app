export interface FaceMeshData {
    vertices: number[];
    indices: number[];
    uvs: number[];
    normals: number[];
    landmarks: FaceLandmarks;
    confidence: number;
    timestamp: number;
}

export interface FaceLandmarks {
    // Face regions
    jawLine: Point[];
    leftEyebrow: Point[];
    rightEyebrow: Point[];
    noseBridge: Point[];
    noseTip: Point[];
    leftEye: Point[];
    rightEye: Point[];
    outerLips: Point[];
    innerLips: Point[];
    leftCheek: Point[];
    rightCheek: Point[];
    chin: Point[];
    
    // Additional points for makeup application
    foreheadCenter: Point;
    leftTemple: Point;
    rightTemple: Point;
    leftCheekbone: Point;
    rightCheekbone: Point;
    leftNostril: Point;
    rightNostril: Point;
    cupidsBow: Point;
}

export interface Point {
    x: number;
    y: number;
    z: number;
}

export interface ARRenderOptions {
    canvas: HTMLCanvasElement;
    face: FaceMeshData;
    product: {
        type: ProductType;
        texture?: string;
        color?: string;
        opacity?: number;
        blendMode?: BlendMode;
        blendAlgorithm?: BlendAlgorithm;
        adaptToSkin?: boolean;
        adaptToLighting?: boolean;
    };
    performance?: PerformanceMode;
    neuralNetwork?: ARNeuralNetworkConfig;
    skinAnalysis?: SkinAnalysis;
    expression?: FacialExpression;
    tracking?: FaceTracking;
}

export type ProductType =
    | 'foundation'
    | 'concealer'
    | 'blush'
    | 'bronzer'
    | 'highlighter'
    | 'eyeshadow'
    | 'eyeliner'
    | 'mascara'
    | 'lipstick'
    | 'lipliner';

export type BlendMode =
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color'
    | 'luminosity';

export type BlendAlgorithm = 
    | 'foundation'
    | 'concealer'
    | 'blush'
    | 'bronzer'
    | 'highlighter'
    | 'eyeshadow'
    | 'eyeliner'
    | 'mascara'
    | 'lipstick';

export type PerformanceMode = 'low' | 'medium' | 'high';

export interface ProductTexture {
    url: string;
    type: ProductType;
    blendMode: BlendMode;
    opacity: number;
}

export interface ARError {
    code: string;
    message: string;
    details?: unknown;
}

export interface FaceDetectionResult {
    face: FaceMeshData | null;
    error: ARError | null;
    confidence: number;
}

export interface ARContext {
    isSupported: boolean;
    isInitialized: boolean;
    error: ARError | null;
    initialize: () => Promise<void>;
    startTracking: () => Promise<void>;
    stopTracking: () => void;
    takeSnapshot: () => Promise<string>;
}

export interface ProductRenderContext {
    renderProduct: (options: ProductRenderOptions) => void;
    error: ARError | null;
}

export interface ProductRenderOptions {
    ctx: CanvasRenderingContext2D;
    product: Product;
    landmarks: FaceLandmarks;
    color?: string | null;
    opacity?: number;
}

export interface ARStats {
    fps: number;
    latency: number;
    confidence: number;
    lastUpdate: number;
}

export interface ARSettings {
    performance: 'low' | 'medium' | 'high';
    enableHighAccuracy: boolean;
    smoothingFactor: number;
    minConfidence: number;
    maxFaces: number;
}

export interface CameraSettings {
    facingMode: 'user' | 'environment';
    resolution: {
        width: number;
        height: number;
    };
    frameRate: number;
}

export interface MeshTransition {
    previousMesh: FaceMeshData | null;
    currentMesh: FaceMeshData;
    progress: number;
    duration: number;
    startTime: number;
}

export interface LogEntry {
    timestamp: number;
    level: 'debug' | 'info' | 'warn' | 'error';
    component: string;
    message: string;
    data?: unknown;
}

export interface ARLogger {
    debug: (component: string, message: string, data?: unknown) => void;
    info: (component: string, message: string, data?: unknown) => void;
    warn: (component: string, message: string, data?: unknown) => void;
    error: (component: string, message: string, data?: unknown) => void;
    getLogs: (level?: LogEntry['level']) => LogEntry[];
}

export interface SkinAnalysis {
    skinTone: {
        value: number;  // 0-100 scale
        undertone: 'warm' | 'cool' | 'neutral';
        confidence: number;
    };
    skinType: {
        type: 'dry' | 'oily' | 'combination' | 'normal';
        regions: {
            tZone: 'dry' | 'oily' | 'normal';
            cheeks: 'dry' | 'oily' | 'normal';
            chin: 'dry' | 'oily' | 'normal';
        };
        confidence: number;
    };
    texture: {
        pores: number;  // 0-1 scale
        smoothness: number;
        spots: Array<{
            type: 'acne' | 'darkSpot' | 'scar';
            position: Point;
            size: number;
        }>;
    };
    lighting: {
        intensity: number;
        direction: Point;
        colorTemperature: number;  // in Kelvin
        quality: 'poor' | 'fair' | 'good' | 'excellent';
    };
}

export interface FacialExpression {
    base: 'neutral' | 'smile' | 'open' | 'surprised' | 'squint';
    intensity: number;
    asymmetry: number;
    confidence: number;
}

export interface FaceTracking {
    pose: {
        rotation: {
            pitch: number;  // up/down
            yaw: number;    // left/right
            roll: number;   // tilt
        };
        translation: Point;
        confidence: number;
    };
    stability: {
        score: number;
        jitter: number;
        lastStableFrame: number;
    };
    occlusion: {
        leftEye: number;
        rightEye: number;
        nose: number;
        mouth: number;
        chin: number;
    };
}

export interface ARNeuralNetworkConfig {
    models: {
        faceDetection: {
            type: 'lightweight' | 'full' | 'enhanced';
            confidence: number;
            maxFaces: number;
        };
        skinAnalysis: {
            enabled: boolean;
            updateInterval: number;  // in ms
        };
        expressionDetection: {
            enabled: boolean;
            sensitivity: number;
        };
    };
    performance: {
        gpuAcceleration: boolean;
        powerEfficiency: boolean;
        thermalManagement: boolean;
    };
    optimization: {
        batchProcessing: boolean;
        tensorCaching: boolean;
        quantization: 'none' | 'float16' | 'int8';
    };
}

export interface WebGLSettings {
    antialias?: boolean;
    alpha?: boolean;
    preserveDrawingBuffer?: boolean;
    powerPreference?: 'high-performance' | 'low-power' | 'default';
    precision?: 'highp' | 'mediump' | 'lowp';
    logarithmicDepthBuffer?: boolean;
}

export interface TexturePoolConfig {
    maxSize: number;
    preloadThreshold: number;
    disposeThreshold: number;
    maxTextureSize: number;
}

export interface MonitoringOptions {
    fps: boolean;
    memory: boolean;
    gpu: boolean;
    sampleSize: number;
    warningThresholds: {
        fps: number;
        memory: number;
        gpu: number;
    };
}

export interface PerformanceStats {
    fps: number;
    frameTime: number;
    memory: number;
    gpuMemory: number;
    warnings: PerformanceWarning[];
}

export interface PerformanceWarning {
    type: 'fps' | 'memory' | 'gpu' | 'trend';
    message: string;
    value: number;
}

export interface RenderStats {
    fps: number;
    frameTime: number;
    gpuMemory: number;
}

export interface ColorCalibrationResult {
  whiteBalance: Float32Array;
  lightingCompensation: Float32Array;
  colorAccuracy: number;
}

export interface ProductData {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  price: number;
  defaultColor: string;
  colors: string[];
  texture?: string;
  blendMode?: BlendMode;
  opacity?: number;
}

export interface FaceMeshConfig {
  maxFaces: number;
  refineLandmarks: boolean;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}
