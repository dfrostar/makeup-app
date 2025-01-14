import { useCallback, useEffect, useRef, useState } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import { FaceMeshData, FaceLandmarks, Point, ARError } from '@/types/ar';

interface FaceMeshOptions {
  maxFaces?: number;
  refineLandmarks?: boolean;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

const DEFAULT_OPTIONS: Required<FaceMeshOptions> = {
  maxFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
};

export const useFaceMesh = (options: FaceMeshOptions = {}) => {
  // Merge options with defaults
  const meshOptions = { ...DEFAULT_OPTIONS, ...options };

  // State and refs
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<ARError | null>(null);
  const [landmarks, setLandmarks] = useState<FaceMeshData | null>(null);
  
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Initialize face detector
  const initialize = useCallback(async () => {
    try {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detector = await faceLandmarksDetection.createDetector(model, {
        runtime: 'tfjs',
        refineLandmarks: meshOptions.refineLandmarks,
        maxFaces: meshOptions.maxFaces,
        detectorConfidence: meshOptions.minDetectionConfidence,
        trackingConfidence: meshOptions.minTrackingConfidence
      });

      detectorRef.current = detector;
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const error: ARError = {
        code: 'INITIALIZATION_ERROR',
        message: 'Failed to initialize face detector',
        details: err
      };
      setError(error);
      console.error('Face detector initialization error:', err);
    }
  }, [meshOptions]);

  // Start face tracking
  const startTracking = useCallback(async (video: HTMLVideoElement) => {
    if (!detectorRef.current) {
      await initialize();
    }

    videoRef.current = video;
    
    const detect = async (timestamp: number) => {
      if (!detectorRef.current || !videoRef.current) return;

      try {
        // Throttle detection based on device capabilities
        const elapsed = timestamp - lastFrameTimeRef.current;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        if (elapsed < frameInterval) {
          animationFrameRef.current = requestAnimationFrame(detect);
          return;
        }

        // Perform face detection
        const faces = await detectorRef.current.estimateFaces(videoRef.current, {
          flipHorizontal: false
        });

        if (faces.length > 0) {
          // Convert to our FaceMeshData format
          const meshData = convertToFaceMeshData(faces[0]);
          setLandmarks(meshData);
          setError(null);
        } else {
          setLandmarks(null);
        }

        lastFrameTimeRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(detect);
      } catch (err) {
        const error: ARError = {
          code: 'DETECTION_ERROR',
          message: 'Face detection failed',
          details: err
        };
        setError(error);
        console.error('Face detection error:', err);
      }
    };

    animationFrameRef.current = requestAnimationFrame(detect);
  }, [initialize]);

  // Stop face tracking
  const stopTracking = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    videoRef.current = null;
    setLandmarks(null);
  }, []);

  // Convert TensorFlow.js face data to our format
  const convertToFaceMeshData = (face: faceLandmarksDetection.Face): FaceMeshData => {
    const landmarks: FaceLandmarks = {
      jawLine: face.keypoints.slice(0, 17).map(toPoint),
      leftEyebrow: face.keypoints.slice(17, 22).map(toPoint),
      rightEyebrow: face.keypoints.slice(22, 27).map(toPoint),
      noseBridge: face.keypoints.slice(27, 31).map(toPoint),
      noseTip: face.keypoints.slice(31, 36).map(toPoint),
      leftEye: face.keypoints.slice(36, 42).map(toPoint),
      rightEye: face.keypoints.slice(42, 48).map(toPoint),
      outerLips: face.keypoints.slice(48, 60).map(toPoint),
      innerLips: face.keypoints.slice(60, 68).map(toPoint),
      leftCheek: [toPoint(face.keypoints[68])],
      rightCheek: [toPoint(face.keypoints[69])],
      chin: [toPoint(face.keypoints[70])],
      foreheadCenter: toPoint(face.keypoints[71]),
      leftTemple: toPoint(face.keypoints[72]),
      rightTemple: toPoint(face.keypoints[73]),
      leftCheekbone: toPoint(face.keypoints[74]),
      rightCheekbone: toPoint(face.keypoints[75]),
      leftNostril: toPoint(face.keypoints[76]),
      rightNostril: toPoint(face.keypoints[77]),
      cupidsBow: toPoint(face.keypoints[78])
    };

    // Extract mesh data
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];
    const normals: number[] = [];

    face.keypoints.forEach((kp) => {
      vertices.push(kp.x, kp.y, kp.z || 0);
      // UV mapping based on normalized coordinates
      uvs.push(kp.x / videoRef.current!.width, kp.y / videoRef.current!.height);
      // Basic normal calculation (facing camera)
      normals.push(0, 0, 1);
    });

    // Generate triangle indices for mesh
    for (let i = 0; i < vertices.length / 3 - 2; i++) {
      indices.push(i, i + 1, i + 2);
    }

    return {
      vertices,
      indices,
      uvs,
      normals,
      landmarks,
      confidence: face.score || 0,
      timestamp: Date.now()
    };
  };

  // Convert TensorFlow.js keypoint to Point
  const toPoint = (keypoint: faceLandmarksDetection.Keypoint): Point => ({
    x: keypoint.x,
    y: keypoint.y,
    z: keypoint.z || 0
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };
  }, [stopTracking]);

  return {
    isInitialized,
    error,
    landmarks,
    startTracking,
    stopTracking
  };
};
